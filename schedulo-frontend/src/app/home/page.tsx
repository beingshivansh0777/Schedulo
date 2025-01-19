"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const router = useRouter();

  const handleCreateEventClick = () => {
    router.push("/event");
  };

  const handleDashboardClick = () => {
    router.push("/dashboard");
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Navbar */}
      <nav className="bg-gray-800 text-white p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Schedulo</h1>
          <div className="space-x-4">
            <Button onClick={handleDashboardClick} className="bg-gray-600 text-white">
              Dashboard
            </Button>
            <Button onClick={handleCreateEventClick} className="bg-blue-500 text-white">
              Create
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="h-full flex justify-center items-center">
        <h1 className="text-4xl font-bold">Welcome to Schedulo!</h1>
      </div>
    </div>
  );
}