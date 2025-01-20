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
  Trash2,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CreateEventPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [mode, setMode] = useState("offline");
  const [link, setLink] = useState("");
  const [eventDate, setEventDate] = useState<Date | undefined>(undefined);
  const [optionalSlots, setOptionalSlots] = useState(0);
  const [isOptionalSlotsEnabled, setIsOptionalSlotsEnabled] = useState(false);
  const [timeSlots, setTimeSlots] = useState([
    {
      hour: "",
      minute: "",
      period: "AM",
      toHour: "",
      toMinute: "",
      toPeriod: "AM",
    },
  ]);
  const [uniqueLink, setUniqueLink] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // const showToastSuccess = (message: string) => {
  //   toast.success(message);
  // };

  const showToastError = (message: string) => {
    toast.error(message);
  };

  const handleAddTimeSlot = () => {
    setTimeSlots([
      ...timeSlots,
      {
        hour: "",
        minute: "",
        period: "AM",
        toHour: "",
        toMinute: "",
        toPeriod: "AM",
      },
    ]);
  };

  const handleRemoveTimeSlot = (index: number) => {
    if (timeSlots.length > 1) {
      setTimeSlots(timeSlots.filter((_, i) => i !== index));
    }
  };

  const formatTimeSlots = () => {
    return timeSlots.map((slot) => ({
      from: `${slot.hour}:${slot.minute} ${slot.period}`,
      to: `${slot.toHour}:${slot.toMinute} ${slot.toPeriod}`,
    }));
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("You must be logged in to create an event.");
      return;
    }

    try {
      if (isOptionalSlotsEnabled) {
        if (optionalSlots <= 0) {
          showToastError("Slots can't be 0 or smaller");
          return;
        }
      }
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/events`,
        {
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
            registrationLimit: optionalSlots,
            timeSlots: formatTimeSlots(),
          }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        setUniqueLink(data.event.slug);
        setIsDialogOpen(true);
      } else {
        alert(data.message || "Failed to create event.");
      }
    } catch (error) {
      alert("Something went wrong. Please try again.");
      console.log(error);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        {/* Navigation Bar */}
        <nav className="py-6 px-8 bg-white border-b">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => router.push("/home")}
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Schedulo</h1>
          </div>
        </nav>

        {/* Main Content */}
        <div className="max-w-3xl mx-auto px-4 py-12">
          <Card className="bg-white shadow-md border-0">
            <div className="border-b p-6">
              <h2 className="text-2xl font-semibold text-gray-900">
                Create New Event
              </h2>
              <p className="text-gray-500 mt-1">
                Fill in the details to schedule your event
              </p>
            </div>

            <CardContent className="p-6 space-y-8">
              {/* Basic Details Section */}
              <div className="space-y-6">
                <div>
                  <Label htmlFor="title" className="text-sm font-medium">
                    Event Title
                  </Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter event title"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="description" className="text-sm font-medium">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide details about your event"
                    className="mt-1 min-h-[120px]"
                  />
                </div>

                {/* Checkbox to enable/disable optional slots */}
                <div className="flex items-center justify-start mb-4">
                  <input
                    type="checkbox"
                    checked={isOptionalSlotsEnabled}
                    onChange={(e) =>
                      setIsOptionalSlotsEnabled(e.target.checked)
                    }
                    className="mr-2 cursor-pointer w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-lg dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300 rounded-lg">
                    Set finite Slots
                  </label>
                </div>

                {/* Conditionally render the optional slots input field */}
                {isOptionalSlotsEnabled && (
                  <div className="mt-4">
                    <Label
                      htmlFor="optionalSlots"
                      className="text-sm font-medium"
                    >
                      Number of Optional Slots
                    </Label>
                    <input
                      type="number"
                      id="optionalSlots"
                      value={optionalSlots}
                      onChange={(e) => setOptionalSlots(Number(e.target.value))}
                      placeholder="Enter the number of optional slots"
                      className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="mode" className="text-sm font-medium">
                      Event Mode
                    </Label>
                    <select
                      id="mode"
                      value={mode}
                      onChange={(e) => setMode(e.target.value)}
                      className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="offline">In-Person</option>
                      <option value="online">Virtual</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="eventDate" className="text-sm font-medium">
                      Event Date
                    </Label>
                    <div className="relative mt-1">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <input
                        type="date"
                        value={
                          eventDate ? eventDate.toISOString().slice(0, 10) : ""
                        }
                        onChange={(e) => setEventDate(new Date(e.target.value))}
                        className="w-full rounded-md border border-input bg-background pl-10 py-2 text-sm"
                      />
                    </div>
                  </div>
                </div>

                {mode === "online" && (
                  <div>
                    <Label htmlFor="link" className="text-sm font-medium">
                      Meeting Link
                    </Label>
                    <div className="relative mt-1">
                      <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="link"
                        value={link}
                        onChange={(e) => setLink(e.target.value)}
                        placeholder="Paste your meeting link"
                        className="pl-10"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Time Slots Section */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <Label className="text-sm font-medium">Time Slots</Label>
                  <Button
                    onClick={handleAddTimeSlot}
                    variant="outline"
                    size="sm"
                    className="text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Time Slot
                  </Button>
                </div>

                <div className="space-y-4">
                  {timeSlots.map((slot, index) => (
                    <div
                      key={index}
                      className="flex gap-4 items-center bg-gray-50 p-4 rounded-lg relative group"
                    >
                      <Clock className="text-gray-400 h-4 w-4 flex-shrink-0" />

                      {/* From Time */}
                      <div className="flex gap-2 items-center flex-1">
                        <div className="space-y-1 flex-1">
                          <Label className="text-xs text-gray-500">From</Label>
                          <div className="flex gap-2">
                            <Input
                              type="number"
                              min="1"
                              max="12"
                              placeholder="HH"
                              value={slot.hour}
                              onChange={(e) => {
                                const newSlots = [...timeSlots];
                                newSlots[index].hour = e.target.value;
                                setTimeSlots(newSlots);
                              }}
                              className="w-20"
                            />
                            <Input
                              type="number"
                              min="0"
                              max="59"
                              placeholder="MM"
                              value={slot.minute}
                              onChange={(e) => {
                                const newSlots = [...timeSlots];
                                newSlots[index].minute = e.target.value;
                                setTimeSlots(newSlots);
                              }}
                              className="w-20"
                            />
                            <select
                              value={slot.period}
                              onChange={(e) => {
                                const newSlots = [...timeSlots];
                                newSlots[index].period = e.target.value;
                                setTimeSlots(newSlots);
                              }}
                              className="w-20 rounded-md border border-input bg-background px-3 py-2 text-sm"
                            >
                              <option value="AM">AM</option>
                              <option value="PM">PM</option>
                            </select>
                          </div>
                        </div>

                        {/* To Time */}
                        <div className="space-y-1 flex-1">
                          <Label className="text-xs text-gray-500">To</Label>
                          <div className="flex gap-2">
                            <Input
                              type="number"
                              min="1"
                              max="12"
                              placeholder="HH"
                              value={slot.toHour}
                              onChange={(e) => {
                                const newSlots = [...timeSlots];
                                newSlots[index].toHour = e.target.value;
                                setTimeSlots(newSlots);
                              }}
                              className="w-20"
                            />
                            <Input
                              type="number"
                              min="0"
                              max="59"
                              placeholder="MM"
                              value={slot.toMinute}
                              onChange={(e) => {
                                const newSlots = [...timeSlots];
                                newSlots[index].toMinute = e.target.value;
                                setTimeSlots(newSlots);
                              }}
                              className="w-20"
                            />
                            <select
                              value={slot.toPeriod}
                              onChange={(e) => {
                                const newSlots = [...timeSlots];
                                newSlots[index].toPeriod = e.target.value;
                                setTimeSlots(newSlots);
                              }}
                              className="w-20 rounded-md border border-input bg-background px-3 py-2 text-sm"
                            >
                              <option value="AM">AM</option>
                              <option value="PM">PM</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {timeSlots.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveTimeSlot(index)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6 border-t">
                <Button
                  onClick={handleSubmit}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  Create Event
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Success Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
                  value={`${process.env.NEXT_DEPLOYED_URL}/event/${uniqueLink}`}
                  readOnly
                  className="pr-20"
                />
                <Button
                  className="absolute right-1 top-1 h-8"
                  onClick={() =>
                    navigator.clipboard.writeText(
                      `${process.env.NEXT_DEPLOYED_URL}/event/${uniqueLink}`
                    )
                  }
                >
                  Copy
                </Button>
              </div>
            </DialogDescription>
            <DialogFooter>
              <Button onClick={() => router.push("/home")} className="w-full">
                Go to Dashboard
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
