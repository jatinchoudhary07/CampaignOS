# AI Marketing Tool (CampaignOS) - Project Audit

## Overview
**CampaignOS** is an advanced AI-powered video generation and marketing platform. It utilizes the Google Gemini API to leverage Veo 3 and Gemini Flash, automating the entire video production pipeline from conceptualization to the final packaged marketing video.

## Key Features & Contributions
* **Gemini API & Veo 3 Integration:** Engineered the core video generation engine using the `@google/genai` SDK, securely handling API keys to generate high-quality video scenes with Veo 3.
* **End-to-End AI Video Pipeline:** Architected a multi-stage generation pipeline (Storyboard -> Video Synthesis -> Voiceover -> Subtitles -> Music integration) driven entirely by Google's generative models.
* **In-Browser Media Processing:** Implemented client-side video compilation and editing using WebAssembly via FFmpeg (`@ffmpeg/ffmpeg`), minimizing server dependency and latency during the final packaging phase.
* **Dynamic Video Configuration:** Developed a comprehensive React frontend to capture granular campaign parameters including aspect ratio, AI voice styles, AI presenters, motion tracking, and brand assets.
* **Modern UI/UX Implementation:** Built a responsive, theme-aware application using Vite, React 19, and Tailwind CSS, featuring real-time generation progress tracking and interactive video preview.

## Tech Stack & Core Dependencies
* **Frontend Framework:** React 19, Vite, TypeScript
* **AI / Video Generation:** `@google/genai` (^1.33.0) integrating Google AI Studio for Veo 3 and Gemini Flash.
* **Video Processing:** `@ffmpeg/ffmpeg` (^0.12.15), `@ffmpeg/util` (^0.12.2) (WebAssembly in-browser processing).
* **Styling & UI:** Tailwind CSS, `lucide-react` (^0.560.0) for UI icons.

## Resume Highlights
* **Advanced API Integration:** Successfully integrated and managed the Gemini API to orchestrate complex text-to-video generation workflows using Veo 3.
* **Full-Stack AI Architecture:** Built scalable client-side applications that successfully marry traditional web paradigms with cutting-edge generative video models.
* **Performance Optimization:** Leveraged WebAssembly (Wasm) for heavy media processing tasks directly within the user's browser, significantly reducing server costs and processing time.
