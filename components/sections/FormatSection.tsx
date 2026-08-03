import React from 'react';
import { Smartphone, Monitor, Square } from 'lucide-react';
import { VideoConfig, VideoAspectRatio } from '../../types';

interface FormatSectionProps {
  config: VideoConfig;
  onChange: (updates: Partial<VideoConfig>) => void;
}

const FORMAT_OPTIONS = [
  {
    ratio: VideoAspectRatio.Vertical,
    icon: Smartphone,
    label: 'Vertical',
    subtitle: '9:16',
    uses: 'Instagram Reels · TikTok · Shorts',
    shape: 'h-16 w-9',
  },
  {
    ratio: VideoAspectRatio.Horizontal,
    icon: Monitor,
    label: 'Landscape',
    subtitle: '16:9',
    uses: 'YouTube · Websites · Presentations',
    shape: 'h-9 w-16',
  },
  {
    ratio: VideoAspectRatio.Square,
    icon: Square,
    label: 'Square',
    subtitle: '1:1',
    uses: 'Facebook · Instagram Feed',
    shape: 'h-12 w-12',
  },
];

export const FormatSection: React.FC<FormatSectionProps> = ({ config, onChange }) => {
  return (
    <div className="bg-[#111] border border-gray-800 rounded-2xl p-4 sm:p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
          <Monitor className="w-4 h-4 text-blue-500" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-white">Output Format</h2>
          <p className="text-xs text-gray-500">Choose your video aspect ratio</p>
        </div>
      </div>

      {/* Segmented Control */}
      <div className="flex bg-[#0a0a0a] p-1 rounded-xl border border-gray-850 gap-1 overflow-x-auto">
        {FORMAT_OPTIONS.map(({ ratio, label, subtitle }) => {
          const isSelected = config.aspectRatio === ratio;
          return (
            <button
              key={ratio}
              id={`format-${label.toLowerCase()}`}
              onClick={() => onChange({ aspectRatio: ratio })}
              className={`flex-1 py-2 text-[11px] sm:text-xs px-1 sm:px-2 font-semibold rounded-lg transition-all whitespace-nowrap ${
                isSelected
                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/15'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {label} ({subtitle})
            </button>
          );
        })}
      </div>

      <p className="text-[11px] text-gray-500 text-center mt-3 leading-tight">
        {config.aspectRatio === VideoAspectRatio.Vertical && "Optimized for Instagram Reels, TikTok, and YouTube Shorts (9:16)"}
        {config.aspectRatio === VideoAspectRatio.Horizontal && "Optimized for YouTube, widescreen website embeds, and desktop presentations (16:9)"}
        {config.aspectRatio === VideoAspectRatio.Square && "Optimized for Instagram Feed posts, Facebook posts, and square ads (1:1)"}
      </p>
    </div>
  );
};
