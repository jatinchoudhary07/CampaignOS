// ─── Enums ───────────────────────────────────────────────────────────────────

export enum VideoAspectRatio {
  Horizontal = '16:9',
  Vertical = '9:16',
  Square = '1:1', // UI only — maps to 16:9 for Veo API
}

export enum VideoResolution {
  HD = '720p',
  FHD = '1080p',
}

export enum CampaignObjective {
  ProductLaunch = 'Product Launch',
  StoreOpening = 'Store Opening',
  SalePromotion = 'Sale Promotion',
  FestivalCampaign = 'Festival Campaign',
  BrandAwareness = 'Brand Awareness',
  NewCollectionLaunch = 'New Collection Launch',
  EventPromotion = 'Event Promotion',
  LeadGeneration = 'Lead Generation',
}

export enum Language {
  English = 'English',
  Hindi = 'Hindi',
  Hinglish = 'Hinglish',
}

export enum VoiceGender {
  Male = 'Male',
  Female = 'Female',
}

export enum VoiceStyle {
  Professional = 'Professional',
  Luxury = 'Luxury',
  Energetic = 'Energetic',
  Friendly = 'Friendly',
  Storytelling = 'Storytelling',
  Authority = 'Authority',
}

export enum CaptionStyle {
  Modern = 'Modern',
  Bold = 'Bold',
  Luxury = 'Luxury',
  Minimal = 'Minimal',
  TikTok = 'TikTok',
}

export enum MusicStyle {
  AutoSelect = 'Auto Select',
  Luxury = 'Luxury',
  Corporate = 'Corporate',
  Energetic = 'Energetic',
  Cinematic = 'Cinematic',
  Motivational = 'Motivational',
  None = 'None',
}

export enum PresenterGender {
  Male = 'Male',
  Female = 'Female',
  None = 'None',
}

export enum CTAType {
  ShopNow = 'Shop Now',
  VisitStore = 'Visit Store',
  LearnMore = 'Learn More',
  BookAppointment = 'Book Appointment',
  CallNow = 'Call Now',
  Custom = 'Custom',
}

export enum CameraMovement {
  Auto = 'Auto',
  SlowPan = 'Slow Pan',
  FastMotion = 'Fast Motion',
  Cinematic = 'Cinematic',
  DroneStyle = 'Drone Style',
}

export enum CreativityLevel {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
}

// ─── Duration Map ────────────────────────────────────────────────────────────

export const DURATION_SCENE_MAP: Record<number, number> = {
  8: 1,
  15: 2,
  30: 4,
  45: 6,
  60: 8,
};

// ─── Main Config ─────────────────────────────────────────────────────────────

export interface VideoConfig {
  // Section 1: Campaign Concept
  industry: string;
  topic: string;
  campaignObjective: CampaignObjective;
  hookText: string;

  // Section 2: Output Format
  aspectRatio: VideoAspectRatio;

  // Section 3: Duration
  duration: number; // seconds: 8 | 15 | 30 | 45 | 60

  // Section 4: Visual Style
  style: string;
  styleId: string;

  // Section 5: Language
  language: Language;

  // Section 6: Voice
  voiceEnabled: boolean;
  voiceGender: VoiceGender;
  voiceStyle: VoiceStyle;

  // Section 7: Subtitles
  subtitlesEnabled: boolean;
  captionStyle: CaptionStyle;

  // Section 8: Background Music
  musicStyle: MusicStyle;

  // Section 9: Brand Assets
  logoImage?: string;       // base64
  productImages: string[];  // base64[]

  // Section 10: AI Presenter
  aiPresenterEnabled: boolean;
  presenterGender: PresenterGender;

  // Section 11: Motion Tracking
  motionTrackingEnabled: boolean;

  // Section 12: CTA
  ctaType: CTAType;
  ctaCustomText: string;

  // Section 13: Advanced Settings
  creativityLevel: CreativityLevel;
  cameraMovement: CameraMovement;
  videoQuality: VideoResolution;
}

// ─── Generation Types ─────────────────────────────────────────────────────────

export interface Scene {
  index: number;
  title: string;
  description: string;
  prompt: string;
  duration: number; // seconds
  videoUrl?: string;
}

export interface Storyboard {
  campaignTitle: string;
  script: string;
  scenes: Scene[];
}

export interface GenerationResult {
  storyboard: Storyboard;
  sceneVideos: string[];     // Individual Veo scene URLs
  mergedVideoUrl?: string;   // Single merged MP4 blob URL (primary)
  voiceoverUrl?: string;     // TTS audio blob URL
  subtitleText?: string;     // Caption lines
}

export type GenerationStep =
  | 'idle'
  | 'storyboard'
  | 'scene_prompts'
  | 'generating_videos'
  | 'voiceover'
  | 'subtitles'
  | 'music'
  | 'merging'
  | 'complete'
  | 'error';

export interface GenerationStatus {
  step: GenerationStep;
  message?: string;
  progress?: number;         // 0–100
  currentScene?: number;     // which scene is being generated
  totalScenes?: number;
  result?: GenerationResult;
}

// ─── Template ─────────────────────────────────────────────────────────────────

export interface Template {
  id: string;
  name: string;
  description: string;
  previewGradient: string;
  accentColor: string;
  promptModifier: string;
  tags: string[];
}
