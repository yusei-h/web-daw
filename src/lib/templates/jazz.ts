import { TemplateData } from "@/types/daw";
import { buildTrack } from "./builder";

export const jazzTemplate: TemplateData = {
  songTitle: "Midnight Jazz",
  bpm: 110,
  totalMeasures: 8,
  tracks: [
    buildTrack("t_jazz_drum", "Jazz Kit", "drum", undefined, {
      p1: {
        name: "Swing Ride",
        gridSteps: {
          Kick:  "x...x.......x...",
          Snare: "......x.......x.",
          HiHat: "x.x.x.x.x.x.x.x.", // Simple swing representation
          OpenHat:"....x...........x"
        },
      },
    }, ["p1", "p1", "p1", "p1", "p1", "p1", "p1", "p1"]),

    buildTrack("t_jazz_bass", "Upright Bass", "bass", undefined, {
      p1: {
        name: "Walking 1",
        gridSteps: {
          "C4": "x.......x.......",
          "E4": "....x.......x...",
          "G4": "........x.......",
          "A#4":"............x...", 
        },
      },
      p2: {
        name: "Walking 2",
        gridSteps: {
          "F3": "x.......x.......",
          "A3": "....x.......x...",
          "C4": "........x.......",
          "D#4":"............x...",
        },
      }
    }, ["p1", "p1", "p2", "p2", "p1", "p1", "p2", "p2"]),

    buildTrack("t_jazz_piano", "Piano Comping", "piano", undefined, {
      p1: {
        name: "Comp 1",
        gridSteps: {
          "C4": "..x.......x.....",
          "E4": "..x.......x.....",
          "G4": "..x.......x.....",
          "A#4":"..x.......x.....", 
        },
      },
      p2: {
        name: "Comp 2",
        gridSteps: {
          "F3": "..x.......x.....",
          "A3": "..x.......x.....",
          "C4": "..x.......x.....",
          "D#4":"..x.......x.....",
        },
      }
    }, ["p1", "p1", "p2", "p2", "p1", "p1", "p2", "p2"]),

    buildTrack("t_jazz_brass", "Brass Section", "brass", undefined, {
      p1: {
        name: "Horn Riff",
        gridSteps: {
          "C4": "x...............",
          "G4": "x.......x.x.....",
          "A#4":"........x.x.....",
        },
      },
      p2: {
        name: "Horn Response",
        gridSteps: {
          "C5": "......x...x.....",
          "A#4":"............x...",
        },
      }
    }, [null, null, null, null, "p1", "p2", "p1", "p2"]),
  ],
};
