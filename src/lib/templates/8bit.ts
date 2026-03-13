import { TemplateData } from "@/types/daw";
import { buildTrack } from "./builder";

export const eightBitTemplate: TemplateData = {
  songTitle: "8-Bit Adventure",
  bpm: 160,
  totalMeasures: 8,
  tracks: [
    buildTrack("t_8bit_drum", "Noise Kit", "drum", undefined, {
      p1: {
        name: "Fast Beat",
        gridSteps: {
          Kick:  "x...x...x...x...",
          Snare: "....x.......x...",
          HiHat: "x.x.x.x.x.x.x.x.",
        },
      },
    }, ["p1", "p1", "p1", "p1", "p1", "p1", "p1", "p1"]),

    buildTrack("t_8bit_bass", "Square Bass", "pluck", undefined, { 
      p1: {
        name: "Bass Run",
        gridSteps: {
          "C3": "x.x.x.x.x.x.x.x.",
        },
      },
      p2: {
        name: "Bass Run 2",
        gridSteps: {
          "D#3": "x.x.x.x.x.x.x.x.",
        },
      },
      p3: {
        name: "Bass Run 3",
        gridSteps: {
          "F3": "x.x.x.x.x.x.x.x.",
        },
      }
    }, ["p1", "p1", "p2", "p2", "p1", "p1", "p3", "p3"]),

    buildTrack("t_8bit_lead", "Arp Lead", "synth", undefined, {
      p1: {
        name: "Arpeggio 1",
        gridSteps: {
          "C5": "x.......x.......",
          "D#5":"..x.......x.....",
          "G5": "....x.......x...",
          "A#5":"......x.......x.",
        },
      },
      p2: {
        name: "Arpeggio 2",
        gridSteps: {
          "D#5": "x.......x.......",
          "F#5":"..x.......x.....",
          "A#5":"....x.......x...",
          "C#6":"......x.......x.",
        },
      },
      p3: {
        name: "Arpeggio 3",
        gridSteps: {
          "F5": "x.......x.......",
          "G#5":"..x.......x.....",
          "C6": "....x.......x...",
          "D#6":"......x.......x.",
        },
      }
    }, ["p1", "p1", "p2", "p2", "p1", "p1", "p3", "p3"]),
  ],
};
