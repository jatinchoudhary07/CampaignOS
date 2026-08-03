import React from 'react';
import { Activity, Package, User, Video } from 'lucide-react';
import { VideoConfig } from '../../types';

interface MotionTrackingSectionProps {
  config: VideoConfig;
  onChange: (updates: Partial<VideoConfig>) => void;
}

export const MotionTrackingSection: React.FC<MotionTrackingSectionProps> = ({ config, onChange }) => {
  return (
    <div className="bg-[#111] border border-gray-800 rounded-2xl p-4 sm:p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
            <Activity className="w-4 h-4 text-blue-500" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">Motion Tracking</h2>
            <p className="text-xs text-gray-500">Creates premium, dynamic feel</p>
          </div>
        </div>
        <button
          id="motion-tracking-toggle"
          onClick={() => onChange({ motionTrackingEnabled: !config.motionTrackingEnabled })}
          className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
            config.motionTrackingEnabled ? 'bg-blue-500' : 'bg-gray-700'
          }`}
        >
          <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${
            config.motionTrackingEnabled ? 'translate-x-6' : 'translate-x-0.5'
          }`} />
        </button>
      </div>

      {config.motionTrackingEnabled && (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2 animate-[fadeIn_0.3s_ease]">
          {[
            { label: 'Text follows products', icon: Package },
            { label: 'Text follows presenter', icon: User },
            { label: 'Camera tracking shots', icon: Video },
          ].map(({ label, icon: IconComponent }) => (
            <div key={label} className="flex flex-col items-center p-3 bg-blue-500/5 border border-blue-500/20 rounded-xl text-center">
              <IconComponent className="w-5 h-5 text-blue-400 mb-1" />
              <span className="text-[10px] text-blue-400 leading-tight">{label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
