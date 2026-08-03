import React from 'react';
import { Globe } from 'lucide-react';
import { VideoConfig, Language } from '../../types';

interface LanguageSectionProps {
  config: VideoConfig;
  onChange: (updates: Partial<VideoConfig>) => void;
}

const LANGUAGE_OPTIONS: { lang: Language; flag: string; desc: string }[] = [
  { lang: Language.English, flag: '🇺🇸', desc: 'Script, voiceover & subtitles in English' },
  { lang: Language.Hindi, flag: '🇮🇳', desc: 'Script, voiceover & subtitles in Hindi' },
  { lang: Language.Hinglish, flag: '🌐', desc: 'Mix of Hindi + English — popular in India' },
];

export const LanguageSection: React.FC<LanguageSectionProps> = ({ config, onChange }) => {
  return (
    <div className="bg-[#111] border border-gray-800 rounded-2xl p-4 sm:p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-8 h-8 bg-indigo-500/10 rounded-lg flex items-center justify-center">
          <Globe className="w-4 h-4 text-indigo-500" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-white">Language</h2>
          <p className="text-xs text-gray-500">Controls script, voiceover, and subtitle language</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {LANGUAGE_OPTIONS.map(({ lang, flag, desc }) => {
          const isSelected = config.language === lang;
          return (
            <button
              key={lang}
              id={`language-${lang.toLowerCase()}`}
              onClick={() => onChange({ language: lang })}
              className={`flex flex-col items-center p-4 rounded-xl border text-center transition-all duration-200 ${
                isSelected
                  ? 'bg-indigo-600/10 border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.1)]'
                  : 'bg-[#0a0a0a] border-gray-800 hover:border-gray-700'
              }`}
            >
              <span className="text-2xl mb-2">{flag}</span>
              <span className={`text-sm font-semibold ${isSelected ? 'text-indigo-300' : 'text-gray-300'}`}>
                {lang}
              </span>
              <span className={`text-[10px] mt-1 leading-tight ${isSelected ? 'text-gray-400' : 'text-gray-600'}`}>
                {desc}
              </span>
            </button>
          );
        })}
      </div>

      {config.language !== Language.English && (
        <div className="mt-3 p-3 bg-indigo-500/5 border border-indigo-500/20 rounded-xl">
          <p className="text-xs text-indigo-400">
            ℹ️ {config.language} script will be generated. Voiceover quality depends on AI model support.
          </p>
        </div>
      )}
    </div>
  );
};
