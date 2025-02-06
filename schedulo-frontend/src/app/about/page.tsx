"use client";
import React, { useState, useEffect } from 'react';
import { Github, Mail, Calendar, Users, Clock, BarChart } from 'lucide-react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const AboutPage = () => {
  interface Contributor {
    id: number;
    login: string;
    avatar_url: string;
    html_url: string;
  }

  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContributors = async () => {
      try {
        const response = await fetch(
          "https://api.github.com/repos/mukundsolanki/Schedulo/contributors"
        );
        const data = await response.json();
        setContributors(data);
      } catch (error) {
        console.error("Error fetching contributors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContributors();
  }, []);

  const features = [
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Event Creation",
      description:
        "Create online or offline events with an intuitive interface that makes scheduling effortless.",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Registration Management",
      description:
        "Generate and share unique registration links, allowing participants to select their preferred time slots.",
    },
    {
      icon: <Mail className="w-8 h-8" />,
      title: "Automated Communications",
      description:
        "Send automated confirmation emails to approved participants, streamlining the communication process.",
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Time Slot Flexibility",
      description:
        "Configure multiple time slots with custom preferences to accommodate various schedules.",
    },
    {
      icon: <BarChart className="w-8 h-8" />,
      title: "Analytics Dashboard",
      description:
        "Access real-time insights on registrations, approvals, and participant statistics.",
    },
    {
      icon: <Github className="w-8 h-8" />,
      title: "Open Source",
      description:
        "Fully customizable platform that welcomes contributions from the developer community.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header with Logo */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold text-gray-900">Schedulo </h1>
            </Link>
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
      </header>

      {/* Hero Section */}

      {/* Mission Statement */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 transform -skew-y-6"></div>
        </div>
        <div className="relative px-4 py-24 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center">
              <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                Our Mission
              </h2>
              <div className="mt-6 space-y-6">
                <p className="text-xl leading-8 text-gray-600">
                  We're revolutionizing event scheduling by making it
                  <span className="text-purple-600 font-semibold">
                    {" "}
                    seamless
                  </span>
                  ,
                  <span className="text-blue-600 font-semibold">
                    {" "}
                    efficient
                  </span>
                  , and
                  <span className="text-purple-600 font-semibold">
                    {" "}
                    accessible
                  </span>{" "}
                  for everyone.
                </p>
                <p className="text-lg leading-7 text-gray-500">
                  From corporate meetings to community events and personal
                  interviews, Schedulo provides an elegant solution that
                  transforms the way you manage time and organize gatherings.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Powerful Features
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Everything you need to manage events efficiently
            </p>
          </div>

          <div className="mt-20">
            <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <div key={index} className="group relative">
                  <div className="relative bg-white p-8 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-2xl border border-gray-100 h-full transform hover:-translate-y-1">
                    <div className="absolute -top-4 -left-4">
                      <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white transform rotate-3 group-hover:rotate-6 transition-transform duration-300">
                        {feature.icon}
                      </div>
                    </div>
                    <div className="mt-8">
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Contributors Section */}
      <div className="relative py-24 bg-gray-50">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-10 -right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply opacity-10 animate-blob"></div>
          <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply opacity-10 animate-blob animation-delay-2000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">
              Our Contributors
            </h2>
            <p className="max-w-2xl mx-auto text-xl text-gray-600 mb-12">
              Meet the amazing developers who are shaping the future of Schedulo
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="space-y-4">
                <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-500 animate-pulse">Loading contributors...</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {contributors.map((contributor) => (
                <a
                  key={contributor.id}
                  href={contributor.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                >
                  <div className="relative p-4">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5 rounded-lg transform transition-all duration-300 group-hover:scale-105"></div>
                    <div className="relative flex flex-col items-center space-y-3">
                      <div className="relative">
                        <div className="w-24 h-24 rounded-full overflow-hidden ring-2 ring-purple-100 group-hover:ring-purple-500 transition-all duration-300">
                          <img
                            src={contributor.avatar_url}
                            alt={`${contributor.login}'s avatar`}
                            className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-110"
                          />
                        </div>
                        <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-lg transform transition-transform duration-300 group-hover:scale-110">
                          <Github className="w-5 h-5 text-gray-600" />
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="font-medium text-gray-900 group-hover:text-purple-600 transition-colors">
                          {contributor.login}
                        </p>
                        <p className="text-sm text-gray-500 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          View Profile
                        </p>
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}

          
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to get started?</span>
            <span className="block text-blue-200">
              Join our open-source community today.
            </span>
          </h2>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
          <div className="flex justify-center space-x-6 md:order-2">
            <a
              href="https://github.com/mukundsolanki/Schedulo"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-500"
            >
              <Github className="w-6 h-6" />
            </a>
          </div>
          <div className="mt-8 md:mt-0 md:order-1">
            <p className="text-center text-base text-gray-400">
              © 2025 Schedulo. MIT Licensed.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AboutPage;
