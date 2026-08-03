import React, { useState, useEffect } from 'react';
import { CampaignOS } from './VideoArchitect';
import { LandingPage } from './components/LandingPage';
import { Sparkles, Lock, ExternalLink, Video } from 'lucide-react';

type AppScreen = 'landing' | 'key_required' | 'studio';

const App: React.FC = () => {
  const [screen, setScreen] = useState<AppScreen>('landing');
  const [checking, setChecking] = useState<boolean>(true);
  const [customKey, setCustomKey] = useState<string>(
    localStorage.getItem('user_gemini_api_key') || ''
  );

  // Check for existing API key and initialize theme on mount
  useEffect(() => {
    // Theme initialization
    const savedTheme = (localStorage.getItem('theme') as 'light' | 'dark' | 'system') || 'system';
    const root = document.documentElement;
    if (savedTheme === 'light') {
      root.classList.add('light');
    } else if (savedTheme === 'dark') {
      root.classList.remove('light');
    } else {
      const systemIsDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (systemIsDark) {
        root.classList.remove('light');
      } else {
        root.classList.add('light');
      }
    }
    setChecking(false);
  }, []);

  const handleGetStarted = () => {
    const win = window as any;
    const storedKey = localStorage.getItem('user_gemini_api_key');
    const envKey =
      (import.meta as any).env?.VITE_GEMINI_API_KEY ||
      (typeof process !== 'undefined' ? (process.env?.GEMINI_API_KEY || process.env?.API_KEY) : '');

    if (win.__GEMINI_API_KEY__ || storedKey || envKey) {
      setScreen('studio');
      return;
    }

    setScreen('key_required');
  };

  const handleSaveCustomKey = () => {
    if (customKey.trim()) {
      localStorage.setItem('user_gemini_api_key', customKey.trim());
      (window as any).__GEMINI_API_KEY__ = customKey.trim();
      setScreen('studio');
    }
  };

  // Initial load
  if (checking) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 via-purple-600 to-pink-600 rounded-xl flex items-center justify-center animate-pulse">
            <Video className="w-4 h-4 text-white" />
          </div>
          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  // Landing page
  if (screen === 'landing') {
    return <LandingPage onGetStarted={handleGetStarted} />;
  }

  // API key required screen
  if (screen === 'key_required') {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-900/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-900/15 rounded-full blur-[120px] pointer-events-none" />

        <div className="z-10 max-w-md w-full bg-[#0d0d0d] border border-gray-800 rounded-2xl p-5 sm:p-8 shadow-2xl text-center">
          <div className="mx-auto w-14 h-14 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center mb-6">
            <Lock className="w-6 h-6 text-blue-400" />
          </div>

          <h1 className="text-2xl font-bold text-white mb-2">Connect Your API Key</h1>
          <p className="text-gray-400 text-sm mb-6 leading-relaxed">
            CampaignOS uses Gemini 2.5 Flash and Veo 3.1 for video generation.
            Enter or update your Google AI Studio API key below.
          </p>

          <div className="space-y-4 mb-6 text-left">
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">
                Google Gemini API Key
              </label>
              <input
                type="text"
                value={customKey}
                onChange={(e) => setCustomKey(e.target.value)}
                placeholder="Enter AI Studio API Key..."
                className="w-full bg-[#161616] border border-gray-800 rounded-xl px-4 py-3 text-white text-xs font-mono focus:outline-none focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          <button
            onClick={handleSaveCustomKey}
            className="w-full flex items-center justify-center gap-2 bg-white text-black hover:bg-gray-100 py-3.5 px-6 rounded-xl font-bold transition-all active:scale-95 shadow-lg"
          >
            <Sparkles className="w-5 h-5" />
            Save & Open Studio
          </button>

          <button
            onClick={() => setScreen('landing')}
            className="mt-3 w-full py-2.5 text-sm text-gray-500 hover:text-gray-300 transition-colors"
          >
            ← Back to home
          </button>

          <div className="mt-6 pt-6 border-t border-gray-800">
            <a
              href="https://ai.google.dev/gemini-api/docs/billing"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-gray-600 hover:text-blue-400 transition-colors"
            >
              <span>View API Billing Documentation</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Main studio
  return <CampaignOS />;
};

export default App;