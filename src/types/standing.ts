export type StandingTeam = {
  id: string;
  rank: number;
  name: string;
  fullName: string;
  abbreviation: string;
  logoUrl?: string;
  conference?: "Leste" | "Oeste" | string;
  division?: string;
  wins: number;
  losses: number;
  winPercentage?: string;
  gamesBehind?: string;
  lastTen?: string;
  streak?: string;
  homeRecord?: string;
  awayRecord?: string;
};
