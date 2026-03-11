# Web Studio DAW 🎹

Web Studio DAW は、Next.js と Tone.js で構築された本格的なブラウザベースのデジタル・オーディオ・ワークステーション（DAW）です。直感的なタイムラインとピアノロールを使用して作曲を行い、作成した楽曲を React コードや JSON として直接エクスポートできます。

[English](README.md) | [日本語](README.ja.md)

## ✨ 主な機能

- **アレンジャー (タイムライン)**: ドラッグ＆ドロップの簡単な操作で、複数のトラックとパターンを構築。
- **ピアノロール**: メロディ楽器とパーカッシブなドラムキットの両方に対応した、詳細なノート編集。
- **多彩な楽器**: シンセリード、エレピ、ベース、パッド、ブラス、マリンバ、ストリングス、ドラムキットを搭載。
- **Tone.js エンジン**: 高性能な音声合成とスケジューリングを実現。
- **多言語対応 (i18n)**: 英語と日本語をフルサポート。
- **React エクスポート**: 任意の React/Next.js プロジェクトで BGM を再生できる、プロダクション対応の React フックを生成。
- **ブラウザへの保存**: プロジェクトをブラウザのローカルストレージに保存・読み込み可能。

## 🛠️ 技術スタック

- **コア**: [Next.js 16 (App Router)](https://nextjs.org/)
- **オーディオエンジン**: [Tone.js](https://tonejs.github.io/)
- **ランタイム**: [Bun](https://bun.sh/)
- **スタイリング**: [Tailwind CSS](https://tailwindcss.com/)
- **状態管理**: カスタム React Hook

## 🚀 はじめ方

### 前提条件

- [Bun](https://bun.sh/) (推奨) または Node.js

### インストール

1. レポジトリをクローンします：
   ```bash
   git clone https://github.com/yourusername/web-daw.git
   cd web-daw
   ```

2. 依存関係をインストールします：
   ```bash
   bun install
   ```

3. 開発サーバーを起動します：
   ```bash
   bun run dev
   ```

4. ブラウザで [http://localhost:3000](http://localhost:3000) を開きます。

## 📖 使い方

### 作曲
1. **トラックの追加**: アレンジャー表示の「+ トラック追加」ボタンを使用します。
2. **パターンの作成**: タイムラインの空のマスをダブルクリックして、新しいパターンを作成します。
3. **ノートの編集**: パターンをクリックしてピアノロールで開きます。左クリックでノートを配置、ドラッグで連続入力（ペイント）が可能です。
4. **アレンジ**: タイムライン上でパターンをドラッグして曲を構成します。**Alt + ドラッグ** でパターンのコピーが可能です。

### エクスポート
- エクスポートパネルの **「BGM用フック(React)をコピー」** をクリックすると、スタンドアロンの React フックを取得できます。
- このフックを他のプロジェクトに貼り付けるだけで、作成した曲をそのまま再生できます。

#### 💡 エクスポートした React コンポーネントの使い方
エクスポートされるコードは、**Tone.js** を使用したカスタム React フックです。

1. **依存関係のインストール**: 導入先のプロジェクトで Tone.js をインストールします。
   ```bash
   npm install tone
   # または
   bun add tone
   ```

2. **ファイルの作成**: `useSongBGM.ts` などのファイルを作成し、コピーしたコードをそのまま貼り付けます。

3. **コンポーネントでの利用**:
   ```tsx
   import { useSongBGM } from './useSongBGM';

   export function MyComponent() {
     // autoPlay: false (デフォルト) の場合、ユーザー操作（クリック等）で再生を開始する必要があります
     const { play, stop, isPlaying, isReady } = useSongBGM({ 
       volume: -5, 
       loop: true 
     });

     return (
       <div>
         <button 
           disabled={!isReady} 
           onClick={() => isPlaying ? stop() : play({ fadeIn: 1 })}
         >
           {isPlaying ? 'BGM停止' : 'BGM再生'}
         </button>
       </div>
     );
   }
   ```
   *注意: ブラウザの自動再生ポリシーにより、音声の再生はボタンクリックなどのユーザー操作によって開始される必要があります。*

## 🤝 貢献について

貢献は大歓迎です！プルリクエストを気軽にお送りください。

1. プロジェクトをフォークする
2. フィーチャーブランチを作成する (`git checkout -b feature/AmazingFeature`)
3. 変更をコミットする (`git commit -m 'Add some AmazingFeature'`)
4. ブランチにプッシュする (`git push origin feature/AmazingFeature`)
5. プルリクエストを作成する

## 📄 ライセンス

MIT ライセンスの下で配布されています。詳細は `LICENSE` をご覧ください。

## 🙏 謝辞

- モダンな DAW と Web Audio API の可能性にインスパイアされました。
- Next.js と Tone.js を使用して ❤️ を込めて作られました。
