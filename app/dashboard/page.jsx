"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

export default function Component() {
  const [formData, setFormData] = useState({
    website: "",
    name: "",
  });
  const [generatedEmail, setGeneratedEmail] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    setGeneratedEmail(`
      Subject: Opportunity to collaborate

      Hi ${formData.name},

      I came across your website, ${formData.website}, and was impressed by the work you're doing. 

      I believe we could explore opportunities to collaborate and help drive more value for your business. 

      I'd love to learn more about your goals and see if there's a way I can assist. When would be a good time to connect?

      Best regards,
      [Your Name]
    `);
  };

  return (
    <div className="flex items-center justify-center h-5/6">
      <div className="w-full max-w-6xl p-4">
        <section className="bg-white p-8">
          <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
            <div className="text-center space-y-4">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight font-sans">
                Generate Personalized Mail
              </h1>
              <p className="text-muted-foreground text-md sm:text-lg">
                Create personalized emails for your leads and customers.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8 sm:mt-12">
              <div className="bg-card rounded-lg shadow-lg p-6 flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <div className="bg-gray-800 rounded-full p-2 text-white">
                    <MailIcon className="h-6 w-6 bg-primary-foreground" />
                  </div>
                  <h2 className="text-xl font-semibold">Personalize List</h2>
                </div>
                <p className="text-muted-foreground">
                  Easily personalize emails for your entire contact list.
                </p>
                <Button className="mt-auto bg-gray-800 text-white hover:bg-gray-700 transition-colors duration-300">
                  Get Started
                </Button>
              </div>
              <div className="bg-card rounded-lg shadow-lg p-6 flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <div className="bg-gray-800 rounded-full p-2 text-white">
                    <UserIcon className="h-6 w-6" />
                  </div>
                  <h2 className="text-xl font-semibold">
                    Personalize Single Lead
                  </h2>
                </div>
                <p className="text-muted-foreground">
                  Personalize emails for individual leads and customers.
                </p>
                <Button className="mt-auto bg-gray-800 text-white hover:bg-gray-700 transition-colors duration-300">
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        </section>
        {generatedEmail && (
          <section className="pt-8">
            <Card>
              <CardHeader>
                <CardTitle>Your Cold Email</CardTitle>
                <CardDescription>
                  Use this email to reach out to your potential partner.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="whitespace-pre-wrap break-words text-sm text-gray-500 dark:text-gray-400">
                  {generatedEmail}
                </pre>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm">
                  Copy to Clipboard
                </Button>
              </CardFooter>
            </Card>
          </section>
        )}
      </div>
    </div>
  );
}

function MailIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function UserIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
