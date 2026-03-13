import { TemplateData } from "@/types/daw";
import { buildTrack } from "./builder";

export const lofiTemplate: TemplateData = {
  songTitle: "Lo-Fi Chill",
  bpm: 80,
  totalMeasures: 8,
  tracks: [
    buildTrack("t_lofi_drum", "Vinyl Kit", "drum", undefined, {
      p1: {
        name: "Chill Beat",
        gridSteps: {
          Kick:  "x.......x.x.....",
          Snare: "....x.......x...",
          HiHat: "x.x.x.x.x.x.x.x.",
        },
      },
      p2: {
        name: "Fill Beat",
        gridSteps: {
          Kick:  "x.......x.x.....",
          Snare: "....x.......xx..",
          HiHat: "x.x.x.x.x.......",
          OpenHat: "..........x....."
        },
      }
    }, ["p1", "p1", "p1", "p2", "p1", "p1", "p1", "p2"]),

    buildTrack("t_lofi_ep", "Electric Piano", "piano", undefined, {
      p1: {
        name: "Chords 1", // Cmaj7
        gridSteps: {
          "C4": "x...............",
          "E4": "x...............",
          "G4": "x...............",
          "B4": "x...............",
        },
      },
      p2: {
        name: "Chords 2", // Amin7
        gridSteps: {
          "A3": "x...............",
          "C4": "x...............",
          "E4": "x...............",
          "G4": "x...............",
        },
      },
      p3: {
        name: "Chords 3", // Fmaj7
        gridSteps: {
          "F3": "x...............",
          "A3": "x...............",
          "C4": "x...............",
          "E4": "x...............",
        },
      },
      p4: {
        name: "Chords 4", // G7 (Turnaround)
        gridSteps: {
          "G3": "x...............",
          "B3": "x...............",
          "D4": "x...............",
          "F4": "x...............",
        },
      }
    }, ["p1", "p2", "p3", "p4", "p1", "p2", "p3", "p4"]),

    buildTrack("t_lofi_bass", "Sub Bass", "bass", undefined, {
      p1: { name: "Root C", gridSteps: { "C4": "x.......x.x....." } },
      p2: { name: "Root A", gridSteps: { "A4": "x.......x.x....." } },
      p3: { name: "Root F", gridSteps: { "F4": "x.......x.x....." } },
      p4: { name: "Root G", gridSteps: { "G4": "x.......x.x....." } }
    }, ["p1", "p2", "p3", "p4", "p1", "p2", "p3", "p4"]),

    buildTrack("t_lofi_pad", "Warm Pad", "pad", undefined, {
      p1: {
        name: "Atmosphere",
        gridSteps: {
          "C5": "x...............",
          "G5": "x...............",
        },
      },
    }, [null, null, null, null, "p1", "p1", "p1", "p1"]),
  ],
};
