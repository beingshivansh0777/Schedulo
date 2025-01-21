"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { MdOutlineDoneOutline } from "react-icons/md";

export default function SignUp() {
  const [isLoading, setIsLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const router = useRouter();

  const validatePassword = (password: string): boolean => {
    const strongPasswordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{5,})/;
    return strongPasswordRegex.test(password);
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const name = formData.get("name") as string;
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;

      if (!validatePassword(password)) {
        setPasswordError(
          "Password must be at least 5 characters long, include an uppercase letter, and a special symbol."
        );
        setIsLoading(false);
        return;
      } else {
        setPasswordError("");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/signup`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        }
      );

      if (response.ok) {
        setIsSuccess(true);
        setTimeout(() => {
          toast.success("Account created successfully!");
        }, 2000);
      } else {
        const { message } = await response.json();
        toast.error(message || "Signup failed. Please try again.");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center bg-gray-100">
        <div className="text-center p-8 bg-white shadow-md rounded-lg max-w-md">
          <MdOutlineDoneOutline className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Account Created!
          </h2>
          <p className="text-gray-700 mb-6">
            Your account has been successfully created. You can now log in with
            your email.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSignup}
      className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg border border-gray-200 space-y-6"
    >
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Create an Account</h2>
        <p className="text-gray-500">Sign up to get started</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="signup-name" className="text-gray-700 font-medium">
            Name
          </Label>
          <Input
            id="signup-name"
            name="name"
            type="text"
            required
            placeholder="Enter your name"
            className="border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="signup-email" className="text-gray-700 font-medium">
            Email
          </Label>
          <Input
            id="signup-email"
            name="email"
            type="email"
            required
            placeholder="Enter your email"
            className="border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="space-y-2">
          <Label
            htmlFor="signup-password"
            className="text-gray-700 font-medium"
          >
            Password
          </Label>
          <Input
            id="signup-password"
            name="password"
            type="password"
            required
            placeholder="Create a password"
            className="border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
          />
          {passwordError && (
            <p className="text-sm text-red-600">{passwordError}</p>
          )}
        </div>
      </div>

      <Button
        type="submit"
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg focus:ring-4 focus:ring-indigo-500 disabled:opacity-50"
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <span className="loader mr-2"></span> Creating account...
          </span>
        ) : (
          "Sign Up"
        )}
      </Button>
    </form>
  );
}
