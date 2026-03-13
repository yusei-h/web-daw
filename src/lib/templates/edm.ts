import { TemplateData } from "@/types/daw";
import { buildTrack } from "./builder";

export const edmTemplate: TemplateData = {
  songTitle: "EDM Anthem",
  bpm: 128,
  totalMeasures: 8,
  tracks: [
    buildTrack("t_edm_drum", "Drums", "drum", undefined, {
      p_build: {
        name: "Build-up",
        gridSteps: {
          Kick:  "x...x...x...x...",
          Snare: "....x.......x...",
        },
      },
      p_fill: {
        name: "Fill",
        gridSteps: {
          Kick:  "x.x.x.x.x.x.xx..",
          Snare: "x.x.x.x.x.x.xx..",
        },
      },
      p_drop: {
        name: "Drop",
        gridSteps: {
          Kick:  "x...x...x...x...",
          Snare: "....x.......x...",
          HiHat: "..x...x...x...x.",
          OpenHat:"......x.......x."
        },
      }
    }, ["p_build", "p_build", "p_build", "p_fill", "p_drop", "p_drop", "p_drop", "p_drop"]),

    buildTrack("t_edm_bass", "Synth Bass", "bass", undefined, {
      p1: {
        name: "Bassline 1",
        gridSteps: {
          "C3": "..x...x...x...x.",
          "C4": "....x.......x...",
        },
      },
      p2: {
        name: "Bassline 2",
        gridSteps: {
          "D#3":"..x...x...x...x.",
          "D#4":"....x.......x...",
        },
      }
    }, ["p1", "p1", "p1", "p1", "p1", "p1", "p2", "p2"]),

    buildTrack("t_edm_pad", "Pluck Chords", "pluck", undefined, {
      p1: {
        name: "Chords Cm",
        gridSteps: {
          "C4": "x..x..x..x..x...",
          "D#4":"x..x..x..x..x...",
          "G4": "x..x..x..x..x...",
        },
      },
      p2: {
        name: "Chords D#",
        gridSteps: {
          "D#4":"x..x..x..x..x...",
          "G4": "x..x..x..x..x...",
          "A#4":"x..x..x..x..x...",
        },
      }
    }, ["p1", "p1", "p1", "p1", "p1", "p1", "p2", "p2"]),

    buildTrack("t_edm_lead", "Lead Synth", "synth", undefined, {
      p1: {
        name: "Melody 1",
        gridSteps: {
          "C5": "x..x..x..x..x...",
          "G4": ".x..x.......x...",
        },
      },
      p2: {
        name: "Melody 2",
        gridSteps: {
          "D#5": "x..x..x..x..x...",
          "A#4": ".x..x.......x...",
        },
      }
    }, [null, null, null, null, "p1", "p1", "p2", "p2"]),
  ],
};
