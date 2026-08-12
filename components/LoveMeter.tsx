"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";
import { playChargePulse, playFireworksFinale } from "@/lib/audio";

const CHARGE_RATE = 1.6;
const DECAY_RATE = 2.4;

export default function LoveMeter() {
  const [charge, setCharge] = useState(0);
  const [isCharged, setIsCharged] = useState(false);
  const [revealStep, setRevealStep] = useState<0 | 1 | 2>(0);
  const isHolding = useRef(false);
  const rafRef = useRef<number | null>(null);
  const lastTickRef = useRef<number>(0);
  const lastPulseRef = useRef<number>(0);

  const fireFireworks = useCallback(() => {
    playFireworksFinale();
    const colors = ["#ff2a5f", "#f3ce7a", "#ffb3c6", "#ffffff"];
    const burst = (originX: number) => {
      confetti({
        particleCount: 80,
        startVelocity: 60,
        spread: 360,
        origin: { x: originX, y: 0.5 },
        colors,
        scalar: 1.3,
        ticks: 240,
      });
    };
    burst(0.3);
    setTimeout(() => burst(0.7), 200);
    setTimeout(() => burst(0.5), 400);

    // Staggered reveal text sequence
    setTimeout(() => setRevealStep(1), 800);
    setTimeout(() => setRevealStep(2), 3200);
  }, []);

  const tick = useCallback(
    (timestamp: number) => {
      if (!lastTickRef.current) lastTickRef.current = timestamp;
      const delta = (timestamp - lastTickRef.current) / 1000;
      lastTickRef.current = timestamp;

      setCharge((prev) => {
        let next = prev;
        if (isHolding.current && prev < 100) {
          next = Math.min(100, prev + CHARGE_RATE * delta * 60);
          if (timestamp - lastPulseRef.current > 130) {
            playChargePulse(next);
            lastPulseRef.current = timestamp;
          }
          if (next >= 100 && prev < 100) {
            setIsCharged(true);
            fireFireworks();
          }
        } else if (!isHolding.current && prev > 0 && !isCharged) {
          next = Math.max(0, prev - DECAY_RATE * delta * 60);
        }
        return next;
      });

      rafRef.current = requestAnimationFrame(tick);
    },
    [fireFireworks, isCharged]
  );

  useEffect(() => {
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [tick]);

  const startCharging = () => {
    if (isCharged) return;
    isHolding.current = true;
  };

  const stopCharging = () => {
    isHolding.current = false;
  };

  const reset = () => {
    setIsCharged(false);
    setCharge(0);
    setRevealStep(0);
  };

  return (
    <section id="lovemeter" className="relative py-28 px-6 max-w-2xl mx-auto text-center z-10">
      {/* 100% Screen Glow Overlay */}
      <AnimatePresence>
        {isCharged && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gradient-to-r from-magenta via-rosegold to-magenta pointer-events-none z-0 blur-3xl"
          />
        )}
      </AnimatePresence>

      <div className="text-center mb-10 relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border border-rosegold/20 text-rosegold/90 mb-3 shadow-md">
          <Heart className="w-3.5 h-3.5 text-magenta" strokeWidth={1.5} />
          <span className="text-xs tracking-[0.3em] uppercase font-body">
            One Last Question...
          </span>
        </div>
        <h2 className="font-display text-4xl md:text-5xl text-gradient-gold font-bold">
          How much do you think I love you?
        </h2>
        <p className="text-stardust/70 font-body mt-3 text-base">
          Press &amp; hold the heart below until it fills completely.
        </p>
      </div>

      <div className="relative flex flex-col items-center gap-8 z-10">
        {/* Giant Glowing Interactive Heart Container */}
        <button
          onMouseDown={startCharging}
          onMouseUp={stopCharging}
          onMouseLeave={stopCharging}
          onTouchStart={(e) => {
            e.preventDefault();
            startCharging();
          }}
          onTouchEnd={stopCharging}
          aria-label="Press and hold to charge love meter"
          className={`relative w-52 h-52 sm:w-60 sm:h-60 rounded-full glass-panel flex items-center justify-center border-2 transition-all duration-300 gpu select-none ${
            isCharged
              ? "border-magenta shadow-[0_0_80px_rgba(255,42,95,0.8)]"
              : "border-rosegold/30 hover:border-magenta"
          }`}
          style={{ touchAction: "none" }}
        >
          {/* Inner Liquid Fill Animation */}
          <motion.div
            className="absolute inset-0 rounded-full overflow-hidden"
            style={{ transform: "translateZ(0)" }}
          >
            <motion.div
              className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-magenta via-rosegold to-stardust"
              animate={{ height: `${charge}%` }}
              transition={{ type: "tween", ease: "linear", duration: 0.05 }}
              style={{ opacity: 0.88 }}
            />
          </motion.div>

          {/* Heart Pulsing Icon */}
          <motion.div
            animate={
              isCharged
                ? { scale: [1, 1.4, 1.15, 1.35, 1.1] }
                : { scale: 1 + charge / 300 }
            }
            transition={
              isCharged
                ? { duration: 0.6, repeat: Infinity, repeatType: "reverse" }
                : { type: "spring", stiffness: 300 }
            }
            className="relative z-10"
          >
            <Heart
              className="w-24 h-24 text-white drop-shadow-[0_0_25px_rgba(255,42,95,0.9)]"
              fill={charge > 5 ? "#ff2a5f" : "none"}
              strokeWidth={1.2}
            />
          </motion.div>

          {/* SVG Progress Ring */}
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle
              cx="50%"
              cy="50%"
              r="47%"
              fill="none"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth={5}
            />
            <motion.circle
              cx="50%"
              cy="50%"
              r="47%"
              fill="none"
              stroke="url(#loveGradient)"
              strokeWidth={5}
              strokeLinecap="round"
              strokeDasharray="295.3"
              animate={{ strokeDashoffset: 295.3 - (295.3 * charge) / 100 }}
              transition={{ type: "tween", duration: 0.05 }}
            />
            <defs>
              <linearGradient id="loveGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f3ce7a" />
                <stop offset="100%" stopColor="#ff2a5f" />
              </linearGradient>
            </defs>
          </svg>
        </button>

        {/* Counter Display & Emotional Reveal Messages */}
        <div className="min-h-[120px] flex flex-col items-center justify-center">
          <span className="font-display text-4xl sm:text-5xl text-gradient-rose font-extrabold block mb-2">
            {Math.round(charge)}%
          </span>

          <AnimatePresence mode="wait">
            {revealStep >= 1 && (
              <motion.h3
                key="rev-1"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="font-display text-3xl sm:text-4xl text-gradient-gold font-bold mb-2"
              >
                You underestimated it.
              </motion.h3>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {revealStep >= 2 && (
              <motion.p
                key="rev-2"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="font-script text-2xl sm:text-3xl text-stardust/90 font-semibold"
              >
                &ldquo;There isn&apos;t a number big enough.&rdquo;
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {isCharged && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={reset}
            className="px-5 py-2.5 rounded-full glass-panel border border-rosegold/30 text-xs tracking-widest uppercase text-stardust/70 hover:text-rosegold hover:border-rosegold/60 transition-colors font-body shadow-md"
          >
            ✦ Measure Love Again ✦
          </motion.button>
        )}
      </div>
    </section>
  );
}
