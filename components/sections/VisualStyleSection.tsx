import React from 'react';
import { Clapperboard, Check } from 'lucide-react';
import { VideoConfig } from '../../types';
import { VIDEO_TEMPLATES } from '../Templates';

interface VisualStyleSectionProps {
  config: VideoConfig;
  onChange: (updates: Partial<VideoConfig>) => void;
}

export const VisualStyleSection: React.FC<VisualStyleSectionProps> = ({ config, onChange }) => {
  return (
    <div className="bg-[#111] border border-gray-800 rounded-2xl p-4 sm:p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
          <Clapperboard className="w-4 h-4 text-blue-500" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-white">Visual Style</h2>
          <p className="text-xs text-gray-500">Controls the look of generated scenes</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {VIDEO_TEMPLATES.map((template) => {
          const isSelected = config.styleId === template.id;
          return (
            <button
              key={template.id}
              id={`style-${template.id}`}
              onClick={() => onChange({ styleId: template.id, style: template.promptModifier })}
              className={`group relative flex flex-col items-start p-3.5 sm:p-4 rounded-xl border text-left transition-all duration-300 hover:scale-[1.02] overflow-hidden ${
                isSelected
                  ? 'border-blue-500 bg-blue-500/5 shadow-[0_0_15px_rgba(0,122,255,0.15)]'
                  : 'border-white/5 bg-[#0a0a0a] hover:border-white/10'
              }`}
            >
              {/* Color preview strip */}
              <div className={`w-full h-14 rounded-lg bg-gradient-to-br ${template.previewGradient} mb-3 transition-all duration-300 ${isSelected ? 'opacity-100 scale-[1.02]' : 'opacity-50 group-hover:opacity-75'}`} />

              {/* Selected indicator */}
              {isSelected && (
                <div className="absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center bg-blue-500 shadow-lg shadow-blue-500/30">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}

              <span className={`text-sm font-semibold ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                {template.name}
              </span>
              <span className="text-[11px] text-gray-500 mt-1 line-clamp-2 leading-tight">
                {template.description}
              </span>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mt-2">
                {template.tags.map((tag) => (
                  <span key={tag} className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/5 text-gray-400">
                    {tag}
                  </span>
                ))}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
