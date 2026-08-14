"use client";

import { useState, useEffect } from "react";

export default function Greeting() {
  const [mounted, setMounted] = useState(false);
  const [greeting, setGreeting] = useState("Good morning");

  useEffect(() => {
    setMounted(true);
    const updateGreeting = () => {
      const hour = new Date().getHours();
      if (hour >= 12 && hour < 17) setGreeting("Good afternoon");
      else if (hour >= 17) setGreeting("Good evening");
      else setGreeting("Good morning");
    };
    updateGreeting();
  }, []);

  if (!mounted) {
    return <h1 className="page-title">Welcome back, User!</h1>;
  }

  return <h1 className="page-title">{greeting}, User!</h1>;
}
