export type AwardWinner = {
  id: string;
  season: string;
  award: string;
  playerName?: string;
  team?: string;
  position?: string;
  imageUrl?: string;
  summary?: string;
  status?: "confirmed" | "pending";
  source?: "espn" | "mock" | "manual";
};
