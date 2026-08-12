"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Starfield from "@/components/Starfield";
import PasscodeGate from "@/components/PasscodeGate";
import Navbar from "@/components/Navbar";
import BirthdayHero from "@/components/Hero";
import MemoryGallery from "@/components/MemoryGallery";
import StoryTimeline from "@/components/Timeline";
import VoiceMessage from "@/components/VoiceAudioPlayer";
import DateNightReveal from "@/components/DateNightReveal";
import ScratchCard from "@/components/ScratchCard";
import LoveMeter from "@/components/LoveMeter";
import BirthdayLetter from "@/components/LoveLetter";
import Finale from "@/components/Finale";
import Footer from "@/components/Footer";
import PersonalizerDrawer from "@/components/PersonalizerDrawer";
import { usePersonalization } from "@/context/PersonalizationContext";

export default function HomePage() {
  const { previewMode } = usePersonalization();
  const [isUnlocked, setIsUnlocked] = useState(false);

  const showContent = isUnlocked || previewMode;

  return (
    <main className="relative min-h-screen bg-[#060105] text-[#ffe9ef] selection:bg-magenta selection:text-white overflow-x-hidden">
      {/* Persistent Cosmic Starfield Background */}
      <Starfield />

      {/* 01 - Secret Birthday Vault Gate */}
      <AnimatePresence>
        {!showContent && (
          <PasscodeGate onUnlock={() => setIsUnlocked(true)} />
        )}
      </AnimatePresence>

      {/* Cinematic Birthday Journey */}
      {showContent && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <Navbar />
          <BirthdayHero />
          <MemoryGallery />
          <StoryTimeline />
          <VoiceMessage />
          <DateNightReveal />
          <ScratchCard />
          <LoveMeter />
          <BirthdayLetter />
          <Finale />
          <Footer />
          <PersonalizerDrawer />
        </motion.div>
      )}
    </main>
  );
}
