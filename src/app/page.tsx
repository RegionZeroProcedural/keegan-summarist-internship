"use client";

import { useCallback, useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import HeroPlatform from "@/components/HeroPlatform";
import StatisticsBody from "@/components/StatisticsBody";
import ReviewsSection from "@/components/ReviewsSection";
import AwardCards from "@/components/AwardCards";
import LoginModal from "@/components/LoginModal";
import Footer from "@/components/Footer";

export default function Home() {
  const [loginPromptActive, setLoginPromptActive] = useState(false);
  const openLogin = useCallback(() => setLoginPromptActive(true), []);
  const closeLogin = useCallback(() => setLoginPromptActive(false), []);

  return (
    <>
      <div className="mx-auto flex w-full max-w-[78rem] min-w-0 flex-col px-4 py-2 sm:px-6 lg:px-10 xl:px-12">
        {/* Keep it mounted so the #summarist-login link works even before hydration. */}
        <LoginModal isOpen={loginPromptActive} onClose={closeLogin} />
        <Navbar onLogin={openLogin} />
        <Hero toggleLogin={openLogin} />
        <HeroPlatform />
        <StatisticsBody />
        <ReviewsSection toggleLogin={openLogin} />
        <AwardCards />
      </div>
      <Footer />
    </>
  );
}
