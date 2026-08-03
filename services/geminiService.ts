import { GoogleGenAI } from "@google/genai";
import {
  VideoConfig, VideoAspectRatio, VideoResolution,
  DURATION_SCENE_MAP, Scene, Storyboard, GenerationResult,
  Language, VoiceGender, VoiceStyle, CameraMovement, CreativityLevel,
  PresenterGender, MusicStyle
} from "../types";
import { VIDEO_TEMPLATES } from "../components/Templates";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getApiKey = (): string => {
  return (window as any).__GEMINI_API_KEY__ || process.env.API_KEY || '';
};

// Map Square to 16:9 since Veo doesn't support 1:1
const getVeoAspectRatio = (ar: VideoAspectRatio): string => {
  return ar === VideoAspectRatio.Square ? '16:9' : ar;
};

// ─── Step 1 & 2: Generate Storyboard ─────────────────────────────────────────

export const generateStoryboard = async (
  config: VideoConfig,
  ai: GoogleGenAI,
  onProgress: (msg: string) => void
): Promise<Storyboard> => {
  onProgress("🎬 Generating campaign storyboard...");

  const sceneCount = DURATION_SCENE_MAP[config.duration];
  const secPerScene = Math.round(config.duration / sceneCount);

  const systemPrompt = `You are a professional video marketing director. Create a detailed storyboard for a marketing video.
Return ONLY valid JSON — no markdown, no code fences.`;

  const userPrompt = `Create a ${config.duration}-second marketing video storyboard with exactly ${sceneCount} scene(s).

Campaign Details:
- Industry: ${config.industry}
- Topic: ${config.topic}
- Campaign Objective: ${config.campaignObjective}
- Hook/Overlay Text: ${config.hookText || 'None'}
- Visual Style: ${config.style}
- Language: ${config.language}
- CTA: ${config.ctaType === 'Custom' ? config.ctaCustomText : config.ctaType}
- Voice: ${config.voiceEnabled ? `${config.voiceGender} ${config.voiceStyle}` : 'No voiceover'}
- AI Presenter: ${config.aiPresenterEnabled ? config.presenterGender : 'None'}

Return this exact JSON structure:
{
  "campaignTitle": "string",
  "script": "full voiceover script in ${config.language}",
  "scenes": [
    {
      "index": 0,
      "title": "Scene name",
      "description": "Visual description of what happens",
      "prompt": "Detailed Veo video generation prompt with style keywords",
      "duration": ${secPerScene}
    }
  ]
}

For the storyboard pattern use this for ${config.campaignObjective}:
- Scene 1: Attention-grabbing hook${sceneCount >= 2 ? '\n- Scene 2: Main subject/product showcase' : ''}${sceneCount >= 3 ? '\n- Scene 3: Benefits/features/atmosphere' : ''}${sceneCount >= 4 ? '\n- Scene 4: CTA / brand moment' : ''}${sceneCount >= 5 ? '\n- Scene 5: Social proof or detail shot' : ''}${sceneCount >= 6 ? '\n- Scene 6: Final CTA with brand logo' : ''}

Each scene prompt should incorporate: ${config.style}
Camera movement: ${config.cameraMovement}`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
    config: {
      systemInstruction: systemPrompt,
      temperature: config.creativityLevel === CreativityLevel.High ? 1.2 :
                   config.creativityLevel === CreativityLevel.Medium ? 0.8 : 0.4,
    }
  });

  const raw = response.text?.trim() || '';
  // Strip any accidental markdown fences
  const cleaned = raw.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();

  try {
    const parsed = JSON.parse(cleaned) as Storyboard;
    return parsed;
  } catch {
    // Fallback storyboard if parse fails
    return buildFallbackStoryboard(config, sceneCount, secPerScene);
  }
};

const buildFallbackStoryboard = (config: VideoConfig, sceneCount: number, secPerScene: number): Storyboard => {
  const sceneTemplates = [
    { title: 'Opening Hook', description: `Bold cinematic opening for ${config.industry}`, },
    { title: 'Product Showcase', description: `Showcase of ${config.topic}` },
    { title: 'Feature Highlight', description: 'Key benefits and atmosphere' },
    { title: 'Brand Moment', description: 'Premium brand identity' },
    { title: 'Customer Story', description: 'Social proof and testimonial' },
    { title: 'CTA Screen', description: 'Final call to action' },
    { title: 'Brand Closing', description: 'Logo and brand outro' },
    { title: 'End Card', description: 'Contact and social links' },
  ];

  const scenes: Scene[] = Array.from({ length: sceneCount }, (_, i) => ({
    index: i,
    title: sceneTemplates[i]?.title || `Scene ${i + 1}`,
    description: sceneTemplates[i]?.description || `Scene ${i + 1}`,
    prompt: `${config.style} ${config.industry} marketing video, ${config.topic}, ${
      config.cameraMovement === CameraMovement.DroneStyle ? 'aerial drone shot' :
      config.cameraMovement === CameraMovement.SlowPan ? 'slow cinematic pan' :
      config.cameraMovement === CameraMovement.Cinematic ? 'cinematic steadicam' : 'smooth camera movement'
    }, professional commercial quality, 4K`,
    duration: secPerScene,
  }));

  return {
    campaignTitle: `${config.topic} — ${config.industry} Campaign`,
    script: `Welcome to ${config.hookText || config.topic}. ${config.industry} at its finest. ${config.ctaType}.`,
    scenes,
  };
};

// ─── Step 3-4: Generate Videos Per Scene ─────────────────────────────────────

export const generateSceneVideo = async (
  scene: Scene,
  config: VideoConfig,
  apiKey: string,
  ai: GoogleGenAI,
  onProgress: (msg: string) => void
): Promise<string> => {
  onProgress(`🎥 Generating Scene ${scene.index + 1}: ${scene.title}...`);

  // Enrich prompt with style, presenter, motion tracking
  let enrichedPrompt = scene.prompt;

  if (config.aiPresenterEnabled && config.presenterGender !== PresenterGender.None) {
    enrichedPrompt += ` Include a ${config.presenterGender.toLowerCase()} professional ${config.industry} brand presenter speaking to camera.`;
  }

  if (config.motionTrackingEnabled) {
    enrichedPrompt += ` Use dynamic tracking shots, smooth dolly movements, and cinematic transitions.`;
  }

  if (config.hookText && scene.index === 0) {
    enrichedPrompt += ` Feature prominent text overlay: "${config.hookText}".`;
  }

  const generationConfig: any = {
    numberOfVideos: 1,
    resolution: config.videoQuality,
    aspectRatio: getVeoAspectRatio(config.aspectRatio),
  };

  let operation;

  // Use logo as reference image for first scene if available
  if (config.logoImage && scene.index === 0) {
    const base64Data = config.logoImage.split(',')[1];
    operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: enrichedPrompt,
      image: { imageBytes: base64Data, mimeType: 'image/png' },
      config: generationConfig,
    });
  } else if (config.productImages?.length > 0 && scene.index === 1) {
    const base64Data = config.productImages[0].split(',')[1];
    operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: enrichedPrompt,
      image: { imageBytes: base64Data, mimeType: 'image/jpeg' },
      config: generationConfig,
    });
  } else {
    operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: enrichedPrompt,
      config: generationConfig,
    });
  }

  // Poll until done
  const statusMessages = [
    `Rendering frames for Scene ${scene.index + 1}...`,
    `Applying ${config.styleId} style to Scene ${scene.index + 1}...`,
    `Color grading Scene ${scene.index + 1}...`,
    `Finalizing Scene ${scene.index + 1}...`,
  ];
  let msgIdx = 0;

  while (!operation.done) {
    await new Promise((r) => setTimeout(r, 5000));
    onProgress(statusMessages[msgIdx % statusMessages.length]);
    msgIdx++;
    operation = await ai.operations.getVideosOperation({ operation });
  }

  if (operation.error) {
    throw new Error(operation.error.message || `Scene ${scene.index + 1} generation failed.`);
  }

  const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
  if (!videoUri) throw new Error(`No video URI for Scene ${scene.index + 1}.`);

  return `${videoUri}&key=${apiKey}`;
};

// ─── Step 5: Generate Voiceover ───────────────────────────────────────────────

export const generateVoiceover = async (
  script: string,
  config: VideoConfig,
  ai: GoogleGenAI,
  onProgress: (msg: string) => void
): Promise<string | undefined> => {
  if (!config.voiceEnabled) return undefined;
  onProgress("🎙️ Generating AI voiceover...");

  try {
    const voiceName = config.voiceGender === VoiceGender.Female
      ? config.voiceStyle === VoiceStyle.Luxury ? 'Aoede'
        : config.voiceStyle === VoiceStyle.Energetic ? 'Zephyr'
        : 'Kore'
      : config.voiceStyle === VoiceStyle.Authority ? 'Orus'
        : config.voiceStyle === VoiceStyle.Energetic ? 'Fenrir'
        : 'Charon';

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-preview-tts',
      contents: [{ role: 'user', parts: [{ text: script }] }],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName } },
        },
      } as any,
    });

    const audioPart = response.candidates?.[0]?.content?.parts?.find((p: any) => p.inlineData?.mimeType?.startsWith('audio'));
    if (!audioPart?.inlineData) return undefined;

    const { data, mimeType } = audioPart.inlineData;
    const byteChars = atob(data);
    const byteArr = new Uint8Array(byteChars.length);
    for (let i = 0; i < byteChars.length; i++) byteArr[i] = byteChars.charCodeAt(i);
    const blob = new Blob([byteArr], { type: mimeType || 'audio/wav' });
    return URL.createObjectURL(blob);
  } catch (e) {
    console.warn('Voiceover generation failed:', e);
    return undefined;
  }
};

// ─── Step 6: Generate Subtitles ───────────────────────────────────────────────

export const generateSubtitles = async (
  storyboard: Storyboard,
  config: VideoConfig,
  ai: GoogleGenAI,
  onProgress: (msg: string) => void
): Promise<string | undefined> => {
  if (!config.subtitlesEnabled) return undefined;
  onProgress("📝 Generating subtitles...");

  try {
    const prompt = `Generate subtitle captions for this video script. 
Create one short caption line per scene (max 8 words each).
Return just the lines, one per line, no numbering.

Script: ${storyboard.script}
Number of scenes: ${storyboard.scenes.length}
Language: ${config.language}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });

    return response.text?.trim() || undefined;
  } catch (e) {
    console.warn('Subtitle generation failed:', e);
    return undefined;
  }
};

// ─── Main Orchestrator ────────────────────────────────────────────────────────

export const generateVideo = async (
  config: VideoConfig,
  apiKey: string,
  onProgress: (msg: string, step?: string, current?: number, total?: number) => void
): Promise<GenerationResult> => {
  const ai = new GoogleGenAI({ apiKey });

  // Step 1 & 2: Storyboard
  onProgress("🎬 Generating campaign storyboard...", 'storyboard');
  const storyboard = await generateStoryboard(config, ai, (msg) => onProgress(msg, 'storyboard'));

  onProgress(`✅ Storyboard ready: ${storyboard.scenes.length} scenes`, 'scene_prompts');
  await new Promise((r) => setTimeout(r, 500));

  // Steps 3–4: Generate videos per scene
  onProgress("🎥 Starting video generation...", 'generating_videos', 0, storyboard.scenes.length);
  const sceneVideos: string[] = [];

  for (const scene of storyboard.scenes) {
    const videoUrl = await generateSceneVideo(
      scene, config, apiKey, ai,
      (msg) => onProgress(msg, 'generating_videos', scene.index, storyboard.scenes.length)
    );
    sceneVideos.push(videoUrl);
    onProgress(`✅ Scene ${scene.index + 1} complete`, 'generating_videos', scene.index + 1, storyboard.scenes.length);
  }

  // Step 5: Voiceover
  onProgress("🎙️ Generating AI voiceover...", 'voiceover');
  const voiceoverUrl = await generateVoiceover(storyboard.script, config, ai, (msg) => onProgress(msg, 'voiceover'));

  // Step 6: Subtitles
  onProgress("📝 Generating subtitles...", 'subtitles');
  const subtitleText = await generateSubtitles(storyboard, config, ai, (msg) => onProgress(msg, 'subtitles'));

  // Step 7: Music (noted in UI)
  onProgress("🎵 Applying music settings...", 'music');
  await new Promise((r) => setTimeout(r, 400));

  // Step 8: Packaging (player handles seamless scene chaining)
  onProgress("🔗 Packaging your video...", 'merging');
  await new Promise((r) => setTimeout(r, 300));

  onProgress("✅ Your video is ready!", 'complete');

  return { storyboard, sceneVideos, voiceoverUrl, subtitleText };
};

export const parseAIPrompt = async (
  promptText: string,
  apiKey: string
): Promise<Partial<VideoConfig>> => {
  const ai = new GoogleGenAI({ apiKey });
  const systemPrompt = `You are an expert AI marketing director. The user will ask you to create a video campaign (e.g. "Create a luxury jewellery launch campaign").
Analyze their request and output a JSON object representing the configuration updates to apply to the campaign settings.
Ensure you ONLY output a valid JSON object matching this schema (do NOT include markdown formatting or code fences):
{
  "industry": "string (capitalized name of the industry/niche)",
  "topic": "string (the product or main topic of the campaign)",
  "campaignObjective": "one of: Product Launch, Store Opening, Sale Promotion, Festival Campaign, Brand Awareness, New Collection Launch, Event Promotion, Lead Generation",
  "hookText": "string (a catchy, punchy opening text overlay for the video, max 8 words)",
  "aspectRatio": "one of: 16:9, 9:16, 1:1",
  "duration": 8, 15, 30, 45, or 60,
  "styleId": "one of: luxury, corporate, cinematic, lifestyle, minimalist, cyberpunk",
  "voiceEnabled": true or false,
  "voiceGender": "one of: Male, Female",
  "voiceStyle": "one of: Professional, Luxury, Energetic, Friendly, Storytelling, Authority",
  "subtitlesEnabled": true or false,
  "captionStyle": "one of: Modern, Bold, Luxury, Minimal, TikTok",
  "musicStyle": "one of: Auto Select, Luxury, Corporate, Energetic, Cinematic, Motivational, None"
}
Ensure the values are highly tailored and appropriate for the user's campaign description. Choose values matching the exact enums specified.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: [{ role: 'user', parts: [{ text: promptText }] }],
    config: {
      systemInstruction: systemPrompt,
      temperature: 0.2,
    }
  });

  const raw = response.text?.trim() || '';
  const cleaned = raw.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
  try {
    const parsed = JSON.parse(cleaned);
    const template = VIDEO_TEMPLATES.find((t) => t.id === parsed.styleId);
    if (template) {
      parsed.style = template.promptModifier;
    }
    // Convert duration to number
    if (parsed.duration) {
      parsed.duration = Number(parsed.duration);
    }
    return parsed;
  } catch (err) {
    console.error('Failed to parse AI prompt:', err);
    return {};
  }
};