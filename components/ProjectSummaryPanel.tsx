import React from 'react';
import { ArrowRight, Zap, Clock, Sparkles, CheckCircle } from 'lucide-react';
import {
  VideoConfig, DURATION_SCENE_MAP, Language, MusicStyle,
  CTAType, PresenterGender, VideoAspectRatio, GenerationStatus
} from '../types';
import { VIDEO_TEMPLATES } from './Templates';

interface ProjectSummaryPanelProps {
  config: VideoConfig;
  status: GenerationStatus;
  onGenerate: () => void;
}

const SummaryRow: React.FC<{ label: string; value: string; highlight?: boolean }> = ({ label, value, highlight }) => (
  <li className="flex items-start justify-between gap-2 py-1.5 border-b border-gray-800/50 last:border-0">
    <span className="text-xs text-gray-500 shrink-0">{label}</span>
    <span className={`text-xs font-medium text-right ${highlight ? 'text-blue-300' : 'text-gray-300'}`}>{value}</span>
  </li>
);

export const ProjectSummaryPanel: React.FC<ProjectSummaryPanelProps> = ({ config, status, onGenerate }) => {
  const template = VIDEO_TEMPLATES.find(t => t.id === config.styleId);
  const sceneCount = DURATION_SCENE_MAP[config.duration];
  const estimatedCredits = sceneCount * 10 + (config.voiceEnabled ? 5 : 0) + (config.aiPresenterEnabled ? 10 : 0);
  const estimatedTime = sceneCount * 60 + (config.voiceEnabled ? 20 : 0);

  const aiFeatures = [
    config.voiceEnabled && `${config.voiceGender} Voice (${config.voiceStyle})`,
    config.subtitlesEnabled && `Subtitles (${config.captionStyle})`,
    config.aiPresenterEnabled && config.presenterGender !== PresenterGender.None && `${config.presenterGender} Presenter`,
    config.motionTrackingEnabled && 'Motion Tracking',
  ].filter(Boolean) as string[];

  const canGenerate = config.industry && config.topic && status.step === 'idle';

  const formatRatio = (ar: VideoAspectRatio) =>
    ar === VideoAspectRatio.Vertical ? 'Vertical 9:16' :
      ar === VideoAspectRatio.Square ? 'Square 1:1' : 'Landscape 16:9';

  return (
    <div className="w-full flex flex-col lg:h-full lg:max-h-full space-y-3.5">
      {/* Scrollable Summary Cards */}
      <div className="flex-1 lg:overflow-y-auto pr-1 space-y-3.5 custom-scrollbar">
        {/* Summary Card */}
        <div className="bg-gradient-to-b from-[#161616] to-[#111] border border-gray-800 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-semibold text-white">Project Summary</h3>
            {config.industry && config.topic && (
              <div className="ml-auto w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            )}
          </div>

          <ul className="space-y-0">
            <SummaryRow label="Industry" value={config.industry || '—'} highlight={!!config.industry} />
            <SummaryRow label="Topic" value={config.topic || '—'} highlight={!!config.topic} />
            <SummaryRow label="Campaign" value={config.campaignObjective} />
            <SummaryRow label="Format" value={formatRatio(config.aspectRatio)} />
            <SummaryRow label="Duration" value={`${config.duration}s · ${sceneCount} scene${sceneCount > 1 ? 's' : ''}`} />
            <SummaryRow label="Style" value={template?.name || '—'} />
            <SummaryRow label="Language" value={config.language} />
            <SummaryRow label="Voice" value={config.voiceEnabled ? `${config.voiceGender} · ${config.voiceStyle}` : 'Off'} />
            <SummaryRow label="Subtitles" value={config.subtitlesEnabled ? config.captionStyle : 'Off'} />
            <SummaryRow label="Music" value={config.musicStyle === MusicStyle.None ? 'Off' : config.musicStyle} />
            <SummaryRow label="CTA" value={config.ctaType === CTAType.Custom && config.ctaCustomText ? config.ctaCustomText : config.ctaType} />
            <SummaryRow
              label="AI Features"
              value={aiFeatures.length ? aiFeatures.join(' · ') : 'Standard'}
            />
          </ul>
        </div>

        {/* Estimates */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#111] border border-gray-800 rounded-xl p-3 flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-500 shrink-0" />
            <div>
              <p className="text-[10px] text-gray-500">Est. Credits</p>
              <p className="text-sm font-bold text-white">~{estimatedCredits}</p>
            </div>
          </div>
          <div className="bg-[#111] border border-gray-800 rounded-xl p-3 flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-500 shrink-0" />
            <div>
              <p className="text-[10px] text-gray-500">Est. Time</p>
              <p className="text-sm font-bold text-white">~{estimatedTime}s</p>
            </div>
          </div>
        </div>

        {/* Brand assets summary */}
        {(config.logoImage || config.productImages?.length > 0) && (
          <div className="bg-[#111] border border-gray-800 rounded-xl p-3">
            <p className="text-xs text-gray-400 mb-2">Brand Assets</p>
            <div className="flex items-center gap-2 flex-wrap">
              {config.logoImage && (
                <div className="flex items-center gap-1.5 px-2 py-1 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <CheckCircle className="w-3 h-3 text-green-400" />
                  <span className="text-[10px] text-green-400">Logo</span>
                </div>
              )}
              {config.productImages?.length > 0 && (
                <div className="flex items-center gap-1.5 px-2 py-1 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <CheckCircle className="w-3 h-3 text-green-400" />
                  <span className="text-[10px] text-green-400">{config.productImages.length} Product{config.productImages.length > 1 ? 's' : ''}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Sticky Pinned Generate Button */}
      <div className="pt-2 shrink-0 space-y-1.5 bg-base-theme/90 backdrop-blur-md z-10">
        <button
          id="generate-video-btn"
          onClick={onGenerate}
          disabled={!canGenerate}
          className={`w-full group relative overflow-hidden py-3 rounded-2xl font-bold text-base transition-all duration-300 flex items-center justify-center gap-2 ${canGenerate
              ? 'bg-white text-black hover:shadow-[0_0_40px_rgba(255,255,255,0.25)] hover:scale-[1.02] active:scale-[0.98]'
              : 'bg-gray-800 text-gray-600 cursor-not-allowed'
            }`}
        >
          {canGenerate && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          )}
          <Zap className={`w-5 h-5 ${canGenerate ? 'text-black' : 'text-gray-600'}`} />
          <span>Generate Video</span>
          {canGenerate && <ArrowRight className="w-5 h-5 text-black group-hover:translate-x-1 transition-transform" />}
        </button>

        {!canGenerate && status.step === 'idle' && (
          <p className="text-xs text-gray-600 text-center">
            Fill in Industry and Topic to generate
          </p>
        )}
      </div>
    </div>
  );
};
