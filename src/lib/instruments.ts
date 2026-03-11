import * as Tone from "tone";
import { InstrumentKey, InstrumentType } from "@/types/daw";

export interface InstrumentConfig {
  name: string;
  type: InstrumentType;
  defaultVolume: number;
  icon: string;
  theme: string;
}

export interface InstrumentInstance {
  triggerAttackRelease: (
    notes: string[] | string,
    duration: string,
    time?: number
  ) => void;
  dispose: () => void;
  setVolume: (value: number) => void;
}

export const INSTRUMENTS: Record<InstrumentKey, InstrumentConfig> = {
  synth: {
    name: "シンセリード",
    type: "melodic",
    defaultVolume: -4,
    icon: "🎹",
    theme: "theme-blue",
  },
  piano: {
    name: "エレピ",
    type: "melodic",
    defaultVolume: -2,
    icon: "🎹",
    theme: "theme-emerald",
  },
  bass: {
    name: "ベース",
    type: "melodic",
    defaultVolume: -2,
    icon: "🎸",
    theme: "theme-purple",
  },
  pad: {
    name: "シンセパッド",
    type: "melodic",
    defaultVolume: -6,
    icon: "☁️",
    theme: "theme-pink",
  },
  brass: {
    name: "ブラス",
    type: "melodic",
    defaultVolume: -3,
    icon: "🎺",
    theme: "theme-red",
  },
  pluck: {
    name: "プラック",
    type: "melodic",
    defaultVolume: -2,
    icon: "🪕",
    theme: "theme-teal",
  },
  marimba: {
    name: "マリンバ",
    type: "melodic",
    defaultVolume: -1,
    icon: "🥢",
    theme: "theme-yellow",
  },
  strings: {
    name: "ストリングス",
    type: "melodic",
    defaultVolume: -5,
    icon: "🎻",
    theme: "theme-indigo",
  },
  drum: {
    name: "ドラムキット",
    type: "percussive",
    defaultVolume: 0,
    icon: "🥁",
    theme: "theme-amber",
  },
};

export function createInstrumentInstance(
  key: InstrumentKey,
  volume: number
): InstrumentInstance {
  if (key === "drum") {
    const gainNode = new Tone.Gain(Tone.dbToGain(volume)).toDestination();
    const kick = new Tone.MembraneSynth({
      pitchDecay: 0.05,
      octaves: 4,
      volume: 2,
    }).connect(gainNode);
    const snare = new Tone.NoiseSynth({
      noise: { type: "white" },
      envelope: { attack: 0.005, decay: 0.2, sustain: 0 },
      volume: -2,
    }).connect(gainNode);
    const hihat = new Tone.MetalSynth({
      envelope: { attack: 0.001, decay: 0.1, release: 0.01 },
      resonance: 4000,
      volume: -12,
    }).connect(gainNode);

    let lastK = -1;
    let lastS = -1;
    let lastH = -1;

    return {
      triggerAttackRelease: (notes, duration, time) => {
        const t = typeof time === "number" ? time : Tone.Transport.seconds;
        const arr = Array.isArray(notes) ? notes : [notes];
        arr.forEach((note) => {
          if (note === "Kick" && t !== lastK) {
            kick.triggerAttackRelease("C1", "8n", t);
            lastK = t;
          }
          if (note === "Snare" && t !== lastS) {
            snare.triggerAttackRelease("16n", t);
            lastS = t;
          }
          if (note === "HiHat" && t !== lastH) {
            hihat.triggerAttackRelease("32n", t);
            lastH = t;
          }
        });
      },
      dispose: () => {
        kick.dispose();
        snare.dispose();
        hihat.dispose();
        gainNode.dispose();
      },
      setVolume: (val) => {
        gainNode.gain.rampTo(Tone.dbToGain(val), 0.1);
      },
    };
  }

  let synth: Tone.PolySynth;
  switch (key) {
    case "piano":
      synth = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: "triangle8" },
        envelope: { attack: 0.02, decay: 1, sustain: 0.4, release: 1 },
      });
      break;
    case "bass":
      synth = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: "square" },
        envelope: { attack: 0.01, decay: 0.5, sustain: 0.2, release: 0.2 },
      });
      break;
    case "pad":
      synth = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: "sine" },
        envelope: { attack: 0.5, decay: 0.1, sustain: 1, release: 2 },
      });
      break;
    case "brass":
      synth = new Tone.PolySynth(Tone.FMSynth, {
        harmonicity: 1,
        modulationIndex: 1.5,
        oscillator: { type: "sawtooth" },
        envelope: { attack: 0.05, decay: 0.2, sustain: 0.8, release: 0.5 },
        modulation: { type: "sine" },
      });
      break;
    case "pluck":
      synth = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: "triangle" },
        envelope: { attack: 0.005, decay: 1, sustain: 0, release: 1 },
      });
      break;
    case "marimba":
      synth = new Tone.PolySynth(Tone.AMSynth, {
        harmonicity: 3.2,
        oscillator: { type: "sine" },
        envelope: { attack: 0.001, decay: 0.3, sustain: 0, release: 0.5 },
        modulation: { type: "square" },
        modulationEnvelope: { attack: 0.001, decay: 0.2, sustain: 0, release: 0.2 },
      });
      break;
    case "strings":
      synth = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: "sawtooth8" },
        envelope: { attack: 0.3, decay: 0.1, sustain: 1, release: 1.5 },
      });
      break;
    case "synth":
    default:
      synth = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: "sawtooth" },
      });
      break;
  }

  synth.volume.value = volume;
  synth.toDestination();

  return {
    triggerAttackRelease: (notes, duration, time) => {
      synth.triggerAttackRelease(notes, duration, time as any);
    },
    dispose: () => {
      synth.dispose();
    },
    setVolume: (val) => {
      synth.volume.rampTo(val, 0.1);
    },
  };
}
