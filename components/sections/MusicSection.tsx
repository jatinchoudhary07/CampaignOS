import React from 'react';
import {
  Music, Sparkles, Briefcase, Zap, Film, Rocket, VolumeX, Wand2
} from 'lucide-react';
import { VideoConfig, MusicStyle } from '../../types';

interface MusicSectionProps {
  config: VideoConfig;
  onChange: (updates: Partial<VideoConfig>) => void;
}

const MUSIC_OPTIONS: { style: MusicStyle; icon: React.ComponentType<any>; desc: string; color: string }[] = [
  { style: MusicStyle.AutoSelect, icon: Wand2, desc: 'AI picks best match', color: 'text-blue-400 border-blue-500/50 bg-blue-600/10' },
  { style: MusicStyle.Luxury, icon: Sparkles, desc: 'Piano & strings', color: 'text-yellow-400 border-yellow-500/50 bg-yellow-600/10' },
  { style: MusicStyle.Corporate, icon: Briefcase, desc: 'Upbeat corporate', color: 'text-sky-400 border-sky-500/50 bg-sky-600/10' },
  { style: MusicStyle.Energetic, icon: Zap, desc: 'High tempo EDM', color: 'text-orange-400 border-orange-500/50 bg-orange-600/10' },
  { style: MusicStyle.Cinematic, icon: Film, desc: 'Epic orchestra', color: 'text-purple-400 border-purple-500/50 bg-purple-600/10' },
  { style: MusicStyle.Motivational, icon: Rocket, desc: 'Inspiring build-up', color: 'text-green-400 border-green-500/50 bg-green-600/10' },
  { style: MusicStyle.None, icon: VolumeX, desc: 'No background music', color: 'text-gray-400 border-gray-700 bg-transparent' },
];

export const MusicSection: React.FC<MusicSectionProps> = ({ config, onChange }) => {
  return (
    <div className="bg-[#111] border border-gray-800 rounded-2xl p-4 sm:p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-8 h-8 bg-violet-500/10 rounded-lg flex items-center justify-center">
          <Music className="w-4 h-4 text-violet-500" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-white">Background Music</h2>
          <p className="text-xs text-gray-500">AI selects best track based on campaign</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {MUSIC_OPTIONS.map(({ style, icon: IconComponent, desc, color }) => {
          const isSelected = config.musicStyle === style;
          return (
            <button
              key={style}
              id={`music-${style.toLowerCase().replace(' ', '-')}`}
              onClick={() => onChange({ musicStyle: style })}
              className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 text-left ${
                isSelected ? color : 'border-gray-800 bg-[#0a0a0a] hover:border-gray-700'
              }`}
            >
              <IconComponent className="w-5 h-5 shrink-0" />
              <div>
                <p className={`text-sm font-medium ${isSelected ? '' : 'text-gray-300'}`}>
                  {style}
                </p>
                <p className={`text-[10px] ${isSelected ? 'opacity-80' : 'text-gray-600'}`}>
                  {desc}
                </p>
              </div>
              {isSelected && (
                <div className="ml-auto w-2 h-2 rounded-full bg-current animate-pulse flex-shrink-0" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
