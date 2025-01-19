"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SignIn from "@/app/auth/signin/page";
import SignUp from "@/app/auth/signup/page";
import { FlipWords } from "@/components/ui/flip-words";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoNavigate } from "react-icons/io5";

const HomePage = () => {
  const words = ["events", "interviews", "meetings"];

  return (
    <div>
      <ToastContainer />
      <div className="min-h-screen w-full relative overflow-hidden">
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

        {/* Main Content */}
        <div className="relative z-10">
          {/* Navigation */}
          <nav className="py-6 px-8">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">Schedulo</h1>
              <div className="space-x-4">
                <Button variant="ghost">About</Button>

                <a
                  href="https://github.com/mukundsolanki"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className=" bg-gray-800 text-white hover:bg-gray-700">
                    <span>Visit GitHub</span>
                    <IoNavigate className="w-5 h-5" />
                  </Button>
                </a>
              </div>
            </div>
          </nav>

          {/* Hero Section */}
          <section className="flex items-center justify-center min-h-screen py-20 px-8">
            <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
              <h2 className="text-6xl font-bold text-gray-900 mb-6">
                Create{" "}
                <span className="text-indigo-600">
                  <FlipWords words={words} />
                </span>{" "}
                <br />
                seamless <span className="text-indigo-600"> with Schedulo</span>
              </h2>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl">
                Streamline your scheduling process and save time with our
                intuitive management platform.
              </p>
              <div className="space-x-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <InteractiveHoverButton>Get Started</InteractiveHoverButton>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <Tabs defaultValue="login" className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="login">Login</TabsTrigger>
                        <TabsTrigger value="signup">Sign Up</TabsTrigger>
                      </TabsList>
                      <TabsContent value="login">
                        <SignIn />
                      </TabsContent>
                      <TabsContent value="signup">
                        <SignUp />
                      </TabsContent>
                    </Tabs>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </section>
        </div>

        <footer className="text-center text-base text-gray-600 py-4">
          <p>Designed by Mukund Solanki</p>
        </footer>
      </div>
    </div>
  );
};

export default HomePage;
