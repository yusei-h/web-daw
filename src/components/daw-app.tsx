"use client";

import { useDawState } from "@/hooks/use-daw-state";
import { useToneEngine } from "@/hooks/use-tone-engine";
import { useLocalSongStorage } from "@/hooks/use-local-song-storage";
import { DawHeader } from "@/components/daw-header";
import { ArrangerTimeline } from "@/components/arranger-timeline";
import { PianoRoll } from "@/components/piano-roll";
import { StoragePanel } from "@/components/storage-panel";
import { ImportExportPanel } from "@/components/import-export-panel";
import { TEMPLATES, TemplateId } from "@/lib/templates";

export function DawApp() {
  const daw = useDawState();
  const { togglePlay, stopAudio } = useToneEngine(
    daw.state,
    daw.setPlayMode,
    daw.setPosition
  );
  const { savedSongs, saveSong, deleteSong } = useLocalSongStorage();

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-6 p-4 md:p-6 pb-20">
      <DawHeader
        bpm={daw.state.bpm}
        totalMeasures={daw.state.totalMeasures}
        playMode={daw.state.playMode}
        onSetBpm={daw.setBpm}
        onSetTotalMeasures={daw.setTotalMeasures}
        onTogglePlay={() => {
          togglePlay("main").catch(console.error);
        }}
        onLoadTemplate={(templateId: TemplateId) => {
          daw.restoreProject(TEMPLATES[templateId]);
        }}
      />

      <ArrangerTimeline
        tracks={daw.state.tracks}
        activeTrackId={daw.state.activeTrackId}
        activePatternId={daw.state.activePatternId}
        totalMeasures={daw.state.totalMeasures}
        currentMeasure={
          daw.state.playMode !== "stopped" ? daw.state.currentMeasure : null
        }
        onAddTrack={daw.addTrack}
        onDeleteTrack={daw.deleteTrack}
        onRenameTrack={daw.renameTrack}
        onChangeInstrument={daw.changeTrackInstrument}
        onToggleMute={daw.toggleTrackMute}
        onSetVolume={daw.setTrackVolume}
        onSetActivePattern={daw.setActivePattern}
        onPlacePattern={daw.placePatternOnTimeline}
        onRenamePattern={daw.renamePattern}
        onSetLoopMeasure={(m) => {
          const isSameMeasure =
            daw.state.loopMeasureIndex === m && daw.state.playMode === "measure";
          daw.setLoopMeasure(m);
          if (m === null) {
            stopAudio();
          } else {
            // もし既に別の小節が再生中なら、一度止めてから新しい小節で開始する
            togglePlay("measure", !isSameMeasure).catch(console.error);
          }
        }}
        loopMeasureIndex={daw.state.loopMeasureIndex}
      />

      <PianoRoll
        activeTrack={daw.activeTrack}
        activePattern={daw.activePattern}
        currentStep={
          daw.state.playMode !== "stopped" ? daw.state.currentStep : null
        }
        playMode={daw.state.playMode}
        onToggleNote={daw.toggleNote}
        onPaintNote={daw.paintNote}
        onCreatePattern={daw.createPattern}
        onClearPattern={daw.clearPattern}
        onTogglePlayPattern={() => {
          // パターン再生は常にトグル（切り替え）として動作
          togglePlay("pattern").catch(console.error);
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        <StoragePanel
          songTitle={daw.state.songTitle}
          onSetSongTitle={daw.setSongTitle}
          onSave={() => saveSong(daw.state)}
          onLoad={(project: unknown) => daw.restoreProject(project)}
          savedSongs={savedSongs}
          onDelete={deleteSong}
        />
        <ImportExportPanel
          state={daw.state}
          onRestore={(project: unknown) => daw.restoreProject(project)}
        />
      </div>
    </div>
  );
}
