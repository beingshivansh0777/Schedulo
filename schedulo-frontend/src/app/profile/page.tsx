"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Pencil } from "lucide-react";

interface Profile {
  name: string;
  email: string;
  image: string;
  location: string;
  createdEvents: string[];
  registeredEvents: string[];
  approvedEvents: string[];
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          setError("User not authenticated");
          setLoading(false);
          return;
        }

        const response = await axios.get("http://localhost:5000/api/getprofile", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        console.log(response.data.data);
        setProfile(response.data.data);
      } catch (err) {
        setError("Could not load profile");
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-lg font-semibold">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        {error}
      </div>
    );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative bg-gray-100 p-6 rounded-2xl shadow-xl max-w-md w-full text-center"
      >
        <button
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition"
          onClick={() => window.location.href="/editprofile"}
        >
          <Pencil size={20} className="text-gray-700" />
        </button>

        <motion.img
          src={profile?.image || "https://via.placeholder.com/150"}
          alt="Profile"
          className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-gray-300 object-cover shadow-md"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        />
        <h1 className="text-2xl font-bold text-gray-800">{profile?.name || "No Name Available"}</h1>
        <p className="text-gray-600">{profile?.email || "No Email Available"}</p>
        <p className="text-gray-500">{profile?.location || "Location Not Provided"}</p>

        <div className="mt-6 space-y-3 text-sm text-gray-700">
          <EventSection title="Created Events" events={profile?.createdEvents} color="bg-blue-500" />
          <EventSection title="Registered Events" events={profile?.registeredEvents} color="bg-green-500" />
          <EventSection title="Approved Events" events={profile?.approvedEvents} color="bg-purple-500" />
        </div>
      </motion.div>
    </div>
  );
}

function EventSection({ title, events, color }: { title: string; events?: string[]; color: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="text-left"
    >
      <p className="font-semibold text-gray-900">{title}:</p>
      <div className="flex flex-wrap gap-2 mt-2">
        {events?.length ? (
          events.map((event, index) => (
            <span key={index} className={`text-white text-xs px-3 py-1 rounded-full ${color} shadow-sm`}>
              {event}
            </span>
          ))
        ) : (
          <span className="text-gray-500 italic">Not available</span>
        )}
      </div>
    </motion.div>
  );
}
