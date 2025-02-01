"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SignIn from "@/app/auth/signin/page";
import SignUp from "@/app/auth/signup/page";
import { FlipWords } from "@/components/ui/flip-words";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Github } from "lucide-react";
import { LineShadowText } from "@/components/ui/line-shadow-text";
import { useTheme } from "next-themes";

const HomePage = () => {
  const words = ["events", "interviews", "meetings"];
  const theme = useTheme();
  const shadowColor = theme.resolvedTheme === "dark" ? "white" : "black";

  return (
    <div>
      <ToastContainer />
      <div className="h-screen w-full relative overflow-hidden flex flex-col">
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
        <div className="relative z-10 flex flex-col flex-grow">
          {/* Navigation */}
          <nav className="py-6 px-8 flex-shrink-0">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
              <div className="flex  items-center space-x-4">
                
              <h1 className="text-2xl font-bold text-gray-900">Schedulo </h1>
              
              </div>
              <div className="space-x-4">
                <Button variant="ghost">About</Button>

                <a
                  href="https://github.com/mukundsolanki/Schedulo"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="bg-gray-800 text-white hover:bg-gray-700">
                    <span>GitHub</span>
                    <Github className="w-5 h-5" />
                  </Button>
                </a>
              </div>
            </div>
          </nav>

          {/* Hero Section */}
          <section className="flex items-center justify-center flex-grow px-8">
            <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
            <div className="mb-4">

<a target="_blank" href="https://peerlist.io/mukundsolanki/project/schedulo-simplifying-event-scheduling-with-ease">

<img src="https://private-user-images.githubusercontent.com/114515612/407613782-4e392f57-7144-4e0b-a4df-cc0fe2e6e737.svg?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3MzgzNDc3MTgsIm5iZiI6MTczODM0NzQxOCwicGF0aCI6Ii8xMTQ1MTU2MTIvNDA3NjEzNzgyLTRlMzkyZjU3LTcxNDQtNGUwYi1hNGRmLWNjMGZlMmU2ZTczNy5zdmc_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjUwMTMxJTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI1MDEzMVQxODE2NThaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT0yNWRkZGYxZmQ4MWMwYzI0MjNkMGNlYjA3YzkyMTUwZTdjNzM5ZGM4ZWZlN2ZlMDNhN2E3MjFiZGJmZDhiYTM3JlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCJ9.Yk8ncGzxV2GOQ9cQ2vUjju6lyo7j0Jbzv_DNg1ozbNs" alt="" />
</a>
</div>
              <h2 className="text-6xl font-bold text-gray-900 mb-6">
                Create{" "}
                <span className="text-indigo-600">
                  <FlipWords words={words} />
                </span>{" "}
                <br />
                seamless with{" "}
                <span className="text-indigo-600">
                  <LineShadowText className="italic" shadowColor={shadowColor}>
                    Schedulo
                  </LineShadowText>
                </span>
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
                    <DialogTitle />
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

          {/* Footer */}
          <footer className="text-center text-base text-gray-600 py-4 flex-shrink-0">
            <p>
              © 2025 Schedulo.{" "}
              <a
                href="https://github.com/mukundsolanki/Schedulo/blob/main/LICENSE"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                MIT Licensed
              </a>
              . Contribute on{" "}
              <a
                href="https://github.com/mukundsolanki/Schedulo"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Github
              </a>
              .
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
