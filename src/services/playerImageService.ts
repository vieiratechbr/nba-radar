import { getPlayerImageUrl } from "@/utils/playerImages";

export async function getPlayerImage(playerName: string, team?: string) {
  void team;

  const localImage = getPlayerImageUrl(playerName);
  if (localImage) return localImage;

  return undefined;
}
