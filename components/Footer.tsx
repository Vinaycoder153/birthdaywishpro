"use client";

import { Heart } from "lucide-react";
import { usePersonalization } from "@/context/PersonalizationContext";

export default function Footer() {
  const { data } = usePersonalization();
  const year = new Date().getFullYear();

  return (
    <footer className="relative py-16 px-6 text-center border-t border-rosegold/10">
      <Heart className="w-5 h-5 text-magenta/60 fill-magenta/30 mx-auto mb-4" />
      <p className="font-script text-2xl text-gradient-gold mb-2">
        {data.yourName} &amp; {data.partnerName}
      </p>
      <p className="text-xs text-stardust/30 font-body tracking-wide">
        Made with love, {year}
      </p>
    </footer>
  );
}
