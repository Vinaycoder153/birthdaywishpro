"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, Sparkles, MapPin, Check, RefreshCw, X, Heart, Star } from "lucide-react";
import confetti from "canvas-confetti";
import { usePersonalization } from "@/context/PersonalizationContext";
import { playSuccessChime, playTone } from "@/lib/audio";

export default function DateNightReveal() {
  const { data } = usePersonalization();
  const [isOpen, setIsOpen] = useState(false);
  const [messageVisible, setMessageVisible] = useState(false);
  const [gesture, setGesture] = useState<"wave" | "heart" | "dance">("wave");
  const confettiTimer = useRef<ReturnType<typeof setInterval> | null>(null);

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
    setMessageVisible(false);
    playSuccessChime();

    const colors = ["#f3ce7a", "#ff2a5f", "#ff77b7", "#a78bfa", "#61dafb", "#ffffff"];
    confetti({ particleCount: 180, spread: 100, origin: { y: 0.55 }, colors, scalar: 1.25 });

    if (confettiTimer.current) clearInterval(confettiTimer.current);
    const end = Date.now() + 2200;
    confettiTimer.current = setInterval(() => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.35 },
        colors,
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.35 },
        colors,
      });
      if (Date.now() > end && confettiTimer.current) {
        clearInterval(confettiTimer.current);
        confettiTimer.current = null;
      }
    }, 180);
  };

  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => setMessageVisible(true), 850);
    return () => clearTimeout(timer);
  }, [isOpen]);

  useEffect(() => () => {
    if (confettiTimer.current) clearInterval(confettiTimer.current);
  }, []);

  const interact = (nextGesture: "wave" | "heart" | "dance") => {
    setGesture(nextGesture);
    playTone({
      frequency: nextGesture === "heart" ? 660 : nextGesture === "dance" ? 740 : 523,
      duration: 0.22,
      type: "sine",
      volume: 0.1,
    });
    confetti({
      particleCount: 24,
      spread: 55,
      origin: { x: 0.5, y: 0.58 },
      colors: ["#ff77b7", "#f3ce7a", "#ffffff"],
      scalar: 0.75,
    });
  };

  const closeScene = () => {
    setIsOpen(false);
    setMessageVisible(false);
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
                ✦ Contains a magical birthday scene ✦
              </span>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="surprise-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label="Sin's magical birthday surprise"
            onClick={(event) => event.target === event.currentTarget && closeScene()}
          >
            <motion.div
              className="birthday-scene"
              initial={{ opacity: 0, scale: 0.72, y: 70, rotateX: 18 }}
              animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0, scale: 0.84, y: 40 }}
              transition={{ type: "spring", stiffness: 110, damping: 17 }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="scene-stars" aria-hidden="true" />
              <button className="scene-close" onClick={closeScene} aria-label="Close surprise">
                <X className="w-5 h-5" />
              </button>

              <div className="floating-balloons" aria-hidden="true">
                <span className="balloon balloon-pink">20</span>
                <span className="balloon balloon-gold">★</span>
                <span className="balloon balloon-purple">♡</span>
                <span className="balloon balloon-blue">✦</span>
              </div>

              <div className="character-companions" aria-hidden="true">
                <motion.div className="kawaii-companion companion-star" animate={{ y: [0, -12, 0], rotate: [-5, 5, -5] }} transition={{ duration: 3.2, repeat: Infinity }}>
                  <span className="companion-face"><i /><b /></span>
                  <span className="companion-crown">★</span>
                </motion.div>
                <motion.div className="kawaii-companion companion-bunny" animate={{ y: [0, -9, 0], rotate: [4, -4, 4] }} transition={{ duration: 2.8, repeat: Infinity }}>
                  <span className="bunny-ear left" />
                  <span className="bunny-ear right" />
                  <span className="companion-face"><i /><b /></span>
                </motion.div>
              </div>

              <div className="sin-stage">
                <div className="stage-platform">
                  <div className="platform-rim" />
                  <div className="platform-light" />
                </div>

                <motion.div
                  className={`sin-avatar gesture-${gesture}`}
                  animate={gesture === "dance"
                    ? { y: [0, -18, 0], rotateZ: [0, -4, 4, 0] }
                    : gesture === "heart"
                      ? { scale: [1, 1.05, 1] }
                      : { y: [0, -5, 0] }}
                  transition={{ duration: gesture === "dance" ? 0.7 : 1.8, repeat: gesture === "wave" ? Infinity : 1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => interact("heart")}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(event) => event.key === "Enter" && interact("heart")}
                  aria-label="Tap Sin for a heart surprise"
                >
                  <div className="avatar-halo">
                    <span>20</span>
                  </div>
                  <div className="avatar-hair-back" />
                  <div className="avatar-head">
                    <div className="avatar-bangs" />
                    <div className="avatar-eyes"><i /><i /></div>
                    <div className="avatar-smile" />
                    <div className="avatar-blush left" />
                    <div className="avatar-blush right" />
                  </div>
                  <div className="avatar-arm left-arm"><span /></div>
                  <div className="avatar-arm right-arm"><span /></div>
                  <div className="avatar-body">
                    <div className="outfit-sash" />
                    <div className="outfit-sparkle">✦</div>
                  </div>
                  <div className="avatar-skirt" />
                  <div className="avatar-legs"><i /><i /></div>
                  <div className="avatar-shoes"><i /><i /></div>
                </motion.div>
              </div>

              <AnimatePresence>
                {messageVisible && (
                  <motion.div
                    className="hidden-birthday-message"
                    initial={{ opacity: 0, y: 24, scale: 0.92, filter: "blur(14px)" }}
                    animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <span className="message-kicker"><Sparkles className="w-3.5 h-3.5" /> A message just for you</span>
                    <h3>Happy 20th Birthday, Sin!</h3>
                    <p>
                      May every dream find its sparkle, every wish find its moment,
                      and every day feel as special as the joy you bring to your friends.
                    </p>
                    <div className="message-signoff">
                      <Heart className="w-4 h-4 fill-current" />
                      Always your best friend
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="scene-actions">
                <button onClick={() => interact("wave")}><Star className="w-4 h-4" /> Wave</button>
                <button onClick={() => interact("heart")}><Heart className="w-4 h-4 fill-current" /> Heart</button>
                <button onClick={() => interact("dance")}>Dance</button>
              </div>

              <div className="scene-voucher">
                <span><MapPin className="w-3.5 h-3.5" /> {surprise.venue}</span>
                <span><Check className="w-3.5 h-3.5" /> Birthday magic unlocked</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
