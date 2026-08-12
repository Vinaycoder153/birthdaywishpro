"use client";

import { motion } from "framer-motion";
import { Sparkles, Heart, MessageCircle, Coffee, Compass, Star, Sun, Camera } from "lucide-react";
import { usePersonalization } from "@/context/PersonalizationContext";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Sparkles,
  Heart,
  MessageCircle,
  Coffee,
  Compass,
  Star,
  Sun,
  Camera,
};

export default function StoryTimeline() {
  const { data } = usePersonalization();

  return (
    <section id="timeline" className="relative py-28 px-6 max-w-4xl mx-auto z-10">
      <div className="text-center mb-20">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border border-rosegold/20 text-rosegold/90 mb-3 shadow-md">
          <Sparkles className="w-3.5 h-3.5 text-rosegold" strokeWidth={1.5} />
          <span className="text-xs tracking-[0.3em] uppercase font-body">
            Our Journey
          </span>
        </div>
        <h2 className="font-display text-4xl md:text-6xl text-gradient-gold font-bold">
          How We Became Us
        </h2>
        <p className="text-stardust/70 mt-3 font-body max-w-md mx-auto text-base sm:text-lg leading-relaxed">
          The quiet milestones that turned two separate paths into one infinite universe.
        </p>
      </div>

      <div className="relative pl-6 md:pl-0">
        {/* Glowing Center Line */}
        <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-magenta/70 to-rosegold/30 md:-translate-x-1/2" />

        <div className="flex flex-col gap-14 sm:gap-18">
          {data.milestones.map((milestone, i) => {
            const isLeft = i % 2 === 0;
            const IconComponent = (milestone.iconName && iconMap[milestone.iconName]) || Sparkles;

            return (
              <motion.div
                key={milestone.id}
                initial={{ opacity: 0, filter: "blur(8px)", y: 40, scale: 0.95 }}
                whileInView={{ opacity: 1, filter: "blur(0px)", y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className={`relative md:w-[46%] ${
                  isLeft ? "md:pr-6 md:text-right md:ml-0" : "md:pl-6 md:text-left md:ml-auto"
                }`}
              >
                {/* Pulsing Node Circle */}
                <div
                  className={`absolute top-2 -left-[1.65rem] md:left-auto ${
                    isLeft ? "md:-right-[2.65rem]" : "md:-left-[2.65rem]"
                  } w-10 h-10 rounded-full glass-panel border border-rosegold/50 flex items-center justify-center text-magenta shadow-glow z-10 bg-[#060105]`}
                >
                  <IconComponent className="w-4.5 h-4.5 text-magenta" />
                </div>

                {/* Milestone Card */}
                <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-rosegold/20 shadow-lg hover:border-rosegold/40 transition-all duration-300 group">
                  <span className="inline-block px-3.5 py-1 rounded-full bg-magenta/15 border border-magenta/30 text-[11px] tracking-[0.2em] uppercase text-rosegold font-body mb-3 font-semibold">
                    ✦ {milestone.date}
                  </span>
                  <h3 className="font-display text-2xl text-stardust group-hover:text-gradient-gold transition-colors mb-3 font-bold">
                    {milestone.title}
                  </h3>
                  <p className="font-body text-base text-stardust/70 leading-relaxed">
                    {milestone.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
