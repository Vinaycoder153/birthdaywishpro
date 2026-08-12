"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Delete, Lock, Heart, Sparkles, KeyRound } from "lucide-react";
import confetti from "canvas-confetti";
import { usePersonalization } from "@/context/PersonalizationContext";
import { playKeypadChime, playSuccessChime, playErrorBuzz } from "@/lib/audio";

interface PasscodeGateProps {
  onUnlock: () => void;
}

const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "back"];

export default function PasscodeGate({ onUnlock }: PasscodeGateProps) {
  const { data } = usePersonalization();
  const [introStep, setIntroStep] = useState<0 | 1 | 2>(0);
  const [entered, setEntered] = useState("");
  const [isShaking, setIsShaking] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // Staggered text intro animation sequence
  useEffect(() => {
    const timer1 = setTimeout(() => setIntroStep(1), 1800);
    const timer2 = setTimeout(() => setIntroStep(2), 3800);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const fireConfetti = useCallback(() => {
    const colors = ["#f3ce7a", "#ff2a5f", "#ffb3c6", "#ffffff"];
    const duration = 2400;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 70,
        origin: { x: 0, y: 0.6 },
        colors,
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 70,
        origin: { x: 1, y: 0.6 },
        colors,
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();

    confetti({
      particleCount: 160,
      spread: 110,
      startVelocity: 50,
      origin: { y: 0.5 },
      colors,
      shapes: ["circle"],
      scalar: 1.2,
    });
  }, []);

  const handleKeyPress = useCallback(
    (key: string) => {
      if (isUnlocking || introStep < 2) return;

      if (key === "back" || key === "Backspace") {
        setEntered((prev) => prev.slice(0, -1));
        playKeypadChime(2);
        return;
      }
      if (key === "" || !/^[0-9]$/.test(key)) return;

      playKeypadChime(Number(key));
      setEntered((prev) => {
        const next = (prev + key).slice(0, 4);

        if (next.length === 4) {
          setTimeout(() => {
            if (next === data.pin) {
              setIsUnlocking(true);
              playSuccessChime();
              fireConfetti();
              setTimeout(onUnlock, 1800);
            } else {
              playErrorBuzz();
              setIsShaking(true);
              setTimeout(() => {
                setIsShaking(false);
                setEntered("");
              }, 550);
            }
          }, 150);
        }
        return next;
      });
    },
    [isUnlocking, introStep, data.pin, fireConfetti, onUnlock]
  );

  // Desktop keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= "0" && e.key <= "9") {
        handleKeyPress(e.key);
      } else if (e.key === "Backspace" || e.key === "Delete") {
        handleKeyPress("back");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyPress]);

  const genderTitle = data.loverGender === "boy" ? "Birthday Boy" : "Birthday Girl";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-[#060105] overflow-hidden select-none">
      <AnimatePresence mode="wait">
        {/* Intro Step 0: "I made something for you..." */}
        {introStep === 0 && (
          <motion.div
            key="intro-0"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 1 }}
            className="text-center px-6"
          >
            <p className="font-display text-2xl sm:text-3xl text-gradient-gold tracking-wide">
              I made something for you...
            </p>
          </motion.div>
        )}

        {/* Intro Step 1: "But it's only for one person." */}
        {introStep === 1 && (
          <motion.div
            key="intro-1"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 1 }}
            className="text-center px-6"
          >
            <p className="font-display text-2xl sm:text-3xl text-gradient-rose tracking-wide">
              But it&apos;s only for one person.
            </p>
          </motion.div>
        )}

        {/* Intro Step 2: Keypad Gate */}
        {introStep === 2 && !isUnlocking && (
          <motion.div
            key="gate"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{
              opacity: 1,
              scale: 1,
              x: isShaking ? [0, -12, 12, -8, 8, 0] : 0,
            }}
            exit={{ opacity: 0, scale: 0.9, filter: "blur(16px)" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className={`relative w-full max-w-sm glass-panel rounded-[2.5rem] p-8 border transition-all duration-300 shadow-glow gpu ${
              isShaking ? "border-magenta/80 shadow-[0_0_50px_rgba(255,42,95,0.6)]" : "border-rosegold/30"
            }`}
          >
            <div className="flex flex-col items-center mb-8">
              <div className="w-16 h-16 rounded-full glass-panel flex items-center justify-center mb-4 border border-rosegold/30 shadow-glow-gold">
                <Lock className="w-7 h-7 text-rosegold" strokeWidth={1.5} />
              </div>
              <h1 className="font-display text-2xl text-gradient-gold tracking-wide text-center">
                Secret Birthday Vault
              </h1>
              <p className="font-body text-xs sm:text-sm text-stardust/70 mt-2 text-center">
                Enter the secret 4-digit code to step inside
              </p>
            </div>

            {/* Passcode Indicator Dots */}
            <div className="flex justify-center gap-4 mb-8">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`w-4 h-4 rounded-full border transition-all duration-300 ${
                    entered.length > i
                      ? "bg-magenta border-magenta shadow-glow scale-110"
                      : "border-rosegold/30"
                  }`}
                />
              ))}
            </div>

            {/* Keypad Grid */}
            <div className="grid grid-cols-3 gap-3">
              {KEYS.map((key, idx) => {
                if (key === "") return <div key={idx} />;
                if (key === "back") {
                  return (
                    <button
                      key={idx}
                      onClick={() => handleKeyPress("back")}
                      aria-label="Delete digit"
                      className="aspect-square rounded-2xl glass-panel flex items-center justify-center text-stardust/70 hover:text-magenta hover:border-magenta/40 active:scale-95 transition-all duration-150"
                    >
                      <Delete className="w-5 h-5" strokeWidth={1.5} />
                    </button>
                  );
                }
                return (
                  <button
                    key={idx}
                    onClick={() => handleKeyPress(key)}
                    aria-label={`Digit ${key}`}
                    className="aspect-square rounded-2xl glass-panel flex items-center justify-center font-display text-xl text-stardust hover:text-rosegold hover:border-rosegold/40 hover:shadow-glow-gold active:scale-95 transition-all duration-150"
                  >
                    {key}
                  </button>
                );
              })}
            </div>

            <div className="text-center mt-6">
              <button
                onClick={() => setShowHint(!showHint)}
                className="text-xs text-stardust/50 hover:text-rosegold transition-colors font-body tracking-wide flex items-center justify-center gap-1 mx-auto"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>{showHint ? `Default PIN: ${data.pin}` : "Need a hint?"}</span>
              </button>
            </div>
          </motion.div>
        )}

        {/* Correct PIN Unlocking State */}
        {isUnlocking && (
          <motion.div
            key="unlocked"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center gap-4 text-center px-6"
          >
            <motion.div
              animate={{ scale: [1, 1.35, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            >
              <Heart className="w-20 h-20 text-magenta fill-magenta shadow-glow" />
            </motion.div>
            <h2 className="font-display text-3xl sm:text-4xl text-gradient-gold">
              Welcome, {genderTitle} ❤️
            </h2>
            <p className="font-script text-2xl text-stardust/90 mt-2 max-w-md">
              &ldquo;Tonight, the whole universe is celebrating you.&rdquo;
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
