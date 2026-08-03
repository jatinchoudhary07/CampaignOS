import React from 'react';
import { Type } from 'lucide-react';
import { VideoConfig, CaptionStyle } from '../../types';

interface SubtitlesSectionProps {
  config: VideoConfig;
  onChange: (updates: Partial<VideoConfig>) => void;
}

const CAPTION_STYLES: { style: CaptionStyle; preview: string; desc: string }[] = [
  { style: CaptionStyle.Modern, preview: 'Aa', desc: 'Clean, sans-serif' },
  { style: CaptionStyle.Bold, preview: 'AB', desc: 'Heavy weight' },
  { style: CaptionStyle.Luxury, preview: 'ℒ', desc: 'Elegant serif' },
  { style: CaptionStyle.Minimal, preview: 'a', desc: 'Light & subtle' },
  { style: CaptionStyle.TikTok, preview: 'Tk', desc: 'Animated pop' },
];

export const SubtitlesSection: React.FC<SubtitlesSectionProps> = ({ config, onChange }) => {
  return (
    <div className="bg-[#111] border border-gray-800 rounded-2xl p-4 sm:p-6">
      <div className={`flex items-center justify-between ${config.subtitlesEnabled ? 'mb-5' : ''}`}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-cyan-500/10 rounded-lg flex items-center justify-center">
            <Type className="w-4 h-4 text-cyan-500" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">Subtitles</h2>
            <p className="text-xs text-gray-500">Burn captions into video</p>
          </div>
        </div>
        {/* Toggle */}
        <button
          id="subtitles-toggle"
          onClick={() => onChange({ subtitlesEnabled: !config.subtitlesEnabled })}
          className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
            config.subtitlesEnabled ? 'bg-cyan-500' : 'bg-gray-700'
          }`}
        >
          <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${
            config.subtitlesEnabled ? 'translate-x-6' : 'translate-x-0.5'
          }`} />
        </button>
      </div>

      {config.subtitlesEnabled && (
        <div className="animate-[fadeIn_0.3s_ease]">
          <label className="block text-xs font-medium text-gray-400 mb-3 uppercase tracking-wider">
            Caption Style
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {CAPTION_STYLES.map(({ style, preview, desc }) => {
              const isSelected = config.captionStyle === style;
              return (
                <button
                  key={style}
                  id={`caption-${style.toLowerCase()}`}
                  onClick={() => onChange({ captionStyle: style })}
                  className={`flex flex-col items-center p-3 rounded-xl border transition-all duration-200 ${
                    isSelected
                      ? 'bg-cyan-600/10 border-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.1)]'
                      : 'bg-[#0a0a0a] border-gray-800 hover:border-gray-700'
                  }`}
                >
                  <span className={`text-xl font-bold mb-1 ${isSelected ? 'text-cyan-300' : 'text-gray-400'}`}>
                    {preview}
                  </span>
                  <span className={`text-[9px] font-medium ${isSelected ? 'text-cyan-400' : 'text-gray-500'}`}>
                    {style}
                  </span>
                  <span className={`text-[9px] mt-0.5 ${isSelected ? 'text-gray-400' : 'text-gray-600'}`}>
                    {desc}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Caption preview */}
          <div className="mt-3 relative bg-[#0a0a0a] border border-gray-800 rounded-xl overflow-hidden h-14 flex items-end justify-center pb-2">
            <div className={`px-3 py-1 rounded text-xs text-white font-medium ${
              config.captionStyle === CaptionStyle.Bold ? 'font-black text-sm' :
              config.captionStyle === CaptionStyle.Luxury ? 'font-serif italic' :
              config.captionStyle === CaptionStyle.Minimal ? 'font-light text-xs opacity-80' :
              config.captionStyle === CaptionStyle.TikTok ? 'font-black text-sm bg-yellow-400 text-black rounded px-2' :
              'font-medium'
            } bg-black/60 backdrop-blur-sm`}>
              Grand Opening of Janki Jewellers
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
