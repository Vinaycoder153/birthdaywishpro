import type { Metadata, Viewport } from "next";
import { Cinzel, Playfair_Display, Plus_Jakarta_Sans, Dancing_Script } from "next/font/google";
import "./globals.css";
import { PersonalizationProvider } from "@/context/PersonalizationContext";

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
  variable: "--font-cinzel",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-playfair",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-jakarta",
  display: "swap",
});

const dancing = Dancing_Script({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-dancing",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Happy 20th Birthday, Sinchana ✨",
  description: "A cinematic birthday surprise made with love for Sinchana's 20th birthday.",
};

export const viewport: Viewport = {
  themeColor: "#060105",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cinzel.variable} ${playfair.variable} ${jakarta.variable} ${dancing.variable}`}>
      <body className="font-body bg-midnight bg-velvet-radial min-h-screen antialiased text-[#ffe9ef] overflow-x-hidden">
        <div className="noise-overlay" />
        <PersonalizationProvider>{children}</PersonalizationProvider>
      </body>
    </html>
  );
}
