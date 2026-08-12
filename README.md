# Eternally Ours — A Private Keepsake

An Awwwards-grade, interactive romantic keepsake site built with Next.js 14 (App Router), Tailwind CSS, Framer Motion, Lucide React, canvas-confetti, and the Web Audio API.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000 — the default PIN is **1204**.

## Personalising your keepsake

Click the gear icon in the bottom-right corner once unlocked. From there you can edit, with no code:

- Names, secret PIN, voucher reward, and audio title/URL
- Every photo's image URL and caption
- The full romantic letter

All edits are saved to `localStorage` automatically.

### Adding your own voice message or song

Drop an MP3 file at `public/audio/voice-message.mp3`, or paste any direct audio URL into the "Audio file URL" field in the personaliser drawer. If no playable audio is found, the visualiser gracefully falls back to a synthesized ambient pad generated with the Web Audio API, so the frequency bars still animate.

## Feature map

| Feature | File |
|---|---|
| Secret Passcode Vault Gate | `components/PasscodeGate.tsx` |
| 3D Depth Memory Gallery + Lightbox | `components/MemoryGallery.tsx`, `components/Lightbox.tsx` |
| Milestone Story Timeline | `components/Timeline.tsx` |
| Voice Message & Audio Visualiser | `components/VoiceAudioPlayer.tsx` |
| Scratch-Off Date Night Voucher | `components/ScratchVoucher.tsx` |
| Hold-to-Charge Love Meter | `components/LoveMeter.tsx` |
| Live Personaliser Drawer | `components/PersonalizerDrawer.tsx` |
| Handwritten Letter | `components/LoveLetter.tsx` |

## Deploying

Works out of the box on Vercel:

```bash
npm run build
```
