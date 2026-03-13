export type InstrumentKey =
  | "synth"
  | "piano"
  | "acousticGuitar"
  | "electricGuitar"
  | "bass"
  | "pad"
  | "brass"
  | "pluck"
  | "marimba"
  | "strings"
  | "drum";

export type InstrumentType = "melodic" | "percussive";

export type PlayMode = "stopped" | "main" | "pattern" | "measure";

export type PatternGrid = Record<string, boolean[]>;

export interface Pattern {
  id: string;
  name: string;
  grid: PatternGrid;
}

export interface Track {
  id: string;
  name: string;
  instrument: InstrumentKey;
  mute: boolean;
  volume: number;
  patterns: Record<string, Pattern>;
  timeline: Array<string | null>;
  patternCounter: number;
}

export interface DawState {
  bpm: number;
  totalMeasures: number;
  tracks: Track[];
  activeTrackId: string | null;
  activePatternId: string | null;
  playMode: PlayMode;
  loopMeasureIndex: number | null;
  songTitle: string;
  currentMeasure: number;
  currentStep: number;
}

export interface SavedSong {
  id: string;
  title: string;
  date: string;
  data: Omit<
    DawState,
    | "playMode"
    | "activeTrackId"
    | "activePatternId"
    | "loopMeasureIndex"
    | "currentMeasure"
    | "currentStep"
  >;
}

export type TemplateData = Omit<
  DawState,
  | "playMode"
  | "activeTrackId"
  | "activePatternId"
  | "loopMeasureIndex"
  | "currentMeasure"
  | "currentStep"
>;
