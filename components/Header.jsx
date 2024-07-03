"use client";
import React, { useState, useEffect, useRef, forwardRef } from "react";
import Image from "next/image";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Dialog } from "@headlessui/react";
import logo from "../public/logo.png";
import Link from "next/link";
import {
  EnvelopeSimple,
  Lightbulb,
  Handshake,
  Hourglass,
  Check,
  Link as LinkIcon,
  Cpu,
  Heart,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { AnimatedBeam } from "@/components/magicui/animated-beam";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

const Circle = forwardRef(({ className, children }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 bg-white p-3 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)]",
        className
      )}
    >
      {children}
    </div>
  );
});

const Header = (props) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      // Set isScrolled to true when scrolling starts
      setIsScrolled(scrollTop > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  const navigation = [
    { name: "Features", href: "#" },
    { name: "Pricing", href: "#" },
    { name: "FAQ", href: "#" },
  ];

  const containerRef = useRef(null);
  const div1Ref = useRef(null);
  const div2Ref = useRef(null);
  const div3Ref = useRef(null);
  const div4Ref = useRef(null);

  const features = [
    {
      name: "Personalized Email Content",
      description:
        "Our AI generates customized email content tailored to your company's services and your leads' business profiles.",
      icon: EnvelopeSimple,
    },
    {
      name: "Effortless Creation",
      description:
        "Say goodbye to writer's block – create polished emails in seconds with our intuitive platform.",
      icon: Lightbulb,
    },
    {
      name: "Increased Engagement",
      description:
        "Drive higher response rates with emails that resonate with your audience's needs and interests.",
      icon: Handshake,
    },
    {
      name: "Efficient Workflow:",
      description:
        "Save time and streamline your email outreach process with our AI-generated content, allowing you to focus on building relationships and growing your business.",
      icon: Hourglass,
    },
  ];

  return (
    <div className="bg-gray-50 font-sans z-10">
      <div className="bg-white">
        <header
          className={`absolute inset-x-0 top-0 z-50 sticky ${
            isScrolled ? "bg-white opacity-100" : ""
          }`}
        >
          <nav
            className="flex items-center justify-between p-6 lg:px-8"
            aria-label="Global"
          >
            <div className="flex lg:flex-1">
              <a href="#" className="-m-1.5 p-1.5">
                <span className="sr-only">Your Company</span>
                <Image className="h-8 w-auto" src={logo} alt="" />
              </a>
            </div>
            <div className="flex lg:hidden">
              <button
                type="button"
                className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                onClick={() => setMobileMenuOpen(true)}
              >
                <span className="sr-only">Open main menu</span>
                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="hidden lg:flex lg:gap-x-12">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-sm font-semibold leading-6 text-gray-900"
                >
                  {item.name}
                </a>
              ))}
            </div>
            {props.isSupabaseConnected && (
              <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                <div
                  onClick={() => router.push("/login")}
                  className="text-sm font-semibold leading-6 text-gray-900 cursor-pointer"
                >
                  Log in <span aria-hidden="true">&rarr;</span>
                </div>
              </div>
            )}
          </nav>
          <Dialog
            className="lg:hidden"
            open={mobileMenuOpen}
            onClose={setMobileMenuOpen}
          >
            <div className="fixed inset-0 z-50" />
            <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
              <div className="flex items-center justify-between">
                <a href="#" className="-m-1.5 p-1.5">
                  <span className="sr-only">Your Company</span>
                  <Image
                    className="h-8 w-auto"
                    src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                    alt=""
                  />
                </a>
                <button
                  type="button"
                  className="-m-2.5 rounded-md p-2.5 text-gray-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="sr-only">Close menu</span>
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div className="mt-6 flow-root">
                <div className="-my-6 divide-y divide-gray-500/10">
                  <div className="space-y-2 py-6">
                    {navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                  <div className="py-6">
                    <a
                      href="#"
                      className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                    >
                      Log in
                    </a>
                  </div>
                </div>
              </div>
            </Dialog.Panel>
          </Dialog>
        </header>

        <div className="relative isolate px-6 pt-14 lg:px-8">
          <div
            className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
            aria-hidden="true"
          >
            <div
              className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
            />
          </div>
          <div className="mx-auto max-w-2xl">
            {/* <div className="hidden sm:mb-8 sm:flex sm:justify-center">
              <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
                Announcing our next round of funding.{" "}
                <a href="#" className="font-semibold text-indigo-600">
                  <span className="absolute inset-0" aria-hidden="true" />
                  Read more <span aria-hidden="true">&rarr;</span>
                </a>
              </div>
            </div> */}
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                Effortless Cold Email Generation
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Our AI-powered email generator helps you create high-converting
                cold emails tailored to your leads, boosting your outreach
                success.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <a
                  href="#"
                  className="rounded-md bg-gray-900 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
                >
                  Get started
                </a>
                <a
                  href="#"
                  className="text-sm font-semibold leading-6 text-gray-900"
                >
                  Learn more <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>
          </div>
          <div
            className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
            aria-hidden="true"
          >
            <div
              className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
            />
          </div>
        </div>
        <div className="bg-white py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:text-center">
              <h2 className="text-base font-semibold leading-7 text-purple-600">
                Efficient Email Marketing
              </h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Unlock the Power of AI-Driven Cold Emails
              </p>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Our AI-powered platform leverages your business data and
                customer insights to generate personalized cold emails that
                drive results.
              </p>
            </div>
            <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
              <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
                {features.map((feature) => (
                  <div key={feature.name} className="relative pl-16">
                    <dt className="text-base font-semibold leading-7 text-gray-900">
                      <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg">
                        <feature.icon
                          className="h-12 w-12 text-black"
                          aria-hidden="true"
                        />
                      </div>
                      {feature.name}
                    </dt>
                    <dd className="mt-2 text-base leading-7 text-gray-600">
                      {feature.description}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center p-5">
          <section
            className="w-full bg-white dark:bg-white bg-gray-800"
            id="features"
          >
            <div className="container mx-auto px-4 md:px-6">
              <div className="grid items-center gap-6 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_550px]">
                <div className="flex flex-col justify-center space-y-4">
                  <div className="space-y-2">
                    <div className="inline-block rounded-lg dark:bg-white py-1 text-sm bg-gray-800">
                      Cold Email Generation
                    </div>
                    <h2 className="text-2xl font-bold tracking-tighter sm:text-5xl">
                      How Our AI-Powered Cold Email Generation Works
                    </h2>
                    {/* <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                    Our advanced AI algorithms leverage your business data and
                    your leads business knowledge to create personalized cold
                    emails that drive results.
                  </p> */}
                  </div>
                  <div className="flex flex-col justify-center space-y-4">
                    <ul className="grid gap-6">
                      <li>
                        <div className="grid gap-1">
                          <h3 className="text-xl font-bold">
                            Data Collection & Analysis
                          </h3>
                          <p className="text-gray-500 dark:text-gray-400">
                            Our AI gathers insights from the owner&apos;s and
                            lead`&apos;`s website URLs, understanding services
                            and business needs.
                          </p>
                        </div>
                      </li>
                      <li>
                        <div className="grid gap-1">
                          <h3 className="text-xl font-bold">
                            AI-Generated Recommendations
                          </h3>
                          <p className="text-gray-500 dark:text-gray-400">
                            Based on this data, our platform suggests tailored
                            strategies for business growth.
                          </p>
                        </div>
                      </li>
                      <li>
                        <div className="grid gap-1">
                          <h3 className="text-xl font-bold">
                            Automated Email Creation
                          </h3>
                          <p className="text-gray-500 dark:text-gray-400">
                            Finally, our AI crafts personalized emails,
                            articulating how the owner&apos;s services can
                            benefit the lead&apos;s business, saving time and
                            ensuring effectiveness.
                          </p>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
                <div
                  className="relative flex w-full align-center max-w-[800px] items-center justify-center overflow-hidden rounded-lg"
                  ref={containerRef}
                >
                  <div className="flex h-full w-full flex-row items-stretch justify-between ">
                    <div className="flex flex-col justify-between">
                      <div className="flex flex-col items-center justify-between">
                        <Circle ref={div1Ref}>
                          <LinkIcon className="text-black" />
                        </Circle>
                        <p className="font-mono text-sm mt-2">Your Website</p>
                      </div>

                      <div className="flex flex-col items-center justify-between mt-12">
                        <Circle ref={div2Ref}>
                          <LinkIcon className="text-black" />
                        </Circle>
                        <p className="font-mono text-sm mt-2">Lead Website</p>
                      </div>
                    </div>
                    <div className="flex flex-col justify-between">
                      <div className="flex flex-col items-center justify-between mt-12">
                        <Circle ref={div3Ref}>
                          <Cpu className="text-black" />
                        </Circle>
                        <p className="font-mono text-sm mt-2">AI</p>
                      </div>
                    </div>
                    <div className="flex flex-col justify-between">
                      <div className="flex flex-col items-center justify-between mt-12">
                        <Circle ref={div4Ref}>
                          <EnvelopeSimple className="text-black" />
                        </Circle>
                        <p className="font-mono text-sm mt-2">Mail Content</p>
                      </div>
                    </div>
                  </div>

                  <AnimatedBeam
                    duration={3}
                    containerRef={containerRef}
                    fromRef={div1Ref}
                    toRef={div3Ref}
                  />
                  <AnimatedBeam
                    duration={3}
                    containerRef={containerRef}
                    fromRef={div2Ref}
                    toRef={div3Ref}
                  />
                  <AnimatedBeam
                    duration={3}
                    containerRef={containerRef}
                    fromRef={div3Ref}
                    toRef={div4Ref}
                  />
                </div>
              </div>
            </div>
          </section>
        </div>
        <br />

        <section
          className="w-full dark:bg-white bg-gray-800 pt-14"
          id="pricing"
        >
          <div className="container mx-auto px-6 md:px-4">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Pricing
                </h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Choose the plan that fits your needs. All plans include
                  unlimited email generation and personalization.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 sm:grid-cols-2 md:grid-cols-3 lg:gap-12">
              <Card className="flex flex-col justify-between rounded border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white bg-gray-950">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold">Starter</h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      For small teams and individuals
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-4xl font-bold">$49</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      per month
                    </p>
                  </div>
                  <ul className="grid gap-2 text-gray-500 dark:text-gray-400">
                    <li>
                      <Check className="mr-2 inline-block h-4 w-4 text-green-500" />
                      Up to 500 leads
                    </li>
                    <li>
                      <Check className="mr-2 inline-block h-4 w-4 text-green-500" />
                      Unlimited email generation
                    </li>
                    <li>
                      <Check className="mr-2 inline-block h-4 w-4 text-green-500" />
                      Basic personalization
                    </li>
                    <li>
                      <Check className="mr-2 inline-block h-4 w-4 text-green-500" />
                      Email performance analytics
                    </li>
                  </ul>
                </div>
                <Link
                  className="mt-4 inline-flex h-10 w-full items-center border border-black justify-center rounded dark:bg-gray-900 px-8 text-sm font-medium dark:text-gray-50 shadow transition-colors hover:bg-gray-900/90 hover:text-black focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 bg-gray-50 text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
                  href="#"
                >
                  Get Started
                </Link>
              </Card>
              <Card className="flex flex-col justify-between rounded border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white bg-gray-950">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold">Pro</h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      For growing teams and businesses
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-4xl font-bold">$99</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      per month
                    </p>
                  </div>
                  <ul className="grid gap-2 text-gray-500 dark:text-gray-400">
                    <li>
                      <Check className="mr-2 inline-block h-4 w-4 text-green-500" />
                      Up to 2,000 leads
                    </li>
                    <li>
                      <Check className="mr-2 inline-block h-4 w-4 text-green-500" />
                      Unlimited email generation
                    </li>
                    <li>
                      <Check className="mr-2 inline-block h-4 w-4 text-green-500" />
                      Advanced personalization
                    </li>
                    <li>
                      <Check className="mr-2 inline-block h-4 w-4 text-green-500" />
                      Email performance analytics
                    </li>
                    <li>
                      <Check className="mr-2 inline-block h-4 w-4 text-green-500" />
                      Dedicated account manager
                    </li>
                  </ul>
                </div>
                <Link
                  className="mt-4 inline-flex h-10 w-full items-center border border-black justify-center rounded dark:bg-gray-900 px-8 text-sm font-medium dark:text-gray-50 shadow transition-colors hover:bg-gray-900/90 hover:text-black focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 bg-gray-50 text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
                  href="#"
                >
                  Get Started
                </Link>
              </Card>
              <Card className="flex flex-col justify-between rounded border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white bg-gray-950">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold">Enterprise</h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      For large teams and high-volume users
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-4xl font-bold">$499</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      per month
                    </p>
                  </div>
                  <ul className="grid gap-2 text-gray-500 dark:text-gray-400">
                    <li>
                      <Check className="mr-2 inline-block h-4 w-4 text-green-500" />
                      Unlimited leads
                    </li>
                    <li>
                      <Check className="mr-2 inline-block h-4 w-4 text-green-500" />
                      Unlimited email generation
                    </li>
                    <li>
                      <Check className="mr-2 inline-block h-4 w-4 text-green-500" />
                      Advanced personalization
                    </li>
                    <li>
                      <Check className="mr-2 inline-block h-4 w-4 text-green-500" />
                      Email performance analytics
                    </li>
                    <li>
                      <Check className="mr-2 inline-block h-4 w-4 text-green-500" />
                      Dedicated account manager
                    </li>
                    <li>
                      <Check className="mr-2 inline-block h-4 w-4 text-green-500" />
                      Custom integrations
                    </li>
                  </ul>
                </div>
                <Link
                  className="mt-4 inline-flex h-10 w-full items-center border border-black justify-center rounded dark:bg-gray-900 px-8 text-sm font-medium dark:text-gray-50 shadow transition-colors hover:bg-gray-900/90 hover:text-black focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 bg-gray-50 text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
                  href="#"
                >
                  Get Started
                </Link>
              </Card>
            </div>
          </div>
        </section>
        {/* <section className="relative isolate overflow-hidden bg-white px-6 py-24 sm:py-32 lg:px-8">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.indigo.100),white)] opacity-20" />
          <div className="absolute inset-y-0 right-1/2 -z-10 mr-16 w-[200%] origin-bottom-left skew-x-[-30deg] bg-white shadow-xl shadow-indigo-600/10 ring-1 ring-indigo-50 sm:mr-28 lg:mr-0 xl:mr-16 xl:origin-center" />
          <div className="mx-auto max-w-2xl lg:max-w-4xl">
            <p className="text-center text-lg font-semibold text-purple-600">
              Workcation
            </p>
            <figure className="mt-10">
              <blockquote className="text-center text-xl font-semibold leading-8 text-gray-900 sm:text-2xl sm:leading-9">
                <p>
                  “The AI-powered cold email solution from this company has been
                  a game-changer for our business. We&apos;ve seen a significant
                  increase in response rates and qualified leads.”
                </p>
              </blockquote>
              <figcaption className="mt-10">
                <div className="mt-4 flex items-center justify-center space-x-3 text-base">
                  <div className="font-semibold text-gray-900">
                    Judith Black
                  </div>
                  <svg
                    viewBox="0 0 2 2"
                    width={3}
                    height={3}
                    aria-hidden="true"
                    className="fill-gray-900"
                  >
                    <circle cx={1} cy={1} r={1} />
                  </svg>
                  <div className="text-gray-600">CEO of Workcation</div>
                </div>
              </figcaption>
            </figure>
          </div>
        </section> */}
        <section className="w-full py-12 md:py-24 lg:py-24 bg-gray-100 dark:bg-white bg-gray-900">
          <div className="container mx-auto grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold font-sans tracking-tighter md:text-4xl/tight">
                Ready to Boost Your Cold Email Outreach?
              </h2>
              <p className="mx-auto font-mono max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Sign up for our AI-powered cold email platform and start
                generating personalized, high-converting emails today.
              </p>
            </div>
            <div className="mx-auto w-full max-w-sm space-y-2">
              <form className="flex space-x-2">
                <Input
                  className="max-w-lg flex-1 rounded border border-gray-200 dark:bg-white p-2 shadow-sm dark:border-gray-800 bg-gray-950"
                  placeholder="Enter your email"
                  type="email"
                />
                <Button
                  className="bg-gray-900 text-gray-50 rounded"
                  type="submit"
                >
                  Get Started
                </Button>
              </form>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Sign up to start generating personalized cold emails.
                <Link className="underline underline-offset-2" href="#">
                  Terms & Conditions
                </Link>
              </p>
            </div>
          </div>
        </section>
        <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            © 2024 PitchMatch Inc. All rights reserved.
          </p>
          <p className="text-sm text-gray-800 dark:text-gray-400 font-mono flex flex-row items-center">
            Made with{" "}
            <Heart className="ml-2 mr-2" size={16} color="red" weight="fill" />{" "}
            by Intronsoft
          </p>
          <nav className="sm:ml-auto flex gap-4 sm:gap-6">
            <Link
              className="text-xs hover:underline underline-offset-4"
              href="#"
            >
              Terms of Service
            </Link>
            <Link
              className="text-xs hover:underline underline-offset-4"
              href="#"
            >
              Privacy
            </Link>
          </nav>
        </footer>
      </div>
    </div>
  );
};

export default Header;
