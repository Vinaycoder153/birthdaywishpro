"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Heart, ChevronDown, Sparkles, Gift, Star } from "lucide-react";
import { usePersonalization } from "@/context/PersonalizationContext";
import { playTone } from "@/lib/audio";
import confetti from "canvas-confetti";

function getDaysUntilBirthday(dateString: string) {
  const birthday = new Date(`${dateString}T00:00:00`);
  const today = new Date();
  birthday.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  return Math.max(0, Math.ceil((birthday.getTime() - today.getTime()) / 86400000));
}

export default function BirthdayHero() {
  const { data } = usePersonalization();
  const [step, setStep] = useState(0);
  const [heartsCount, setHeartsCount] = useState(0);
  const daysUntil = getDaysUntilBirthday(data.birthdayDate);
  const birthday = new Date(`${data.birthdayDate}T00:00:00`);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothX = useSpring(pointerX, { stiffness: 90, damping: 18 });
  const smoothY = useSpring(pointerY, { stiffness: 90, damping: 18 });
  const visualX = useTransform(smoothX, [-1, 1], [-18, 18]);
  const visualY = useTransform(smoothY, [-1, 1], [-12, 12]);
  const ringX = useTransform(smoothX, [-1, 1], [12, -12]);
  const ringY = useTransform(smoothY, [-1, 1], [8, -8]);

  const handlePointerMove = (event: React.PointerEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    pointerX.set(((event.clientX - rect.left) / rect.width - 0.5) * 2);
    pointerY.set(((event.clientY - rect.top) / rect.height - 0.5) * 2);
  };

  const handlePointerLeave = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  const birthdayLabel = birthday.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  // Progressive text reveal sequence
  useEffect(() => {
    const timer1 = setTimeout(() => setStep(1), 1200);
    const timer2 = setTimeout(() => setStep(2), 3200);
    const timer3 = setTimeout(() => setStep(3), 5200);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  const handleHeartClick = () => {
    setHeartsCount((prev) => prev + 1);
    playTone({
      frequency: 523.25 + (heartsCount % 5) * 80,
      duration: 0.25,
      type: "sine",
      volume: 0.1,
    });

    confetti({
      particleCount: 18,
      spread: 65,
      origin: { y: 0.4 },
      colors: ["#ff2a5f", "#f3ce7a", "#ffb3c6"],
      scalar: 0.85,
    });
  };

  return (
    <section
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-16 overflow-hidden select-none"
    >
      {/* Background Glow Lights */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-magenta/10 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-rosegold/10 rounded-full blur-[140px] pointer-events-none" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.55, y: -30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        className="birthday-visual mb-5 cursor-pointer z-10"
        onClick={handleHeartClick}
        title="Tap to celebrate"
        style={{ x: visualX, y: visualY }}
      >
        <motion.div
          className="birthday-orbit orbit-one"
          animate={{ rotate: 360 }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          style={{ x: ringX, y: ringY }}
        >
          <span><Star className="w-4 h-4" /></span>
        </motion.div>
        <motion.div
          className="birthday-orbit orbit-two"
          animate={{ rotate: -360 }}
          transition={{ duration: 23, repeat: Infinity, ease: "linear" }}
        >
          <span><Gift className="w-4 h-4" /></span>
        </motion.div>

        <div className="age-medallion">
          <div className="age-medallion-glow" />
          <motion.span
            animate={{ rotateY: [0, 12, 0, -12, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            20
          </motion.span>
          <small>years of wonderful</small>
        </div>

        {heartsCount > 0 && (
          <motion.span
            key={heartsCount}
            initial={{ scale: 0, y: 10 }}
            animate={{ scale: 1, y: 0 }}
            className="celebration-count"
          >
            +{heartsCount}
          </motion.span>
        )}
      </motion.div>

      {/* Main Birthday Greeting Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="text-center max-w-4xl z-10"
      >
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border border-rosegold/20 text-rosegold text-xs tracking-[0.3em] uppercase font-body mb-6 shadow-md">
          <Sparkles className="w-3.5 h-3.5 text-magenta" />
          A Little Universe Made For You
        </span>

        <h1 className="font-display text-5xl sm:text-7xl md:text-8xl text-gradient-gold leading-[1.05] tracking-tight font-extrabold drop-shadow-2xl">
          {data.heroGreeting}
        </h1>

        <div className="mt-7 flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm font-body">
          <span className="rounded-full border border-magenta/40 bg-magenta/10 px-4 py-2 text-stardust shadow-glow">
            {daysUntil === 0 ? "Today is your day ✨" : `${daysUntil} days to go`}
          </span>
          <span className="rounded-full border border-rosegold/30 bg-rosegold/10 px-4 py-2 text-rosegold">
            {birthdayLabel} · Turning 20
          </span>
        </div>
      </motion.div>

      {/* Progressive Text Reveal Sequence */}
      <div className="mt-8 text-center max-w-2xl min-h-[140px] flex flex-col items-center justify-center z-10 px-4">
        <AnimatePresence mode="wait">
          {step >= 1 && (
            <motion.p
              key="step-1"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="font-script text-2xl sm:text-3xl text-gradient-rose mb-3"
            >
              &ldquo;Today isn&apos;t just another date on the calendar.&rdquo;
            </motion.p>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {step >= 2 && (
            <motion.p
              key="step-2"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="font-body text-stardust/80 text-base sm:text-lg leading-relaxed mb-4"
            >
              It&apos;s the day one of my favorite people came into the world.
            </motion.p>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {step >= 3 && (
            <motion.p
              key="step-3"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="font-body text-rosegold/90 text-sm sm:text-base italic max-w-lg leading-relaxed"
            >
              &ldquo;{data.partnerName}, this little universe exists because being your best friend is one of my favorite parts of life.&rdquo;
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Glowing CTA "Begin Our Story ↓" */}
      <motion.a
        href="#gallery"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 6.2, duration: 1 }}
        className="mt-14 flex flex-col items-center gap-2 text-stardust/60 hover:text-rosegold transition-colors group z-10"
      >
        <span className="text-xs tracking-[0.3em] uppercase font-body">Begin Our Story</span>
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.6, repeat: Infinity }}>
          <ChevronDown className="w-5 h-5 text-rosegold/70 group-hover:text-magenta transition-colors" strokeWidth={1.5} />
        </motion.div>
      </motion.a>
    </section>
  );
}
