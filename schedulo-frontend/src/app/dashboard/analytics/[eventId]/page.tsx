"use client";
import React from "react";
import { useParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function AnalyticsPage() {
  const params = useParams();
  
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Event Analytics</h1>
        <Card>
          <CardHeader>
            <CardTitle>Analytics Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Analytics dashboard for event ID: {params.eventId}
            </p>
            <p className="text-gray-600 mt-4">
              This is a placeholder for the analytics dashboard. 
              You can add your analytics content here later.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}