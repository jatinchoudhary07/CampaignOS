import React from 'react';
import { Layers, ChevronDown } from 'lucide-react';
import { VideoConfig, CampaignObjective } from '../../types';

interface CampaignSectionProps {
  config: VideoConfig;
  onChange: (updates: Partial<VideoConfig>) => void;
}

const INDUSTRY_SUGGESTIONS = [
  'Jewellery', 'Fashion', 'Real Estate', 'Education',
  'Restaurant', 'Automobile', 'Healthcare', 'Beauty',
  'Technology', 'Fitness', 'Travel', 'Finance',
];

export const CampaignSection: React.FC<CampaignSectionProps> = ({ config, onChange }) => {
  return (
    <div className="bg-[#111] border border-gray-800 rounded-2xl p-4 sm:p-6">
      <div className="flex items-center gap-3 mb-5 sm:mb-6">
        <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
          <Layers className="w-4 h-4 text-blue-500" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-white">Campaign Concept</h2>
          <p className="text-xs text-gray-500">Define what your video is about</p>
        </div>
      </div>

      <div className="space-y-5">
        {/* Industry */}
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">
            Industry / Niche
          </label>
          <input
            id="industry-input"
            type="text"
            placeholder="e.g. Jewellery, Real Estate, Restaurant"
            className="w-full bg-[#0a0a0a] border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/70 focus:ring-1 focus:ring-blue-500/30 transition-all text-sm"
            value={config.industry}
            onChange={(e) => onChange({ industry: e.target.value })}
          />
          {/* Quick select chips */}
          <div className="flex flex-wrap gap-2 mt-2">
            {INDUSTRY_SUGGESTIONS.slice(0, 6).map((s) => (
              <button
                key={s}
                onClick={() => onChange({ industry: s })}
                className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                  config.industry === s
                    ? 'bg-blue-500/20 border-blue-500/50 text-blue-300'
                    : 'bg-[#0a0a0a] border-gray-800 text-gray-500 hover:border-gray-600 hover:text-gray-300'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Topic */}
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">
            Topic / Product
          </label>
          <input
            id="topic-input"
            type="text"
            placeholder="e.g. New Store Opening, Wedding Collection, Summer Sale"
            className="w-full bg-[#0a0a0a] border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/70 focus:ring-1 focus:ring-blue-500/30 transition-all text-sm"
            value={config.topic}
            onChange={(e) => onChange({ topic: e.target.value })}
          />
        </div>

        {/* Campaign Objective */}
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">
            Campaign Objective
          </label>
          <div className="relative">
            <select
              id="campaign-objective"
              className="w-full bg-[#0a0a0a] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/70 focus:ring-1 focus:ring-blue-500/30 transition-all text-sm appearance-none cursor-pointer"
              value={config.campaignObjective}
              onChange={(e) => onChange({ campaignObjective: e.target.value as CampaignObjective })}
            >
              {Object.values(CampaignObjective).map((obj) => (
                <option key={obj} value={obj}>{obj}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          </div>
        </div>

        {/* Hook / Overlay Text */}
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">
            Hook / Overlay Text
          </label>
          <textarea
            id="hook-text"
            placeholder={`e.g. "Grand Opening of Janki Jewellers" or "Flat 30% Off!"`}
            rows={2}
            className="w-full bg-[#0a0a0a] border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/70 focus:ring-1 focus:ring-blue-500/30 transition-all text-sm resize-none"
            value={config.hookText}
            onChange={(e) => onChange({ hookText: e.target.value })}
          />
          <p className="text-xs text-gray-600 mt-1">Used as opening text and key message in video</p>
        </div>
      </div>
    </div>
  );
};
