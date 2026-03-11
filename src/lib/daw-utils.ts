import {
  Track,
  Pattern,
  InstrumentKey,
  InstrumentType,
  PatternGrid,
  DawState,
} from "@/types/daw";
import {
  DRUM_PITCHES,
  MELODIC_PITCHES,
  NUM_STEPS,
  DEFAULT_BPM,
  DEFAULT_MEASURES,
} from "./constants";
import { INSTRUMENTS } from "./instruments";

export function createEmptyGrid(instrumentType: InstrumentType): PatternGrid {
  const pitches =
    instrumentType === "percussive" ? DRUM_PITCHES : MELODIC_PITCHES;
  const grid: PatternGrid = {};
  pitches.forEach((p) => (grid[p] = new Array(NUM_STEPS).fill(false)));
  return grid;
}

export function createNewTrack(
  instKey: InstrumentKey = "synth",
  trackCount: number,
  totalMeasures: number
): Track {
  const id =
    "t_" +
    Date.now().toString(36) +
    Math.random().toString(36).substring(2, 7);
  const defaultVol = INSTRUMENTS[instKey].defaultVolume;
  const track: Track = {
    id,
    name: `Track ${trackCount + 1}`,
    instrument: instKey,
    mute: false,
    volume: defaultVol,
    patterns: {},
    timeline: new Array(totalMeasures).fill(null),
    patternCounter: 1,
  };

  const p1Id = "p1";
  track.patterns[p1Id] = {
    id: p1Id,
    name: "P1",
    grid: createEmptyGrid(INSTRUMENTS[instKey].type),
  };
  return track;
}

export function generateExportData(state: DawState) {
  const exportTracks = state.tracks.map((track) => {
    const allNotes: any[] = [];
    const instConfig = INSTRUMENTS[track.instrument];
    const isDrum = instConfig.type === "percussive";
    const pitches = isDrum ? DRUM_PITCHES : MELODIC_PITCHES;

    track.timeline.forEach((patternId, measureIndex) => {
      if (!patternId) return;
      const pattern = track.patterns[patternId];
      if (!pattern) return;

      for (let step = 0; step < NUM_STEPS; step++) {
        pitches.forEach((pitch) => {
          if (pattern.grid[pitch] && pattern.grid[pitch][step]) {
            const beat = Math.floor(step / 4);
            const sixteenth = step % 4;
            
            let finalNote = pitch;
            if (track.instrument === "bass") {
              const match = finalNote.match(/([A-G]#?)(\d+)/);
              if (match) {
                finalNote = `${match[1]}${Math.max(0, parseInt(match[2], 10) - 2)}`;
              }
            }

            allNotes.push({
              time: `${measureIndex}:${beat}:${sixteenth}`,
              note: finalNote,
              duration: "16n",
            });
          }
        });
      }
    });

    return {
      id: track.id,
      name: track.name,
      instrument: track.instrument,
      volume: track.volume,
      notes: allNotes,
    };
  });

  return {
    title: state.songTitle,
    bpm: state.bpm,
    lengthInMeasures: state.totalMeasures,
    tracks: exportTracks,
  };
}

export function generateProjectData(state: DawState) {
  return {
    bpm: state.bpm,
    totalMeasures: state.totalMeasures,
    tracks: state.tracks,
    songTitle: state.songTitle,
  };
}

export function createInitialDawState(): DawState {
  const drumTrack = createNewTrack("drum", 0, DEFAULT_MEASURES);
  drumTrack.name = "ドラム";
  drumTrack.timeline[0] = "p1";
  drumTrack.timeline[1] = "p1";
  drumTrack.patterns["p1"].name = "基本ビート";
  
  // デフォルトのビートを設定
  const dGrid = drumTrack.patterns["p1"].grid;
  [0, 4, 8, 12].forEach(s => dGrid["Kick"][s] = true);
  [4, 12].forEach(s => dGrid["Snare"][s] = true);
  [2, 6, 10, 14].forEach(s => dGrid["HiHat"][s] = true);

  return {
    bpm: DEFAULT_BPM,
    totalMeasures: DEFAULT_MEASURES,
    tracks: [drumTrack],
    activeTrackId: drumTrack.id,
    activePatternId: "p1",
    playMode: "stopped",
    loopMeasureIndex: null,
    songTitle: "My Awesome Song",
    currentMeasure: 0,
    currentStep: 0,
  };
}

export function generateReactCode(songData: any, locale: string = "ja"): string {
  const isJa = locale === "ja";

  const t = {
    title: isJa ? "自動生成されたBGM用カスタムフック" : "Auto-generated Custom Hook for BGM",
    pkg: isJa ? "依存パッケージ: npm install tone" : "Dependencies: npm install tone",
    usage: isJa ? "使用例: const { play, stop } = useSongBGM({ autoPlay: true });" : "Example: const { play, stop } = useSongBGM({ autoPlay: true });",
    options: isJa ? "オプション" : "Options",
    vol: isJa ? "音量 (-Infinity から 0+)" : "Volume (-Infinity to 0+)",
    loop: isJa ? "ループ再生するかどうか" : "Whether to loop playback",
    autoPlay: isJa ? "読み込み完了時に自動再生するかどうか" : "Whether to auto-play on load",
    ready: isJa ? "オーディオの準備が完了したかどうか" : "Whether audio is ready",
    playing: isJa ? "現在再生中かどうか" : "Whether audio is currently playing",
    playFunc: isJa ? "再生を開始する関数" : "Function to start playback",
    stopFunc: isJa ? "再生を停止する関数" : "Function to stop playback",
    setVol: isJa ? "動的に音量を変更する関数" : "Function to change volume dynamically",
  };

  return `import { useState, useEffect, useRef, useCallback } from 'react';
import * as Tone from 'tone';

/**
 * --- Type Definitions ---
 */
export interface NoteData {
  time: string;
  note: string | string[];
  duration: string;
}

export interface TrackData {
  id: string;
  name: string;
  instrument: string;
  volume: number;
  notes: NoteData[];
}

export interface SongData {
  title: string;
  bpm: number;
  lengthInMeasures: number;
  tracks: TrackData[];
}

export interface BGMOptions {
  /** ${t.vol} */
  volume?: number;
  /** ${t.loop} */
  loop?: boolean;
  /** ${t.autoPlay} */
  autoPlay?: boolean;
}

/**
 * ${t.title}
 * ${t.pkg}
 * ${t.usage}
 */
const SONG_DATA: SongData = ${JSON.stringify(songData, null, 2)};

/**
 * useSongBGM hook
 * @param initialOptions ${t.options}
 */
export function useSongBGM(initialOptions: BGMOptions = {}) {
  const { volume = 0, loop = true, autoPlay = false } = initialOptions;
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Refs for Tone.js instances to avoid re-renders
  const synthsRef = useRef<(Tone.PolySynth | { triggerAttackRelease: Function, dispose: Function })[]>([]);
  const partsRef = useRef<Tone.Part[]>([]);
  const masterVolRef = useRef<Tone.Volume | null>(null);
  const baseVolumeRef = useRef(volume);

  useEffect(() => { baseVolumeRef.current = volume; }, [volume]);

  useEffect(() => {
    // Initialization and Cleanup logic
    const cleanup = () => {
      synthsRef.current.forEach(s => s.dispose());
      partsRef.current.forEach(p => p.dispose());
      if (masterVolRef.current) masterVolRef.current.dispose();
      synthsRef.current = []; 
      partsRef.current = [];
    };
    cleanup();

    // Transport configuration
    Tone.Transport.bpm.value = SONG_DATA.bpm;
    Tone.Transport.loop = loop;
    Tone.Transport.loopStart = 0;
    Tone.Transport.loopEnd = \`\${SONG_DATA.lengthInMeasures}m\`;

    // Master volume setup
    const masterVol = new Tone.Volume(volume).toDestination();
    masterVolRef.current = masterVol;

    /**
     * Internal instrument factory
     */
    const createInstrument = (type: string, instVolume: number) => {
      const gainNode = new Tone.Gain(Tone.dbToGain(instVolume)).connect(masterVol);
      let inst: any;
      switch(type) {
        case 'piano': inst = new Tone.PolySynth(Tone.Synth, { oscillator: { type: "triangle8" }, envelope: { attack: 0.005, decay: 1.2, sustain: 0.3, release: 0.8 } }); break;
        case 'acousticGuitar': inst = new Tone.PolySynth(Tone.Synth, { oscillator: { type: "pwm", modulationFrequency: 0.2 }, envelope: { attack: 0.005, decay: 1.5, sustain: 0.2, release: 1 } }); break;
        case 'electricGuitar': inst = new Tone.PolySynth(Tone.FMSynth, { harmonicity: 1.5, modulationIndex: 2.5, oscillator: { type: "sawtooth" }, envelope: { attack: 0.01, decay: 0.5, sustain: 0.6, release: 0.5 }, modulation: { type: "square" } }); break;
        case 'bass': inst = new Tone.PolySynth(Tone.FMSynth, { harmonicity: 1, modulationIndex: 3, oscillator: { type: "triangle" }, envelope: { attack: 0.005, decay: 0.6, sustain: 0.1, release: 0.8 }, modulation: { type: "sine" }, modulationEnvelope: { attack: 0.005, decay: 0.1, sustain: 0, release: 0 } }); break;
        case 'pad': inst = new Tone.PolySynth(Tone.Synth, { oscillator: { type: "sine" }, envelope: { attack: 1.2, decay: 0.5, sustain: 0.8, release: 2.5 } }); break;
        case 'brass': inst = new Tone.PolySynth(Tone.FMSynth, { harmonicity: 1.01, modulationIndex: 2, oscillator: { type: "sawtooth" }, envelope: { attack: 0.1, decay: 0.2, sustain: 0.8, release: 0.5 }, modulation: { type: "sine" } }); break;
        case 'pluck': inst = new Tone.PolySynth(Tone.Synth, { oscillator: { type: "triangle" }, envelope: { attack: 0.002, decay: 0.8, sustain: 0, release: 0.4 } }); break;
        case 'marimba': inst = new Tone.PolySynth(Tone.AMSynth, { harmonicity: 3.2, oscillator: { type: "sine" }, envelope: { attack: 0.001, decay: 0.3, sustain: 0, release: 0.3 }, modulation: { type: "square" } }); break;
        case 'strings': inst = new Tone.PolySynth(Tone.Synth, { oscillator: { type: "sawtooth8" }, envelope: { attack: 0.4, decay: 0.2, sustain: 0.9, release: 1.5 } }); break;
        case 'drum': 
          const kick = new Tone.MembraneSynth({ pitchDecay: 0.05, octaves: 4, volume: 2 }).connect(gainNode);
          const snare = new Tone.NoiseSynth({ noise: { type: 'white' }, envelope: { attack: 0.005, decay: 0.2, sustain: 0 }, volume: -2 }).connect(gainNode);
          const hihat = new Tone.MetalSynth({ envelope: { attack: 0.001, decay: 0.1, release: 0.01 }, resonance: 4000, volume: -12 }).connect(gainNode);
          
          let lastK = -1; let lastS = -1; let lastH = -1;
          return {
            triggerAttackRelease: (notes: string | string[], duration: string, time: number | string) => {
              const t = typeof time === 'number' ? time : Tone.Transport.seconds;
              const arr = Array.isArray(notes) ? notes : [notes];
              arr.forEach(note => {
                if (note === 'Kick' && t !== lastK) { kick.triggerAttackRelease("C1", "8n", t); lastK = t; }
                if (note === 'Snare' && t !== lastS) { snare.triggerAttackRelease("16n", t); lastS = t; }
                if (note === 'HiHat' && t !== lastH) { hihat.triggerAttackRelease("32n", t); lastH = t; }
              });
            },
            dispose: () => { kick.dispose(); snare.dispose(); hihat.dispose(); gainNode.dispose(); }
          };
        case 'synth':
        default: inst = new Tone.PolySynth(Tone.Synth, { oscillator: { type: "sawtooth" }, envelope: { attack: 0.01, decay: 0.1, sustain: 1, release: 0.5 } }); break;
      }
      if (inst) {
        inst.connect(gainNode);
        const origDispose = inst.dispose.bind(inst);
        inst.dispose = () => { origDispose(); gainNode.dispose(); };
      }
      return inst;
    };

    // Instantiate instruments and schedule notes
    SONG_DATA.tracks.forEach((track: TrackData) => {
      const synth = createInstrument(track.instrument, track.volume || 0);
      synthsRef.current.push(synth);
      const part = new Tone.Part((time, value) => { 
        synth.triggerAttackRelease(value.note, value.duration, time); 
      }, track.notes).start(0);
      partsRef.current.push(part);
    });

    setIsReady(true);
    if (autoPlay) { 
      Tone.start().then(() => { 
        Tone.Transport.start(); 
        setIsPlaying(true); 
      }); 
    }
    
    return () => { 
      Tone.Transport.stop(); 
      cleanup(); 
    };
  }, [loop, autoPlay, volume]);

  /** ${t.loop} */
  const setLoop = useCallback((isLoop: boolean) => { 
    Tone.Transport.loop = isLoop; 
  }, []);

  /** ${t.setVol} */
  const setVolume = useCallback((db: number, rampTime = 0.1) => {
    baseVolumeRef.current = db;
    if (masterVolRef.current) masterVolRef.current.volume.rampTo(db, rampTime);
  }, []);

  /** ${t.playFunc} */
  const play = useCallback(async (options: { fadeIn?: number } = {}) => {
    const { fadeIn = 0 } = options;
    if (Tone.context.state !== 'running') await Tone.start();
    if (masterVolRef.current) {
      if (fadeIn > 0) {
        masterVolRef.current.volume.value = -Infinity;
        masterVolRef.current.volume.rampTo(baseVolumeRef.current, fadeIn);
      } else { 
        masterVolRef.current.volume.value = baseVolumeRef.current; 
      }
    }
    Tone.Transport.start(); 
    setIsPlaying(true);
  }, []);

  /** ${t.stopFunc} */
  const stop = useCallback((options: { fadeOut?: number } = {}) => {
    const { fadeOut = 0 } = options;
    if (masterVolRef.current && fadeOut > 0) {
      masterVolRef.current.volume.rampTo(-Infinity, fadeOut);
      setTimeout(() => { 
        Tone.Transport.pause(); 
        setIsPlaying(false); 
      }, fadeOut * 1000);
    } else { 
      Tone.Transport.pause(); 
      setIsPlaying(false); 
    }
  }, []);

  return { 
    /** ${t.ready} */
    isReady, 
    /** ${t.playing} */
    isPlaying, 
    /** ${t.playFunc} */
    play, 
    /** ${t.stopFunc} */
    stop, 
    /** ${t.setVol} */
    setVolume, 
    /** ${t.loop} */
    setLoop 
  };
}
`;
}
