let sharedContext: AudioContext | null = null;
let ambientNodes: { oscs: OscillatorNode[]; gains: GainNode[] } | null = null;

export function getAudioContext(): AudioContext {
  if (!sharedContext) {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    sharedContext = new AudioCtx();
  }
  if (sharedContext.state === "suspended") {
    void sharedContext.resume();
  }
  return sharedContext;
}

interface ToneOptions {
  frequency: number;
  duration: number;
  type?: OscillatorType;
  volume?: number;
  glideTo?: number;
}

export function playTone({
  frequency,
  duration,
  type = "sine",
  volume = 0.14,
  glideTo,
}: ToneOptions): void {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    if (glideTo) {
      osc.frequency.exponentialRampToValueAtTime(
        glideTo,
        ctx.currentTime + duration
      );
    }
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration + 0.05);
  } catch {
    // Audio unavailable — fail silently
  }
}

export function playKeypadChime(digitIndex: number): void {
  const baseFrequencies = [523.25, 587.33, 659.25, 698.46, 783.99, 880];
  const frequency = baseFrequencies[digitIndex % baseFrequencies.length];
  playTone({ frequency, duration: 0.18, type: "sine", volume: 0.1 });
}

export function playSuccessChime(): void {
  const notes = [523.25, 659.25, 783.99, 1046.5];
  notes.forEach((freq, i) => {
    setTimeout(() => playTone({ frequency: freq, duration: 0.35, type: "sine", volume: 0.12 }), i * 110);
  });
}

export function playErrorBuzz(): void {
  playTone({ frequency: 180, duration: 0.3, type: "sawtooth", volume: 0.08, glideTo: 90 });
}

export function playChargePulse(progress: number): void {
  const frequency = 220 + progress * 6.6;
  playTone({ frequency, duration: 0.08, type: "triangle", volume: 0.05 });
}

export function playFireworksFinale(): void {
  const notes = [392, 523.25, 659.25, 880, 1046.5, 1318.5];
  notes.forEach((freq, i) => {
    setTimeout(
      () => playTone({ frequency: freq, duration: 0.4, type: "sine", volume: 0.1 }),
      i * 70
    );
  });
}

/** Web Audio Ambient Romantic Serenade Generator */
export function startAmbientSoundscape(): () => void {
  try {
    const ctx = getAudioContext();
    if (ambientNodes) stopAmbientSoundscape();

    const frequencies = [261.63, 329.63, 392.0, 523.25, 659.25]; // C major 7th harmony
    const oscs: OscillatorNode[] = [];
    const gains: GainNode[] = [];

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.08, ctx.currentTime);
    masterGain.connect(ctx.destination);

    frequencies.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = idx % 2 === 0 ? "sine" : "triangle";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      // Subtle LFO modulation for warm analog organ/piano sound
      gain.gain.setValueAtTime(0.02 + idx * 0.01, ctx.currentTime);

      osc.connect(gain);
      gain.connect(masterGain);
      osc.start();

      oscs.push(osc);
      gains.push(gain);
    });

    ambientNodes = { oscs, gains };

    return stopAmbientSoundscape;
  } catch {
    return () => {};
  }
}

export function stopAmbientSoundscape(): void {
  if (!ambientNodes) return;
  const { oscs } = ambientNodes;
  oscs.forEach((osc) => {
    try {
      osc.stop();
    } catch {
      // already stopped
    }
  });
  ambientNodes = null;
}
