"use client";

import { useEffect, useRef, useCallback } from "react";
import * as Tone from "tone";
import { DawState, InstrumentKey, PlayMode } from "@/types/daw";
import { createInstrumentInstance, InstrumentInstance } from "@/lib/instruments";
import { DRUM_PITCHES, MELODIC_PITCHES, NUM_STEPS } from "@/lib/constants";

export function useToneEngine(
  state: DawState,
  onSetPlayMode: (mode: PlayMode) => void,
  onSetPosition: (measure: number, step: number) => void
) {
  const synthsRef = useRef<Map<string, InstrumentInstance>>(new Map());
  const repeatEventIdRef = useRef<number | null>(null);
  const playheadStepRef = useRef(0);
  const lastStateRef = useRef(state);

  // マスターボリュームの初期化
  useEffect(() => {
    Tone.Destination.volume.value = 0;
  }, []);

  // ステートの最新値を常に参照できるように更新
  useEffect(() => {
    lastStateRef.current = state;
  }, [state]);

  // トラッキング楽器インスタンスの同期
  useEffect(() => {
    const currentTrackIds = new Set(state.tracks.map((t) => t.id));
    synthsRef.current.forEach((inst, id) => {
      if (!currentTrackIds.has(id)) {
        inst.dispose();
        synthsRef.current.delete(id);
      }
    });

    state.tracks.forEach((track) => {
      const existing = synthsRef.current.get(track.id);
      if (!existing) {
        const inst = createInstrumentInstance(track.instrument, track.volume);
        synthsRef.current.set(track.id, inst);
      }
    });
  }, [state.tracks]);

  // ボリュームおよびBPM同期
  useEffect(() => {
    state.tracks.forEach((track) => {
      const inst = synthsRef.current.get(track.id);
      if (inst) {
        inst.setVolume(track.mute ? -Infinity : track.volume);
      }
    });
    Tone.Transport.bpm.value = state.bpm;
  }, [state.tracks, state.bpm]);

  const stopAudio = useCallback(() => {
    Tone.Transport.stop();
    if (repeatEventIdRef.current !== null) {
      Tone.Transport.clear(repeatEventIdRef.current);
      repeatEventIdRef.current = null;
    }
    playheadStepRef.current = 0;
    onSetPlayMode("stopped");
    onSetPosition(0, 0);
  }, [onSetPlayMode, onSetPosition]);

  const startAudio = useCallback(
    (mode: PlayMode) => {
      stopAudio(); // 既に動いている場合はリセット

      playheadStepRef.current = 0;
      onSetPlayMode(mode);

      repeatEventIdRef.current = Tone.Transport.scheduleRepeat((time) => {
        const currentState = lastStateRef.current;
        const currentMode = mode; // クロージャ内の mode を使用
        const step = playheadStepRef.current;

        if (currentMode === "main") {
          const currentMeasure = Math.floor(step / NUM_STEPS) % currentState.totalMeasures;
          const localStep = step % NUM_STEPS;

          currentState.tracks.forEach((track) => {
            if (track.mute) return;
            const patternId = track.timeline[currentMeasure];
            if (!patternId) return;
            const pattern = track.patterns[patternId];
            const inst = synthsRef.current.get(track.id);
            if (pattern && inst) {
              const pitches = track.instrument === "drum" ? DRUM_PITCHES : MELODIC_PITCHES;
              const active = pitches.filter((p) => pattern.grid[p] && pattern.grid[p][localStep]);
              if (active.length > 0) inst.triggerAttackRelease(active, "16n", time);
            }
          });

          Tone.Draw.schedule(() => {
            onSetPosition(currentMeasure, localStep);
          }, time);

          playheadStepRef.current = (step + 1) % (currentState.totalMeasures * NUM_STEPS);
        } else if (currentMode === "pattern") {
          const track = currentState.tracks.find((t) => t.id === currentState.activeTrackId);
          const patternId = currentState.activePatternId;
          const localStep = step % NUM_STEPS;

          if (track && patternId && !track.mute) {
            const pattern = track.patterns[patternId];
            const inst = synthsRef.current.get(track.id);
            if (pattern && inst) {
              const pitches = track.instrument === "drum" ? DRUM_PITCHES : MELODIC_PITCHES;
              const active = pitches.filter((p) => pattern.grid[p] && pattern.grid[p][localStep]);
              if (active.length > 0) inst.triggerAttackRelease(active, "16n", time);
            }
          }

          Tone.Draw.schedule(() => {
            onSetPosition(-1, localStep); // パターン再生時は measure = -1 と定義
          }, time);

          playheadStepRef.current = (step + 1) % NUM_STEPS;
        } else if (currentMode === "measure") {
          const currentMeasure = currentState.loopMeasureIndex ?? 0;
          const localStep = step % NUM_STEPS;

          currentState.tracks.forEach((track) => {
            if (track.mute) return;
            const patternId = track.timeline[currentMeasure];
            if (!patternId) return;
            const pattern = track.patterns[patternId];
            const inst = synthsRef.current.get(track.id);
            if (pattern && inst) {
              const pitches = track.instrument === "drum" ? DRUM_PITCHES : MELODIC_PITCHES;
              const active = pitches.filter((p) => pattern.grid[p] && pattern.grid[p][localStep]);
              if (active.length > 0) inst.triggerAttackRelease(active, "16n", time);
            }
          });

          Tone.Draw.schedule(() => {
            onSetPosition(currentMeasure, localStep);
          }, time);

          playheadStepRef.current = (step + 1) % NUM_STEPS;
        }
      }, "16n");

      Tone.Transport.start();
    },
    [onSetPlayMode, onSetPosition, stopAudio]
  );

  const togglePlay = useCallback(
    async (mode: PlayMode = "main", forceRestart = false) => {
      if (Tone.context.state !== "running") {
        await Tone.start();
      }

      if (state.playMode === mode && !forceRestart) {
        stopAudio();
      } else {
        startAudio(mode);
      }
    },
    [state.playMode, startAudio, stopAudio]
  );

  // クリーンアップ
  useEffect(() => {
    return () => {
      synthsRef.current.forEach((inst) => inst.dispose());
      Tone.Transport.stop();
      if (repeatEventIdRef.current !== null) {
        Tone.Transport.clear(repeatEventIdRef.current);
      }
    };
  }, []);

  return { togglePlay, stopAudio };
}
