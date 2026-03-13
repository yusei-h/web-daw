import { TemplateData } from "@/types/daw";
import { buildTrack } from "./builder";

export const basicTemplate: TemplateData = {
  songTitle: "Basic Beat",
  bpm: 120,
  totalMeasures: 8,
  tracks: [
    buildTrack("t_basic_drum", "ドラム", "drum", undefined, {
      p1: {
        name: "基本ビート",
        gridSteps: {
          HiHat: "x.x.x.x.x.x.x.x.",
          Snare: "....x.......x...",
          Kick:  "x.......x.......",
        },
      },
      p2: {
        name: "フィルイン",
        gridSteps: {
          HiHat: "x.x.x.x.x.......",
          Snare: "....x.......x...",
          Kick:  "x.......x...x...",
          TomHi: "..........x.....",
          TomMid:"............x...",
          TomLow:"..............x.",
        },
      },
    }, ["p1", "p1", "p1", "p2", "p1", "p1", "p1", "p2"]),
  ],
};
