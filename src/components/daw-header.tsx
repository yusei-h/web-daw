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
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 lg:gap-8">
        <div>
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400 flex items-center gap-2">
            <span>🎹</span> {t("header.title")}
          </h1>
          <p className="text-gray-400 text-sm mt-1 font-medium">
            {t("header.subtitle")}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex bg-gray-800 p-1 rounded-lg border border-gray-700">
            <button
              onClick={() => setLocale("ja")}
              className={`px-3 py-1.5 text-[10px] font-extrabold rounded-md transition-all ${
                locale === "ja" ? "bg-blue-600 text-white shadow-sm" : "text-gray-400 hover:text-gray-200"
              }`}
            >
              JA
            </button>
            <button
              onClick={() => setLocale("en")}
              className={`px-3 py-1.5 text-[10px] font-extrabold rounded-md transition-all ${
                locale === "en" ? "bg-blue-600 text-white shadow-sm" : "text-gray-400 hover:text-gray-200"
              }`}
            >
              EN
            </button>
          </div>
          
          <a
            href="https://github.com/yusei-h/web-daw"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-gray-300 hover:text-white transition-all text-xs font-bold group shadow-sm h-[38px]"
          >
            <svg className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
            </svg>
            <span>GitHub</span>
          </a>
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
