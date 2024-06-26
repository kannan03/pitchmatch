"use client";
import React, { useState, useEffect } from "react";

const Page = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // 2000 milliseconds delay

    return () => clearTimeout(timer); // Clean up the timer on component unmount
  }, []);

  if (isLoading) {
    return <div>Loading...</div>; // You can customize this loading message or use a spinner
  }

  return <div>Settings Page</div>;
};

export default Page;
