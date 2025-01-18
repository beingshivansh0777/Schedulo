// src/app/home/page.tsx
"use client";
import React from "react";
import { FlipWords } from "../components/ui/flip-words";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SignIn from "@/app/auth/signin/page";
import SignUp from "@/app/auth/signup/page";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
  const words = ["events", "interviews", "meetings"];

  return (
    <div>
      <ToastContainer />

      <div className="h-[40rem] flex justify-center items-center px-4">
        <div className="text-4xl mx-auto font-normal text-neutral-600 dark:text-neutral-400">
          Create
          <FlipWords words={words} /> <br />
          seamless with Schedulo
          <br />
          <Dialog>
            <DialogTrigger asChild>
              <Button className="mt-6">
                <Mail className="mr-2 h-4 w-4" />
                Get Started
              </Button>
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
    </div>
  );
}
