"use client";

import { useState, useRef, MouseEvent } from "react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { Camera, Maximize2, Sparkles, MapPin, Calendar } from "lucide-react";
import { usePersonalization, MemoryPhoto } from "@/context/PersonalizationContext";
import Lightbox from "./Lightbox";

function PolaroidCard({
  photo,
  index,
  onOpen,
}: {
  photo: MemoryPhoto;
  index: number;
  onOpen: (photo: MemoryPhoto) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [12, -12]), {
    stiffness: 180,
    damping: 18,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-12, 12]), {
    stiffness: 180,
    damping: 18,
  });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const rotationSeed = index % 2 === 0 ? -2.5 : 2.5;

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => onOpen(photo)}
      initial={{ opacity: 0, y: 50, rotate: rotationSeed * 2 }}
      whileInView={{ opacity: 1, y: 0, rotate: rotationSeed }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ scale: 1.05, rotate: 0, zIndex: 20 }}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        transformPerspective: 1000,
      }}
      className="gpu relative cursor-pointer bg-[#faf4ec] border border-[#e8d8c5] rounded-xl p-3.5 pb-14 shadow-2xl select-none group transition-all duration-300 hover:shadow-[0_25px_60px_rgba(255,42,95,0.28)]"
    >
      {/* Washi Tape Texture */}
      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-16 h-6 bg-[#f5e6d3]/90 border border-[#d9c4aa]/60 rotate-[-1deg] shadow-sm z-10 pointer-events-none opacity-90" />

      {/* Image Frame */}
      <div
        className="overflow-hidden rounded-lg bg-stone-900 aspect-[4/5] relative"
        style={{ transform: "translateZ(25px)" }}
      >
        <img
          src={photo.url}
          alt={photo.caption}
          loading="lazy"
          draggable={false}
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
        />

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full glass-panel flex items-center justify-center text-rosegold shadow-glow">
            <Maximize2 className="w-5 h-5" />
          </div>
        </div>

        {photo.location && (
          <span className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-full bg-black/65 backdrop-blur-md text-[10px] text-stardust/90 font-body flex items-center gap-1">
            <MapPin className="w-3 h-3 text-rosegold" />
            {photo.location}
          </span>
        )}
      </div>

      {/* Full Handwritten Caption */}
      <p
        className="absolute bottom-3 left-2.5 right-2.5 text-center font-script text-xl sm:text-2xl text-[#2c1d27] px-1 line-clamp-2 font-semibold tracking-tight"
        style={{ transform: "translateZ(20px)" }}
      >
        {photo.caption}
      </p>
    </motion.div>
  );
}

export default function MemoryGallery() {
  const { data } = usePersonalization();
  const [activePhoto, setActivePhoto] = useState<MemoryPhoto | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = ["All", ...Array.from(new Set(data.photos.map((p) => p.category).filter(Boolean))) as string[]];

  const filteredPhotos = selectedCategory === "All"
    ? data.photos
    : data.photos.filter((p) => p.category === selectedCategory);

  return (
    <section id="gallery" className="relative py-28 px-6 max-w-6xl mx-auto z-10">
      <div className="text-center mb-14">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border border-rosegold/20 text-rosegold/90 mb-4 shadow-md">
          <Camera className="w-3.5 h-3.5 text-magenta" strokeWidth={1.5} />
          <span className="text-xs tracking-[0.3em] uppercase font-body">
            Frozen Moments
          </span>
        </div>
        <h2 className="font-display text-4xl md:text-6xl text-gradient-gold font-bold">
          Little Moments. Infinite Memories.
        </h2>
        <p className="text-stardust/70 mt-3 font-body max-w-lg mx-auto text-base sm:text-lg leading-relaxed">
          Tilt, hover, and tap to unlock frames worth keeping forever.
        </p>

        {/* Category Filters */}
        {categories.length > 1 && (
          <div className="flex flex-wrap justify-center gap-2.5 mt-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-body tracking-wider uppercase transition-all ${
                  selectedCategory === cat
                    ? "bg-gradient-to-r from-magenta to-rosegold text-midnight font-semibold shadow-glow"
                    : "glass-panel text-stardust/60 hover:text-rosegold hover:border-rosegold/30"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-12" style={{ perspective: 1200 }}>
        <AnimatePresence>
          {filteredPhotos.map((photo, i) => (
            <PolaroidCard key={photo.id} photo={photo} index={i} onOpen={setActivePhoto} />
          ))}
        </AnimatePresence>
      </motion.div>

      <Lightbox
        photo={activePhoto}
        allPhotos={data.photos}
        onClose={() => setActivePhoto(null)}
        onNavigate={(newPhoto) => setActivePhoto(newPhoto)}
      />
    </section>
  );
}
