import { TemplateData } from "@/types/daw";
import { buildTrack } from "./builder";

export const rockTemplate: TemplateData = {
  songTitle: "Indie Rock",
  bpm: 140,
  totalMeasures: 8,
  tracks: [
    buildTrack("t_rock_drum", "Drum Kit", "drum", undefined, {
      p1: {
        name: "8-Beat",
        gridSteps: {
          Kick:  "x.....x.x.......",
          Snare: "....x.......x...",
          HiHat: "x.x.x.x.x.x.x.x.",
        },
      },
      p2: {
        name: "Chorus Beat",
        gridSteps: {
          Kick:  "x.....x.x.x.....",
          Snare: "....x.......x...",
          HiHat: "x.x.x.x.x.x.x.x.",
          Crash: "x...............",
        },
      },
      p_fill: {
        name: "Drum Fill",
        gridSteps: {
          Kick:  "x...x...x.......",
          Snare: "x.x.x...x.x.xx..",
          Crash: "x...............",
        },
      }
    }, ["p1", "p1", "p1", "p_fill", "p2", "p2", "p2", "p2"]),

    buildTrack("t_rock_bass", "Electric Bass", "bass", undefined, {
      p1: {
        name: "Driving E",
        gridSteps: {
          "E4": "x.x.x.x.x.x.x.x.",
        },
      },
      p2: {
        name: "Change A",
        gridSteps: {
          "A4": "x.x.x.x.x.x.x.x.",
        },
      },
      p3: {
        name: "Change B",
        gridSteps: {
          "B4": "x...x...x.x.x...",
        },
      }
    }, ["p1", "p1", "p2", "p3", "p1", "p1", "p2", "p3"]),

    buildTrack("t_rock_eg", "Rhythm Guitar", "electricGuitar", undefined, {
      p1: {
        name: "Power E",
        gridSteps: {
          "E3": "x.x.x.x.x.x.x.x.",
          "B3": "x.x.x.x.x.x.x.x.",
        },
      },
      p2: {
        name: "Power A",
        gridSteps: {
          "A3": "x.x.x.x.x.x.x.x.",
          "E4": "x.x.x.x.x.x.x.x.",
        },
      },
      p3: {
        name: "Power B",
        gridSteps: {
          "B3": "x...x...x.x.x...",
          "F#4":"x...x...x.x.x...",
        },
      }
    }, ["p1", "p1", "p2", "p3", "p1", "p1", "p2", "p3"]),

    buildTrack("t_rock_ag", "Acoustic Strum", "acousticGuitar", undefined, {
      p1: {
        name: "Strum E",
        gridSteps: {
          "E3": "x...x.x.x...x.x.",
          "G#3":"x...x.x.x...x.x.",
          "B3": "x...x.x.x...x.x.",
          "E4": "x...x.x.x...x.x.",
        },
      },
    }, ["p1", "p1", "p1", "p1", "p1", "p1", "p1", "p1"]),

    buildTrack("t_rock_lead", "Lead Guitar", "electricGuitar", undefined, {
      p1: {
        name: "Solo Lick",
        gridSteps: {
          "G#4":"x.......x.......",
          "B4": "....x.......x...",
          "E5": "......x.......x.",
        },
      },
    }, [null, null, null, null, "p1", "p1", "p1", "p1"]),
  ],
};
