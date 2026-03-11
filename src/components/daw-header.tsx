"use client";

import { PlayMode } from "@/types/daw";
import { useI18n } from "@/contexts/i18n-context";

interface DawHeaderProps {
  bpm: number;
  totalMeasures: number;
  playMode: PlayMode;
  onSetBpm: (bpm: number) => void;
  onSetTotalMeasures: (measures: number) => void;
  onTogglePlay: () => void;
}

export function DawHeader({
  bpm,
  totalMeasures,
  playMode,
  onSetBpm,
  onSetTotalMeasures,
  onTogglePlay,
}: DawHeaderProps) {
  const isPlaying = playMode === "main";
  const { t, locale, setLocale } = useI18n();

  return (
    <header className="flex-none flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-gray-700 pb-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400 flex items-center gap-2">
            <span>🎹</span> {t("header.title")}
          </h1>
          <p className="text-gray-400 text-sm mt-1 font-medium">
            {t("header.subtitle")}
          </p>
        </div>
        <div className="flex bg-gray-800 p-1 rounded-lg border border-gray-700 self-start">
          <button
            onClick={() => setLocale("ja")}
            className={`px-3 py-1 text-[10px] font-bold rounded-md transition-colors ${
              locale === "ja" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"
            }`}
          >
            JA
          </button>
          <button
            onClick={() => setLocale("en")}
            className={`px-3 py-1 text-[10px] font-bold rounded-md transition-colors ${
              locale === "en" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"
            }`}
          >
            EN
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 bg-gray-800 p-2.5 rounded-xl border border-gray-700 shadow-inner">
        <button
          onClick={onTogglePlay}
          className={`font-bold py-2 px-8 rounded-lg transition-all shadow-lg flex items-center gap-2 justify-center transform active:scale-95 ${
            isPlaying
              ? "bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-white"
              : "bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white"
          }`}
        >
          <span className="text-xl leading-none">{isPlaying ? "■" : "▶"}</span>
          <span>{isPlaying ? t("header.stop") : t("header.play")}</span>
        </button>

        <div className="flex items-center gap-2 px-3 border-l border-gray-700">
          <label className="text-xs text-gray-400 font-bold tracking-wider">
            {t("header.bpm")}
          </label>
          <input
            type="number"
            value={bpm}
            onChange={(e) => onSetBpm(parseInt(e.target.value))}
            min="60"
            max="240"
            className="w-16 bg-gray-900 border border-gray-600 rounded-md px-2 py-1.5 text-white text-center text-sm font-mono focus:border-blue-500 focus:outline-none transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 px-3 border-l border-gray-700">
          <label className="text-xs text-gray-400 font-bold tracking-wider">
            {t("header.measures")}
          </label>
          <input
            type="number"
            value={totalMeasures}
            onChange={(e) => onSetTotalMeasures(parseInt(e.target.value))}
            min="1"
            max="32"
            className="w-16 bg-gray-900 border border-gray-600 rounded-md px-2 py-1.5 text-white text-center text-sm font-mono focus:border-blue-500 focus:outline-none transition-colors"
          />
        </div>
      </div>
    </header>
  );
}
