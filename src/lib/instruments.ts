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
    defaultVolume: -14,
    icon: "🎹",
    theme: "theme-blue",
  },
  piano: {
    name: "エレピ",
    type: "melodic",
    defaultVolume: -10,
    icon: "🎹",
    theme: "theme-emerald",
  },
  acousticGuitar: {
    name: "アコギ",
    type: "melodic",
    defaultVolume: -20,
    icon: "🎸",
    theme: "theme-orange",
  },
  electricGuitar: {
    name: "エレキ",
    type: "melodic",
    defaultVolume: -8,
    icon: "🎸",
    theme: "theme-blue",
  },
  bass: {
    name: "ベース",
    type: "melodic",
    defaultVolume: 15,
    icon: "🎸",
    theme: "theme-purple",
  },
  pad: {
    name: "シンセパッド",
    type: "melodic",
    defaultVolume: +2,
    icon: "☁️",
    theme: "theme-pink",
  },
  brass: {
    name: "ブラス",
    type: "melodic",
    defaultVolume: -4,
    icon: "🎺",
    theme: "theme-red",
  },
  pluck: {
    name: "プラック",
    type: "melodic",
    defaultVolume: -7,
    icon: "🪕",
    theme: "theme-teal",
  },
  marimba: {
    name: "マリンバ",
    type: "melodic",
    defaultVolume: 6,
    icon: "🥢",
    theme: "theme-yellow",
  },
  strings: {
    name: "ストリングス",
    type: "melodic",
    defaultVolume: -6,
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
      volume: -6,
    }).connect(gainNode);
    const hihat = new Tone.MetalSynth({
      envelope: { attack: 0.001, decay: 0.1, release: 0.01 },
      resonance: 4000,
      volume: -16,
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
      // ピアノ: 減衰が速い三角波。アタックを鋭く。
      synth = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: "triangle8" },
        envelope: { attack: 0.005, decay: 1.2, sustain: 0.3, release: 0.8 },
      });
      break;
    case "acousticGuitar":
      // アコギ プラック感のある減衰音
      synth = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: "pwm", modulationFrequency: 0.2 },
        envelope: { attack: 0.005, decay: 1.5, sustain: 0.2, release: 1 },
      });
      break;
    case "electricGuitar":
      // エレキ 歪みを持たせたオシレータ
      synth = new Tone.PolySynth(Tone.FMSynth, {
        harmonicity: 1.5,
        modulationIndex: 2.5,
        oscillator: { type: "sawtooth" },
        envelope: { attack: 0.01, decay: 0.5, sustain: 0.6, release: 0.5 },
        modulation: { type: "square" },
      });
      break;
    case "bass":
      // ベース: アコースティック/エレキベースに近い質感（弦を弾くアタックと減衰）
      synth = new Tone.PolySynth(Tone.FMSynth, {
        harmonicity: 1,
        modulationIndex: 3,
        oscillator: { type: "triangle" },
        envelope: { attack: 0.005, decay: 0.6, sustain: 0.1, release: 0.8 },
        modulation: { type: "sine" },
        modulationEnvelope: { attack: 0.005, decay: 0.1, sustain: 0, release: 0 },
      });
      break;
    case "pad":
      // パッド: 遅いアタックと長いリリース。包み込むような音。
      synth = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: "sine" },
        envelope: { attack: 1.2, decay: 0.5, sustain: 0.8, release: 2.5 },
      });
      break;
    case "brass":
      // ブラス: FMSynthで金属的な質感を出し、デチューンされた鋸歯状波で厚みを出す。
      synth = new Tone.PolySynth(Tone.FMSynth, {
        harmonicity: 1.01,
        modulationIndex: 2,
        oscillator: { type: "sawtooth" },
        envelope: { attack: 0.1, decay: 0.2, sustain: 0.8, release: 0.5 },
        modulation: { type: "sine" },
      });
      break;
    case "pluck":
      // プラック: 非常に短いアタック。はじく音。
      synth = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: "triangle" },
        envelope: { attack: 0.002, decay: 0.8, sustain: 0, release: 0.4 },
      });
      break;
    case "marimba":
      // マリンバ: AM合成で木琴のような打撃音を再現。
      synth = new Tone.PolySynth(Tone.AMSynth, {
        harmonicity: 3.2,
        oscillator: { type: "sine" },
        envelope: { attack: 0.001, decay: 0.3, sustain: 0, release: 0.3 },
        modulation: { type: "square" },
      });
      break;
    case "strings":
      // ストリングス: 複数のデチューンされた鋸歯状波でアンサンブル感を出す。
      synth = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: "sawtooth8" },
        envelope: { attack: 0.4, decay: 0.2, sustain: 0.9, release: 1.5 },
      });
      break;
    case "synth":
    default:
      // デフォルトシンセ: 明るい鋸歯状波。
      synth = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: "sawtooth" },
        envelope: { attack: 0.01, decay: 0.1, sustain: 1, release: 0.5 },
      });
      break;
  }

  synth.volume.value = volume;
  synth.toDestination();

  return {
    triggerAttackRelease: (notes, duration, time) => {
      let finalNotes = notes;

      // ベースの場合は、ピッチを2オクターブ下げる
      if (key === "bass") {
        const transpose = (note: string) => {
          const match = note.match(/([A-G]#?)(\d+)/);
          if (match) {
            const pitch = match[1];
            const octave = parseInt(match[2], 10);
            return `${pitch}${Math.max(0, octave - 2)}`;
          }
          return note;
        };

        if (Array.isArray(notes)) {
          finalNotes = notes.map(transpose);
        } else {
          finalNotes = transpose(notes as string);
        }
      }

      synth.triggerAttackRelease(finalNotes, duration, time as any);
    },
    dispose: () => {
      synth.dispose();
    },
    setVolume: (val) => {
      synth.volume.rampTo(val, 0.1);
    },
  };
}
