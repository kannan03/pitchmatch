"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { ArrowLeft } from "@phosphor-icons/react";
import { useModals } from "@saas-ui/react";
import "./styles.css";

function Onboarding() {
  const router = useRouter();
  const modals = useModals();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [organizationName, setOrganizationName] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("https://");
  const [websiteError, setWebsiteError] = useState("");
  const [animate, setAnimate] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    // Trigger animation after component is mounted
    setAnimate(true);

    // Fetch user's email when component mounts
    const fetchUserData = async () => {
      const supabase = createClient();
      const { data, error: userError } = await supabase.auth.getUser();
      if (data && data.user.email) {
        setUserEmail(data.user.email);
      } else if (userError) {
        setError("Could not fetch user information.");
      }
    };

    fetchUserData();
  }, []);

  const signOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  const handleSubmit = async () => {
    setLoading(true);

    const supabase = createClient();
    const { data, error: userError } = await supabase.auth.getUser();

    if (userError || !data.user) {
      setError("Could not fetch user information.");
      setLoading(false);
      return;
    }

    const userId = data.user.id;

    const { error: insertError } = await supabase
      .from("onboarding_details")
      .insert([
        {
          user_id: userId,
          organization_name: organizationName,
          website_url: websiteUrl,
        },
      ]);

    if (insertError) {
      setError("Could not save onboarding details.");
      setLoading(false);
      return;
    }

    setLoading(false);
    router.push(
      `/organization-details?organizationName=${organizationName}&websiteUrl=${websiteUrl}`
    );
  };

  const handleWebsiteChange = (e) => {
    let { value } = e.target;
    if (value === "https:/") {
      setWebsiteUrl("https://");
      return;
    }

    // If value is empty or only contains "https://", do nothing
    if (value === "https://" || value === "") {
      setWebsiteUrl(value);
      return;
    }

    // Add "https://" prefix if it's not present
    if (!value.startsWith("https://")) {
      value = "https://" + value;
    }

    setWebsiteUrl(value);

    // Check if the entered URL matches the regex pattern
    const urlRegex = /^https?:\/\/(?:www\.)?[^\s.]+\.\S{2,}$/i;
    if (!urlRegex.test(value)) {
      setWebsiteError("Please enter a valid URL");
    } else {
      setWebsiteError("");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="header bg-white text-gray-400 p-2 border-b-2 border-gray-100 sticky top-0 z-50">
        <div
          style={{ fontSize: "14px" }}
          className="container flex font-sans   items-center ml-8"
        >
          <ArrowLeft
            onClick={() =>
              modals.confirm({
                title: "Cancel Onboarding",
                body: "Are you sure you want to cancel onboarding?",
                confirmProps: {
                  colorScheme: "red",
                  label: "Yes",
                },
                onConfirm: () => {
                  signOut();
                },
              })
            }
            className="h-5 w-5 mr-8 text-black  cursor-pointer"
          />

          <div>
            <p>Logged in as </p>
            <p className=" font-mono text-black">{userEmail}</p>
          </div>
          <div>{/* Add any navigation links or icons here */}</div>
        </div>
      </header>

      <motion.div
        className="flex-grow flex flex-col items-center justify-center font-sans -mt-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className={`text-center mb-8 ${animate ? "fade-in" : ""}`}>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-800">
            Get Started
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
            Enter your organization details to begin.
          </p>
        </div>

        <motion.div
          className={`w-full max-w-md px-6 py-6 mx-auto mb-8 border rounded-lg shadow-lg ${
            animate ? "fade-in" : ""
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <div className="mb-4">
            <Label htmlFor="organization-name">Organization Name</Label>
            <Input
              id="organization-name"
              name="organization-name"
              placeholder="Enter your organization name"
              required
              type="text"
              value={organizationName}
              onChange={(e) => setOrganizationName(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="website-url">Website URL</Label>
            <Input
              id="website-url"
              name="website-url"
              placeholder="Enter your organization's website"
              required
              type="url"
              value={websiteUrl}
              onChange={handleWebsiteChange}
            />
            {websiteError && (
              <p className="text-red-500 text-sm mt-1">{websiteError}</p>
            )}
          </div>
        </motion.div>
        <motion.button
          className={`w-80 h-10 rounded-md mb-0 hover:bg-gray-700 transition-colors duration-300 bg-gray-800 text-white ${
            animate ? "fade-in" : ""
          }`}
          onClick={handleSubmit}
          disabled={loading}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          {"Get Started"}
        </motion.button>
      </motion.div>
    </div>
  );
}

export default Onboarding;
