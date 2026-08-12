"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Settings, X, Plus, Trash2, RotateCcw, Calendar, Heart, Gift, Sparkles, Download, Eye, Upload } from "lucide-react";
import { usePersonalization, MemoryPhoto, Milestone } from "@/context/PersonalizationContext";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block mb-4">
      <span className="block text-xs tracking-wide uppercase text-stardust/60 font-body mb-1.5">
        {label}
      </span>
      {children}
    </label>
  );
}

const inputClass =
  "w-full rounded-xl bg-white/5 border border-rosegold/20 px-3 py-2 text-sm text-stardust font-body placeholder:text-stardust/30 focus:outline-none focus:border-rosegold/60 focus:bg-white/[0.08] transition-colors";

export default function PersonalizerDrawer() {
  const {
    data,
    updateData,
    resetData,
    isDrawerOpen,
    setDrawerOpen,
    previewMode,
    setPreviewMode,
  } = usePersonalization();

  const [tab, setTab] = useState<"general" | "photos" | "story" | "surprises" | "letter">("general");

  // Photo handlers
  const updatePhoto = (id: string, partial: Partial<MemoryPhoto>) => {
    updateData({
      photos: data.photos.map((p) => (p.id === id ? { ...p, ...partial } : p)),
    });
  };

  const addPhoto = () => {
    const id = `p${Date.now()}`;
    updateData({
      photos: [
        ...data.photos,
        {
          id,
          url: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800&q=80",
          caption: "A new favorite moment",
          date: "Special Date",
          location: "Secret Place",
          category: "Moments",
        },
      ],
    });
  };

  const removePhoto = (id: string) => {
    updateData({ photos: data.photos.filter((p) => p.id !== id) });
  };

  // Milestone handlers
  const updateMilestone = (id: string, partial: Partial<Milestone>) => {
    updateData({
      milestones: data.milestones.map((m) => (m.id === id ? { ...m, ...partial } : m)),
    });
  };

  const addMilestone = () => {
    const id = `m${Date.now()}`;
    updateData({
      milestones: [
        ...data.milestones,
        {
          id,
          title: "New Milestone",
          date: "Special Chapter",
          description: "Describe this special moment...",
          iconName: "Sparkles",
        },
      ],
    });
  };

  const removeMilestone = (id: string) => {
    updateData({ milestones: data.milestones.filter((m) => m.id !== id) });
  };

  // Export JSON Config
  const exportConfig = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", jsonString);
    downloadAnchor.setAttribute("download", `birthday-universe-config.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <>
      <button
        onClick={() => setDrawerOpen(true)}
        aria-label="Open personaliser"
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full glass-panel shadow-glow-gold border border-rosegold/40 flex items-center justify-center text-rosegold hover:rotate-90 hover:scale-105 transition-all duration-500 gpu"
      >
        <Settings className="w-6 h-6" strokeWidth={1.5} />
      </button>

      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
              className="fixed inset-0 z-40 bg-black/75 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 240 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md glass-panel border-l border-rosegold/25 p-6 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6 pb-3 border-b border-rosegold/15">
                <h3 className="font-display text-xl text-gradient-gold font-semibold">
                  Personalise Surprise Universe
                </h3>
                <button
                  onClick={() => setDrawerOpen(false)}
                  aria-label="Close personaliser"
                  className="w-9 h-9 rounded-full glass-panel flex items-center justify-center text-stardust/70 hover:text-magenta"
                >
                  <X className="w-4 h-4" strokeWidth={1.5} />
                </button>
              </div>

              {/* Preview Toggle Button */}
              <button
                onClick={() => setPreviewMode(!previewMode)}
                className={`w-full mb-5 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-xs font-body uppercase tracking-wider transition-all ${
                  previewMode
                    ? "bg-gradient-to-r from-magenta to-rosegold text-midnight font-bold shadow-glow"
                    : "glass-panel border-rosegold/30 text-rosegold hover:text-white"
                }`}
              >
                <Eye className="w-4 h-4" />
                {previewMode ? "Preview Mode ACTIVE (Vault Unlocked)" : "Enable Instant Preview Mode"}
              </button>

              {/* Tab Navigation */}
              <div className="flex gap-1.5 mb-6 overflow-x-auto pb-1 scrollbar-none">
                {(["general", "photos", "story", "surprises", "letter"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`px-3 py-1.5 rounded-full text-xs uppercase tracking-wider font-body shrink-0 transition-colors ${
                      tab === t
                        ? "bg-gradient-to-r from-magenta to-rosegold text-midnight font-semibold shadow-glow"
                        : "text-stardust/60 glass-panel border border-rosegold/15 hover:text-rosegold"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              {/* General Settings Tab */}
              {tab === "general" && (
                <div>
                  <Field label="Lover's Name">
                    <input
                      className={inputClass}
                      value={data.partnerName}
                      onChange={(e) => updateData({ partnerName: e.target.value })}
                    />
                  </Field>
                  <Field label="Your Name">
                    <input
                      className={inputClass}
                      value={data.yourName}
                      onChange={(e) => updateData({ yourName: e.target.value })}
                    />
                  </Field>
                  <Field label="Lover's Title (Greeting Gate)">
                    <select
                      className={inputClass}
                      value={data.loverGender}
                      onChange={(e) =>
                        updateData({ loverGender: e.target.value as "girl" | "boy" })
                      }
                    >
                      <option value="girl">Birthday Girl ❤️</option>
                      <option value="boy">Birthday Boy ❤️</option>
                    </select>
                  </Field>
                  <Field label="Secret Vault PIN (4 Digits)">
                    <input
                      className={inputClass}
                      maxLength={4}
                      inputMode="numeric"
                      value={data.pin}
                      onChange={(e) =>
                        updateData({
                          pin: e.target.value.replace(/\D/g, "").slice(0, 4),
                        })
                      }
                    />
                  </Field>
                  <Field label="Birthday Date (YYYY-MM-DD)">
                    <input
                      type="date"
                      className={inputClass}
                      value={data.birthdayDate}
                      onChange={(e) => updateData({ birthdayDate: e.target.value })}
                    />
                  </Field>
                  <Field label="Voice Message / Song Title">
                    <input
                      className={inputClass}
                      value={data.songTitle}
                      onChange={(e) => updateData({ songTitle: e.target.value })}
                    />
                  </Field>
                  <Field label="Audio File URL">
                    <input
                      className={inputClass}
                      value={data.audioUrl}
                      onChange={(e) => updateData({ audioUrl: e.target.value })}
                    />
                  </Field>
                </div>
              )}

              {/* Photos Tab */}
              {tab === "photos" && (
                <div>
                  {data.photos.map((photo) => (
                    <div
                      key={photo.id}
                      className="mb-4 p-3.5 rounded-2xl bg-white/[0.03] border border-rosegold/15"
                    >
                      <div className="flex items-center justify-between mb-2.5">
                        <img
                          src={photo.url}
                          alt=""
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        <button
                          onClick={() => removePhoto(photo.id)}
                          aria-label="Remove photo"
                          className="text-stardust/40 hover:text-magenta"
                        >
                          <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                        </button>
                      </div>
                      <Field label="Image URL">
                        <input
                          className={inputClass}
                          value={photo.url}
                          onChange={(e) => updatePhoto(photo.id, { url: e.target.value })}
                        />
                      </Field>
                      <Field label="Caption">
                        <input
                          className={inputClass}
                          value={photo.caption}
                          onChange={(e) => updatePhoto(photo.id, { caption: e.target.value })}
                        />
                      </Field>
                      <Field label="Location">
                        <input
                          className={inputClass}
                          value={photo.location || ""}
                          onChange={(e) => updatePhoto(photo.id, { location: e.target.value })}
                        />
                      </Field>
                    </div>
                  ))}
                  <button
                    onClick={addPhoto}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-dashed border-rosegold/30 text-rosegold/80 hover:text-rosegold hover:border-rosegold/60 transition-colors text-xs uppercase tracking-wider font-body"
                  >
                    <Plus className="w-4 h-4" strokeWidth={1.5} /> Add Photo
                  </button>
                </div>
              )}

              {/* Story Tab */}
              {tab === "story" && (
                <div>
                  {data.milestones.map((milestone) => (
                    <div
                      key={milestone.id}
                      className="mb-4 p-3.5 rounded-2xl bg-white/[0.03] border border-rosegold/15"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-stardust/60 font-body uppercase font-medium">
                          {milestone.title}
                        </span>
                        <button
                          onClick={() => removeMilestone(milestone.id)}
                          aria-label="Remove milestone"
                          className="text-stardust/40 hover:text-magenta"
                        >
                          <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                        </button>
                      </div>
                      <Field label="Title">
                        <input
                          className={inputClass}
                          value={milestone.title}
                          onChange={(e) => updateMilestone(milestone.id, { title: e.target.value })}
                        />
                      </Field>
                      <Field label="Badge Tag">
                        <input
                          className={inputClass}
                          value={milestone.date}
                          onChange={(e) => updateMilestone(milestone.id, { date: e.target.value })}
                        />
                      </Field>
                      <Field label="Description">
                        <textarea
                          className={`${inputClass} min-h-[60px] resize-none`}
                          value={milestone.description}
                          onChange={(e) =>
                            updateMilestone(milestone.id, { description: e.target.value })
                          }
                        />
                      </Field>
                    </div>
                  ))}
                  <button
                    onClick={addMilestone}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-dashed border-rosegold/30 text-rosegold/80 hover:text-rosegold hover:border-rosegold/60 transition-colors text-xs uppercase tracking-wider font-body"
                  >
                    <Plus className="w-4 h-4" strokeWidth={1.5} /> Add Milestone
                  </button>
                </div>
              )}

              {/* Surprises Tab */}
              {tab === "surprises" && (
                <div>
                  <Field label="Gift Box Surprise Title">
                    <input
                      className={inputClass}
                      value={data.dateNightSurprise?.title || ""}
                      onChange={(e) =>
                        updateData({
                          dateNightSurprise: {
                            ...data.dateNightSurprise,
                            title: e.target.value,
                          },
                        })
                      }
                    />
                  </Field>
                  <Field label="Gift Box Details">
                    <textarea
                      className={`${inputClass} min-h-[70px] resize-none`}
                      value={data.dateNightSurprise?.details || ""}
                      onChange={(e) =>
                        updateData({
                          dateNightSurprise: {
                            ...data.dateNightSurprise,
                            details: e.target.value,
                          },
                        })
                      }
                    />
                  </Field>
                  <Field label="Scratch Card Message">
                    <textarea
                      className={`${inputClass} min-h-[70px] resize-none`}
                      value={data.scratchMessage}
                      onChange={(e) => updateData({ scratchMessage: e.target.value })}
                    />
                  </Field>
                  <Field label="Finale Closing Message">
                    <textarea
                      className={`${inputClass} min-h-[70px] resize-none`}
                      value={data.finalMessage}
                      onChange={(e) => updateData({ finalMessage: e.target.value })}
                    />
                  </Field>
                </div>
              )}

              {/* Letter Tab */}
              {tab === "letter" && (
                <Field label="Romantic Birthday Letter">
                  <textarea
                    className={`${inputClass} min-h-[260px] resize-none`}
                    value={data.letter}
                    onChange={(e) => updateData({ letter: e.target.value })}
                  />
                </Field>
              )}

              <div className="mt-8 pt-4 border-t border-rosegold/15 flex flex-col gap-2">
                <button
                  onClick={exportConfig}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl glass-panel border border-rosegold/30 text-rosegold hover:text-white transition-colors text-xs uppercase tracking-wider font-body"
                >
                  <Download className="w-4 h-4" strokeWidth={1.5} /> Export Backup (JSON)
                </button>
                <button
                  onClick={resetData}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-stardust/40 hover:text-stardust/70 transition-colors text-xs uppercase tracking-wider font-body"
                >
                  <RotateCcw className="w-3.5 h-3.5" strokeWidth={1.5} /> Reset Everything
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
