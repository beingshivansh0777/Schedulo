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

  const [form, setForm] = useState<RegistrationForm>({
    name: "",
    email: "",
    selectedTimeSlot: null,
  });

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/events/${params.slug}`
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch event");
        }

        setEvent(data.event);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch event");
      } finally {
        setLoading(false);
      }
    };

    if (params.slug) {
      fetchEvent();
    }
  }, [params.slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.selectedTimeSlot) {
      setError("Please select a time slot");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/events/${params.slug}/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            selectedTimeSlot: form.selectedTimeSlot,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      setRegistrationSuccess(true);
      setForm({ name: "", email: "", selectedTimeSlot: null });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Card className="w-full max-w-2xl">
          <CardContent className="p-6">
            <p className="text-red-500">Error: {error || "Event not found"}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div
        className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50"
        style={{
          backgroundImage: `linear-gradient(to bottom right, rgba(99, 102, 241, 0.1), rgba(168, 85, 247, 0.1)),
                             linear-gradient(rgba(99, 102, 241, 0.05) 2px, transparent 2px),
                             linear-gradient(90deg, rgba(99, 102, 241, 0.05) 2px, transparent 2px)`,
          backgroundSize: "100% 100%, 20px 20px, 20px 20px",
        }}
      >
        <div className="flex justify-center items-center min-h-screen p-4">
          <Card className="w-full max-w-4xl bg-white shadow-lg rounded-lg">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-3xl font-bold">
                  {event.title}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 grid grid-cols-2 gap-6">
              {/* Left Side: Event Details */}
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p>{event.description}</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Event Details</h3>
                  <div className="space-y-2">
                    <p>
                      <strong>Mode:</strong> {event.mode}
                    </p>
                    {event.mode === "online" && event.link && (
                      <p>
                        <strong>Meeting Link:</strong>{" "}
                        <a
                          href={event.link}
                          className="text-blue-500 hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {event.link}
                        </a>
                      </p>
                    )}
                    <p>
                      <strong>Date:</strong>{" "}
                      {format(new Date(event.eventDate), "MMMM d, yyyy")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Side: Registration Form */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">
                  Register for this Event
                </h3>

                {registrationSuccess ? (
                  <Alert className="bg-green-50 border-green-200">
                    <AlertDescription className="text-green-800">
                      Registration successful! You will receive a confirmation
                      email shortly.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={form.name}
                        onChange={(e) =>
                          setForm({ ...form, name: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={form.email}
                        onChange={(e) =>
                          setForm({ ...form, email: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">
                        Available Time Slots
                      </h3>
                      <div className="space-y-4">
                        {event.timeSlots.map((slot, index) => (
                          <div
                            key={index}
                            className={`m-2 inline-block px-3 py-1 border rounded-md cursor-pointer text-sm ${
                              form.selectedTimeSlot?.from === slot.from &&
                              form.selectedTimeSlot?.to === slot.to
                                ? "bg-blue-200"
                                : "hover:bg-gray-100"
                            }`}
                            onClick={() =>
                              setForm({ ...form, selectedTimeSlot: slot })
                            }
                          >
                            {slot.from} - {slot.to}
                          </div>
                        ))}
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-blue-500 text-white"
                    >
                      Register
                    </Button>
                  </form>
                )}
              </div>
            </CardContent>
            <CardFooter className="text-center text-sm text-gray-500">
              Created with {" "}
              <span>
                <a
                  href="https://github.com/mukundsolanki"
                  target="_blank"
                  rel="noopener noreferrer"
                >Schedulo
                </a>
              </span>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
