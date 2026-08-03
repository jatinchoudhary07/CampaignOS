import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Play, Pause, Download, RotateCcw, Volume2, VolumeX,
  Subtitles, CheckCircle
} from 'lucide-react';
import { GenerationResult, CaptionStyle } from '../types';

interface VideoPlayerProps {
  result: GenerationResult;
  captionStyle?: CaptionStyle;
  subtitlesEnabled?: boolean;
  onReset: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  result,
  captionStyle = CaptionStyle.Modern,
  subtitlesEnabled = true,
  onReset,
}) => {
  const { storyboard, sceneVideos, voiceoverUrl, subtitleText } = result;
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const [currentScene, setCurrentScene] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showSubtitles, setShowSubtitles] = useState(subtitlesEnabled);
  const [hasFinished, setHasFinished] = useState(false);

  const totalScenes = sceneVideos.length;

  // Parse subtitle lines
  const subtitleLines = subtitleText
    ? subtitleText.split('\n').filter((l) => l.trim() && !l.match(/^\d+$/) && !l.match(/^\d{2}:/))
    : [];

  // Auto-advance to next scene seamlessly when current one ends
  const handleSceneEnd = useCallback(() => {
    if (currentScene < totalScenes - 1) {
      // Move to next scene — will auto-play via useEffect
      setCurrentScene((s) => s + 1);
    } else {
      // All scenes finished
      setIsPlaying(false);
      setHasFinished(true);
    }
  }, [currentScene, totalScenes]);

  // When currentScene changes, load + play the new source immediately
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    vid.src = sceneVideos[currentScene];
    vid.load();

    if (isPlaying) {
      vid.play().catch(() => {});
    }
  }, [currentScene]);

  // Play / Pause
  const handlePlayPause = () => {
    const vid = videoRef.current;
    if (!vid) return;

    if (hasFinished) {
      // Replay from beginning
      setCurrentScene(0);
      setHasFinished(false);
      setIsPlaying(true);
      // useEffect will handle loading scene 0
      return;
    }

    if (isPlaying) {
      vid.pause();
      audioRef.current?.pause();
    } else {
      vid.play().catch(() => {});
      audioRef.current?.play().catch(() => {});
    }
    setIsPlaying(!isPlaying);
  };

  // Mute toggle
  const handleMute = () => {
    setIsMuted((m) => {
      if (videoRef.current) videoRef.current.muted = !m;
      return !m;
    });
  };

  // Download all scenes
  const handleDownload = () => {
    sceneVideos.forEach((url, i) => {
      const a = document.createElement('a');
      a.href = url;
      a.download = `${storyboard.campaignTitle.replace(/[^a-zA-Z0-9]/g, '_')}_scene_${i + 1}.mp4`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  };

  // Caption style class
  const getCaptionClass = () => {
    switch (captionStyle) {
      case CaptionStyle.Bold: return 'font-black text-base tracking-wide drop-shadow-lg';
      case CaptionStyle.Luxury: return 'font-serif italic text-sm tracking-widest drop-shadow-lg';
      case CaptionStyle.Minimal: return 'font-light text-xs opacity-80';
      case CaptionStyle.TikTok: return 'font-black text-base bg-yellow-400 text-black rounded px-2 py-0.5';
      default: return 'font-medium text-sm drop-shadow-md';
    }
  };

  // Progress bar: scene-based
  const progressPercent = hasFinished ? 100 : ((currentScene) / totalScenes) * 100;

  return (
    <div className="max-w-4xl mx-auto" style={{ animation: 'fadeIn 0.5s ease' }}>

      {/* Success header */}
      <div className="text-center mb-6 sm:mb-8">
        <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 bg-green-500/10 border border-green-500/30 rounded-full mb-3 sm:mb-4">
          <CheckCircle className="w-3.5 h-3.5 text-green-400" />
          <span className="text-green-400 text-xs sm:text-sm font-medium">
            Video Ready — {totalScenes} scene{totalScenes > 1 ? 's' : ''}
          </span>
        </div>
        <h2 className="text-xl sm:text-3xl font-bold text-white px-2">{storyboard.campaignTitle}</h2>
        {storyboard.script && (
          <p className="text-gray-400 mt-2 text-xs sm:text-sm max-w-2xl mx-auto line-clamp-2 px-4">
            {storyboard.script}
          </p>
        )}
      </div>

      {/* ── Video Player ── */}
      <div className="relative bg-black rounded-2xl overflow-hidden border border-gray-800 shadow-2xl shadow-black/50 group keep-dark">
        <video
          ref={videoRef}
          src={sceneVideos[0]}
          className="w-full max-h-[50vh] sm:max-h-[65vh] object-contain bg-black"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={handleSceneEnd}
          playsInline
        />

        {/* Scene indicator — small pill at top */}
        {totalScenes > 1 && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 flex gap-1.5 px-3 py-1.5 bg-black/60 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
            {sceneVideos.map((_, i) => (
              <div
                key={i}
                className={`h-1 rounded-full transition-all duration-500 ${
                  i < currentScene
                    ? 'w-4 bg-green-400'
                    : i === currentScene
                    ? 'w-6 bg-white'
                    : 'w-4 bg-gray-600'
                }`}
              />
            ))}
          </div>
        )}

        {/* Subtitle overlay */}
        {showSubtitles && subtitleLines.length > 0 && currentScene < subtitleLines.length && (
          <div className="absolute bottom-20 left-0 right-0 flex justify-center px-6 pointer-events-none">
            <div className={`text-white text-center max-w-xl ${getCaptionClass()} bg-black/70 backdrop-blur-sm px-4 py-2 rounded-lg`}>
              {subtitleLines[currentScene]}
            </div>
          </div>
        )}

        {/* Controls bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/70 to-transparent pt-10 pb-4 px-4">
          {/* Progress bar */}
          <div className="w-full h-1 bg-gray-800 rounded-full mb-3 overflow-hidden cursor-pointer">
            <div
              className="h-full bg-white rounded-full transition-all duration-700"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between gap-3">
            {/* Left controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={handlePlayPause}
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 active:scale-95 transition-all shadow-lg"
              >
                {hasFinished ? (
                  <RotateCcw className="w-4 h-4 text-black" />
                ) : isPlaying ? (
                  <Pause className="w-4 h-4 text-black" />
                ) : (
                  <Play className="w-4 h-4 text-black ml-0.5" />
                )}
              </button>

              <button onClick={handleMute} className="text-gray-400 hover:text-white transition-colors">
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>

              {subtitleText && (
                <button
                  onClick={() => setShowSubtitles(!showSubtitles)}
                  title="Toggle subtitles"
                  className={`transition-colors ${showSubtitles ? 'text-white' : 'text-gray-600 hover:text-gray-400'}`}
                >
                  <Subtitles className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Center: currently playing */}
            <span className="text-xs text-gray-500 font-medium">
              {hasFinished ? 'Finished' : `Scene ${currentScene + 1} / ${totalScenes}`}
            </span>

            {/* Right: download */}
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-4 py-2 bg-white text-black text-xs font-semibold rounded-lg hover:bg-gray-200 active:scale-95 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              Download
            </button>
          </div>
        </div>
      </div>

      {/* Hidden voiceover audio */}
      {voiceoverUrl && <audio ref={audioRef} src={voiceoverUrl} className="hidden" />}

      {/* ── Storyboard Details ── */}
      <div className="mt-6 bg-[#111] border border-gray-800 rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-gray-300 mb-3">Storyboard Breakdown</h3>
        <div className="space-y-2">
          {storyboard.scenes.map((scene, i) => (
            <div
              key={i}
              className={`flex gap-3 p-3 rounded-xl transition-colors ${
                i === currentScene ? 'bg-white/5 border border-white/10' : 'hover:bg-white/[0.02]'
              }`}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 ${
                i < currentScene
                  ? 'bg-green-500/20 text-green-400'
                  : i === currentScene
                  ? 'bg-white text-black'
                  : 'bg-gray-800 text-gray-500'
              }`}>
                {i < currentScene ? '✓' : i + 1}
              </div>
              <div>
                <p className={`text-sm font-medium ${i === currentScene ? 'text-white' : 'text-gray-400'}`}>
                  {scene.title}
                </p>
                <p className="text-xs text-gray-600 mt-0.5">{scene.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Script */}
      {storyboard.script && (
        <div className="mt-4 bg-[#111] border border-gray-800 rounded-2xl p-5">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Generated Script</p>
          <p className="text-sm text-gray-300 leading-relaxed">{storyboard.script}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 mt-6">
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#111] border border-gray-800 hover:border-gray-700 text-white rounded-xl transition-colors text-sm font-medium"
        >
          <RotateCcw className="w-4 h-4" />
          New Video
        </button>
        <button
          onClick={handleDownload}
          className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-black hover:bg-gray-200 rounded-xl transition-all active:scale-[0.98] text-sm font-bold shadow-lg shadow-white/10"
        >
          <Download className="w-4 h-4" />
          Download All Scenes
        </button>
      </div>
    </div>
  );
};