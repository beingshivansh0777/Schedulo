"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { FaUsers } from "react-icons/fa";
import emailjs from "@emailjs/browser";

interface Registration {
  _id: string;
  name: string;
  email: string;
  selectedTimeSlot: {
    from: string;
    to: string;
  };
  registeredAt: string;
  approved: boolean;
  eventId: string;
}

interface Event {
  _id: string;
  title: string;
  mode: string;
  link?: string;
  eventDate: string;
}

export default function AnalyticsPage() {
  const params = useParams();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingButtons, setLoadingButtons] = useState<Record<string, boolean>>(
    {}
  );

  useEffect(() => {
    emailjs.init(process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!);
  }, []);

  const fetchEvent = async (eventId: string) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/events/id/${eventId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch event details");
      }

      const data = await response.json();
      setCurrentEvent(data.event);
      return data.event;
    } catch (error) {
      console.error("Error fetching event:", error);
      throw error;
    }
  };

  const fetchRegistrations = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/events/${params.eventId}/registrations`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setRegistrations(data.registrations);

      if (!currentEvent) {
        await fetchEvent(params.eventId as string);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch registrations"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.eventId) {
      fetchRegistrations();
    }
  }, [params.eventId]);

  const sendApprovalEmail = async (registration: Registration) => {
    // console.log("Sending approval email to:", registration.email);
    if (!currentEvent) {
      throw new Error("Event details not available");
    }

    try {
      const templateId =
        currentEvent.mode.toLowerCase() === "online"
          ? process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_ONLINE
          : process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_OFFLINE;

      const templateParams = {
        to_email: registration.email,
        to_name: registration.name,
        event_name: currentEvent.title,
        event_mode: currentEvent.mode,
        event_date: format(new Date(currentEvent.eventDate), "MMMM dd, yyyy"),
        time_slot: `${registration.selectedTimeSlot.from} - ${registration.selectedTimeSlot.to}`,
        subject: `Confirmation for event: ${currentEvent.title}`,
        event_link:
          currentEvent.mode.toLowerCase() === "online"
            ? currentEvent.link || ""
            : undefined,
      };

      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        templateId!,
        templateParams
      );
      return true;
    } catch (error) {
      console.error("Email error:", error);
      throw error;
    }
  };

  const handleApprove = async (registrationId: string) => {
    setLoadingButtons((prev) => ({ ...prev, [registrationId]: true }));

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/registrations/${registrationId}/approve`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      await sendApprovalEmail(data.registration);
      fetchRegistrations();
    } catch (err) {
      console.error("Error approving registration:", err);
    } finally {
      setLoadingButtons((prev) => ({ ...prev, [registrationId]: false }));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <Card>
            <CardContent className="p-6">
              <p className="text-red-500">{error}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Event Registrations</h1>
          <div className="flex items-center text-lg font-medium text-gray-700">
            <FaUsers className="mr-2 text-blue-500" />
            <span>{registrations.length} Total Registrations</span>
          </div>
        </div>

        {registrations.length === 0 ? (
          <Card>
            <CardContent className="p-6">
              <p>No registrations yet for this event.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {registrations.map((registration) => (
              <Card
                key={registration._id}
                className="shadow-lg hover:shadow-xl transition duration-300 ease-in-out"
              >
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6">
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="font-medium">{registration.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{registration.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Time Slot</p>
                      <p className="font-medium">
                        {registration.selectedTimeSlot.from} -{" "}
                        {registration.selectedTimeSlot.to}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Registered On</p>
                      <p className="font-medium">
                        {format(
                          new Date(registration.registeredAt),
                          "MMM d, yyyy"
                        )}
                      </p>
                    </div>
                    <div className="flex items-center">
                      {!registration.approved ? (
                        <Button
                          onClick={() => handleApprove(registration._id)}
                          className="w-full bg-green-500 hover:bg-green-600 text-white"
                          disabled={loadingButtons[registration._id]}
                        >
                          {loadingButtons[registration._id]
                            ? "Approving..."
                            : "Approve"}
                        </Button>
                      ) : (
                        <span className="text-green-500 font-medium">
                          Approved ✓
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
