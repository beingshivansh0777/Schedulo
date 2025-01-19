"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Calendar, Clock, PlusCircle } from "lucide-react";
import { IoNavigate } from "react-icons/io5";

interface TimeSlot {
  from: string;
  to: string;
}

interface Event {
  _id: string;
  title: string;
  description: string;
  mode: string;
  eventDate: string;
  timeSlots: TimeSlot[];
  slug: string;
}

export function HomePage() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    router.push("/");
  };

  const handleCreateEventClick = () => {
    router.push("/event");
  };

  const handleEventClick = (eventId: string) => {
    router.push(`/dashboard/analytics/${eventId}`);
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          router.push("/");
          return;
        }

        const response = await fetch("http://localhost:5000/api/events", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        setEvents(data.events || []);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Simplified Navbar */}
      <nav className="bg-white border-b px-6 h-16 flex items-center justify-between fixed w-full z-10">
        <h1 className="text-2xl font-bold text-gray-900">Schedulo</h1>
        <div className="flex items-center space-x-4">
          {events.length > 0 && (
            <Button
              onClick={handleCreateEventClick}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Event
            </Button>
          )}
          {/* Logout Button */}
          <Button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            Logout
          </Button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 pt-16 bg-gray-50">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p>Loading...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] bg-white">
            <div className="bg-gray-50 p-6 rounded-full mb-6">
              <PlusCircle className="w-16 h-16 text-blue-500" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              No Events Yet
            </h2>
            <p className="text-gray-600 mb-8 text-center max-w-md">
              Get started by creating your first event. You can schedule
              interviews, meetings, or any other type of event.
            </p>
            <Button
              onClick={handleCreateEventClick}
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg"
            >
              Create Your First Event
            </Button>
          </div>
        ) : (
          <div className="p-6">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-2xl font-bold text-gray-800 mb-6">
                Dashboard
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => (
                  <Card
                    key={event._id}
                    className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:translate-y-[-2px]"
                    onClick={() => handleEventClick(event._id)}
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{event.title}</span>
                        <span className="text-sm px-3 py-1 bg-blue-100 text-blue-600 rounded-full">
                          {event.mode}
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 line-clamp-2 mb-4">
                        {event.description}
                      </p>
                      <div className="space-y-3">
                        <div className="flex items-center text-sm text-gray-500 bg-gray-50 p-2 rounded">
                          <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                          {new Date(event.eventDate).toLocaleDateString()}
                        </div>
                        <div className="flex items-center text-sm text-gray-500 bg-gray-50 p-2 rounded">
                          <Clock className="w-4 h-4 mr-2 text-blue-500" />
                          {event.timeSlots.length} time slot(s)
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="border-t bg-gray-50">
                      <div className="flex items-center justify-between w-full">
                        <span className="text-sm text-gray-500">
                          View Details
                        </span>
                        <Button variant="ghost" size="sm">
                          →
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default HomePage;
