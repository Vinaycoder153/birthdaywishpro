"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

export interface MemoryPhoto {
  id: string;
  url: string;
  caption: string;
  date?: string;
  location?: string;
  category?: string;
}

export interface Milestone {
  id: string;
  title: string;
  date: string;
  description: string;
  iconName?: string;
}

export interface DateNightSurprise {
  title: string;
  tagline: string;
  details: string;
  venue: string;
}

export interface PersonalizationData {
  partnerName: string;
  yourName: string;
  loverGender: "girl" | "boy";
  pin: string;
  birthdayDate: string;
  heroGreeting: string;
  heroSubtitle: string;
  letter: string;
  dateNightSurprise: DateNightSurprise;
  scratchMessage: string;
  scratchTitle: string;
  finalMessage: string;
  songTitle: string;
  audioUrl: string;
  photos: MemoryPhoto[];
  milestones: Milestone[];
}

const STORAGE_KEY = "birthday-universe-data-v1";

export const DEFAULT_DATA: PersonalizationData = {
  partnerName: "My Love",
  yourName: "Your Person",
  loverGender: "girl",
  pin: "1204",
  birthdayDate: "2026-08-12",
  heroGreeting: "Happy Birthday, My Entire Universe",
  heroSubtitle: "Today isn't just another date on the calendar. It's the day the world became a little brighter, softer, and infinitely more beautiful.",
  letter:
    "Happy Birthday, my love.\n\nI don't know if words will ever be enough to explain what you mean to me.\n\nBut if I could give you one thing today, it would be the ability to see yourself through my eyes.\n\nYou would see someone extraordinarily special.\nSomeone worth celebrating every single second.\nSomeone worth choosing.\n\nAgain.\nAnd again.\nAnd again.\n\nThank you for existing, for loving me, and for filling my life with a light I never knew I was missing.",
  dateNightSurprise: {
    title: "YOUR BIRTHDAY DATE NIGHT",
    tagline: "A Private Celebration Reserved Just For You",
    details: "One unforgettable date: your favorite cuisine, your favorite place, candlelight, and one person who is completely & hopelessly obsessed with you.",
    venue: "Secret Candlelight Sanctuary — Tonight",
  },
  scratchMessage: "SURPRISE! ❤️ Tonight, you're officially kidnapped for a private rooftop birthday date under the stars.",
  scratchTitle: "A Private Secret Awaits",
  finalMessage: "This isn't the end of our story. It's just another beautiful chapter. Happy Birthday, my love. Forever looks beautiful with you.",
  songTitle: "Our Heartbeat Serenade",
  audioUrl: "/audio/voice-message.mp3",
  photos: [
    {
      id: "p1",
      url: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800&q=80",
      caption: "The smile I never get tired of looking at.",
      date: "Dec 4",
      location: "Where it all began",
      category: "Favorites",
    },
    {
      id: "p2",
      url: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=800&q=80",
      caption: "That golden evening we wished would last forever.",
      date: "Jul 18",
      location: "Sunset Harbor",
      category: "Golden Hour",
    },
    {
      id: "p3",
      url: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&q=80",
      caption: "You + Me = my favorite place in the universe.",
      date: "Oct 12",
      location: "Starlight Ridge",
      category: "Adventures",
    },
    {
      id: "p4",
      url: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800&q=80",
      caption: "I wish I could pause this exact moment forever.",
      date: "Dec 25",
      location: "Winter Hideaway",
      category: "Cozy Days",
    },
    {
      id: "p5",
      url: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&q=80",
      caption: "Quiet mornings with you are my favorite kind of luxury.",
      date: "Feb 14",
      location: "Our Corner",
      category: "Quiet Days",
    },
    {
      id: "p6",
      url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80",
      caption: "In a room full of art, I'd still stare at you.",
      date: "May 02",
      location: "The Gallery",
      category: "Favorites",
    },
  ],
  milestones: [
    {
      id: "m1",
      title: "The First Hello",
      date: "The Spark",
      description:
        "The moment two strangers unknowingly started becoming something more.",
      iconName: "Sparkles",
    },
    {
      id: "m2",
      title: "The First Conversation",
      date: "Endless Hours",
      description:
        "One casual conversation that somehow turned into hours of shared laughter and secrets.",
      iconName: "MessageCircle",
    },
    {
      id: "m3",
      title: "The First Date",
      date: "Unforgettable",
      description:
        "Nervous smiles, spilled coffee, and the exact instant I knew you were going to change my life.",
      iconName: "Coffee",
    },
    {
      id: "m4",
      title: "Our First Adventure",
      date: "Lost Together",
      description:
        "Somewhere between the journey and the destination, I realized how much I loved being beside you.",
      iconName: "Compass",
    },
    {
      id: "m5",
      title: "Today — Your Birthday",
      date: "This Moment",
      description:
        "Another birthday, another chapter written in the stars, and another reason to celebrate you.",
      iconName: "Heart",
    },
    {
      id: "m6",
      title: "Tomorrow & Forever",
      date: "Our Future",
      description:
        "Whatever comes next in this wild world, I hope I get to experience every second of it with you.",
      iconName: "Star",
    },
  ],
};

interface PersonalizationContextValue {
  data: PersonalizationData;
  updateData: (partial: Partial<PersonalizationData>) => void;
  resetData: () => void;
  isDrawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
  previewMode: boolean;
  setPreviewMode: (preview: boolean) => void;
}

const PersonalizationContext = createContext<PersonalizationContextValue | null>(
  null
);

export function PersonalizationProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<PersonalizationData>(DEFAULT_DATA);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as PersonalizationData;
        setData({ ...DEFAULT_DATA, ...parsed });
      }
    } catch {
      setData(DEFAULT_DATA);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data, hydrated]);

  const updateData = (partial: Partial<PersonalizationData>) => {
    setData((prev) => ({ ...prev, ...partial }));
  };

  const resetData = () => setData(DEFAULT_DATA);

  return (
    <PersonalizationContext.Provider
      value={{
        data,
        updateData,
        resetData,
        isDrawerOpen,
        setDrawerOpen,
        previewMode,
        setPreviewMode,
      }}
    >
      {children}
    </PersonalizationContext.Provider>
  );
}

export function usePersonalization() {
  const ctx = useContext(PersonalizationContext);
  if (!ctx) {
    throw new Error(
      "usePersonalization must be used within a PersonalizationProvider"
    );
  }
  return ctx;
}
