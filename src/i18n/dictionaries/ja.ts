export const ja = {
  header: {
    title: "Web Studio DAW",
    subtitle: "直感的な操作で曲を作り、Reactコードとして出力できます",
    play: "全体再生",
    stop: "停止中",
    bpm: "BPM",
    measures: "曲の長さ(小節)",
    template: "テンプレート",
    confirmTemplate: "現在のプロジェクトは破棄されてテンプレートが読み込まれます。よろしいですか？",
    templates: {
      basic: "基本 (Basic)",
      edm: "EDM (ダンス)",
      lofi: "Lo-Fi チル",
      rock: "ロック",
      jazz: "ジャズ",
      "8bit": "8-Bit レトロ"
    }
  },
  arranger: {
    title: "アレンジャー (タイムライン)",
    helpClick: "🖱️ 左クリック: 配置",
    helpDrag: "✋ ドラッグ: 移動 (Altキーでコピー)",
    addTrack: "トラック追加",
    muteTrack: "ミュート (消音)",
    deleteTrack: "トラックを削除する",
    patterns: "パターン",
    renameTrackPrompt: "トラックの名前を入力してください",
    renamePatternPrompt: "パターンの名前を入力してください",
  },
  pianoRoll: {
    editing: "を編集中",
    selectPattern: "タイムラインのマスをクリックしてパターンを選択してください。",
    createPattern: "+ 新規パターン作成",
    clearPattern: "すべて消去",
    playPattern: "パターンのみ試聴",
    renamePattern: "パターンの名前を入力してください",
  },
  storage: {
    title: "ブラウザに保存・復元",
    placeholder: "曲のタイトルを入力",
    save: "保存する",
    noSongs: "保存された曲はありません。",
    load: "読み込み",
    confirmDelete: "この曲を削除してもよろしいですか？",
  },
  importExport: {
    title: "外部エクスポート・インポート",
    copyReact: "BGM用フック(React)をコピー",
    copyJson: "データ(JSON)をコピー",
    importPlaceholder: "ここにコピーしたJSONデータをペーストして復元...",
    restore: "復元実行",
    restoreSuccess: "プロジェクトを正常に復元しました！",
    restoreError: "データの解析に失敗しました。無効なJSONです。",
    copySuccessReact: "✓ Reactコードをコピーしました！",
    copySuccessJson: "✓ プロジェクトデータ(JSON)をコピーしました。",
  },
  instruments: {
    synth: "シンセリード",
    piano: "エレピ",
    acousticGuitar: "アコギ",
    electricGuitar: "エレキ",
    bass: "ベース",
    pad: "シンセパッド",
    brass: "ブラス",
    pluck: "プラック",
    marimba: "マリンバ",
    strings: "ストリングス",
    drum: "ドラムキット",
  },
  common: {
    close: "閉じる",
    cancel: "キャンセル",
    ok: "OK",
    stop: "停止",
  }
};

export type Dictionary = typeof ja;
