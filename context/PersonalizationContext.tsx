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
const LEGACY_STOCK_PHOTO_URLS = [
  "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800&q=80",
  "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=800&q=80",
  "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&q=80",
  "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800&q=80",
  "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&q=80",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80",
];

export const DEFAULT_DATA: PersonalizationData = {
  partnerName: "Sinchana",
  yourName: "Your Best Friend",
  loverGender: "girl",
  pin: "2511",
  birthdayDate: "2026-11-25",
  heroGreeting: "Happy 20th Birthday, Sin",
  heroSubtitle: "Six days until we celebrate the wonderful person, unforgettable laughs, and beautiful friendship that make life brighter.",
  letter:
    "Happy Birthday, Sin!\n\nTwenty looks wonderful on you already.\n\nThank you for being the kind of friend who turns ordinary days into stories worth remembering, quiet moments into comfort, and every laugh into a memory I want to keep forever.\n\nYou are kind, hilarious, strong, and completely one of a kind. I hope this new chapter brings you big dreams, brave beginnings, and all the happiness you deserve.\n\nHere is to more adventures, more inside jokes, and a lifetime of being best friends.\n\nAlways cheering for you,\nYour Best Friend",
  dateNightSurprise: {
    title: "YOUR BIRTHDAY ADVENTURE",
    tagline: "A Celebration Reserved For The Birthday Girl",
    details: "One unforgettable day: good food, ridiculous laughter, your favorite people, and a brand-new memory for our best-friend scrapbook.",
    venue: "Sin's 20th Birthday Celebration — 25 November",
  },
  scratchMessage: "SURPRISE! ✨ Your 20th birthday mission is officially unlocked: celebrate loudly, laugh until it hurts, and make one more unforgettable memory.",
  scratchTitle: "A Birthday Secret Awaits",
  finalMessage: "This isn't the end of our story. It's another beautiful chapter in the friendship I am so grateful for. Happy 20th birthday, Sin — the best is still ahead.",
  songTitle: "Best-Friend Birthday Serenade",
  audioUrl: "/audio/voice-message.mp3",
  photos: [
    {
      id: "sin-photo-01",
      url: "https://res.cloudinary.com/dhce3g2sm/image/upload/v1795572959/1000110946_enhanced_qziza6.jpg",
      caption: "A little moment with Sin ✨",
      category: "Birthday Memories",
    },
    {
      id: "sin-photo-02",
      url: "https://res.cloudinary.com/dhce3g2sm/image/upload/v1795572975/1000110945_enhanced_yk30sg.jpg",
      caption: "One for the memory book 💖",
      category: "Birthday Memories",
    },
    {
      id: "sin-photo-03",
      url: "https://res.cloudinary.com/dhce3g2sm/image/upload/v1795572975/1000110944_enhanced_csjmo3.jpg",
      caption: "Sin's birthday sparkle ✨",
      category: "Birthday Memories",
    },
    {
      id: "sin-photo-04",
      url: "https://res.cloudinary.com/dhce3g2sm/image/upload/v1795572976/1000110947_enhanced_j5zdzf.jpg",
      caption: "A favorite frame with my favorite friend",
      category: "Birthday Memories",
    },
    {
      id: "sin-photo-05",
      url: "https://res.cloudinary.com/dhce3g2sm/image/upload/v1795572977/1000110942_enhanced_c7q2y2.jpg",
      caption: "Here's to more moments like this 🥂",
      category: "Birthday Memories",
    },
    {
      id: "sin-photo-06",
      url: "https://res.cloudinary.com/dhce3g2sm/image/upload/v1795572977/1000110940_enhanced_sofakm.jpg",
      caption: "Another little piece of our story",
      category: "Birthday Memories",
    },
    {
      id: "sin-photo-07",
      url: "https://res.cloudinary.com/dhce3g2sm/image/upload/v1795572978/1000110938_enhanced_hphirk.jpg",
      caption: "Sin, being wonderfully herself 🌟",
      category: "Birthday Memories",
    },
    {
      id: "sin-photo-08",
      url: "https://res.cloudinary.com/dhce3g2sm/image/upload/v1795572979/1000110943_enhanced_nrpg5k.jpg",
      caption: "A memory that deserves its own spotlight",
      category: "Birthday Memories",
    },
    {
      id: "sin-photo-09",
      url: "https://res.cloudinary.com/dhce3g2sm/image/upload/v1795572982/1000110941_enhanced_rshj9u.jpg",
      caption: "Best-friend memories, forever treasured 💫",
      category: "Birthday Memories",
    },
    {
      id: "sin-photo-10",
      url: "https://res.cloudinary.com/dhce3g2sm/image/upload/v1795572983/1000110939_enhanced_nv6s82.jpg",
      caption: "One more birthday memory to treasure ✨",
      category: "Birthday Memories",
    },
  ],
  milestones: [
    {
      id: "m1",
      title: "The First Hello",
      date: "The Spark",
      description:
        "The moment two people unknowingly started a friendship that would become one of life's best gifts.",
      iconName: "Sparkles",
    },
    {
      id: "m2",
      title: "The First Conversation",
      date: "Endless Hours",
      description:
        "One casual conversation that somehow turned into hours of laughter, secrets, and the beginning of our favorite inside jokes.",
      iconName: "MessageCircle",
    },
    {
      id: "m3",
      title: "The First Adventure",
      date: "Unforgettable",
      description:
        "A simple day out that became proof that even the most ordinary plans are better when we are together.",
      iconName: "Coffee",
    },
    {
      id: "m4",
      title: "Our Favorite Memories",
      date: "Lost Together",
      description:
        "Somewhere between the journey and the destination, we collected the kind of memories that make friendship feel like home.",
      iconName: "Compass",
    },
    {
      id: "m5",
      title: "Today — Your Birthday",
      date: "This Moment",
      description:
        "Twenty candles, one incredible friend, and a whole new chapter waiting to be written in the stars.",
      iconName: "Heart",
    },
    {
      id: "m6",
      title: "Tomorrow & Forever",
      date: "Our Future",
      description:
        "Whatever comes next in this wild world, I hope we keep showing up for every laugh, leap, and little victory together.",
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
        const hasOnlyLegacyStockPhotos =
          Array.isArray(parsed.photos) &&
          parsed.photos.length === LEGACY_STOCK_PHOTO_URLS.length &&
          parsed.photos.every((photo) => LEGACY_STOCK_PHOTO_URLS.includes(photo.url));
        const hasPreviousBirthdayPhotoSet =
          Array.isArray(parsed.photos) &&
          parsed.photos.length === DEFAULT_DATA.photos.length - 1 &&
          parsed.photos.every(
            (photo, index) =>
              photo.id === DEFAULT_DATA.photos[index]?.id &&
              photo.url === DEFAULT_DATA.photos[index]?.url
          );
        const photos = hasOnlyLegacyStockPhotos
          ? DEFAULT_DATA.photos
          : hasPreviousBirthdayPhotoSet
            ? [...parsed.photos, DEFAULT_DATA.photos[DEFAULT_DATA.photos.length - 1]]
            : parsed.photos ?? DEFAULT_DATA.photos;

        setData({
          ...DEFAULT_DATA,
          ...parsed,
          photos,
        });
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
