import { Track, Pattern, PlayMode } from "@/types/daw";
import { INSTRUMENTS } from "@/lib/instruments";
import { DRUM_PITCHES, MELODIC_PITCHES, NUM_STEPS } from "@/lib/constants";
import React, { useRef, useEffect } from "react";
import { useI18n } from "@/contexts/i18n-context";

interface PianoRollProps {
  activeTrack: Track | null;
  activePattern: Pattern | null;
  currentStep: number | null;
  playMode: PlayMode;
  onToggleNote: (
    trackId: string,
    patternId: string,
    pitch: string,
    step: number
  ) => void;
  onPaintNote: (
    trackId: string,
    patternId: string,
    pitch: string,
    step: number,
    value: boolean
  ) => void;
  onCreatePattern: (trackId: string) => void;
  onClearPattern: (trackId: string, patternId: string) => void;
  onTogglePlayPattern: () => void;
}

export function PianoRoll({
  activeTrack,
  activePattern,
  currentStep,
  playMode,
  onToggleNote,
  onPaintNote,
  onCreatePattern,
  onClearPattern,
  onTogglePlayPattern,
}: PianoRollProps) {
  const isDraggingRef = useRef(false);
  const paintValueRef = useRef(true);
  const { t } = useI18n();

  useEffect(() => {
    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };
    window.addEventListener("mouseup", handleMouseUp);
    return () => window.removeEventListener("mouseup", handleMouseUp);
  }, []);

  if (!activeTrack || !activePattern) {
    return (
      <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-2xl overflow-hidden min-h-[300px] flex items-center justify-center">
        <div className="text-center p-12 text-gray-500 text-sm flex flex-col items-center gap-2">
          <span className="text-4xl">👆</span>
          <span>{t("pianoRoll.selectPattern")}</span>
        </div>
      </div>
    );
  }

  const instConfig = INSTRUMENTS[activeTrack.instrument];
  const pitches =
    instConfig.type === "percussive" ? DRUM_PITCHES : MELODIC_PITCHES;

  const handleMouseDown = (pitch: string, step: number) => {
    isDraggingRef.current = true;
    const nextVal = !activePattern.grid[pitch][step];
    paintValueRef.current = nextVal;
    onToggleNote(activeTrack.id, activePattern.id, pitch, step);
  };

  const handleMouseEnter = (pitch: string, step: number) => {
    if (isDraggingRef.current) {
      onPaintNote(
        activeTrack.id,
        activePattern.id,
        pitch,
        step,
        paintValueRef.current
      );
    }
  };

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-2xl flex flex-col overflow-hidden">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center p-3.5 border-b border-gray-700 bg-gray-900/50 gap-3">
        <h2 className="font-bold text-sm text-blue-400 flex items-center gap-2">
          <span className="text-lg">{instConfig.icon}</span>
          <span className="text-gray-200">{activeTrack.name}</span>
          <span className="text-gray-500 mx-1">/</span>
          <span
            className={`cursor-default px-2 py-0.5 rounded border border-opacity-50 flex items-center gap-1 ${instConfig.theme}`}
            style={{
              backgroundColor: "var(--theme-color)",
              borderColor: "var(--theme-border)",
              color: "white",
            } as any}
          >
            {activePattern.name}
          </span>
          <span className="text-xs text-gray-400 font-normal ml-2">
            {t("pianoRoll.editing")}
          </span>
        </h2>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={onTogglePlayPattern}
            className={`text-xs font-bold py-1.5 px-4 rounded-lg border transition-all flex items-center gap-1 shadow ${
              playMode === "pattern"
                ? "bg-yellow-700/80 hover:bg-yellow-600 text-yellow-100 border-yellow-600"
                : "bg-green-700/80 hover:bg-green-600 text-green-100 border-green-600"
            }`}
          >
            {playMode === "pattern"
              ? `■ ${t("common.stop")}`
              : `▶ ${t("pianoRoll.playPattern")}`}
          </button>
          <button
            onClick={() => onCreatePattern(activeTrack.id)}
            className="text-xs font-bold bg-gray-700 hover:bg-gray-600 text-white py-1.5 px-4 rounded-lg border border-gray-600 transition-colors flex items-center gap-1 shadow"
          >
            {t("pianoRoll.createPattern")}
          </button>
          <button
            onClick={() => onClearPattern(activeTrack.id, activePattern.id)}
            className="text-xs font-bold bg-red-900/80 hover:bg-red-800 text-red-200 py-1.5 px-4 rounded-lg border border-red-800 transition-colors shadow"
          >
            {t("pianoRoll.clearPattern")}
          </button>
        </div>
      </div>

      <div className="overflow-y-auto max-h-[55vh] p-4 bg-gray-900 custom-scrollbar">
        <div className={`piano-roll themed ${instConfig.theme}`}>
          {pitches.map((pitch) => (
            <React.Fragment key={pitch}>
              <div
                className={`key-label ${
                  instConfig.type === "percussive"
                    ? "drum-key"
                    : pitch.includes("#")
                    ? "black-key"
                    : "white-key"
                }`}
              >
                {pitch}
              </div>
              {Array.from({ length: NUM_STEPS }).map((_, step) => (
                <div
                  key={step}
                  className={`cell ${
                    activePattern.grid[pitch][step] ? "active" : ""
                  } ${currentStep === step ? "playing-col" : ""}`}
                  onMouseDown={() => handleMouseDown(pitch, step)}
                  onMouseEnter={() => handleMouseEnter(pitch, step)}
                />
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
