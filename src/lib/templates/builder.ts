import { Track, InstrumentKey, PatternGrid, TemplateData } from "@/types/daw";
import { MELODIC_PITCHES, DRUM_PITCHES, NUM_STEPS } from "../constants";
import { INSTRUMENTS } from "../instruments";

/**
 * ユーティリティ:
 * "x..." などの文字列を使って簡単にグリッドを生成する
 * x または o が true になり、 . または - または 空白 は false
 */
export function buildGrid(
  type: "melodic" | "percussive",
  stepStrings: Record<string, string>
): PatternGrid {
  const pitches = type === "percussive" ? DRUM_PITCHES : MELODIC_PITCHES;
  const grid: PatternGrid = {};

  pitches.forEach((p) => {
    const row = new Array(NUM_STEPS).fill(false);
    const patternStr = stepStrings[p] || "";
    // パターン文字列の長さ分ループし、x か o なら true
    for (let i = 0; i < NUM_STEPS; i++) {
      if (patternStr[i] === "x" || patternStr[i] === "o" || patternStr[i] === "1") {
        row[i] = true;
      }
    }
    grid[p] = row;
  });
  return grid;
}

export function buildTrack(
  id: string,
  name: string,
  instrument: InstrumentKey,
  volume: number | undefined,
  patterns: Record<string, { name: string; gridSteps: Record<string, string> }>,
  timeline: (string | null)[]
): Track {
  const trackPatterns: Track["patterns"] = {};
  
  Object.entries(patterns).forEach(([pId, pData]) => {
    trackPatterns[pId] = {
      id: pId,
      name: pData.name,
      grid: buildGrid(INSTRUMENTS[instrument].type, pData.gridSteps),
    };
  });

  const finalVolume = volume !== undefined ? volume : INSTRUMENTS[instrument].defaultVolume;

  return {
    id,
    name,
    instrument,
    mute: false,
    volume: finalVolume,
    patterns: trackPatterns,
    timeline,
    patternCounter: Object.keys(patterns).length, // 簡易
  };
}
