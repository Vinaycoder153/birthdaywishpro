"use client";

import { motion } from "framer-motion";
import { Heart, Sparkles } from "lucide-react";
import { usePersonalization } from "@/context/PersonalizationContext";

export default function Finale() {
  const { data } = usePersonalization();

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 py-24 text-center z-10 select-none overflow-hidden">
      {/* Background Floating Memories Grid */}
      <div className="pointer-events-none absolute inset-0 opacity-15 overflow-hidden">
        {data.photos.slice(0, 6).map((photo, i) => (
          <motion.img
            key={photo.id}
            src={photo.url}
            alt=""
            className="absolute w-40 sm:w-56 h-40 sm:h-56 object-cover rounded-2xl filter blur-sm shadow-2xl"
            style={{
              left: `${(i * 37 + 10) % 85}%`,
              top: `${(i * 29 + 15) % 80}%`,
            }}
            animate={{
              y: [0, -25, 0],
              opacity: [0.1, 0.25, 0.1],
              scale: [0.9, 1.05, 0.9],
            }}
            transition={{
              duration: 8 + (i % 4),
              repeat: Infinity,
              delay: i * 0.4,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 max-w-3xl flex flex-col items-center"
      >
        <motion.div
          animate={{ scale: [1, 1.25, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-20 h-20 rounded-full glass-panel flex items-center justify-center mb-8 border border-rosegold/30 shadow-glow"
        >
          <Heart className="w-10 h-10 text-magenta fill-magenta drop-shadow-lg" />
        </motion.div>

        <h2 className="font-display text-4xl sm:text-6xl text-gradient-gold font-extrabold leading-tight mb-4">
          This isn&apos;t the end of our story.
        </h2>

        <p className="font-script text-3xl sm:text-4xl text-gradient-rose font-semibold mb-8">
          It&apos;s just another beautiful chapter.
        </p>

        <div className="my-6 p-8 sm:p-12 rounded-3xl glass-panel border border-rosegold/30 shadow-glow-gold max-w-xl">
          <h3 className="font-display text-3xl sm:text-5xl text-stardust font-bold mb-3">
            Happy Birthday, {data.partnerName} ❤️
          </h3>
          <p className="font-body text-stardust/70 text-base sm:text-lg leading-relaxed mt-4">
            {data.finalMessage || "From someone who hopes to make many more memories with you."}
          </p>

          <div className="mt-8 pt-6 border-t border-rosegold/20">
            <span className="font-script text-2xl sm:text-3xl text-rosegold font-bold block">
              &ldquo;Forever looks beautiful with you.&rdquo;
            </span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
