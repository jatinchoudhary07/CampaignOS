import React from 'react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { VideoConfig, CTAType } from '../../types';

interface CTASectionProps {
  config: VideoConfig;
  onChange: (updates: Partial<VideoConfig>) => void;
}

const CTA_OPTIONS = Object.values(CTAType);

export const CTASection: React.FC<CTASectionProps> = ({ config, onChange }) => {
  return (
    <div className="bg-[#111] border border-gray-800 rounded-2xl p-4 sm:p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
          <ArrowRight className="w-4 h-4 text-blue-500" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-white">Call To Action</h2>
          <p className="text-xs text-gray-500">Appears on the final screen of your video</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* CTA Type selector */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {CTA_OPTIONS.map((cta) => {
            const isSelected = config.ctaType === cta;
            return (
              <button
                key={cta}
                id={`cta-${cta.toLowerCase().replace(/\s/g, '-')}`}
                onClick={() => onChange({ ctaType: cta })}
                className={`py-3 px-2 rounded-xl border text-xs font-medium text-center transition-all duration-200 ${
                  isSelected
                    ? 'bg-blue-600/10 border-blue-500 text-blue-300 shadow-[0_0_10px_rgba(59,130,246,0.1)]'
                    : 'bg-[#0a0a0a] border-gray-800 text-gray-400 hover:border-gray-700'
                }`}
              >
                {cta}
              </button>
            );
          })}
        </div>

        {/* Custom CTA text input */}
        {config.ctaType === CTAType.Custom && (
          <div className="animate-[fadeIn_0.3s_ease]">
            <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">
              Custom CTA Text
            </label>
            <input
              id="cta-custom-text"
              type="text"
              placeholder="e.g. Visit Us at Khan Market, Delhi"
              className="w-full bg-[#0a0a0a] border border-blue-500/30 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/70 text-sm transition-all"
              value={config.ctaCustomText}
              onChange={(e) => onChange({ ctaCustomText: e.target.value })}
            />
          </div>
        )}

        {/* CTA preview */}
        <div className="relative bg-[#0a0a0a] border border-gray-800 rounded-xl overflow-hidden h-16 flex items-center justify-center">
          <div className="px-6 py-2.5 bg-white rounded-lg flex items-center gap-2">
            <span className="text-black font-bold text-sm">
              {config.ctaType === CTAType.Custom && config.ctaCustomText ? config.ctaCustomText : config.ctaType}
            </span>
            <ArrowRight className="w-4 h-4 text-black" />
          </div>
        </div>
      </div>
    </div>
  );
};
