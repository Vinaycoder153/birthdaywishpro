"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Mic2, Volume2, Music, Sparkles, Heart } from "lucide-react";
import { usePersonalization } from "@/context/PersonalizationContext";
import { getAudioContext, startAmbientSoundscape, stopAmbientSoundscape } from "@/lib/audio";

const BAR_COUNT = 48;

export default function VoiceMessage() {
  const { data } = usePersonalization();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number | null>(null);
  const cleanupSynthRef = useRef<(() => void) | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [useSynthetic, setUseSynthetic] = useState(false);

  const drawVisualizer = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx2d = canvas.getContext("2d");
    if (!ctx2d) return;

    const analyser = analyserRef.current;
    const width = canvas.width;
    const height = canvas.height;

    const render = () => {
      ctx2d.clearRect(0, 0, width, height);

      let dataArray: Uint8Array;
      if (analyser) {
        const bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);
        analyser.getByteFrequencyData(dataArray);
      } else {
        // Fallback animated sine wave
        dataArray = new Uint8Array(BAR_COUNT);
        const time = Date.now() / 250;
        for (let i = 0; i < BAR_COUNT; i++) {
          dataArray[i] = Math.floor(
            110 + Math.sin(time + i * 0.3) * 85 + Math.cos(time * 0.8 + i * 0.2) * 55
          );
        }
      }

      const barWidth = width / BAR_COUNT;
      for (let i = 0; i < BAR_COUNT; i++) {
        const dataIndex = Math.floor((i / BAR_COUNT) * (dataArray.length || 1));
        const value = (dataArray[dataIndex] || 60) / 255;
        const barHeight = Math.max(6, value * height);
        const x = i * barWidth;
        const y = (height - barHeight) / 2;

        const gradient = ctx2d.createLinearGradient(0, y, 0, y + barHeight);
        gradient.addColorStop(0, "#f3ce7a");
        gradient.addColorStop(0.5, "#ff2a5f");
        gradient.addColorStop(1, "#ffb3c6");
        ctx2d.fillStyle = gradient;

        ctx2d.beginPath();
        ctx2d.roundRect(x + barWidth * 0.2, y, barWidth * 0.6, barHeight, 4);
        ctx2d.fill();
      }
      rafRef.current = requestAnimationFrame(render);
    };
    render();
  };

  const togglePlay = async () => {
    const ctx = getAudioContext();
    if (ctx.state === "suspended") await ctx.resume();

    if (!isPlaying) {
      setIsPlaying(true);
      drawVisualizer();

      if (audioRef.current && !useSynthetic) {
        try {
          await audioRef.current.play();
        } catch {
          setUseSynthetic(true);
          cleanupSynthRef.current = startAmbientSoundscape();
        }
      } else {
        cleanupSynthRef.current = startAmbientSoundscape();
      }
    } else {
      setIsPlaying(false);
      if (audioRef.current) audioRef.current.pause();
      if (cleanupSynthRef.current) cleanupSynthRef.current();
      stopAmbientSoundscape();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const handleTimeUpdate = () => {
      if (audio.duration) setProgress(audio.currentTime / audio.duration);
    };
    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    const handleError = () => {
      setUseSynthetic(true);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);
    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (cleanupSynthRef.current) cleanupSynthRef.current();
      stopAmbientSoundscape();
    };
  }, []);

  return (
    <section id="voice" className="relative py-28 px-6 max-w-2xl mx-auto z-10">
      {/* Background Reaction Glow when Playing */}
      <AnimatePresence>
        {isPlaying && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.25 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-magenta/20 blur-3xl pointer-events-none rounded-full"
          />
        )}
      </AnimatePresence>

      <div className="text-center mb-10 relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border border-rosegold/20 text-rosegold/90 mb-3 shadow-md">
          <Mic2 className="w-3.5 h-3.5 text-magenta" strokeWidth={1.5} />
          <span className="text-xs tracking-[0.3em] uppercase font-body">
            Audio Message
          </span>
        </div>
        <h2 className="font-display text-4xl md:text-5xl text-gradient-gold font-bold">
          If My Heart Could Speak...
        </h2>
        <p className="font-script text-2xl text-gradient-rose mt-2">
          &ldquo;Press play. This one is from my heart.&rdquo;
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="glass-panel rounded-3xl p-8 border border-rosegold/30 shadow-glow relative z-10"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-magenta to-rosegold p-0.5 shadow-glow">
            <div className="w-full h-full rounded-[14px] bg-[#0c0308] flex items-center justify-center">
              <Music className="w-5 h-5 text-rosegold" />
            </div>
          </div>
          <div>
            <p className="font-display text-xl text-stardust font-semibold">{data.songTitle}</p>
            <p className="text-xs text-stardust/60 font-body">
              {useSynthetic ? "Web Audio Ambient Heartbeat Serenade" : `A personal message for ${data.partnerName}`}
            </p>
          </div>
          <Volume2 className="w-5 h-5 text-stardust/40 ml-auto" strokeWidth={1.5} />
        </div>

        {/* Audio Visualizer Canvas */}
        <div className="relative rounded-2xl bg-[#090207] p-3 border border-rosegold/15 mb-6 overflow-hidden">
          <canvas
            ref={canvasRef}
            width={600}
            height={90}
            className="w-full h-[90px]"
          />
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={togglePlay}
            aria-label={isPlaying ? "Pause message" : "Play message"}
            className="w-14 h-14 rounded-full bg-gradient-to-br from-magenta via-magenta to-rosegold flex items-center justify-center shadow-glow active:scale-95 hover:scale-105 transition-transform gpu shrink-0"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 text-midnight fill-midnight" strokeWidth={0} />
            ) : (
              <Play className="w-6 h-6 text-midnight fill-midnight ml-0.5" strokeWidth={0} />
            )}
          </button>

          <div className="flex-1">
            <div className="flex justify-between text-xs text-stardust/60 font-body mb-1.5">
              <span>{isPlaying ? "Playing..." : "Tap to listen"}</span>
              <span>{useSynthetic ? "Ambient Pad" : `${Math.round(progress * 100)}%`}</span>
            </div>
            <div className="h-2 rounded-full bg-white/10 overflow-hidden relative border border-white/5">
              <motion.div
                className="h-full bg-gradient-to-r from-rosegold via-magenta to-stardust rounded-full"
                style={{ width: isPlaying && useSynthetic ? "100%" : `${progress * 100}%` }}
              />
            </div>
          </div>
        </div>

        <audio ref={audioRef} src={data.audioUrl} preload="none" />
      </motion.div>
    </section>
  );
}
