import React from 'react';
import { Clock } from 'lucide-react';
import { VideoConfig, DURATION_SCENE_MAP } from '../../types';

interface DurationSectionProps {
  config: VideoConfig;
  onChange: (updates: Partial<VideoConfig>) => void;
}

const DURATION_OPTIONS = [
  { seconds: 8, label: '8s', use: 'Quick teaser' },
  { seconds: 15, label: '15s', use: 'Short ad' },
  { seconds: 30, label: '30s', use: 'Marketing reel' },
  { seconds: 45, label: '45s', use: 'Campaign video' },
  { seconds: 60, label: '60s', use: 'Full ad' },
];

export const DurationSection: React.FC<DurationSectionProps> = ({ config, onChange }) => {
  return (
    <div className="bg-[#111] border border-gray-800 rounded-2xl p-4 sm:p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
          <Clock className="w-4 h-4 text-blue-500" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-white">Video Duration</h2>
          <p className="text-xs text-gray-500">Determines number of scenes generated</p>
        </div>
      </div>

      {/* Segmented Control */}
      <div className="flex bg-[#0a0a0a] p-1 rounded-xl border border-gray-850 gap-1 overflow-x-auto">
        {DURATION_OPTIONS.map(({ seconds, label }) => {
          const isSelected = config.duration === seconds;
          return (
            <button
              key={seconds}
              id={`duration-${seconds}s`}
              onClick={() => onChange({ duration: seconds })}
              className={`flex-1 py-2 text-[11px] sm:text-xs font-semibold rounded-lg transition-all ${
                isSelected
                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/15'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Scene breakdown preview */}
      <div className="mt-4 p-3 bg-[#0a0a0a] rounded-xl border border-gray-850">
        <p className="text-xs text-gray-400 mb-2">
          Scene distribution: <span className="text-blue-400 font-semibold">{DURATION_SCENE_MAP[config.duration]} scenes</span> ({Math.round(config.duration / DURATION_SCENE_MAP[config.duration])}s per scene)
        </p>
        <div className="flex gap-1">
          {Array.from({ length: DURATION_SCENE_MAP[config.duration] }).map((_, i) => (
            <div
              key={i}
              className="flex-1 h-6 rounded bg-gradient-to-r from-blue-600/20 to-blue-500/5 border border-blue-500/20 flex items-center justify-center"
            >
              <span className="text-[9px] text-blue-400 font-medium">S{i + 1}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
