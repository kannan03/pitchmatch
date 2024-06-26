"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { createClient } from "@/utils/supabase/client";
import { useDisclosure } from "@chakra-ui/react";
import { FormDialog, FormLayout } from "@saas-ui/react";
import { useSnackbar } from "@saas-ui/react";
import { useModals } from "@saas-ui/react";
import axios from "axios";
import {
  ChatDots,
  UserSound,
  ChartLineUp,
  UserCirclePlus,
} from "@phosphor-icons/react";

const goals = [
  {
    id: 1,
    name: "Schedule a meeting",
    description: "Encourage potential clients to set up a detailed discussion.",
    icon: <ChatDots className="h-7 w-7" />,
  },
  {
    id: 2,
    name: "Build conversation",
    description:
      "Start meaningful dialogues to understand and address client challenges.",
    icon: <UserSound className="h-7 w-7" />,
  },
  {
    id: 3,
    name: "Drive Engagement",
    description:
      "Encourage potential clients to take action with compelling and targeted content.",
    icon: <ChartLineUp className="h-7 w-7" />,
  },
  {
    id: 4,
    name: "Enhance Brand Awareness",
    description:
      "Boost your brand's visibility and recognition among potential clients.",
    icon: <UserCirclePlus className="h-7 w-7" />,
  },
];

const PageComponent = () => {
  const [step, setStep] = useState(1);
  const [organizations, setOrganizations] = useState([]);
  const [organizationName, setOrganizationName] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("https://");
  const [leadName, setLeadName] = useState("");
  const [leadWebsite, setLeadWebsite] = useState("https://");
  const [selectedOrganization, setSelectedOrganization] = useState(null);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [orgSummary, setOrgSummary] = useState(null);
  const [websiteError, setWebsiteError] = useState("");
  const [animate, setAnimate] = useState(false);

  const nextStep = (e) => setStep(step + 1);
  const prevStep = () => setStep(step - 1);
  const cancel = () => setStep(1); // Resets to the first step

  const disclosure = useDisclosure();
  const snackbar = useSnackbar();
  const modals = useModals();

  const onSubmit = async (inputs) => {
    const supabase = createClient();
    const { data, error: userError } = await supabase.auth.getUser();

    if (userError || !data.user) {
      setError("Could not fetch user information.");
      setLoading(false);
      return;
    }

    const userId = data.user.id;

    const { data: insertData, error: insertError } = await supabase
      .from("onboarding_details")
      .insert([
        {
          user_id: userId,
          organization_name: inputs.organization_name,
          website_url: inputs.website_url,
        },
      ])
      .select();

    if (insertError) {
      snackbar({
        title: "Organization creation failed",
        description:
          "We couldn't create the organization at the moment. Please try again later.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      return;
    }
    fetchOrganizations();
    snackbar({
      title: "Organization created.",
      description: "We've created the organization for you.",
      status: "success",
      duration: 2000,
      isClosable: true,
    });

    disclosure.onClose();
    setOrganizationName("");
    setWebsiteUrl("https://");
    modals.confirm({
      title: "Proceed to the Next Step",
      body: "Do you want to proceed with the newly created organization?",
      confirmProps: {
        label: "Yes",
      },
      onConfirm: () => {
        console.log(insertData, "insertData");
        setSelectedOrganization(insertData[0]);
        fetchOrgSummary(
          insertData[0].organization_name,
          insertData[0].website_url
        );
        setStep(2);
      },
    });
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
    const urlRegex = /^https?:\/\/(?:www\.)?[^\s.]+\.\S{2,}$/i;
    if (!urlRegex.test(value)) {
      setWebsiteError("Please enter a valid URL");
    } else {
      setWebsiteError("");
    }
  };

  const handleLeadWebsiteChange = (e) => {
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

    setLeadWebsite(value);
    const urlRegex = /^https?:\/\/(?:www\.)?[^\s.]+\.\S{2,}$/i;
    if (!urlRegex.test(value)) {
      setWebsiteError("Please enter a valid URL");
    } else {
      setWebsiteError("");
    }
  };

  const fetchOrganizations = async () => {
    const supabase = createClient();
    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError || !authData.user) {
      return NextResponse.redirect(
        `${origin}/login?message=Could not authenticate user`
      );
    }
    const userId = authData.user.id;

    const { data, error } = await supabase
      .from("onboarding_details")
      .select("id,organization_name, website_url")
      .eq("user_id", userId);

    if (error) {
      console.error("Error fetching organizations:", error);
      return;
    }

    setOrganizations(data);
  };

  const fetchOrgSummary = async (organizationName, websiteUrl) => {
    return;
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

      const formattedText = response.data?.data?.outputs?.text || ""; // Get text from API response
      const processedText = formattedText.replace(/\*\*/g, ""); // Remove **
      setOrgSummary(processedText);
    } catch (error) {
      console.log(error);
      snackbar({
        title: "Error fetching organization summary",
        description:
          "We couldn't fetch the organization summary at the moment. Please try again later",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    } finally {
    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);

  return (
    <div className="container mx-auto p-4 font-sans">
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="w-full max-w-5xl mt-8 mx-auto py-8 px-8 md:px-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-sans font-semibold">
                  Available Organizations
                </h2>
                <Button variant="outline" onClick={() => disclosure.onOpen()}>
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Add Organization
                </Button>
              </div>
              <hr />
              <div className="grid gap-4">
                {organizations.map((org) => (
                  <div
                    key={org.id}
                    onClick={() => {
                      setSelectedOrganization(org);
                      fetchOrgSummary(org.organization_name, org.website_url);
                      setStep(2);
                    }}
                    className="flex items-center bg-background rounded-lg shadow-sm p-4 cursor-pointer hover:bg-gray-100"
                  >
                    <div className="bg-muted rounded-md flex items-center justify-center aspect-square w-12">
                      <img
                        // src={org.favicon}
                        src={`https://www.google.com/s2/favicons?sz=64&domain=${org.website_url}`}
                        alt={`${org.name} favicon`}
                        className="w-9 h-9 text-muted-foreground"
                      />
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="text-lg font-sans">
                        {org.organization_name}
                      </h3>
                      <p className="text-sm font-mono text-muted-foreground">
                        {new URL(org.website_url).hostname}
                      </p>
                    </div>
                    <Button variant="ghost" size="icon">
                      <ChevronRightIcon className="w-5 h-5 text-muted-foreground" />
                    </Button>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-center mt-6">
                <span style={{ fontWeight: "bold" }}>**Note </span>
                <p style={{ margin: 0, marginLeft: 8 }}>
                  The organization you're working with will generate
                  personalized mail tailored to your leads' businesses.
                </p>
              </div>
            </div>
          </motion.div>
        )}
        {step === 2 && (
          <motion.div
            className="flex-grow flex flex-col items-center justify-center font-sans mt-48"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className={`text-center mb-8 ${animate ? "fade-in" : ""}`}>
              <h2 className="text-xl font-sans font-semibold">
                Enter your Lead's details to begin.
              </h2>
            </div>

            <motion.div
              className={`w-full max-w-md px-6 py-6 mx-auto mb-8 border rounded-lg shadow-lg ${
                animate ? "fade-in" : ""
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <div className="mb-4">
                <Label htmlFor="organization-name">Lead Name</Label>
                <Input
                  id="lead-name"
                  name="lead-name"
                  placeholder="Enter your Lead's name"
                  required
                  type="text"
                  value={leadName}
                  onChange={(e) => setLeadName(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <Label htmlFor="website-url">Lead's Website URL</Label>
                <Input
                  id="lead-website-url"
                  name="lead-website-url"
                  placeholder="Enter your Leads's website"
                  required
                  type="url"
                  value={leadWebsite}
                  onChange={handleLeadWebsiteChange}
                />
                {websiteError && (
                  <p className="text-red-500 text-sm mt-1">{websiteError}</p>
                )}
              </div>
            </motion.div>
            <motion.div className="flex-grow flex flex-row items-center justify-center">
              <motion.button
                className={`w-20 h-10 rounded-md mb-0 hover:bg-gray-200 transition-colors mr-4 duration-300 bg-white border text-black ${
                  animate ? "fade-in" : ""
                }`}
                onClick={prevStep}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                {"Back"}
              </motion.button>
              <motion.button
                className={`w-20 h-10 rounded-md mb-0 hover:bg-gray-600 transition-colors duration-300 bg-gray-800 text-white ${
                  animate ? "fade-in" : ""
                }`}
                onClick={nextStep}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                {"Next"}
              </motion.button>
            </motion.div>
          </motion.div>
        )}
        {step === 3 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="w-full max-w-5xl mt-8 mx-auto py-8 px-8 md:px-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-sans font-semibold">
                  Set Your Goal
                </h2>
              </div>
              <hr />
              <div className="grid gap-4">
                {goals.map((goal) => (
                  <div
                    key={goal.id}
                    onClick={() => {
                      setSelectedGoal(goal);
                    }}
                    className="flex items-center bg-background rounded-lg shadow-sm p-4 cursor-pointer hover:bg-gray-100"
                  >
                    <div className="bg-muted rounded-md flex items-center justify-center aspect-square w-12">
                      {goal.icon}
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="text-lg font-sans">{goal.name}</h3>
                      <p className="text-sm font-mono text-muted-foreground">
                        {goal.description}
                      </p>
                    </div>
                    <Button variant="ghost" size="icon">
                      <ChevronRightIcon className="w-5 h-5 text-muted-foreground" />
                    </Button>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-center mt-6">
                <span style={{ fontWeight: "bold" }}>**Note </span>
                <p style={{ margin: 0, marginLeft: 8 }}>
                  The email will be tailored based on the specific goal it aims
                  to achieve.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <FormDialog
        title="New organization"
        defaultValues={{ organization_name: "", website_url: "https://" }}
        {...disclosure}
        colorScheme="gray"
        onSubmit={onSubmit}
        onClose={() => {
          setOrganizationName("");
          setWebsiteUrl("https://");
          disclosure.onClose();
        }}
      >
        {({ Field }) => (
          <FormLayout>
            <Field
              name="organization_name"
              label="Name"
              type="text"
              rules={{ required: "Name is required" }}
              value={organizationName}
              onChange={(e) => setOrganizationName(e.target.value)}
              autoFocus
            />
            <Field
              name="website_url"
              type="url"
              label="Website URL"
              rules={{ required: "URL is required" }}
              value={websiteUrl}
              onChange={handleWebsiteChange}
            />
          </FormLayout>
        )}
      </FormDialog>
    </div>
  );
};

export default PageComponent;

function ChevronRightIcon(props) {
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
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function PlusIcon(props) {
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
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}
