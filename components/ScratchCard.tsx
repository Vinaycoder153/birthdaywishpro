"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, RefreshCw, Gift } from "lucide-react";
import confetti from "canvas-confetti";
import { usePersonalization } from "@/context/PersonalizationContext";
import { playTone } from "@/lib/audio";

const SCRATCH_THRESHOLD = 0.65;

export default function ScratchCard() {
  const { data } = usePersonalization();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isScratching = useRef(false);
  const lastPoint = useRef<{ x: number; y: number } | null>(null);
  const revealedFired = useRef(false);

  const [isRevealed, setIsRevealed] = useState(false);
  const [scratchPercent, setScratchPercent] = useState(0);

  const drawFoil = useCallback((canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const { width, height } = canvas;

    // Liquid Rose Gold metallic gradient
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#f3ce7a");
    gradient.addColorStop(0.25, "#fff3d6");
    gradient.addColorStop(0.5, "#d9a441");
    gradient.addColorStop(0.75, "#f3ce7a");
    gradient.addColorStop(1, "#fff3d6");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Luxury diagonal pattern lines
    ctx.globalAlpha = 0.14;
    ctx.strokeStyle = "#5e4210";
    for (let i = -width; i < width * 2; i += 14) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + height, height);
      ctx.lineWidth = 2;
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // Text instructions
    ctx.fillStyle = "rgba(75, 47, 13, 0.9)";
    ctx.font = "bold 18px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("✦ SCRATCH THIS ✦", width / 2, height / 2 - 10);
    ctx.font = "500 12px sans-serif";
    ctx.fillText("Use your mouse or finger to scratch off foil", width / 2, height / 2 + 16);
  }, []);

  const resetFoil = useCallback(() => {
    revealedFired.current = false;
    setIsRevealed(false);
    setScratchPercent(0);

    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
      drawFoil(canvas);
    }
  }, [drawFoil]);

  const resizeAndDraw = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = container.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    const ctx = canvas.getContext("2d");
    ctx?.scale(dpr, dpr);
    drawFoil(canvas);
  }, [drawFoil]);

  useEffect(() => {
    resizeAndDraw();
    window.addEventListener("resize", resizeAndDraw);
    return () => window.removeEventListener("resize", resizeAndDraw);
  }, [resizeAndDraw]);

  const getPoint = (
    e: React.MouseEvent | React.TouchEvent
  ): { x: number; y: number } | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    if ("touches" in e) {
      const touch = e.touches[0];
      if (!touch) return null;
      return { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
    }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const scratchAt = (point: { x: number; y: number }) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    ctx.globalCompositeOperation = "destination-out";
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.lineWidth = 50;

    if (lastPoint.current) {
      ctx.beginPath();
      ctx.moveTo(lastPoint.current.x, lastPoint.current.y);
      ctx.lineTo(point.x, point.y);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.arc(point.x, point.y, 25, 0, Math.PI * 2);
      ctx.fill();
    }
    lastPoint.current = point;
  };

  const calculateScratchedPercent = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return 0;
    const dpr = window.devicePixelRatio || 1;
    const sampleStep = 6;
    let transparentCount = 0;
    let total = 0;
    const { data: pixels } = ctx.getImageData(0, 0, canvas.width, canvas.height);
    for (let i = 3; i < pixels.length; i += 4 * sampleStep * dpr) {
      total++;
      if (pixels[i] < 32) transparentCount++;
    }
    return total ? transparentCount / total : 0;
  }, []);

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    isScratching.current = true;
    const point = getPoint(e);
    if (point) scratchAt(point);
  };

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isScratching.current) return;
    const point = getPoint(e);
    if (!point) return;
    scratchAt(point);

    const percent = calculateScratchedPercent();
    setScratchPercent(percent);
    if (percent > SCRATCH_THRESHOLD && !revealedFired.current) {
      revealedFired.current = true;
      setIsRevealed(true);
      playTone({ frequency: 880, duration: 0.4, type: "sine", volume: 0.12, glideTo: 1320 });
      confetti({
        particleCount: 110,
        spread: 90,
        origin: { y: 0.6 },
        colors: ["#f3ce7a", "#ff2a5f", "#ffb3c6"],
      });
    }
  };

  const handleEnd = () => {
    isScratching.current = false;
    lastPoint.current = null;
  };

  return (
    <section id="scratch" className="relative py-28 px-6 max-w-xl mx-auto z-10">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border border-rosegold/20 text-rosegold/90 mb-3 shadow-md">
          <Sparkles className="w-3.5 h-3.5 text-magenta" strokeWidth={1.5} />
          <span className="text-xs tracking-[0.3em] uppercase font-body">
            {data.scratchTitle || "Scratch Your Birthday Secret"}
          </span>
        </div>
        <h2 className="font-display text-4xl text-gradient-gold font-bold">
          Scratch Your Surprise
        </h2>
        <p className="text-stardust/70 mt-2 font-body text-base">
          Rub off the gold foil layer to reveal what&apos;s hidden underneath.
        </p>
      </div>

      <motion.div
        ref={containerRef}
        initial={{ opacity: 0, scale: 0.94 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative w-full aspect-[16/9] rounded-3xl overflow-hidden glass-panel border-2 border-rosegold/30 shadow-glow-gold select-none"
      >
        {/* Hidden Revealed Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-gradient-to-b from-[#1c0715] to-[#090207]">
          <h3 className="font-display text-3xl sm:text-4xl text-gradient-gold font-extrabold mb-3 tracking-wide">
            SURPRISE! ❤️
          </h3>
          <p className="font-script text-2xl sm:text-3xl text-gradient-rose font-semibold leading-relaxed">
            {data.scratchMessage}
          </p>
        </div>

        {/* Scratchable Gold Foil Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full cursor-pointer touch-none z-10"
          onMouseDown={handleStart}
          onMouseMove={handleMove}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={handleStart}
          onTouchMove={handleMove}
          onTouchEnd={handleEnd}
        />
      </motion.div>

      {/* Footer Info & Re-cover Foil Button */}
      <div className="flex items-center justify-between mt-4 px-2">
        <span className="text-xs text-stardust/50 font-body">
          {isRevealed
            ? "✦ Fully revealed! Enjoy your birthday surprise."
            : `${Math.min(100, Math.round(scratchPercent * (1 / SCRATCH_THRESHOLD) * 100))}% scratched`}
        </span>
        <button
          onClick={resetFoil}
          className="flex items-center gap-1 text-xs text-stardust/40 hover:text-rosegold transition-colors font-body"
          title="Cover with gold foil again"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Re-cover
        </button>
      </div>
    </section>
  );
}
