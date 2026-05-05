export type DraftProspect = {
  id: string;
  year: string;
  rank: number;
  projectedPick?: number;
  playerName: string;
  position: string;
  age?: number;
  height?: string;
  weight?: string;
  schoolOrTeam?: string;
  nationality?: string;
  strengths?: string[];
  weakness?: string[];
  imageUrl?: string;
};
