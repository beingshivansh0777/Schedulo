"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import {
  Clock,
  Calendar,
  Link as LinkIcon,
  Plus,
  ArrowLeft,
} from "lucide-react";

export default function CreateEventPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [mode, setMode] = useState("offline");
  const [link, setLink] = useState("");
  const [eventDate, setEventDate] = useState<Date | undefined>(undefined);
  const [timeSlots, setTimeSlots] = useState([{ from: "", to: "" }]);
  const [uniqueLink, setUniqueLink] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddTimeSlot = () => {
    setTimeSlots([...timeSlots, { from: "", to: "" }]);
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      alert("You must be logged in to create an event.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          mode,
          link,
          eventDate,
          timeSlots,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setUniqueLink(data.event.slug);
        setIsDialogOpen(true);
      } else {
        alert(data.message || "Failed to create event.");
      }
    } catch (error) {
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* Background with grid pattern and gradient */}
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

      {/* Navigation Bar */}
      <nav className="bg-white/80 backdrop-blur-sm border-b px-6 h-16 flex items-center fixed w-full z-10">
        <Button
          variant="ghost"
          className="mr-4"
          onClick={() => router.push("/home")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </nav>

      {/* Main Content */}
      <div className="relative pt-24 px-6 pb-12 max-w-3xl mx-auto">
        <Card className="bg-white/80 backdrop-blur-sm shadow-sm border">
        <h1 className="ml-4 mt-4 text-2xl font-bold text-gray-900">Create Event</h1>
          <CardContent className="p-6">
            {/* Basic Details Section */}
            <div className="space-y-6">
              <div>
                <Label
                  htmlFor="title"
                  className="text-base font-semibold block mb-2"
                >
                  Event Title
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter a descriptive title"
                  className="h-12 bg-white"
                />
              </div>

              <div>
                <Label
                  htmlFor="description"
                  className="text-base font-semibold block mb-2"
                >
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide details about your event"
                  className="min-h-[120px] resize-none bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label
                    htmlFor="mode"
                    className="text-base font-semibold block mb-2"
                  >
                    Event Mode
                  </Label>
                  <select
                    id="mode"
                    value={mode}
                    onChange={(e) => setMode(e.target.value)}
                    className="w-full h-12 rounded-md border border-input bg-white px-3"
                  >
                    <option value="offline">In-Person</option>
                    <option value="online">Virtual</option>
                  </select>
                </div>

                <div>
                  <Label
                    htmlFor="eventDate"
                    className="text-base font-semibold block mb-2"
                  >
                    Event Date
                  </Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      id="eventDate"
                      type="date"
                      value={
                        eventDate ? eventDate.toISOString().slice(0, 10) : ""
                      }
                      onChange={(e) => setEventDate(new Date(e.target.value))}
                      className="w-full h-12 pl-10 rounded-md border border-input bg-white"
                    />
                  </div>
                </div>
              </div>

              {mode === "online" && (
                <div>
                  <Label
                    htmlFor="link"
                    className="text-base font-semibold block mb-2"
                  >
                    Meeting Link
                  </Label>
                  <div className="relative">
                    <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                      id="link"
                      value={link}
                      onChange={(e) => setLink(e.target.value)}
                      placeholder="Paste your Google Meet link"
                      className="pl-10 h-12 bg-white"
                    />
                  </div>
                </div>
              )}

              {/* Time Slots Section */}
              <div className="border-t pt-6 mt-6">
                <div className="flex justify-between items-center mb-4">
                  <Label className="text-base font-semibold">Time Slots</Label>
                  <Button
                    onClick={handleAddTimeSlot}
                    variant="outline"
                    className="gap-2 bg-white"
                  >
                    <Plus className="h-4 w-4" />
                    Add Slot
                  </Button>
                </div>

                <div className="space-y-4">
                  {timeSlots.map((slot, index) => (
                    <div
                      key={index}
                      className="flex gap-4 items-center bg-white p-4 rounded-lg border"
                    >
                      <Clock className="text-gray-400 h-5 w-5" />
                      <div className="flex-1 grid grid-cols-2 gap-4">
                        <Input
                          placeholder="Start Time"
                          value={slot.from}
                          onChange={(e) =>
                            setTimeSlots(
                              timeSlots.map((s, i) =>
                                i === index ? { ...s, from: e.target.value } : s
                              )
                            )
                          }
                          className="h-12 bg-white"
                        />
                        <Input
                          placeholder="End Time"
                          value={slot.to}
                          onChange={(e) =>
                            setTimeSlots(
                              timeSlots.map((s, i) =>
                                i === index ? { ...s, to: e.target.value } : s
                              )
                            )
                          }
                          className="h-12 bg-white"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8 flex justify-end">
              <Button
                onClick={handleSubmit}
                className="bg-blue-500 hover:bg-blue-600 text-white px-8 h-12"
              >
                Create Event
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Success Dialog - Same as before */}
      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          if (!open) router.push("/home");
          setIsDialogOpen(open);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogTitle className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
              <div className="h-4 w-4 rounded-full bg-green-500" />
            </div>
            Event Created Successfully
          </DialogTitle>
          <DialogDescription className="space-y-4">
            <p>Share this link with your participants:</p>
            <div className="relative">
              <Input
                value={`http://localhost:3000/event/${uniqueLink}`}
                readOnly
                className="pr-20 h-12"
              />
              <Button
                className="absolute right-1 top-1 h-10"
                onClick={() =>
                  navigator.clipboard.writeText(
                    `http://localhost:3000/event/${uniqueLink}`
                  )
                }
              >
                Copy
              </Button>
            </div>
          </DialogDescription>
          <DialogFooter>
            <Button
              onClick={() => router.push("/home")}
              className="w-full h-12"
            >
              Go to Dashboard
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
