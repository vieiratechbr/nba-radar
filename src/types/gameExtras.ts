import type { GameHighlight } from "@/types/highlight";

export type GamePrediction = {
  source: "highlightly";
  homeWinProbability?: number;
  visitorWinProbability?: number;
  drawProbability?: number;
  summary?: string;
};

export type HeadToHeadSummary = {
  source: "highlightly";
  totalGames?: number;
  homeWins?: number;
  visitorWins?: number;
  lastMeetings?: {
    id: string;
    date: string;
    homeTeam: string;
    visitorTeam: string;
    homeScore?: number;
    visitorScore?: number;
  }[];
};

export type LastFiveGame = {
  id: string;
  date: string;
  opponent: string;
  result?: "W" | "L" | "-";
  homeAway?: "home" | "away";
  score?: string;
};

export type TeamRecentForm = {
  teamId: string;
  teamName: string;
  games: LastFiveGame[];
};

export type GameExtras = {
  highlights: GameHighlight[];
  prediction: GamePrediction | null;
  headToHead: HeadToHeadSummary | null;
  recentForm: {
    home: TeamRecentForm | null;
    visitor: TeamRecentForm | null;
  };
  source: "highlightly" | "none";
  message?: string;
  debug?: {
    highlightlyMatchId?: string;
    reason?: string;
    lookup?: unknown;
  };
};
