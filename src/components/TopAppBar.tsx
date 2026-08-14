"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function TopAppBar() {
  const router = useRouter();
  const pathname = usePathname();
  const [title, setTitle] = useState("Medicare+");

  useEffect(() => {
    // Basic title mapping based on route
    if (pathname === "/") setTitle("Medicare+");
    else if (pathname.startsWith("/medicines")) setTitle("Medicines");
    else if (pathname.startsWith("/health")) setTitle("Health Tracker");
    else if (pathname.startsWith("/profile")) setTitle("Profile");
    else if (pathname.startsWith("/login")) setTitle("Sign In");
    else if (pathname.startsWith("/register")) setTitle("Create Account");
  }, [pathname]);

  const showBack = pathname !== "/" && pathname !== "/login" && pathname !== "/register";

  if (pathname === "/login" || pathname === "/register") return (
    <div className="top-app-bar" style={{ boxShadow: 'none', background: 'transparent' }}>
       <h1 style={{ fontWeight: 600 }}>{title}</h1>
    </div>
  );

  return (
    <header className="top-app-bar">
      {showBack ? (
        <button 
          onClick={() => router.back()} 
          className="top-bar-action"
          aria-label="Go back"
          style={{ background: 'none', border: 'none', color: 'inherit' }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </button>
      ) : (
        <div className="top-bar-action">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="16"></line>
            <line x1="8" y1="12" x2="16" y2="12"></line>
          </svg>
        </div>
      )}
      
      <h1>{title}</h1>

      <div className="top-bar-action" onClick={() => router.push('/profile')}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      </div>
    </header>
  );
}
