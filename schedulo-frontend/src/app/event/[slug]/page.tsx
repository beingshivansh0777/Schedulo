"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Calendar, Clock, Globe, MapPin, Users, TicketX } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface TimeSlot {
  from: string;
  to: string;
}

interface Event {
  title: string;
  description: string;
  mode: string;
  link?: string;
  eventDate: string;
  timeSlots: TimeSlot[];
}

interface RegistrationForm {
  name: string;
  email: string;
  selectedTimeSlot: TimeSlot | null;
}

export default function EventPage() {
  const params = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [count, setCount] = useState(0);
  const [maxCount, setMaxCount] = useState(0);
  const [form, setForm] = useState<RegistrationForm>({
    name: "",
    email: "",
    selectedTimeSlot: null,
  });

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/events/${params.slug}`
        );
        const data = await response.json();
        if (!response.ok)
          throw new Error(data.message || "Failed to fetch event");
        setEvent(data.event);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch event");
      } finally {
        setLoading(false);
      }
    };

    const fetchRegistrations = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/events/${params.slug}/registrations/count`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        setCount(data.count);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch registrations"
        );
      }
    };

    const fetchRegistrationLimit = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/events/${params.slug}/registration-limit`
        );
        const data = await response.json();
        if (!response.ok)
          throw new Error(data.message || "Failed to fetch registration limit");
        setMaxCount(data.registrationLimit);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to fetch registration limit"
        );
      }
    };

    if (params.slug) {
      fetchRegistrations();
      fetchRegistrationLimit();
      fetchEvent();
    }
  }, [params.slug]);

  const showToastError = (message: string) => {
    toast.error(message);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-64 bg-gray-200 rounded"></div>
          <div className="h-4 w-48 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="flex justify-center items-center min-h-screen p-4">
        <Alert className="w-full max-w-md bg-red-50 border-red-200">
          <AlertDescription className="text-red-800">
            {error || "Event not found"}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (maxCount > 0) {
    if (count >= maxCount) {
      return (
        <div className="flex justify-center items-center min-h-screen">
          <div
            className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50"
            style={{
              backgroundImage: `
                linear-gradient(to bottom right, rgba(99, 102, 241, 0.1), rgba(168, 85, 247, 0.1)),
                linear-gradient(rgba(99, 102, 241, 0.05) 2px, transparent 2px),
                linear-gradient(90deg, rgba(99, 102, 241, 0.05) 2px, transparent 2px)
              `,
              backgroundSize: "100% 100%, 20px 20px, 20px 20px",
            }}
          />
          <div className="z-10 min-h-screen w-full bg-gradient-to-br flex justify-center items-center">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center space-y-4">
              <div className="flex justify-center">
                <TicketX className="h-16 w-16 text-red-500" />
              </div>
              <h1 className="text-2xl font-bold text-red-600">
                Oops, the registration for this event is full
              </h1>
              <p className="text-gray-700">
                Try contacting the administrator for assistance
              </p>
              <p className="w-full">
                Created with{" "}
                <a
                  href="https://schedulo-eight.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Schedulo
                </a>
              </p>
            </div>
          </div>
        </div>
      );
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.selectedTimeSlot) {
      showToastError("Please select a time slot");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/events/${params.slug}/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Registration failed");
      setRegistrationSuccess(true);
      setForm({ name: "", email: "", selectedTimeSlot: null });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="flex justify-center items-center">
        <div
          className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50"
          style={{
            backgroundImage: `
            linear-gradient(to bottom right, rgba(99, 102, 241, 0.1), rgba(168, 85, 247, 0.1)),
            linear-gradient(rgba(99, 102, 241, 0.05) 2px, transparent 2px),
            linear-gradient(90deg, rgba(99, 102, 241, 0.05) 2px, transparent 2px)
          `,
            backgroundSize: "100% 100%, 20px 20px, 20px 20px",
          }}
        />

        <div className="z-10 min-h-screen w-full bg-gradient-to-br">
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="grid md:grid-cols-5 gap-8">
              {/* Event Details Section */}
              <div className="md:col-span-3">
                <Card className="h-full">
                  <CardHeader className="space-y-4 pb-4">
                    <div className="space-y-2">
                      <CardTitle className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {event.title}
                      </CardTitle>
                      <p className="text-gray-600 text-lg">
                        {event.description}
                      </p>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                          <Calendar className="h-5 w-5 text-blue-600" />
                          <div>
                            <p className="text-sm text-gray-500">Date</p>
                            <p className="font-medium">
                              {format(
                                new Date(event.eventDate),
                                "MMMM d, yyyy"
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                          {event.mode === "online" ? (
                            <Globe className="h-5 w-5 text-blue-600" />
                          ) : (
                            <MapPin className="h-5 w-5 text-blue-600" />
                          )}
                          <div>
                            <p className="text-sm text-gray-500">Mode</p>
                            <p className="font-medium capitalize">
                              {event.mode}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                          <Users className="h-5 w-5 text-blue-600" />
                          <div>
                            <p className="text-sm text-gray-500">Capacity</p>
                            <p className="font-medium">
                              {maxCount == 0
                                ? "Available"
                                : `${count} / ${maxCount}`}
                            </p>
                          </div>
                        </div>
                      </div>

                      {event.mode === "online" && event.link && (
                        <div className="p-2 bg-blue-50 rounded-lg">
                          <p className="font-medium mb-2 italic">
                            This is an online event, link will be shared to
                            registered email once approved.
                          </p>
                        </div>
                      )}

                      <div>
                        <h3 className="font-semibold text-lg mb-3 flex items-center">
                          <Clock className="h-5 w-5 mr-2 text-black" />
                          Select Available Time Slots
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {event.timeSlots.map((slot, index) => (
                            <button
                              key={index}
                              onClick={() =>
                                setForm({ ...form, selectedTimeSlot: slot })
                              }
                              className={`p-3 rounded-lg text-sm font-medium transition-all
                                ${
                                  form.selectedTimeSlot?.from === slot.from &&
                                  form.selectedTimeSlot?.to === slot.to
                                    ? "bg-blue-100 text-black ring-2 ring-green-600"
                                    : "bg-white hover:bg-gray-50 text-gray-700 border border-gray-200"
                                }`}
                            >
                              {slot.from} - {slot.to}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Registration Form Section */}
              <div className="md:col-span-2">
                <Card className="sticky top-8">
                  <CardHeader>
                    <CardTitle className="text-2xl font-semibold">
                      Register for this Event
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {registrationSuccess ? (
                      <Alert className="bg-green-50 border-green-200">
                        <AlertDescription className="text-green-800">
                          Registration successful! You will receive a
                          confirmation email shortly after it is approved by
                          administrator.
                        </AlertDescription>
                      </Alert>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-sm font-medium">
                            Full Name
                          </Label>
                          <Input
                            id="name"
                            placeholder="Enter your name"
                            value={form.name}
                            onChange={(e) =>
                              setForm({ ...form, name: e.target.value })
                            }
                            className="w-full"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="email"
                            className="text-sm font-medium"
                          >
                            Email Address
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            value={form.email}
                            onChange={(e) =>
                              setForm({ ...form, email: e.target.value })
                            }
                            className="w-full"
                            required
                          />
                        </div>

                        <Button
                          type="submit"
                          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-all"
                        >
                          Register Now
                        </Button>
                      </form>
                    )}
                  </CardContent>
                  <CardFooter className="text-center text-sm text-gray-500">
                    <p className="w-full">
                      Created with{" "}
                      <a
                        href="https://schedulo-eight.vercel.app"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Schedulo
                      </a>
                    </p>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
