"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Camera, Clock, Feather, Mic2, Gift, Settings, Menu, X, Sparkles, Eye } from "lucide-react";
import { usePersonalization } from "@/context/PersonalizationContext";

const navItems = [
  { id: "gallery", label: "Memories", icon: Camera },
  { id: "timeline", label: "Our Story", icon: Clock },
  { id: "voice", label: "Heartbeat", icon: Mic2 },
  { id: "surprise", label: "Surprise Box", icon: Gift },
  { id: "scratch", label: "Scratch Card", icon: Sparkles },
  { id: "lovemeter", label: "Love Meter", icon: Heart },
  { id: "letter", label: "Letter", icon: Feather },
];

export default function Navbar() {
  const { data, setDrawerOpen, previewMode } = usePersonalization();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);

      const sections = navItems.map((item) => document.getElementById(item.id));
      const scrollPos = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const sec = sections[i];
        if (sec && sec.offsetTop <= scrollPos) {
          setActiveSection(navItems[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <motion.header
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          scrolled
            ? "py-3 bg-[#060105]/85 backdrop-blur-2xl border-b border-rosegold/20 shadow-2xl"
            : "py-6 bg-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="group flex items-center gap-2.5"
          >
            <div className="w-9 h-9 rounded-full glass-panel flex items-center justify-center border border-rosegold/30 group-hover:border-magenta group-hover:scale-105 transition-all duration-300 shadow-glow">
              <Heart className="w-4 h-4 text-magenta fill-magenta/40 group-hover:fill-magenta transition-colors" />
            </div>
            <span className="font-display text-lg tracking-wide text-gradient-gold font-semibold">
              Birthday<span className="text-magenta font-script text-xl ml-1">Universe</span>
            </span>
          </a>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-1 glass-panel px-3 py-1.5 rounded-full border border-rosegold/20 shadow-lg">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-body tracking-wider transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-r from-magenta to-rosegold text-midnight font-semibold shadow-glow"
                      : "text-stardust/70 hover:text-rosegold hover:bg-white/[0.05]"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" strokeWidth={1.5} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            {previewMode && (
              <span className="hidden sm:inline-flex items-center gap-1 px-3 py-1 rounded-full bg-magenta/20 border border-magenta/40 text-[10px] uppercase font-body text-stardust font-bold shadow-glow">
                <Eye className="w-3 h-3 text-magenta" /> Preview Mode
              </span>
            )}

            <button
              onClick={() => setDrawerOpen(true)}
              aria-label="Open personalization drawer"
              className="flex items-center gap-2 px-3 py-1.5 rounded-full glass-panel border border-rosegold/30 text-xs text-rosegold hover:border-magenta hover:text-white transition-all shadow-glow-gold"
            >
              <Settings className="w-3.5 h-3.5" strokeWidth={1.5} />
              <span className="hidden sm:inline font-body tracking-wider uppercase text-[10px]">Customize</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
              className="md:hidden w-9 h-9 rounded-full glass-panel flex items-center justify-center text-stardust hover:text-rosegold"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-0 top-[60px] z-30 md:hidden bg-[#060105]/95 backdrop-blur-2xl border-b border-rosegold/20 p-6 shadow-2xl"
          >
            <div className="grid grid-cols-2 gap-3">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className="flex items-center gap-3 p-3 rounded-xl glass-panel text-stardust hover:text-rosegold text-sm font-body"
                  >
                    <Icon className="w-4 h-4 text-magenta" strokeWidth={1.5} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
