import type { GameStatus, TeamSide } from "@/types/game";

export type GameDetails = {
  id: string;
  name: string;
  shortName?: string;
  date: string;
  status: GameStatus;
  period?: number;
  clock?: string;
  venue?: string;
  city?: string;
  homeTeam: TeamSide & {
    record?: string;
  };
  visitorTeam: TeamSide & {
    record?: string;
  };
  linescore?: {
    period: string;
    homeScore: number;
    visitorScore: number;
  }[];
  leaders?: GameLeader[];
  teamStats?: TeamStatGroup[];
  playerStats?: PlayerBoxScore[];
  plays?: GamePlay[];
  source: "espn";
};

export type GameLeader = {
  team: string;
  athleteName: string;
  athleteShortName?: string;
  athleteHeadshot?: string;
  category: string;
  value: string;
};

export type TeamStatGroup = {
  team: string;
  stats: {
    label: string;
    value: string;
  }[];
};

export type PlayerBoxScore = {
  team: string;
  athleteName: string;
  athleteId?: string;
  position?: string;
  minutes?: string;
  points?: string | number;
  rebounds?: string | number;
  assists?: string | number;
  steals?: string | number;
  blocks?: string | number;
  turnovers?: string | number;
  fieldGoals?: string;
  threePointers?: string;
  freeThrows?: string;
};

export type GamePlay = {
  id: string;
  period?: number;
  clock?: string;
  team?: string;
  text: string;
  originalText?: string;
  score?: string;
  type?: string;
};
