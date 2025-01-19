"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { FaUsers } from "react-icons/fa";

interface Registration {
  _id: string;
  name: string;
  email: string;
  selectedTimeSlot: {
    from: string;
    to: string;
  };
  registeredAt: string;
}

export default function AnalyticsPage() {
  const params = useParams();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch(`http://localhost:5000/api/events/${params.eventId}/registrations`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message);
        }

        setRegistrations(data.registrations);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch registrations");
      } finally {
        setLoading(false);
      }
    };

    if (params.eventId) {
      fetchRegistrations();
    }
  }, [params.eventId]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
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
              <Card key={registration._id} className="shadow-lg hover:shadow-xl transition duration-300 ease-in-out">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
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
                        {registration.selectedTimeSlot.from} - {registration.selectedTimeSlot.to}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Registered On</p>
                      <p className="font-medium">
                        {format(new Date(registration.registeredAt), 'MMM d, yyyy')}
                      </p>
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
