import type { GameHighlight } from "@/types/highlight";

const allowedHostnames = [
  "espn.com",
  "espncdn.com",
  "youtube.com",
  "youtube-nocookie.com",
  "vimeo.com"
];

function parseUrl(url?: string) {
  if (!url) return null;

  try {
    const parsedUrl = new URL(url);
    return parsedUrl.protocol === "https:" ? parsedUrl : null;
  } catch {
    return null;
  }
}

function isAllowedHostname(hostname: string) {
  return allowedHostnames.some((allowedHostname) => (
    hostname === allowedHostname || hostname.endsWith(`.${allowedHostname}`)
  )) || hostname === "player.vimeo.com";
}

export function isSafeEmbedUrl(url?: string) {
  const parsedUrl = parseUrl(url);
  return Boolean(parsedUrl && isAllowedHostname(parsedUrl.hostname));
}

export function isDirectVideoUrl(url?: string) {
  const parsedUrl = parseUrl(url);
  if (!parsedUrl || !isAllowedHostname(parsedUrl.hostname)) return false;
  return /\.(mp4|webm|ogg)(\?|$)/i.test(parsedUrl.pathname);
}

export function getBestVideoDisplayMode(highlight: GameHighlight): "iframe" | "video" | "external" {
  if (isDirectVideoUrl(highlight.embedUrl) || isDirectVideoUrl(highlight.videoUrl)) return "video";
  if (isSafeEmbedUrl(highlight.embedUrl)) return "iframe";
  return "external";
}

export function getVideoSourceUrl(highlight: GameHighlight) {
  if (isDirectVideoUrl(highlight.embedUrl)) return highlight.embedUrl ?? "";
  if (isDirectVideoUrl(highlight.videoUrl)) return highlight.videoUrl ?? "";
  return highlight.embedUrl ?? highlight.videoUrl ?? "";
}
