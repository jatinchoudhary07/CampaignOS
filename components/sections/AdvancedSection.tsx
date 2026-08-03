import React, { useState } from 'react';
import {
  Settings, ChevronDown, ChevronUp, Target, Sparkles, Flame, Waves, Zap, Film, Compass
} from 'lucide-react';
import { VideoConfig, CreativityLevel, CameraMovement, VideoResolution } from '../../types';

interface AdvancedSectionProps {
  config: VideoConfig;
  onChange: (updates: Partial<VideoConfig>) => void;
}

export const AdvancedSection: React.FC<AdvancedSectionProps> = ({ config, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-[#111] border border-gray-800 rounded-2xl overflow-hidden">
      {/* Header / toggle */}
      <button
        id="advanced-settings-toggle"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 sm:p-6 hover:bg-[#161616] transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-500/10 rounded-lg flex items-center justify-center">
            <Settings className="w-4 h-4 text-gray-400" />
          </div>
          <div className="text-left">
            <h2 className="text-base font-semibold text-white">Advanced Settings</h2>
            <p className="text-xs text-gray-500">Creativity, camera, quality controls</p>
          </div>
        </div>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-gray-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-500" />
        )}
      </button>

      {isOpen && (
        <div className="px-4 sm:px-6 pb-4 sm:pb-6 space-y-5 border-t border-gray-800/50 pt-5 animate-[fadeIn_0.3s_ease]">
          {/* Creativity Level */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-3 uppercase tracking-wider">
              Creativity Level
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {Object.values(CreativityLevel).map((level) => {
                const isSelected = config.creativityLevel === level;
                const colors = {
                  [CreativityLevel.Low]: isSelected ? 'bg-blue-600/10 border-blue-500 text-blue-300' : '',
                  [CreativityLevel.Medium]: isSelected ? 'bg-purple-600/10 border-purple-500 text-purple-300' : '',
                  [CreativityLevel.High]: isSelected ? 'bg-red-600/10 border-red-500 text-red-300' : '',
                };
                const IconComponent =
                  level === CreativityLevel.Low ? Target :
                  level === CreativityLevel.Medium ? Sparkles : Flame;
                return (
                  <button
                    key={level}
                    id={`creativity-${level.toLowerCase()}`}
                    onClick={() => onChange({ creativityLevel: level })}
                    className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                      isSelected ? colors[level] : 'bg-[#0a0a0a] border-gray-800 text-gray-400 hover:border-gray-700'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    {level}
                  </button>
                );
              })}
            </div>
            <p className="text-[10px] text-gray-600 mt-2">
              {config.creativityLevel === CreativityLevel.Low
                ? 'Stays close to your brief — predictable, safe outputs'
                : config.creativityLevel === CreativityLevel.Medium
                ? 'Balanced creativity — recommended for most campaigns'
                : 'High creativity — unexpected, bold, sometimes surprising'}
            </p>
          </div>

          {/* Camera Movement */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-3 uppercase tracking-wider">
              Camera Movement
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {Object.values(CameraMovement).map((cam) => {
                const isSelected = config.cameraMovement === cam;
                const IconComponent =
                  cam === CameraMovement.Auto ? Target :
                  cam === CameraMovement.SlowPan ? Waves :
                  cam === CameraMovement.FastMotion ? Zap :
                  cam === CameraMovement.Cinematic ? Film : Compass;
                return (
                  <button
                    key={cam}
                    id={`camera-${cam.toLowerCase().replace(/\s/g, '-')}`}
                    onClick={() => onChange({ cameraMovement: cam })}
                    className={`flex items-center gap-2 p-3 rounded-xl border text-sm transition-all ${
                      isSelected
                        ? 'bg-gray-600/20 border-gray-500 text-gray-200'
                        : 'bg-[#0a0a0a] border-gray-800 text-gray-400 hover:border-gray-700'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span className="font-medium">{cam}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Video Quality */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-3 uppercase tracking-wider">
              Video Quality
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { res: VideoResolution.HD, label: '720p HD', desc: 'Faster generation' },
                { res: VideoResolution.FHD, label: '1080p Full HD', desc: 'Sharper quality' },
              ].map(({ res, label, desc }) => {
                const isSelected = config.videoQuality === res;
                return (
                  <button
                    key={res}
                    id={`quality-${res}`}
                    onClick={() => onChange({ videoQuality: res })}
                    className={`flex flex-col items-center p-3 rounded-xl border text-sm transition-all ${
                      isSelected
                        ? 'bg-emerald-600/10 border-emerald-500 text-emerald-300'
                        : 'bg-[#0a0a0a] border-gray-800 text-gray-400 hover:border-gray-700'
                    }`}
                  >
                    <span className="font-bold">{label}</span>
                    <span className={`text-[10px] mt-0.5 ${isSelected ? 'text-emerald-400/70' : 'text-gray-600'}`}>{desc}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
