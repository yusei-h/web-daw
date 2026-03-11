# Web Studio DAW 🎹

Web Studio DAW is a professional, browser-based Digital Audio Workstation (DAW) built with Next.js and Tone.js. It allows you to compose music intuitively through a timeline and piano roll, and export your creations directly as React code or JSON.

[English](README.md) | [日本語](README.ja.md)

**Live Demo**: [https://yusei-h.github.io/web-daw/](https://yusei-h.github.io/web-daw/)

## ✨ Features

- **Arranger (Timeline)**: Organize multiple tracks and patterns with an easy drag-and-drop interface.
- **Piano Roll**: Detailed note editing with support for both melodic instruments and percussive drum kits.
- **Variety of Instruments**: Includes Synth Leads, Electric Pianos, Bass, Pads, Brass, Marimba, Strings, and a full Drum Kit.
- **Tone.js Engine**: High-performance audio synthesis and scheduling.
- **i18n Support**: Full support for English and Japanese.
- **Export to React**: Generate production-ready React hooks that can play your BGM in any React/Next.js project.
- **Browser Persistence**: Save and load your projects locally in the browser.

## 🛠️ Tech Stack

- **Core**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Audio Engine**: [Tone.js](https://tonejs.github.io/)
- **Runtime**: [Bun](https://bun.sh/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: Custom React Hooks

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (Recommended) or Node.js

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/web-daw.git
   cd web-daw
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

3. Start the development server:
   ```bash
   bun run dev
   ```

4. Open [http://localhost:3000/web-daw/](http://localhost:3000/web-daw/) in your browser. (Note: use `/web-daw/` suffix in dev as well due to `basePath` config).

### Deployment

This project is configured for **GitHub Pages**. Any push to the `main` branch will automatically trigger the GitHub Actions workflow to build and deploy the app.

1. Ensure **GitHub Actions** is enabled in your repository settings (**Settings > Actions > General**).
2. Go to **Settings > Pages** and set the **Source** to **"GitHub Actions"**.

## 📖 Usage

### Composing
1. **Add Tracks**: Use the "+ Add Track" button in the Arranger view.
2. **Create Patterns**: Double-click an empty slot on the timeline to create a new pattern.
3. **Editing Notes**: Click a pattern to open it in the Piano Roll. Left-click to place notes, or drag to paint multiple notes.
4. **Arranging**: Drag patterns on the timeline to arrange your song. Use **Alt + Drag** to copy patterns.

### Exporting
- Click **"Copy Hook for BGM (React)"** in the Export panel to get a standalone React hook.
- You can paste this hook into another project to play the exact same sequence you composed.

#### 💡 How to use the exported React component
The exported code is a custom React hook that uses **Tone.js**.

1. **Install dependencies** in your target project:
   ```bash
   npm install tone
   # or
   bun add tone
   ```

2. **Create a file** (e.g., `useSongBGM.ts`) and paste the copied code.

3. **Use the hook** in your component:
   ```tsx
   import { useSongBGM } from './useSongBGM';

   export function MyComponent() {
     // autoPlay: false (default) requires a user gesture to start audio
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
           {isPlaying ? 'Stop BGM' : 'Play BGM'}
         </button>
       </div>
     );
   }
   ```
   *Note: Due to browser autoplay policies, audio must be started by a user interaction (like a click).*

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 🙏 Acknowledgments

- Inspired by modern DAWs and the power of the Web Audio API.
- Built with ❤️ using Next.js and Tone.js.
