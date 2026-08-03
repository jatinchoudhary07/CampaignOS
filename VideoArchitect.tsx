import React, { useState, useEffect } from 'react';
import {
  Video, Zap, CheckCircle, Loader2, AlertCircle,
  FileText, Edit3, Mic, Type, Music, Link,
  Sun, Moon, Monitor
} from 'lucide-react';

import { VIDEO_TEMPLATES } from './components/Templates';
import { VideoPlayer } from './components/VideoPlayer';
import { ProjectSummaryPanel } from './components/ProjectSummaryPanel';
import { CampaignSection } from './components/sections/CampaignSection';
import { FormatSection } from './components/sections/FormatSection';
import { DurationSection } from './components/sections/DurationSection';
import { VisualStyleSection } from './components/sections/VisualStyleSection';
import { LanguageSection } from './components/sections/LanguageSection';
import { VoiceSection } from './components/sections/VoiceSection';
import { SubtitlesSection } from './components/sections/SubtitlesSection';
import { MusicSection } from './components/sections/MusicSection';
import { BrandAssetsSection } from './components/sections/BrandAssetsSection';
import { AIPresenterSection } from './components/sections/AIPresenterSection';
import { MotionTrackingSection } from './components/sections/MotionTrackingSection';
import { CTASection } from './components/sections/CTASection';
import { AdvancedSection } from './components/sections/AdvancedSection';

import { generateVideo } from './services/geminiService';
import {
  VideoConfig, VideoAspectRatio, VideoResolution, GenerationStatus,
  CampaignObjective, Language, VoiceGender, VoiceStyle, CaptionStyle,
  MusicStyle, PresenterGender, CTAType, CameraMovement, CreativityLevel,
  DURATION_SCENE_MAP
} from './types';

// ─── Default Config ────────────────────────────────────────────────────────────

const DEFAULT_CONFIG: VideoConfig = {
  industry: '',
  topic: '',
  campaignObjective: CampaignObjective.StoreOpening,
  hookText: '',
  aspectRatio: VideoAspectRatio.Vertical,
  duration: 30,
  style: VIDEO_TEMPLATES[0].promptModifier,
  styleId: VIDEO_TEMPLATES[0].id,
  language: Language.English,
  voiceEnabled: true,
  voiceGender: VoiceGender.Female,
  voiceStyle: VoiceStyle.Luxury,
  subtitlesEnabled: true,
  captionStyle: CaptionStyle.Modern,
  musicStyle: MusicStyle.AutoSelect,
  logoImage: undefined,
  productImages: [],
  aiPresenterEnabled: false,
  presenterGender: PresenterGender.Female,
  motionTrackingEnabled: true,
  ctaType: CTAType.ShopNow,
  ctaCustomText: '',
  creativityLevel: CreativityLevel.Medium,
  cameraMovement: CameraMovement.Auto,
  videoQuality: VideoResolution.HD,
};

// ─── Generation Steps UI ───────────────────────────────────────────────────────

const GENERATION_STEPS = [
  { id: 'storyboard', label: 'Storyboard', icon: FileText },
  { id: 'scene_prompts', label: 'Scene Prompts', icon: Edit3 },
  { id: 'generating_videos', label: 'Video Generation', icon: Video },
  { id: 'voiceover', label: 'Voiceover', icon: Mic },
  { id: 'subtitles', label: 'Subtitles', icon: Type },
  { id: 'music', label: 'Music', icon: Music },
  { id: 'merging', label: 'Packaging', icon: Link },
];

// ─── Main Component ────────────────────────────────────────────────────────────

export const CampaignOS: React.FC = () => {
  const [config, setConfig] = useState<VideoConfig>(DEFAULT_CONFIG);
  const [status, setStatus] = useState<GenerationStatus>({ step: 'idle' });
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('dark');

  useEffect(() => {
    const savedTheme = (localStorage.getItem('theme') as 'light' | 'dark' | 'system') || 'system';
    setTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (t: 'light' | 'dark' | 'system') => {
    const root = document.documentElement;
    if (t === 'light') {
      root.classList.add('light');
    } else if (t === 'dark') {
      root.classList.remove('light');
    } else {
      const systemIsDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (systemIsDark) {
        root.classList.remove('light');
      } else {
        root.classList.add('light');
      }
    }
  };

  const updateTheme = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
  };

  const updateConfig = (updates: Partial<VideoConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  };

  const handleGenerate = async () => {
    if (!config.industry || !config.topic) return;

    setStatus({ step: 'storyboard', message: 'Initializing AI Architect...', progress: 0 });

    try {
      const apiKey = (window as any).__GEMINI_API_KEY__ || process.env.API_KEY || '';

      const result = await generateVideo(
        config,
        apiKey,
        (msg, step, current, total) => {
          setStatus((prev) => ({
            ...prev,
            step: (step as any) || prev.step,
            message: msg,
            currentScene: current,
            totalScenes: total,
            progress: step === 'generating_videos' && total
              ? Math.round(((current || 0) / total) * 60) + 20
              : undefined,
          }));
        }
      );

      setStatus({ step: 'complete', message: 'Your video is ready!', result });
    } catch (error: any) {
      if (error.message?.includes('Requested entity was not found')) {
        alert('API Key session expired. Please refresh the page.');
      }
      setStatus({ step: 'error', message: error.message || 'Generation failed' });
    }
  };

  const currentStepIndex = GENERATION_STEPS.findIndex((s) => s.id === status.step);

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen lg:h-screen lg:max-h-screen bg-base-theme text-title-theme flex flex-col transition-colors duration-300 w-full max-w-full overflow-x-hidden lg:overflow-hidden">

      {/* ── Header ── */}
      <header className="border-b border-theme-1 shrink-0 h-16 nav-bg-theme backdrop-blur-xl z-50 w-full">
        <div className="w-full px-4 sm:px-6 h-16 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-tr from-[#7bbbff] to-[#b8a9ff] rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Video className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <span className="font-bold text-base sm:text-lg tracking-tight text-title-theme">
              CampaignOS
            </span>
            <span className="text-[10px] px-1.5 py-0.5 bg-blue-500/10 border border-blue-500/30 rounded-full text-blue-400 font-medium hidden xs:inline-block">
              BETA
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 text-xs text-desc-theme">
            {/* Sleek theme selector pill */}
            <div className="flex items-center gap-0.5 bg-black/10 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-full p-0.5">
              <button
                onClick={() => updateTheme('light')}
                className={`p-1 rounded-full transition-all ${theme === 'light' ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'}`}
                title="Light Mode"
              >
                <Sun className="w-3 h-3" />
              </button>
              <button
                onClick={() => updateTheme('dark')}
                className={`p-1 rounded-full transition-all ${theme === 'dark' ? 'bg-zinc-800 text-white shadow-sm' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'}`}
                title="Dark Mode"
              >
                <Moon className="w-3 h-3" />
              </button>
              <button
                onClick={() => updateTheme('system')}
                className={`p-1 rounded-full transition-all ${theme === 'system' ? 'bg-white dark:bg-zinc-800 text-black dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'}`}
                title="System Default"
              >
                <Monitor className="w-3 h-3" />
              </button>
            </div>

            <span className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-surface-theme border border-theme-2 rounded-full">
              <Zap className="w-3 h-3 text-yellow-500" />
              Powered by Gemini + Veo
            </span>
          </div>
        </div>
      </header>

      {/* Main Workspace Container: Full-Width 2-Column Dashboard Grid */}
      <div className="w-full px-3 sm:px-6 py-4 sm:py-6 flex-1 lg:overflow-hidden lg:h-[calc(100vh-64px)]">
        {status.step === 'idle' && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_420px] gap-6 lg:gap-8 w-full lg:h-full lg:overflow-hidden items-start">
              
              {/* Left Column: Configuration Forms (Expands & scrolls independently on desktop) */}
              <div className="space-y-6 w-full lg:h-full lg:overflow-y-auto lg:pr-3 custom-scrollbar scroll-smooth pb-24 lg:pb-8">
                <CampaignSection config={config} onChange={updateConfig} />
                <FormatSection config={config} onChange={updateConfig} />
                <DurationSection config={config} onChange={updateConfig} />
                <VisualStyleSection config={config} onChange={updateConfig} />
                <LanguageSection config={config} onChange={updateConfig} />
                <VoiceSection config={config} onChange={updateConfig} />
                <SubtitlesSection config={config} onChange={updateConfig} />
                <MusicSection config={config} onChange={updateConfig} />
                <BrandAssetsSection config={config} onChange={updateConfig} />
                <AIPresenterSection config={config} onChange={updateConfig} />
                <MotionTrackingSection config={config} onChange={updateConfig} />
                <CTASection config={config} onChange={updateConfig} />
                <AdvancedSection config={config} onChange={updateConfig} />
              </div>

              {/* Right Column: Project Summary Panel (Fixed Sidebar on desktop, normal stacked card on mobile) */}
              <div className="w-full lg:w-[400px] xl:w-[420px] shrink-0 lg:h-full flex flex-col lg:overflow-hidden pb-24 lg:pb-0">
                <ProjectSummaryPanel
                  config={config}
                  status={status}
                  onGenerate={handleGenerate}
                />
              </div>

            </div>

            {/* Mobile Floating Action Bar */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 p-3.5 bg-base-theme/95 border-t border-theme-1 backdrop-blur-xl z-40 flex items-center justify-between gap-3 shadow-2xl">
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-title-theme">
                  {config.industry && config.topic ? `${config.duration}s Video` : 'Configure Video'}
                </span>
                <span className="text-[10px] text-muted-theme">
                  {config.industry && config.topic ? `Ready to generate` : 'Fill Industry & Topic'}
                </span>
              </div>
              <button
                onClick={handleGenerate}
                disabled={!config.industry || !config.topic}
                className={`px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all active:scale-95 ${config.industry && config.topic
                  ? 'bg-white text-black shadow-lg shadow-white/10'
                  : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                  }`}
              >
                <Zap className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span>Generate</span>
              </button>
            </div>
          </>
        )}

        {/* ── Generating State ── */}
        {(status.step !== 'idle' && status.step !== 'complete' && status.step !== 'error') && (
          <div className="max-w-2xl mx-auto py-16">
            <div className="flex justify-center mb-10">
              <div className="relative w-24 h-24">
                <div className="absolute inset-0 border-t-2 border-blue-500 rounded-full animate-spin" />
                <div className="absolute inset-2 border-r-2 border-purple-500 rounded-full animate-spin [animation-direction:reverse] [animation-duration:1.5s]" />
                <div className="absolute inset-4 border-b-2 border-pink-500 rounded-full animate-spin [animation-duration:2s]" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Video className="w-7 h-7 text-white animate-pulse" />
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-center text-white mb-2">
              Architecting Your Video
            </h2>
            <p className="text-gray-400 text-center mb-2 h-6 text-sm">
              {status.message}
            </p>

            {status.step === 'generating_videos' && status.totalScenes && (
              <p className="text-xs text-gray-600 text-center mb-6">
                Scene {(status.currentScene || 0) + 1} of {status.totalScenes}
              </p>
            )}

            <div className="space-y-2 mt-8">
              {GENERATION_STEPS.map((gstep, i) => {
                const isDone = i < currentStepIndex;
                const isCurrent = i === currentStepIndex;
                return (
                  <div
                    key={gstep.id}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-500 ${isCurrent
                      ? 'bg-blue-500/10 border-blue-500/30'
                      : isDone
                        ? 'bg-green-500/5 border-green-500/20'
                        : 'bg-[#0a0a0a] border-gray-800/30 opacity-40'
                      }`}
                  >
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm flex-shrink-0 ${isCurrent ? 'bg-blue-500/20' : isDone ? 'bg-green-500/20' : 'bg-gray-800'
                      }`}>
                      {isDone ? (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      ) : isCurrent ? (
                        <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
                      ) : (
                        <span className="text-xs text-gray-600">{i + 1}</span>
                      )}
                    </div>
                    <span className={`flex items-center gap-2 text-sm font-medium ${isCurrent ? 'text-blue-300' : isDone ? 'text-green-400' : 'text-gray-600'
                      }`}>
                      <gstep.icon className="w-4 h-4" />
                      {gstep.label}
                    </span>
                    {isCurrent && (
                      <div className="ml-auto flex gap-0.5">
                        {[0, 1, 2].map((d) => (
                          <div
                            key={d}
                            className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce"
                            style={{ animationDelay: `${d * 0.15}s` }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <p className="text-xs text-gray-700 text-center mt-6">
              This may take {DURATION_SCENE_MAP[config.duration] * 1.5}–{DURATION_SCENE_MAP[config.duration] * 2} minutes. Please keep this tab open.
            </p>
          </div>
        )}

        {/* ── Complete State ── */}
        {status.step === 'complete' && status.result && (
          <VideoPlayer
            result={status.result}
            captionStyle={config.captionStyle}
            subtitlesEnabled={config.subtitlesEnabled}
            onReset={() => setStatus({ step: 'idle' })}
          />
        )}

        {/* ── Error State ── */}
        {status.step === 'error' && (
          <div className="max-w-lg mx-auto text-center py-20">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-5">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Generation Failed</h2>
            <p className="text-red-400 text-sm mb-8 max-w-sm mx-auto">{status.message}</p>
            <button
              onClick={() => setStatus({ step: 'idle' })}
              className="px-6 py-2.5 bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition-colors text-sm font-medium"
            >
              ← Try Again
            </button>
          </div>
        )}
      </div>

    </div>
  );
};