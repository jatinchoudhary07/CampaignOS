import React from 'react';
import { Mic, ChevronDown } from 'lucide-react';
import { VideoConfig, VoiceGender, VoiceStyle } from '../../types';

interface VoiceSectionProps {
  config: VideoConfig;
  onChange: (updates: Partial<VideoConfig>) => void;
}

const VOICE_STYLES: { style: VoiceStyle; desc: string }[] = [
  { style: VoiceStyle.Professional, desc: 'Clear & authoritative' },
  { style: VoiceStyle.Luxury, desc: 'Soft & premium' },
  { style: VoiceStyle.Energetic, desc: 'Upbeat & exciting' },
  { style: VoiceStyle.Friendly, desc: 'Warm & approachable' },
  { style: VoiceStyle.Storytelling, desc: 'Narrative & engaging' },
  { style: VoiceStyle.Authority, desc: 'Bold & commanding' },
];

export const VoiceSection: React.FC<VoiceSectionProps> = ({ config, onChange }) => {
  return (
    <div className="bg-[#111] border border-gray-800 rounded-2xl p-4 sm:p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
            <Mic className="w-4 h-4 text-blue-500" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">Voice Settings</h2>
            <p className="text-xs text-gray-500">AI-generated narration</p>
          </div>
        </div>
        {/* Toggle */}
        <button
          id="voice-toggle"
          onClick={() => onChange({ voiceEnabled: !config.voiceEnabled })}
          className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
            config.voiceEnabled ? 'bg-blue-500' : 'bg-gray-700'
          }`}
        >
          <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${
            config.voiceEnabled ? 'translate-x-6' : 'translate-x-0.5'
          }`} />
        </button>
      </div>

      {config.voiceEnabled && (
        <div className="space-y-4 animate-[fadeIn_0.3s_ease]">
          {/* Voice Gender */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">
              Voice Gender
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[VoiceGender.Female, VoiceGender.Male].map((gender) => (
                <button
                  key={gender}
                  id={`voice-gender-${gender.toLowerCase()}`}
                  onClick={() => onChange({ voiceGender: gender })}
                  className={`py-2.5 rounded-xl border text-sm font-medium transition-all ${
                    config.voiceGender === gender
                      ? 'bg-blue-600/15 border-blue-500 text-blue-300'
                      : 'bg-[#0a0a0a] border-gray-800 text-gray-400 hover:border-gray-700'
                  }`}
                >
                  {gender}
                </button>
              ))}
            </div>
          </div>

          {/* Voice Style */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">
              Voice Style
            </label>
            <div className="relative">
              <select
                id="voice-style"
                className="w-full bg-[#0a0a0a] border border-gray-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500/70 transition-all appearance-none cursor-pointer"
                value={config.voiceStyle}
                onChange={(e) => onChange({ voiceStyle: e.target.value as VoiceStyle })}
              >
                {VOICE_STYLES.map(({ style, desc }) => (
                  <option key={style} value={style}>{style} — {desc}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
          </div>

          {/* Voice preview hint */}
          <div className="p-3 bg-blue-500/5 border border-blue-500/20 rounded-xl flex items-center gap-3">
            <div className="flex gap-0.5 items-end h-5">
              {[3, 5, 4, 7, 6, 4, 3, 5, 4, 6].map((h, i) => (
                <div
                  key={i}
                  className="w-1 bg-blue-500 rounded-full animate-pulse"
                  style={{ height: `${h * 3}px`, animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </div>
            <p className="text-xs text-blue-400">
              {config.voiceGender} · {config.voiceStyle} voice will narrate your campaign
            </p>
          </div>
        </div>
      )}

      {!config.voiceEnabled && (
        <p className="text-xs text-gray-600 text-center py-4">
          Enable voiceover to add AI narration to your video
        </p>
      )}
    </div>
  );
};
