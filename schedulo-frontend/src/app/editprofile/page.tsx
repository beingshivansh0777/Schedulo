"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Pencil, Save, Upload } from "lucide-react";

interface Profile {
  name: string;
  email: string;
  location: string;
  image: string;
}

export default function EditProfilePage() {
  const [profile, setProfile] = useState<Profile>({
    name: "Not updated",
    email: "Not updated",
    location: "Not updated",
    image: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

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
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile({ ...profile, ...response.data.data });
      } catch (err) {
        setError("Could not load profile");
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };
  

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("authToken");
      await axios.post("http://localhost:5000/api/editprofile", profile, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Profile updated successfully!");
    } catch (err) {
      alert("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
      setImagePreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleImageUpload = async () => {
    if (!imageFile) return;
    const formData = new FormData();
    formData.append("image", imageFile);

    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.post("http://localhost:5000/api/editimage", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setProfile((prev) => ({ ...prev, image: response.data.imageUrl }));
      alert("Profile picture updated!");
    } catch (err) {
      alert("Failed to update profile picture");
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen text-lg font-semibold">Loading...</div>;
  if (error) return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-gray-100 p-6 rounded-2xl shadow-lg max-w-md w-full"
      >
        <h1 className="text-2xl font-bold text-center mb-4 flex items-center justify-center gap-2">
          <Pencil size={20} /> Edit Profile
        </h1>
        <div className="flex flex-col items-center mb-4">
          <img src={imagePreview || profile.image || "https://via.placeholder.com/150"} alt="Profile" 
            className="w-24 h-24 rounded-full border-4 border-gray-300 object-cover" 
          />
          <input type="file" accept="image/*" onChange={handleImageChange} className="mt-2" />
          <Button onClick={handleImageUpload} className="mt-2 flex items-center gap-2">
            <Upload size={18} /> Upload Image
          </Button>
        </div>
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">Username</label>
          <input type="text" name="name" value={profile.name} onChange={handleChange} className="input-field" />
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input type="text" name="email" value={profile.email} disabled className="input-field" />
          <label className="block text-sm font-medium text-gray-700">Location</label>
          <input type="text" name="location" value={profile.location} onChange={handleChange} className="input-field" />
        </div>
        <Button 
          onClick={handleSave} 
          className="mt-6 w-full flex items-center justify-center gap-2"
          disabled={saving}
        >
          {saving ? "Saving..." : "Update Profile"} <Save size={18} />
        </Button>
      </motion.div>
    </div>
  );
}
