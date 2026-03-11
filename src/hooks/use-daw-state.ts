import { useReducer, useCallback, useMemo } from "react";
import {
  DawState,
  Track,
  InstrumentKey,
  PlayMode,
} from "@/types/daw";
import {
  createInitialDawState,
  createNewTrack,
  createEmptyGrid,
} from "@/lib/daw-utils";
import { INSTRUMENTS } from "@/lib/instruments";

type DawAction =
  | { type: "ADD_TRACK"; instrument: InstrumentKey }
  | { type: "DELETE_TRACK"; trackId: string }
  | { type: "RENAME_TRACK"; trackId: string; name: string }
  | { type: "CHANGE_TRACK_INSTRUMENT"; trackId: string; instrument: InstrumentKey }
  | { type: "TOGGLE_TRACK_MUTE"; trackId: string }
  | { type: "SET_TRACK_VOLUME"; trackId: string; volume: number }
  | { type: "SET_BPM"; bpm: number }
  | { type: "SET_TOTAL_MEASURES"; totalMeasures: number }
  | { type: "SET_ACTIVE_PATTERN"; trackId: string; patternId: string | null }
  | { type: "CREATE_PATTERN"; trackId: string }
  | { type: "RENAME_PATTERN"; trackId: string; patternId: string; name: string }
  | {
      type: "TOGGLE_NOTE";
      trackId: string;
      patternId: string;
      pitch: string;
      step: number;
    }
  | {
      type: "PAINT_NOTE";
      trackId: string;
      patternId: string;
      pitch: string;
      step: number;
      value: boolean;
    }
  | { type: "CLEAR_PATTERN"; trackId: string; patternId: string }
  | {
      type: "PLACE_PATTERN_ON_TIMELINE";
      trackId: string;
      measureIndex: number;
      patternId: string | null;
    }
  | { type: "SET_PLAY_MODE"; playMode: PlayMode }
  | { type: "SET_LOOP_MEASURE"; measureIndex: number | null }
  | { type: "SET_SONG_TITLE"; title: string }
  | { type: "SET_POSITION"; measure: number; step: number }
  | { type: "RESTORE_PROJECT"; project: any };

function dawReducer(state: DawState, action: DawAction): DawState {
  switch (action.type) {
    case "ADD_TRACK": {
      const newTrack = createNewTrack(
        action.instrument,
        state.tracks.length,
        state.totalMeasures
      );
      return {
        ...state,
        tracks: [...state.tracks, newTrack],
        activeTrackId: newTrack.id,
        activePatternId: "p1",
      };
    }
    case "DELETE_TRACK": {
      const newTracks = state.tracks.filter((t) => t.id !== action.trackId);
      let { activeTrackId, activePatternId } = state;
      if (activeTrackId === action.trackId) {
        activeTrackId = newTracks.length > 0 ? newTracks[0].id : null;
        activePatternId = activeTrackId ? Object.keys(newTracks[0].patterns)[0] : null;
      }
      return { ...state, tracks: newTracks, activeTrackId, activePatternId };
    }
    case "RENAME_TRACK":
      return {
        ...state,
        tracks: state.tracks.map((t) =>
          t.id === action.trackId ? { ...t, name: action.name } : t
        ),
      };
    case "CHANGE_TRACK_INSTRUMENT":
      return {
        ...state,
        tracks: state.tracks.map((t) => {
          if (t.id !== action.trackId) return t;
          const oldType = INSTRUMENTS[t.instrument].type;
          const newType = INSTRUMENTS[action.instrument].type;
          const patterns = { ...t.patterns };
          if (oldType !== newType) {
            Object.keys(patterns).forEach((pId) => {
              patterns[pId] = {
                ...patterns[pId],
                grid: createEmptyGrid(newType),
              };
            });
          }
          return { ...t, instrument: action.instrument, patterns };
        }),
      };
    case "TOGGLE_TRACK_MUTE":
      return {
        ...state,
        tracks: state.tracks.map((t) =>
          t.id === action.trackId ? { ...t, mute: !t.mute } : t
        ),
      };
    case "SET_TRACK_VOLUME":
      return {
        ...state,
        tracks: state.tracks.map((t) =>
          t.id === action.trackId ? { ...t, volume: action.volume } : t
        ),
      };
    case "SET_BPM":
      return { ...state, bpm: action.bpm };
    case "SET_TOTAL_MEASURES": {
      const newLen = action.totalMeasures;
      return {
        ...state,
        totalMeasures: newLen,
        tracks: state.tracks.map((t) => {
          const newTimeline = new Array(newLen).fill(null);
          for (let i = 0; i < Math.min(t.timeline.length, newLen); i++) {
            newTimeline[i] = t.timeline[i];
          }
          return { ...t, timeline: newTimeline };
        }),
      };
    }
    case "SET_ACTIVE_PATTERN":
      return {
        ...state,
        activeTrackId: action.trackId,
        activePatternId: action.patternId,
      };
    case "CREATE_PATTERN": {
      let newPatternId = "";
      const newTracks = state.tracks.map((t) => {
        if (t.id !== action.trackId) return t;
        const count = t.patternCounter + 1;
        newPatternId = `p${count}`;
        return {
          ...t,
          patternCounter: count,
          patterns: {
            ...t.patterns,
            [newPatternId]: {
              id: newPatternId,
              name: `P${count}`,
              grid: createEmptyGrid(INSTRUMENTS[t.instrument].type),
            },
          },
        };
      });
      return {
        ...state,
        tracks: newTracks,
        activeTrackId: action.trackId,
        activePatternId: newPatternId || state.activePatternId,
      };
    }
    case "RENAME_PATTERN":
      return {
        ...state,
        tracks: state.tracks.map((t) => {
          if (t.id !== action.trackId) return t;
          return {
            ...t,
            patterns: {
              ...t.patterns,
              [action.patternId]: {
                ...t.patterns[action.patternId],
                name: action.name,
              },
            },
          };
        }),
      };
    case "TOGGLE_NOTE":
      return {
        ...state,
        tracks: state.tracks.map((t) => {
          if (t.id !== action.trackId) return t;
          const pattern = t.patterns[action.patternId];
          const grid = { ...pattern.grid };
          const row = [...grid[action.pitch]];
          row[action.step] = !row[action.step];
          grid[action.pitch] = row;
          return {
            ...t,
            patterns: {
              ...t.patterns,
              [action.patternId]: { ...pattern, grid },
            },
          };
        }),
      };
    case "PAINT_NOTE":
      return {
        ...state,
        tracks: state.tracks.map((t) => {
          if (t.id !== action.trackId) return t;
          const pattern = t.patterns[action.patternId];
          const grid = { ...pattern.grid };
          const row = [...grid[action.pitch]];
          row[action.step] = action.value;
          grid[action.pitch] = row;
          return {
            ...t,
            patterns: {
              ...t.patterns,
              [action.patternId]: { ...pattern, grid },
            },
          };
        }),
      };
    case "CLEAR_PATTERN":
      return {
        ...state,
        tracks: state.tracks.map((t) => {
          if (t.id !== action.trackId) return t;
          return {
            ...t,
            patterns: {
              ...t.patterns,
              [action.patternId]: {
                ...t.patterns[action.patternId],
                grid: createEmptyGrid(INSTRUMENTS[t.instrument].type),
              },
            },
          };
        }),
      };
    case "PLACE_PATTERN_ON_TIMELINE":
      return {
        ...state,
        tracks: state.tracks.map((t) => {
          if (t.id !== action.trackId) return t;
          const timeline = [...t.timeline];
          timeline[action.measureIndex] = action.patternId;
          return { ...t, timeline };
        }),
      };
    case "SET_PLAY_MODE":
      return { ...state, playMode: action.playMode };
    case "SET_LOOP_MEASURE":
      return { ...state, loopMeasureIndex: action.measureIndex };
    case "SET_SONG_TITLE":
      return { ...state, songTitle: action.title };
    case "SET_POSITION":
      return { ...state, currentMeasure: action.measure, currentStep: action.step };
    case "RESTORE_PROJECT":
      return {
        ...state,
        ...action.project,
        playMode: "stopped",
        loopMeasureIndex: null,
        currentMeasure: 0,
        currentStep: 0,
      };
    default:
      return state;
  }
}

export function useDawState() {
  const [state, dispatch] = useReducer(dawReducer, null, createInitialDawState);

  const addTrack = useCallback(
    (instrument: InstrumentKey = "synth") => dispatch({ type: "ADD_TRACK", instrument }),
    []
  );
  const deleteTrack = useCallback(
    (trackId: string) => dispatch({ type: "DELETE_TRACK", trackId }),
    []
  );
  const renameTrack = useCallback(
    (trackId: string, name: string) => dispatch({ type: "RENAME_TRACK", trackId, name }),
    []
  );
  const changeTrackInstrument = useCallback(
    (trackId: string, instrument: InstrumentKey) =>
      dispatch({ type: "CHANGE_TRACK_INSTRUMENT", trackId, instrument }),
    []
  );
  const toggleTrackMute = useCallback(
    (trackId: string) => dispatch({ type: "TOGGLE_TRACK_MUTE", trackId }),
    []
  );
  const setTrackVolume = useCallback(
    (trackId: string, volume: number) =>
      dispatch({ type: "SET_TRACK_VOLUME", trackId, volume }),
    []
  );
  const setBpm = useCallback((bpm: number) => dispatch({ type: "SET_BPM", bpm }), []);
  const setTotalMeasures = useCallback(
    (totalMeasures: number) => dispatch({ type: "SET_TOTAL_MEASURES", totalMeasures }),
    []
  );
  const setActivePattern = useCallback(
    (trackId: string, patternId: string | null) =>
      dispatch({ type: "SET_ACTIVE_PATTERN", trackId, patternId }),
    []
  );
  const createPattern = useCallback(
    (trackId: string) => dispatch({ type: "CREATE_PATTERN", trackId }),
    []
  );
  const renamePattern = useCallback(
    (trackId: string, patternId: string, name: string) =>
      dispatch({ type: "RENAME_PATTERN", trackId, patternId, name }),
    []
  );
  const toggleNote = useCallback(
    (trackId: string, patternId: string, pitch: string, step: number) =>
      dispatch({ type: "TOGGLE_NOTE", trackId, patternId, pitch, step }),
    []
  );
  const paintNote = useCallback(
    (trackId: string, patternId: string, pitch: string, step: number, value: boolean) =>
      dispatch({ type: "PAINT_NOTE", trackId, patternId, pitch, step, value }),
    []
  );
  const clearPattern = useCallback(
    (trackId: string, patternId: string) =>
      dispatch({ type: "CLEAR_PATTERN", trackId, patternId }),
    []
  );
  const placePatternOnTimeline = useCallback(
    (trackId: string, measureIndex: number, patternId: string | null) =>
      dispatch({ type: "PLACE_PATTERN_ON_TIMELINE", trackId, measureIndex, patternId }),
    []
  );
  const setPlayMode = useCallback(
    (playMode: PlayMode) => dispatch({ type: "SET_PLAY_MODE", playMode }),
    []
  );
  const setLoopMeasure = useCallback(
    (measureIndex: number | null) => dispatch({ type: "SET_LOOP_MEASURE", measureIndex }),
    []
  );
  const setSongTitle = useCallback(
    (title: string) => dispatch({ type: "SET_SONG_TITLE", title }),
    []
  );
  const setPosition = useCallback(
    (measure: number, step: number) => dispatch({ type: "SET_POSITION", measure, step }),
    []
  );
  const restoreProject = useCallback(
    (project: unknown) => dispatch({ type: "RESTORE_PROJECT", project }),
    []
  );

  const activeTrack = useMemo(
    () => state.tracks.find((t) => t.id === state.activeTrackId) || null,
    [state.tracks, state.activeTrackId]
  );

  const activePattern = useMemo(() => {
    if (!activeTrack || !state.activePatternId) return null;
    return activeTrack.patterns[state.activePatternId] || null;
  }, [activeTrack, state.activePatternId]);

  return {
    state,
    activeTrack,
    activePattern,
    addTrack,
    deleteTrack,
    renameTrack,
    changeTrackInstrument,
    toggleTrackMute,
    setTrackVolume,
    setBpm,
    setTotalMeasures,
    setActivePattern,
    createPattern,
    renamePattern,
    toggleNote,
    paintNote,
    clearPattern,
    placePatternOnTimeline,
    setPlayMode,
    setLoopMeasure,
    setPosition,
    setSongTitle,
    restoreProject,
  };
}
