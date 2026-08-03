import React from 'react';
import { User, UserX } from 'lucide-react';
import { VideoConfig, PresenterGender } from '../../types';

interface AIPresenterSectionProps {
  config: VideoConfig;
  onChange: (updates: Partial<VideoConfig>) => void;
}

const PRESENTER_OPTIONS: { gender: PresenterGender; icon: React.ComponentType<any>; label: string; desc: string }[] = [
  { gender: PresenterGender.Female, icon: User, label: 'Female', desc: 'Professional woman presenter' },
  { gender: PresenterGender.Male, icon: User, label: 'Male', desc: 'Professional man presenter' },
  { gender: PresenterGender.None, icon: UserX, label: 'None', desc: 'No presenter in video' },
];

export const AIPresenterSection: React.FC<AIPresenterSectionProps> = ({ config, onChange }) => {
  return (
    <div className="bg-[#111] border border-gray-800 rounded-2xl p-4 sm:p-6">
      <div className={`flex items-center justify-between ${config.aiPresenterEnabled ? 'mb-5' : ''}`}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
            <User className="w-4 h-4 text-blue-500" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">AI Presenter</h2>
            <p className="text-xs text-gray-500">Add a human presenter to your video</p>
          </div>
        </div>
        {/* Toggle */}
        <button
          id="presenter-toggle"
          onClick={() => onChange({ aiPresenterEnabled: !config.aiPresenterEnabled })}
          className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
            config.aiPresenterEnabled ? 'bg-blue-500' : 'bg-gray-700'
          }`}
        >
          <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${
            config.aiPresenterEnabled ? 'translate-x-6' : 'translate-x-0.5'
          }`} />
        </button>
      </div>

      {config.aiPresenterEnabled && (
        <div className="animate-[fadeIn_0.3s_ease]">
          <label className="block text-xs font-medium text-gray-400 mb-3 uppercase tracking-wider">
            Presenter Type
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {PRESENTER_OPTIONS.map(({ gender, icon: IconComponent, label, desc }) => {
              const isSelected = config.presenterGender === gender;
              return (
                <button
                  key={gender}
                  id={`presenter-${label.toLowerCase()}`}
                  onClick={() => onChange({ presenterGender: gender })}
                  className={`flex flex-col items-center p-4 rounded-xl border transition-all duration-200 ${
                    isSelected
                      ? 'bg-blue-600/10 border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.1)]'
                      : 'bg-[#0a0a0a] border-gray-800 hover:border-gray-700'
                  }`}
                >
                  <IconComponent className={`w-6 h-6 mb-2 ${isSelected ? 'text-blue-300' : 'text-gray-400'}`} />
                  <span className={`text-sm font-medium ${isSelected ? 'text-blue-300' : 'text-gray-300'}`}>
                    {label}
                  </span>
                  <span className={`text-[10px] mt-0.5 text-center leading-tight ${isSelected ? 'text-gray-400' : 'text-gray-600'}`}>
                    {desc}
                  </span>
                </button>
              );
            })}
          </div>
          {config.presenterGender !== PresenterGender.None && (
            <p className="text-xs text-blue-400/80 mt-3 text-center">
              ✓ {config.presenterGender} presenter will appear in your generated video
            </p>
          )}
        </div>
      )}
    </div>
  );
};
