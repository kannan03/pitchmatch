"use client";

import Link from "next/link";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CardContent, Card } from "@/components/ui/card";
import { createClient } from "@/utils/supabase/client";
// import { useRouter } from "next/router"; // Import useRouter for redirection
import { useState } from "react"; // Import useState for managing form state

export default function Component() {
  const [email, setEmail] = useState(""); // State for email input
  const [loading, setLoading] = useState(false); // State for loading state
  // const router = useRouter(); // Next.js router for redirection

  const resetPassword = async () => {
    setLoading(true); // Set loading state to true
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email); // Use Supabase's resetPasswordForEmail method

    if (error) {
      console.error("Error resetting password:", error.message);
      // Handle error if any
      setLoading(false); // Reset loading state
    } else {
      console.log("Password reset email sent successfully");
      // Redirect to login page after successful email sent
      // router.push("/login?message=Check email to continue sign in process");
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-100 px-4 dark:bg-gray-950">
      <div className="w-full max-w-md space-y-6">
        <div className="flex items-center justify-between">
          {/* <Link href="/login">
            <a className="inline-flex h-9 w-9 items-center justify-center rounded-md transition-colors hover:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-950 dark:hover:bg-gray-800 dark:focus:ring-gray-300">
              <ArrowLeftIcon className="h-5 w-5" />
              <span className="sr-only">Go back</span>
            </a>
          </Link> */}
          <h1 className="text-2xl font-bold">Reset Password</h1>
          <div className="h-9 w-9" />
        </div>
        <Card className="bg-white pt-10">
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-gray-500 dark:text-gray-400">
                Enter your email address and we'll send you a link to reset your
                password.
              </p>
            </div>
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                resetPassword(); // Call resetPassword function on form submission
              }}
            >
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  placeholder="m@example.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)} // Update email state on input change
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-slate-800 text-white h-10 rounded"
                disabled={loading} // Disable button when loading
              >
                {loading ? "Verifying email..." : "Reset Password"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ArrowLeftIcon(props) {
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
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  );
}
