"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, Sparkles, MapPin, Calendar, Check, RefreshCw } from "lucide-react";
import confetti from "canvas-confetti";
import { usePersonalization } from "@/context/PersonalizationContext";
import { playSuccessChime, playTone } from "@/lib/audio";

export default function DateNightReveal() {
  const { data } = usePersonalization();
  const [isOpen, setIsOpen] = useState(false);

  const surprise = data.dateNightSurprise || {
    title: "YOUR BIRTHDAY DATE NIGHT",
    tagline: "A Private Celebration Reserved Just For You",
    details:
      "One unforgettable date. Your favorite food. Your favorite place. And one person who is completely & hopelessly obsessed with you.",
    venue: "Secret Location — Tonight",
  };

  const handleOpenBox = () => {
    if (isOpen) return;
    setIsOpen(true);
    playSuccessChime();

    // Confetti burst explosion
    confetti({
      particleCount: 100,
      spread: 90,
      origin: { y: 0.6 },
      colors: ["#f3ce7a", "#ff2a5f", "#ffb3c6", "#ffffff"],
      scalar: 1.2,
    });
  };

  return (
    <section id="surprise" className="relative py-28 px-6 max-w-2xl mx-auto z-10">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border border-rosegold/20 text-rosegold/90 mb-3 shadow-md">
          <Gift className="w-3.5 h-3.5 text-magenta" strokeWidth={1.5} />
          <span className="text-xs tracking-[0.3em] uppercase font-body">
            Secret Birthday Surprise
          </span>
        </div>
        <h2 className="font-display text-4xl md:text-5xl text-gradient-gold font-bold">
          I saved one more thing for you...
        </h2>
        <p className="text-stardust/70 mt-3 font-body text-base sm:text-lg">
          Tap the glowing golden gift box to unwrap your birthday prize.
        </p>
      </div>

      <div className="flex justify-center">
        <AnimatePresence mode="wait">
          {!isOpen ? (
            /* Closed 3D Gift Box */
            <motion.div
              key="box-closed"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.1, opacity: 0, filter: "blur(12px)" }}
              transition={{ duration: 0.6 }}
              onClick={handleOpenBox}
              className="relative cursor-pointer group flex flex-col items-center select-none"
            >
              <motion.div
                whileHover={{ scale: 1.06, rotate: 2 }}
                whileTap={{ scale: 0.95 }}
                className="w-48 h-48 sm:w-56 sm:h-56 rounded-3xl glass-panel border-2 border-rosegold/40 flex flex-col items-center justify-center p-6 shadow-glow-gold relative overflow-hidden group-hover:border-magenta transition-all duration-500"
              >
                {/* Glow & Sparkle particles inside box */}
                <div className="absolute inset-0 bg-gradient-to-tr from-magenta/20 via-rosegold/10 to-transparent pointer-events-none" />

                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="relative z-10 flex flex-col items-center"
                >
                  <Gift className="w-20 h-20 text-rosegold drop-shadow-[0_0_20px_rgba(243,206,122,0.8)] group-hover:text-magenta transition-colors duration-300" strokeWidth={1.2} />
                  <span className="font-display text-lg text-gradient-gold mt-3 font-semibold">
                    Tap to Open
                  </span>
                </motion.div>
              </motion.div>

              <span className="text-xs font-body text-stardust/50 mt-4 tracking-widest uppercase">
                ✦ Contains 1x Birthday Date Voucher ✦
              </span>
            </motion.div>
          ) : (
            /* Opened Birthday Surprise Voucher Card */
            <motion.div
              key="voucher-revealed"
              initial={{ opacity: 0, scale: 0.85, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="w-full glass-panel rounded-3xl p-8 sm:p-12 border-2 border-rosegold/40 shadow-glow-gold relative overflow-hidden text-center"
            >
              {/* Ribbon Graphic */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-magenta to-rosegold text-midnight font-bold text-xs uppercase tracking-widest mb-6 shadow-glow">
                <Sparkles className="w-4 h-4" />
                Voucher Claimed
              </div>

              <h3 className="font-display text-3xl sm:text-4xl text-gradient-gold font-extrabold tracking-wide mb-3">
                🎟️ {surprise.title}
              </h3>

              <p className="font-script text-2xl text-gradient-rose font-semibold mb-4">
                &ldquo;{surprise.tagline}&rdquo;
              </p>

              <div className="p-6 rounded-2xl bg-white/[0.04] border border-rosegold/20 my-6">
                <p className="font-body text-stardust/90 text-base sm:text-lg leading-relaxed">
                  {surprise.details}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-body text-stardust/70">
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-panel border border-rosegold/20">
                  <MapPin className="w-3.5 h-3.5 text-rosegold" /> {surprise.venue}
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-panel border border-rosegold/20">
                  <Check className="w-3.5 h-3.5 text-green-400" /> Non-transferable &amp; Unlimited Love
                </span>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="mt-8 text-xs text-stardust/40 hover:text-rosegold transition-colors font-body flex items-center justify-center gap-1 mx-auto"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Re-seal gift box
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
