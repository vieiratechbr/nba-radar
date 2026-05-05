export type GameStatus = "scheduled" | "live" | "final";
export type GameDay = "yesterday" | "today" | "tomorrow";

export interface TeamSide {
  id?: number | string;
  name: string;
  fullName: string;
  abbreviation: string;
  score: number;
  logoUrl?: string;
  color?: string;
}

export interface Game {
  id: string;
  date: string;
  day?: GameDay;
  homeTeamId?: string;
  awayTeamId?: string;
  homeScore?: number;
  awayScore?: number;
  status: GameStatus;
  period?: number | string;
  clock?: string;
  time?: string;
  arena?: string;
  city?: string;
  highlight?: string;
  featured?: boolean;
  homeTeam?: TeamSide;
  visitorTeam?: TeamSide;
  source?: string;
}
