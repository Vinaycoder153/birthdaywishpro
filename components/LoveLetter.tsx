"use client";

import { motion } from "framer-motion";
import { Feather, Heart } from "lucide-react";
import { usePersonalization } from "@/context/PersonalizationContext";

export default function BirthdayLetter() {
  const { data } = usePersonalization();

  const letterLines = (data.letter || "").split("\n").filter(Boolean);

  return (
    <section id="letter" className="relative py-32 px-6 max-w-3xl mx-auto z-10">
      {/* Soft Ambient Spotlight Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-magenta/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="text-center mb-14 relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border border-rosegold/20 text-rosegold/90 mb-3 shadow-md">
          <Feather className="w-3.5 h-3.5 text-magenta" strokeWidth={1.5} />
          <span className="text-xs tracking-[0.3em] uppercase font-body">
            Confidential &amp; Yours
          </span>
        </div>
        <h2 className="font-display text-4xl md:text-5xl text-gradient-gold font-bold">
          A Letter For You
        </h2>
      </div>

      {/* Intimate Parchment Glass Letter Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="glass-panel rounded-[2.5rem] p-8 sm:p-14 border border-rosegold/30 shadow-glow relative z-10 overflow-hidden"
      >
        {/* Subtle Watermark Heart */}
        <Heart className="absolute -bottom-10 -right-10 w-64 h-64 text-magenta/5 pointer-events-none" />

        <div className="space-y-6 text-left">
          {letterLines.map((line, idx) => (
            <motion.p
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.7, delay: idx * 0.12 }}
              className="font-script text-2xl sm:text-3xl text-gradient-rose leading-relaxed font-semibold tracking-wide"
            >
              {line}
            </motion.p>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: letterLines.length * 0.12 + 0.3 }}
          className="mt-12 pt-8 border-t border-rosegold/15 flex flex-col items-end"
        >
          <p className="font-script text-3xl text-rosegold">
            Happy Birthday, {data.partnerName}. ❤️
          </p>
          <p className="font-display text-lg text-stardust/80 mt-1">
            — Forever, {data.yourName}
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}
