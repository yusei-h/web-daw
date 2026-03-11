import { Track, InstrumentKey } from "@/types/daw";
import { INSTRUMENTS } from "@/lib/instruments";
import React from "react";
import { useI18n } from "@/contexts/i18n-context";

interface ArrangerTimelineProps {
  tracks: Track[];
  activeTrackId: string | null;
  activePatternId: string | null;
  totalMeasures: number;
  currentMeasure: number | null;
  onAddTrack: (instrument: InstrumentKey) => void;
  onDeleteTrack: (trackId: string) => void;
  onRenameTrack: (trackId: string, name: string) => void;
  onChangeInstrument: (trackId: string, instrument: InstrumentKey) => void;
  onToggleMute: (trackId: string) => void;
  onSetVolume: (trackId: string, volume: number) => void;
  onSetActivePattern: (trackId: string, patternId: string | null) => void;
  onPlacePattern: (
    trackId: string,
    measureIndex: number,
    patternId: string | null
  ) => void;
  onRenamePattern: (trackId: string, patternId: string, name: string) => void;
  onSetLoopMeasure: (measureIndex: number | null) => void;
  loopMeasureIndex: number | null;
}

export function ArrangerTimeline({
  tracks,
  activeTrackId,
  activePatternId,
  totalMeasures,
  currentMeasure,
  onAddTrack,
  onDeleteTrack,
  onRenameTrack,
  onChangeInstrument,
  onToggleMute,
  onSetVolume,
  onSetActivePattern,
  onPlacePattern,
  onRenamePattern,
  onSetLoopMeasure,
  loopMeasureIndex,
}: ArrangerTimelineProps) {
  const { t } = useI18n();

  const handleDragStart = (
    e: React.DragEvent,
    trackId: string,
    measureIndex: number
  ) => {
    const track = tracks.find((t) => t.id === trackId);
    const patternId = track?.timeline[measureIndex];
    if (!patternId) return;

    onSetActivePattern(trackId, patternId);
    e.dataTransfer.setData(
      "application/json",
      JSON.stringify({ trackId, fromMeasure: measureIndex })
    );
    e.dataTransfer.effectAllowed = "copyMove";
  };

  const handleDrop = (
    e: React.DragEvent,
    trackId: string,
    measureIndex: number
  ) => {
    e.preventDefault();
    const dataStr = e.dataTransfer.getData("application/json");
    if (!dataStr) return;

    try {
      const { trackId: fromTrackId, fromMeasure } = JSON.parse(dataStr);
      if (fromTrackId !== trackId) {
        return;
      }

      const track = tracks.find((t) => t.id === trackId);
      const patternId = track?.timeline[fromMeasure];
      if (!patternId) return;

      if (!e.altKey) {
        onPlacePattern(trackId, fromMeasure, null);
      }
      onPlacePattern(trackId, measureIndex, patternId);
    } catch (err) {}
  };

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-2xl flex flex-col overflow-hidden">
      <div className="flex flex-wrap justify-between items-center p-3.5 border-b border-gray-700 bg-gray-900/50">
        <div className="flex items-center gap-4">
          <h2 className="font-bold text-sm text-gray-200 flex items-center gap-2">
            <span className="text-lg">🎼</span> {t("arranger.title")}
          </h2>
          <div className="hidden md:flex gap-3 text-[11px] text-gray-400 bg-gray-900 px-3 py-1 rounded-full border border-gray-700">
            <span>{t("arranger.helpClick")}</span>
            <span className="border-l border-gray-700 pl-3">
              {t("arranger.helpDrag")}
            </span>
          </div>
        </div>
        <button
          onClick={() => onAddTrack("synth")}
          className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-1.5 px-4 rounded-lg flex items-center gap-1 transition-colors shadow"
        >
          <span className="text-lg leading-none">+</span> {t("arranger.addTrack")}
        </button>
      </div>

      <div className="overflow-x-auto bg-gray-900 p-1 custom-scrollbar">
        <div
          className="timeline-grid pb-2"
          style={{ "--total-measures": totalMeasures } as any}
        >
          {/* Header Row */}
          <div className="tl-track-head bg-transparent border-none"></div>
          {Array.from({ length: totalMeasures }).map((_, m) => (
            <div
              key={m}
              onClick={() => {
                if (loopMeasureIndex === m) {
                  onSetLoopMeasure(null);
                } else {
                  onSetLoopMeasure(m);
                }
              }}
              className={`tl-header tl-header-interactive group cursor-pointer transition-colors ${
                loopMeasureIndex === m
                  ? "bg-yellow-600/50 text-white"
                  : "hover:bg-gray-700"
              }`}
            >
              <span>{m + 1}</span>
              <span className="ml-1 opacity-0 group-hover:opacity-100 text-[10px]">
                {loopMeasureIndex === m ? "■" : "▶"}
              </span>
            </div>
          ))}

          {/* Tracks */}
          {tracks.map((track) => {
            const instConfig = INSTRUMENTS[track.instrument];
            return (
              <React.Fragment key={track.id}>
                {/* Track Header */}
                <div
                  className={`tl-track-head transition-colors themed-border ${
                    instConfig.theme
                  } ${track.id === activeTrackId ? "bg-gray-800" : ""}`}
                >
                  <div className="flex justify-between items-center gap-2">
                    <div className="flex items-center gap-1.5 flex-1 min-w-0">
                      <span className="text-sm">{instConfig.icon}</span>
                      <input
                        value={track.name}
                        onChange={(e) => onRenameTrack(track.id, e.target.value)}
                        className="bg-transparent text-sm font-bold text-white w-full focus:outline-none focus:border-b border-gray-500 truncate"
                        placeholder={t("arranger.renameTrackPrompt")}
                      />
                    </div>
                    <button
                      onClick={() => onToggleMute(track.id)}
                      className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold transition-colors shrink-0 ${
                        track.mute
                          ? "bg-yellow-500 text-gray-900"
                          : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      }`}
                    >
                      M
                    </button>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <select
                      value={track.instrument}
                      onChange={(e) =>
                        onChangeInstrument(track.id, e.target.value as InstrumentKey)
                      }
                      className="bg-gray-900 border border-gray-600 rounded-md text-[11px] text-gray-300 p-1 w-32 focus:outline-none focus:border-blue-500"
                    >
                      {Object.entries(INSTRUMENTS).map(([key, config]) => (
                        <option key={key} value={key}>
                          {config.icon} {t(`instruments.${key}`)}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => onDeleteTrack(track.id)}
                      className="text-gray-500 hover:text-red-400 p-1 rounded hover:bg-gray-800 transition-colors shrink-0"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px]">🔈</span>
                    <input
                      type="range"
                      min="-30"
                      max="10"
                      value={track.volume}
                      onChange={(e) =>
                        onSetVolume(track.id, parseFloat(e.target.value))
                      }
                      className="flex-1"
                    />
                  </div>
                </div>

                {/* Timeline Cells */}
                {track.timeline.map((pId, m) => (
                  <div
                    key={m}
                    className={`tl-cell ${
                      currentMeasure === m ? "playing-measure" : ""
                    }`}
                    onClick={() => {
                      if (!activeTrackId || activeTrackId !== track.id) {
                        onSetActivePattern(track.id, Object.keys(track.patterns)[0]);
                      }
                      if (activePatternId && track.patterns[activePatternId]) {
                        onPlacePattern(track.id, m, activePatternId);
                      }
                    }}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => handleDrop(e, track.id, m)}
                  >
                    {pId && track.patterns[pId] && (
                      <div
                        draggable
                        onDragStart={(e) => handleDragStart(e, track.id, m)}
                        onMouseDown={(e) => {
                          e.stopPropagation();
                          onSetActivePattern(track.id, pId);
                        }}
                        onDoubleClick={(e) => {
                          e.stopPropagation();
                          const newName = prompt(
                            t("arranger.renamePatternPrompt"),
                            track.patterns[pId].name
                          );
                          if (newName) onRenamePattern(track.id, pId, newName);
                        }}
                        onContextMenu={(e) => {
                          e.preventDefault();
                          onPlacePattern(track.id, m, null);
                        }}
                        className={`tl-clip themed ${instConfig.theme} ${
                          activeTrackId === track.id && activePatternId === pId
                            ? "active-clip"
                            : ""
                        }`}
                      >
                        <span className="opacity-80">{instConfig.icon}</span>
                        <span className="truncate">{track.patterns[pId].name}</span>
                      </div>
                    )}
                  </div>
                ))}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}
