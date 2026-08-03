// Video merger is handled directly in the VideoPlayer component
// using sequential auto-play (no FFmpeg.wasm needed).
// This file is kept as a no-op for import compatibility.

export const mergeVideos = async (
  videoUrls: string[],
  _onProgress: (msg: string) => void
): Promise<string | undefined> => {
  // No merge — player handles sequential playback
  return undefined;
};
