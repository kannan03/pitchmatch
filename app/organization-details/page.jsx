"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { ArrowLeft, Pen } from "@phosphor-icons/react";
import { useModals } from "@saas-ui/react";
import { Skeleton } from "@chakra-ui/react";
import { Spinner } from "@chakra-ui/react";
import {
  Editable,
  EditableInput,
  EditableTextarea,
  EditablePreview,
  Flex,
  IconButton,
  ButtonGroup,
  useEditableControls,
  Textarea,
} from "@chakra-ui/react";
import { CheckIcon, CloseIcon, EditIcon } from "@chakra-ui/icons";
import { cn } from "@/lib/utils";
import DotPattern from "@/components/magicui/dot-pattern";
import AnimatedGridPattern from "@/components/magicui/animated-grid-pattern";

function OrganizationDetails() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [editedText, setEditedText] = useState(
    "Intronsoft is a leading IT company offering a comprehensive suite of technology solutions for businesses across industries. They specialize in helping businesses simplify their IT challenges and achieve success through a combination of technical expertise, custom solutions, and exceptional customer service. \n\nHere's a breakdown of their services:\n\n* **IT Consulting & Advisory:** Intronsoft provides strategic IT consulting and advisory services to help businesses align technology with their unique goals. This includes creating efficient, innovative, and worry-free digital journeys.\n* **Cloud Hosting & IT Support:** They offer cloud hosting and IT support services to ensure businesses have reliable and secure technology infrastructure.\n* **Custom Solutions:** Intronsoft develops custom solutions tailored to specific business needs, leveraging their years of technical experience.\n* **Process Improvement:** They help businesses optimize their processes through technology, leading to increased efficiency and productivity.\n* **Unparalleled Customer Service:** Intronsoft is committed to providing exceptional customer service, building long-term, trusted relationships with their clients.\n\nIntronsofts team of dedicated experts creates cutting-edge solutions for businesses and consumers alike, working in a collaborative and creative environment. They are passionate about helping their clients succeed and are committed to providing innovative and effective solutions."
  ); // State to hold edited text
  const [organizationName, setOrganizationName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [dynamicText, setDynamicText] = useState("Analyzing your Website...");
  const [userId, setUserId] = useState(null);
  const [onboardingId, setOnboardingId] = useState(null);

  useEffect(() => {
    const supabase = createClient();

    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        return NextResponse.redirect(
          `${origin}/login?message=Could not authenticate user`
        );
      }
      if (data && data.user.email) {
        setUserEmail(data.user.email);
      }
      const userId = data.user.id;
      setUserId(userId); // Store userId

      const { data: onboarding, error: err } = await supabase
        .from("onboarding_details")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (err) {
        console.log(err);
      }

      console.log(onboarding);
      setLoading(false);
      setOnboardingId(onboarding.id); // Store onboardingId
      setOrganizationName(onboarding?.organization_name);
      // fetchData(onboarding?.organization_name, onboarding?.website_url);
    };

    const fetchData = async (organizationName, websiteUrl) => {
      try {
        const token = process.env.NEXT_PUBLIC_DIFY_API_KEY;
        const response = await axios.post(
          "http://3.111.197.229/v1/workflows/run",
          {
            inputs: {
              company_name: organizationName,
              website_url: websiteUrl,
            },
            user: "test",
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setData(response.data);
        const formattedText = response.data?.data?.outputs?.text || ""; // Get text from API response
        const processedText = formattedText.replace(/\*\*/g, ""); // Remove **
        setEditedText(processedText || ""); // Set edited text from API response
      } catch (error) {
        setError("Failed to fetch organization details.");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (loading) {
      const loadingTimer = setTimeout(() => {
        setDynamicText("Learning about your business...");
      }, 2000); // Display "Analyzing the Business" for 2 seconds
      return () => clearTimeout(loadingTimer);
    }
  }, [loading]);

  const handleSaveAndContinue = async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("onboarding_details")
        .update({ summary: editedText })
        .eq("id", onboardingId);

      if (error) {
        throw new Error(error.message);
      }

      // Navigate to the dashboard after successful save
      router.push("/dashboard");
    } catch (error) {
      console.error("Failed to save the details:", error);
    }
  };

  function EditableControls() {
    const {
      isEditing,
      getSubmitButtonProps,
      getCancelButtonProps,
      getEditButtonProps,
    } = useEditableControls();

    return isEditing ? (
      <ButtonGroup justifyContent="center" size="sm">
        <IconButton icon={<CheckIcon />} {...getSubmitButtonProps()} />
        <IconButton icon={<CloseIcon />} {...getCancelButtonProps()} />
      </ButtonGroup>
    ) : (
      <Flex justifyContent="center" className="items-center">
        <Button
          className="bg-white text-black font-sans text-md border"
          {...getEditButtonProps()}
        >
          <Pen className="mr-2" />
          Edit
        </Button>
      </Flex>
    );
  }

  if (loading) {
    return (
      <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center overflow-hidden bg-background p-20 z-50">
        <div className="absolute top-0 left-0 w-full h-full">
          <DotPattern
            width={20}
            height={20}
            cx={1}
            cy={1}
            cr={1}
            className="absolute inset-0 mask-image:linear-gradient(to_bottom_right,white,transparent,transparent)"
          />
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center flex-col justify-center font-sans z-10"
        >
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="slate.500"
            size="lg"
          />
          <p className="text-xl mt-2">{dynamicText}</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen flex items-center justify-center"
      >
        <p className="text-2xl text-red-500">{error}</p>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="header bg-white text-gray-400 p-2 border-b-2 border-gray-100 sticky top-0 z-50">
        <div
          style={{ fontSize: "14px" }}
          className="container flex font-sans items-center ml-8"
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
            className="h-5 w-5 mr-8 text-black cursor-pointer"
          />

          <div>
            <p>Logged in as </p>
            <p className="font-mono text-black">{userEmail}</p>
          </div>
          <div>{/* Add any navigation links or icons here */}</div>
        </div>
      </header>
      <div className="fixed top-18 left-0 w-full h-full overflow-hidden">
        <DotPattern
          width={20}
          height={20}
          cx={1}
          cy={1}
          cr={1}
          className="absolute inset-0 mask-image:linear-gradient(to_bottom_right,white,transparent,transparent) opacity-40"
        />
        <div className="absolute top-5 left-0 w-full h-full flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{ minHeight: "calc(100vh - 64px)" }} // Adjusted for the header height
            className="flex flex-col items-center justify-center font-sans z-10"
          >
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-800">
              Review and Customize Your Business's Services
            </h1>
            <p className="mt-2 mb-2 text-lg text-gray-600 dark:text-gray-400">
              Tailor Your Service Offerings for Targeted Lead Outreach
            </p>
            <div
              style={{ width: "650px" }}
              className="bg-white shadow-md rounded-lg overflow-hidden mt-2"
            >
              <div className="px-6 py-4">
                <textarea
                  className="w-full h-[500px] p-2 border-none rounded-md resize-none focus:outline-none focus:border-blue-500 shadow-sm"
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                />
              </div>
            </div>
            <div className="px-6 py-4 flex justify-center">
              <Button
                onClick={handleSaveAndContinue}
                className="bg-gray-800 text-white hover:bg-gray-700 transition-colors duration-300 w-80 h-10 rounded-md"
              >
                Save and Continue
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default OrganizationDetails;
