export const DRAFT_PLAYER_IMAGES: Record<string, string> = {};

export function getDraftPlayerImageUrl(playerName?: string, fallback?: string) {
  if (!playerName) return undefined;
  return DRAFT_PLAYER_IMAGES[playerName] ?? fallback;
}
