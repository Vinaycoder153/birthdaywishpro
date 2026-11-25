"use client";

import { motion } from "framer-motion";
import { ArrowDown, Sparkles } from "lucide-react";
import { usePersonalization } from "@/context/PersonalizationContext";

const photoPositions = [
  { left: "2%", top: "2%", width: "18%", height: "28%" },
  { left: "20%", top: "13%", width: "17%", height: "27%" },
  { left: "1%", top: "35%", width: "18%", height: "28%" },
  { left: "19%", top: "56%", width: "18%", height: "27%" },
  { left: "6%", top: "73%", width: "18%", height: "25%" },
  { right: "2%", top: "2%", width: "18%", height: "28%" },
  { right: "20%", top: "13%", width: "17%", height: "27%" },
  { right: "1%", top: "35%", width: "18%", height: "28%" },
  { right: "19%", top: "56%", width: "18%", height: "27%" },
  { right: "6%", top: "73%", width: "18%", height: "25%" },
];

export default function BirthdayCollage() {
  const { data } = usePersonalization();

  return (
    <section className="relative px-4 py-20 sm:px-6 sm:py-28">
      <div className="birthday-collage-shell">
        <div className="birthday-collage-glow" aria-hidden="true" />
        <div className="birthday-collage-stage">
          {data.photos.slice(0, 10).map((photo, index) => {
            const position = photoPositions[index % photoPositions.length];
            const tilt = index % 2 === 0 ? -5 : 5;

            return (
              <motion.figure
                key={photo.id}
                className={`birthday-collage-photo collage-photo-${index + 1}`}
                style={position}
                initial={{ opacity: 0, y: 38, rotate: tilt * 2, scale: 0.88 }}
                whileInView={{ opacity: 1, y: 0, rotate: tilt, scale: 1 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                  duration: 0.7,
                  delay: index * 0.07,
                  ease: [0.16, 1, 0.3, 1],
                }}
                animate={{ y: [0, index % 2 === 0 ? -8 : 8, 0] }}
                whileHover={{ scale: 1.08, rotate: 0, zIndex: 30 }}
              >
                <img
                  src={photo.url}
                  alt={`Birthday memory ${index + 1}`}
                  loading="lazy"
                  draggable={false}
                />
                <span className="collage-photo-shine" aria-hidden="true" />
              </motion.figure>
            );
          })}

          <motion.div
            className="birthday-collage-message"
            initial={{ opacity: 0, y: 24, scale: 0.94 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.25 }}
          >
            <span className="collage-eyebrow">
              <Sparkles className="h-4 w-4" />
              Ten little pieces of magic
            </span>
            <h2>
              Every picture
              <span> feels like you.</span>
            </h2>
            <p>
              A scrapbook of smiles, memories, and all the reasons we celebrate
              you, {data.partnerName}.
            </p>
            <a href="#gallery" className="collage-gallery-link">
              Explore every memory <ArrowDown className="h-4 w-4" />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
