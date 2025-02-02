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
  DeleteButton
} from "@/components/ui/card";
import {
  Calendar,
  Clock,
  PlusCircle,
  PenLine,
  LogOut,
  Copy,
  CheckCheck,
} from "lucide-react";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";

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

export default function HomePage() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // 6 events per page (2 rows x 3 columns)

  useEffect(() => {
    document.title = "Schedulo - Dashboard";

    return () => {
      document.title = "Schedulo";
    };
  }, []);

  const handleLogout = async () => {
    const token = localStorage.getItem("authToken");
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/logout`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(response);
    localStorage.removeItem("authToken");
    router.push("/");
  };

  const handleCreateEventClick = () => {
    router.push("/event");
  };

  const handleEventClick = (eventId: string) => {
    router.push(`/dashboard/analytics/${eventId}`);
  };

  const handleCopyLink = (
    e: React.MouseEvent,
    slug: string,
    eventId: string
  ) => {
    e.stopPropagation();
    const url = `https://schedulo-eight.vercel.app/event/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedId(eventId);
    setTimeout(() => setCopiedId(null), 2000);
  };
  const handleDeleteEvent = async (eventId: string) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/events/${eventId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        console.error("Failed to delete event");
        return;
      }

      // Remove deleted event from state
      setEvents((prevEvents) =>
        prevEvents.filter((event) => event._id !== eventId)
      );
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          router.push("/");
          return;
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/events`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();
        setEvents(data.events || []);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Add pagination helper functions
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEvents = events.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(events.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar matching landing page */}
      <nav className="py-6 px-8 bg-white border-b">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Schedulo</h1>
          <div className="flex items-center space-x-4">
            {events.length > 0 && (
              <Button
                onClick={handleCreateEventClick}
                className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2"
              >
                <PenLine className="w-4 h-4" />
                Create Event
              </Button>
            )}
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="text-gray-700 hover:text-gray-900"
            >
              Logout <LogOut />
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content with subtle background */}
      <div className="flex-1 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-8 py-8">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : events.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-12rem)] bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="bg-indigo-50 p-6 rounded-full mb-6">
                <PlusCircle className="w-16 h-16 text-indigo-600" />
              </div>
              <h2 className="text-3xl font-semibold text-gray-800 mb-4">
                No Events Yet
              </h2>
              <Button
                onClick={handleCreateEventClick}
                className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2"
              >
                <PenLine className="w-5 h-5" />
                Create Your First Event
              </Button>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">
                  Your Events
                </h1>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentEvents.map((event) => (
                  <Card
                    key={event._id}
                    className="bg-white border border-gray-200 hover:border-indigo-200 hover:shadow-lg transition-all duration-300 cursor-pointer"
                    onClick={() => handleEventClick(event._id)}
                  >
                    <CardHeader className="pb-3">
                    <CardTitle className="flex items-center justify-between">
                        <span className="text-lg font-semibold text-gray-900">
                          {event.title}
                        </span>
                        <div className="flex items-center space-x-5">
                          
                            {/* Delete Button Component */}
                            <DeleteButton
                              eventId={event._id}
                              onDelete={handleDeleteEvent}
                            />
                          
                          <span className="text-sm px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full font-medium">
                            {event.mode}
                          </span>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pb-4">
                      <p className="text-gray-600 line-clamp-2 mb-4 text-sm">
                        {event.description}
                      </p>

                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-gray-600 p-2 rounded bg-gray-50">
                          <Calendar className="w-4 h-4 mr-2 text-indigo-500" />
                          {new Date(event.eventDate).toLocaleDateString()}
                        </div>
                        <div className="flex items-center text-sm text-gray-600 p-2 rounded bg-gray-50">
                          <Clock className="w-4 h-4 mr-2 text-indigo-500" />
                          {event.timeSlots.length} time slot(s)
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-3 border-t bg-gray-50 py-3">
                      <div className="flex items-center justify-between w-full p-2 bg-white rounded text-sm">
                        <span className="text-gray-600 truncate mr-2">
                          https://schedulo-eight.vercel.app/event/{event.slug}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-2 h-8 hover:bg-gray-100"
                          onClick={(e) =>
                            handleCopyLink(e, event.slug, event._id)
                          }
                        >
                          {copiedId === event._id ? (
                            <CheckCheck className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4 text-gray-500" />
                          )}
                        </Button>
                      </div>
                      <div className="flex items-center justify-between w-full">
                        <span className="text-sm font-medium text-gray-600">
                          View Details
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-0 hover:bg-transparent hover:text-indigo-600"
                        >
                          →
                        </Button>
                      </div>
                      {/* Delete Button with Event Handler */}
                      <div className="w-full h-16 bg-white "></div>
                    </CardFooter>
                  </Card>
                ))}
              </div>

              {/* Pagination Controls */}
              {events.length > itemsPerPage && (
                <div className="mt-8 flex justify-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeftIcon className="h-4 w-4" />
                  </Button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </Button>
                    )
                  )}

                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRightIcon className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
