"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";

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
          eventDate, // Ensure eventDate is valid
          timeSlots,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setUniqueLink(data.event.slug); // Assume the API returns a slug for the event
        setIsDialogOpen(true); // Open the dialog with the link
      } else {
        alert(data.message || "Failed to create event.");
      }
    } catch (error) {
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Create Event</h1>

      {/* Event Title */}
      <div className="mb-4">
        <Label htmlFor="title">Event Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter event title"
        />
      </div>

      {/* Event Description */}
      <div className="mb-4">
        <Label htmlFor="description">Event Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter event description"
        />
      </div>

      {/* Event Mode */}
      <div className="mb-4">
        <Label htmlFor="mode">Mode</Label>
        <select
          id="mode"
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          className="w-full rounded-md border border-input bg-background px-3 py-2"
        >
          <option value="offline">Offline</option>
          <option value="online">Online</option>
        </select>
      </div>

      {/* Google Meet Link (Only if online mode) */}
      {mode === "online" && (
        <div className="mb-4">
          <Label htmlFor="link">Google Meet Link (optional)</Label>
          <Input
            id="link"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="Enter Google Meet link"
          />
        </div>
      )}

      {/* Event Date (Using native HTML date picker) */}
      <div className="mb-4">
        <Label htmlFor="eventDate">Event Date</Label>
        <input
          id="eventDate"
          type="date"
          value={eventDate ? eventDate.toISOString().slice(0, 10) : ''}
          onChange={(e) => setEventDate(new Date(e.target.value))}
          className="w-full rounded-md border px-3 py-2"
        />
      </div>

      {/* Time Slots */}
      <div>
        <h2 className="text-xl mb-4">Time Slots</h2>
        {timeSlots.map((slot, index) => (
          <div key={index} className="flex gap-4 mb-4">
            <Input
              placeholder="From"
              value={slot.from}
              onChange={(e) =>
                setTimeSlots(
                  timeSlots.map((s, i) =>
                    i === index ? { ...s, from: e.target.value } : s
                  )
                )
              }
            />
            <Input
              placeholder="To"
              value={slot.to}
              onChange={(e) =>
                setTimeSlots(
                  timeSlots.map((s, i) =>
                    i === index ? { ...s, to: e.target.value } : s
                  )
                )
              }
            />
          </div>
        ))}
        <Button onClick={handleAddTimeSlot} className="bg-green-500 text-white">
          Add Another Time Slot
        </Button>
      </div>

      <div className="mt-8">
        <Button onClick={handleSubmit} className="bg-blue-500 text-white">
          Create Event
        </Button>
      </div>

      {/* Dialog for displaying the unique link */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => { if (!open) router.push("/home"); setIsDialogOpen(open); }}>
        <DialogContent>
          <DialogTitle>Event Created Successfully!</DialogTitle>
          <DialogDescription>
            <p>Your event has been created. You can share this unique link:</p>
            <Input value={`http://localhost:3000/event/${uniqueLink}`} readOnly />
          </DialogDescription>
          <DialogFooter>
            <Button onClick={() => setIsDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
