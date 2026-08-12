"use client";

import { useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Download, Heart } from "lucide-react";
import { MemoryPhoto } from "@/context/PersonalizationContext";

interface LightboxProps {
  photo: MemoryPhoto | null;
  allPhotos?: MemoryPhoto[];
  onClose: () => void;
  onNavigate?: (photo: MemoryPhoto) => void;
}

export default function Lightbox({ photo, allPhotos = [], onClose, onNavigate }: LightboxProps) {
  const currentIndex = photo ? allPhotos.findIndex((p) => p.id === photo.id) : -1;

  const handlePrev = useCallback(() => {
    if (currentIndex > 0 && onNavigate) {
      onNavigate(allPhotos[currentIndex - 1]);
    } else if (allPhotos.length > 0 && onNavigate) {
      onNavigate(allPhotos[allPhotos.length - 1]);
    }
  }, [currentIndex, allPhotos, onNavigate]);

  const handleNext = useCallback(() => {
    if (currentIndex < allPhotos.length - 1 && onNavigate) {
      onNavigate(allPhotos[currentIndex + 1]);
    } else if (allPhotos.length > 0 && onNavigate) {
      onNavigate(allPhotos[0]);
    }
  }, [currentIndex, allPhotos, onNavigate]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!photo) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [photo, onClose, handlePrev, handleNext]);

  return (
    <AnimatePresence>
      {photo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-2xl"
        >
          {/* Close Button */}
          <motion.button
            onClick={onClose}
            aria-label="Close photo modal"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute top-6 right-6 z-50 w-11 h-11 rounded-full glass-panel flex items-center justify-center text-stardust hover:text-magenta hover:border-magenta/50 transition-colors shadow-glow"
          >
            <X className="w-5 h-5" strokeWidth={1.5} />
          </motion.button>

          {/* Previous Photo Button */}
          {allPhotos.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              aria-label="Previous photo"
              className="absolute left-4 top-1/2 -translate-y-1/2 z-50 w-11 h-11 rounded-full glass-panel flex items-center justify-center text-stardust hover:text-rosegold hover:border-rosegold/50 transition-all shadow-glow"
            >
              <ChevronLeft className="w-6 h-6" strokeWidth={1.5} />
            </button>
          )}

          {/* Next Photo Button */}
          {allPhotos.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              aria-label="Next photo"
              className="absolute right-4 top-1/2 -translate-y-1/2 z-50 w-11 h-11 rounded-full glass-panel flex items-center justify-center text-stardust hover:text-rosegold hover:border-rosegold/50 transition-all shadow-glow"
            >
              <ChevronRight className="w-6 h-6" strokeWidth={1.5} />
            </button>
          )}

          {/* Lightbox Content Card */}
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.88, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="glass-panel rounded-3xl p-4 sm:p-6 max-w-2xl w-full border border-rosegold/25 shadow-glow relative"
          >
            <div className="overflow-hidden rounded-2xl max-h-[70vh] bg-black/40 flex items-center justify-center relative">
              <motion.img
                key={photo.id}
                src={photo.url}
                alt={photo.caption}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full h-full max-h-[70vh] object-contain rounded-2xl"
              />
            </div>

            <div className="mt-5 text-center px-4">
              <p className="font-script text-2xl sm:text-4xl text-gradient-rose font-semibold leading-snug">
                &ldquo;{photo.caption}&rdquo;
              </p>
              {allPhotos.length > 0 && (
                <span className="inline-block text-[11px] font-body text-stardust/40 mt-2 uppercase tracking-widest">
                  Memory {currentIndex + 1} of {allPhotos.length}
                </span>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
