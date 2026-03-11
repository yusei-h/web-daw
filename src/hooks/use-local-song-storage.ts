"use client";

import { useState, useEffect, useCallback } from "react";
import { DawState, SavedSong } from "@/types/daw";
import { STORAGE_KEY } from "@/lib/constants";
import { generateProjectData } from "@/lib/daw-utils";

export function useLocalSongStorage() {
  const [savedSongs, setSavedSongs] = useState<SavedSong[]>([]);

  const loadSavedSongs = useCallback(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSavedSongs(JSON.parse(stored));
      }
    } catch (err) {
      console.error("Failed to load songs from localStorage", err);
    }
  }, []);

  useEffect(() => {
    loadSavedSongs();
  }, [loadSavedSongs]);

  const saveSong = useCallback((state: DawState) => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const currentList: SavedSong[] = stored ? JSON.parse(stored) : [];
      
      const projectData = generateProjectData(state);
      const newSong: SavedSong = {
        id: "s_" + Date.now(),
        title: state.songTitle || "無題の曲",
        date: new Date().toLocaleString("ja-JP"),
        data: projectData as any,
      };

      const newList = [newSong, ...currentList].slice(0, 20); // 最大20件
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
      setSavedSongs(newList);
      alert("ブラウザに保存しました。");
    } catch (err) {
      alert("保存に失敗しました。");
    }
  }, []);

  const deleteSong = useCallback((id: string) => {
    if (!confirm("この曲を削除しますか？")) return;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const currentList: SavedSong[] = JSON.parse(stored);
        const newList = currentList.filter(s => s.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
        setSavedSongs(newList);
      }
    } catch (err) {}
  }, []);

  return { savedSongs, saveSong, deleteSong };
}
