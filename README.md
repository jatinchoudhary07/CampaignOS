# 🎬 CampaignOS — AI-Powered Marketing Video Platform

<p align="center">
  <img src="https://img.shields.io/badge/Powered%20By-Google%20Gemini%202.5-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Google Gemini" />
  <img src="https://img.shields.io/badge/Video%20Engine-Veo%203.1-7B1FA2?style=for-the-badge&logo=google-cloud&logoColor=white" alt="Google Veo" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-6.2-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/FFmpeg-Wasm-0078D7?style=for-the-badge&logo=ffmpeg&logoColor=white" alt="FFmpeg" />
</p>

---

## 🌟 Overview

**CampaignOS** is a commercial-grade, cloud-native AI video architecture platform designed for marketing agencies, content creators, and growth teams. 

Describe a campaign brief (e.g. *"Grand Opening of Royal Gold Jewellery"*), select your visual style, voiceover preferences, and video aspect ratio — **CampaignOS** handles the entire production pipeline automatically:
1. **AI Storyboard Generation**: Scene-by-scene scriptwriting powered by **Google Gemini 2.5 Flash**.
2. **Cinematic Scene Rendering**: High-fidelity video generation via **Google Veo 3.1**.
3. **AI Voiceover Narration**: Studio-quality voiceover generation with **Gemini TTS** across English, Hindi, and Hinglish.
4. **Automated Captions**: Subtitles burned into video in 5 distinct visual styles.
5. **In-Browser Video Assembly**: Real-time video clip stitching, audio mixing, and watermark integration using **FFmpeg.wasm** directly in the browser.

---

## 🏗️ Architecture & Workflow

The diagram below demonstrates how CampaignOS transforms user inputs into a final rendered commercial video:

```text
                     ┌─────────────────────────────────────────┐
                     │    CampaignOS Platform Architecture      │
                     └────────────────────┬────────────────────┘
                                          │
          ┌───────────────────────────────┼───────────────────────────────┐
          ▼                               ▼                               ▼
┌───────────────────┐           ┌───────────────────┐           ┌───────────────────┐
│ 🤖 SCRIPT &       │           │ 🎥 VEO 3.1 &      │           │ ⚡ IN-BROWSER     │
│    STORYBOARD     │           │    TTS VOICE      │           │    VIDEO ASSEMBLY │
│ Gemini 2.5 Flash  │           │  Scene & Narration│           │   FFmpeg.wasm     │
└───────────────────┘           └───────────────────┘           └───────────────────┘
```

---

## ✨ Key Features

- 🎬 **AI Storyboard Studio**: Auto-generates multi-scene visual descriptions, camera motions, and voiceover scripts.
- 🎥 **Veo 3.1 Visual Scenes**: Generates commercial-grade visual scenes tailored to your selected theme (Luxury, Minimal, Cinematic, Cyberpunk, etc.).
- 🎙️ **Gemini TTS Narration**: Support for Male and Female narration across English, Hindi, and Hinglish.
- 📝 **Auto Subtitles**: Burned-in video captions available in 5 visual styles (*Modern*, *Bold*, *Luxury*, *Minimal*, *TikTok*).
- 🎵 **Audio & Music Sync**: Background music style auto-matched to campaign tone and duration.
- 🏷️ **Brand Asset Overlays**: Upload your brand logo and product images for watermark overlay and scene reference.
- 🖥️ **Linear-Grade Dashboard Layout**: Split desktop layout with independent form scrolling and a fixed project summary sidebar with sticky action button.
- 📱 **100% Mobile Responsive**: Seamless, fluid layout adaptations across smartphones, tablets, laptops, and ultra-wide displays.
- 🌗 **Light & Dark Theme Engine**: Sleek, glassmorphic UI with native dark/light mode toggles.

---

## 🛠️ Tech Stack

| Component | Technology |
| :--- | :--- |
| **Framework** | [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) |
| **Build Tool** | [Vite 6](https://vitejs.dev/) |
| **Styling** | Vanilla CSS + [Tailwind CSS](https://tailwindcss.com/) |
| **AI LLM & Scripting** | [Google Gemini 2.5 Flash](https://ai.google.dev/) |
| **AI Video Generation** | [Google Veo 3.1](https://deepmind.google/technologies/veo/) |
| **AI Voice Synthesis** | Gemini Text-to-Speech (TTS) |
| **Video Processing** | [@ffmpeg/ffmpeg](https://ffmpegwasm.github.io/) (WASM) |
| **Iconography** | [Lucide React](https://lucide.dev/) |

---

## 💻 Getting Started

Follow these steps to run **CampaignOS** locally on your machine:

### 1. Prerequisites
Ensure you have **Node.js** (v18.0 or higher) and **npm** installed on your system.

### 2. Clone Repository
```bash
git clone https://github.com/jatinchoudhary07/CampaignOS.git
cd CampaignOS
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure API Key
CampaignOS requires a **Google Gemini API Key** to interact with Gemini 2.5 and Veo 3.1 models.
- Create a `.env` file in the root directory:
  ```env
  VITE_GEMINI_API_KEY=your_gemini_api_key_here
  ```
- Alternatively, you can enter your API key directly inside the in-app Key Modal upon launching the application.

### 5. Run Development Server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:3000` (or the port indicated in your terminal).

### 6. Build for Production
```bash
npm run build
```

### 7. Preview Production Build
```bash
npm run preview
```

---

## 📁 Project Structure

```
CampaignOS/
├── components/
│   ├── LandingPage.tsx           # High-craft marketing landing page
│   ├── ProjectSummaryPanel.tsx   # Fixed summary sidebar & live cost estimation
│   ├── Templates.tsx             # Pre-configured campaign templates
│   ├── VideoPlayer.tsx           # Interactive video preview player
│   └── sections/                 # Studio configuration form sections
│       ├── AIPresenterSection.tsx
│       ├── AdvancedSection.tsx
│       ├── BrandAssetsSection.tsx
│       ├── CTASection.tsx
│       ├── CampaignSection.tsx
│       ├── DurationSection.tsx
│       ├── FormatSection.tsx
│       ├── LanguageSection.tsx
│       ├── MotionTrackingSection.tsx
│       ├── MusicSection.tsx
│       ├── SubtitlesSection.tsx
│       ├── VisualStyleSection.tsx
│       └── VoiceSection.tsx
├── services/
│   ├── geminiService.ts          # Gemini 2.5 Flash & Veo 3.1 API integrations
│   └── videoMerger.ts            # Client-side FFmpeg.wasm video processing
├── App.tsx                       # Root application component
├── VideoArchitect.tsx            # Main Studio workspace layout
├── types.ts                      # Data interfaces & state schemas
├── index.html                    # Root HTML & global design tokens
└── package.json                  # Dependencies & scripts
```

---

## 👨‍💻 Author & Credits

Designed and built by **Jatin Choudhary**:

- **GitHub**: [@jatinchoudhary07](https://github.com/jatinchoudhary07)
- **Project**: CampaignOS
- **Powered By**: Google Gemini 2.5 Flash & Google Veo 3.1

---

<p align="center">
  Made with ❤️ by Jatin · Powered by Google Gemini & Veo
</p>
