import React from "react";
import { useI18n } from "@/contexts/i18n-context";

interface StoragePanelProps {
  songTitle: string;
  onSetSongTitle: (title: string) => void;
  onSave: () => void;
  onLoad: (project: unknown) => void;
  savedSongs: any[];
  onDelete: (id: string) => void;
}

export function StoragePanel({
  songTitle,
  onSetSongTitle,
  onSave,
  onLoad,
  savedSongs,
  onDelete,
}: StoragePanelProps) {
  const { t } = useI18n();

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 p-5 shadow-xl flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between border-b border-gray-700 pb-3 gap-4">
        <h2 className="text-sm font-bold text-gray-200 flex items-center gap-2">
          <span className="text-lg">💾</span> {t("storage.title")}
        </h2>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <input
            type="text"
            value={songTitle}
            onChange={(e) => onSetSongTitle(e.target.value)}
            placeholder={t("storage.placeholder")}
            className="flex-1 sm:w-48 bg-gray-900 text-white text-xs p-2 rounded-md border border-gray-600 focus:outline-none focus:border-blue-500 transition-colors"
          />
          <button
            onClick={onSave}
            className="bg-blue-600 hover:bg-blue-500 text-white text-xs py-2 px-4 rounded-md transition-colors shadow font-bold whitespace-nowrap"
          >
            {t("storage.save")}
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-2 max-h-32 overflow-y-auto pr-2 custom-scrollbar">
        {savedSongs.length === 0 ? (
          <p className="text-xs text-gray-500 text-center py-4 bg-gray-900/50 rounded-lg border border-dashed border-gray-700">
            {t("storage.noSongs")}
          </p>
        ) : (
          savedSongs.map((song) => (
            <div
              key={song.id}
              className="flex items-center justify-between bg-gray-900/80 p-2.5 rounded-lg border border-gray-700 hover:border-gray-500 transition-colors"
            >
              <div>
                <div className="text-sm text-white font-bold truncate max-w-[150px] md:max-w-[200px]">
                  {song.title}
                </div>
                <div className="text-[10px] text-gray-400 mt-0.5">{song.date}</div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => onLoad(song.data)}
                  className="text-[11px] bg-green-700/80 hover:bg-green-600 text-white py-1.5 px-3 rounded-md transition-colors font-bold shadow"
                >
                  {t("storage.load")}
                </button>
                <button
                  onClick={() => {
                    if (confirm(t("storage.confirmDelete"))) {
                      onDelete(song.id);
                    }
                  }}
                  className="text-[11px] text-gray-500 hover:text-red-400 py-1.5 px-2 rounded-md transition-colors hover:bg-gray-800"
                >
                  ✕
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
