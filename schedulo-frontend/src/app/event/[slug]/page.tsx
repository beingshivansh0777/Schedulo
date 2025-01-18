"use client";
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { format } from 'date-fns';

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

export default function EventPage() {
  const params = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/events/${params.slug}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch event');
        }

        setEvent(data.event);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch event');
      } finally {
        setLoading(false);
      }
    };

    if (params.slug) {
      fetchEvent();
    }
  }, [params.slug]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (error || !event) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Card className="w-full max-w-2xl">
          <CardContent className="p-6">
            <p className="text-red-500">Error: {error || 'Event not found'}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>{event.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <p>{event.description}</p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Event Details</h3>
            <p>Mode: {event.mode}</p>
            {event.mode === 'online' && event.link && (
              <p>Meeting Link: <a href={event.link} className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">{event.link}</a></p>
            )}
            <p>Date: {format(new Date(event.eventDate), 'MMMM d, yyyy')}</p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Time Slots</h3>
            <div className="space-y-2">
              {event.timeSlots.map((slot, index) => (
                <div key={index} className="flex gap-2">
                  <span>{slot.from}</span>
                  <span>-</span>
                  <span>{slot.to}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}