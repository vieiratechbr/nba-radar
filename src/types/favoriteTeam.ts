import type { Game } from "@/types/game";
import type { UserProfile } from "@/types/profile";
import type { StandingTeam } from "@/types/standing";

export type DashboardDataSource = "espn" | "highlightly" | "mock" | "local" | "unavailable";

export type FavoriteTeamSummary = {
  id: string;
  abbreviation?: string;
  name: string;
  fullName: string;
  logoUrl?: string;
  city?: string;
  conference?: string;
  division?: string;
  arena?: string;
  coach?: string;
  record?: string;
  conferenceRank?: number;
};

export type FavoriteTeamGame = {
  id: string;
  game: Game;
  opponent: string;
  opponentAbbreviation?: string;
  opponentLogoUrl?: string;
  homeAway: "home" | "away";
  result?: "V" | "D" | "-";
  score?: string;
  href: string;
};

export type TeamBestPlayer = {
  id?: string;
  name: string;
  teamAbbreviation: string;
  imageUrl?: string;
  position?: string;
  pointsPerGame?: number;
  reboundsPerGame?: number;
  assistsPerGame?: number;
  summary?: string;
  source: "espn" | "highlightly" | "mock" | "unavailable";
};

export type TeamPlayer = {
  id: string;
  name: string;
  position?: string;
  jersey?: string;
  age?: number;
  height?: string;
  weight?: string;
  imageUrl?: string;
  source: "espn" | "highlightly" | "mock";
};

export type TeamStatMetric = {
  label: string;
  value: string;
  abbreviation?: string;
};

export type TeamStats = {
  metrics: TeamStatMetric[];
  source: DashboardDataSource;
};

export type TeamLegend = {
  id: string;
  teamAbbreviation: string;
  name: string;
  years?: string;
  position?: string;
  imageUrl?: string;
  description?: string;
};

export type TeamHistory = {
  teamAbbreviation: string;
  founded?: string;
  city?: string;
  arena?: string;
  championships?: number;
  conferenceTitles?: number;
  divisionTitles?: number;
  summary?: string;
};

export type FavoriteTeamDashboardData = {
  profile: UserProfile;
  team: FavoriteTeamSummary;
  nextGames: FavoriteTeamGame[];
  recentGames: FavoriteTeamGame[];
  standing: StandingTeam | null;
  bestPlayer: TeamBestPlayer | null;
  recentForm: ("V" | "D" | "-")[];
  roster: TeamPlayer[];
  legends: TeamLegend[];
  history: TeamHistory | null;
  teamStats: TeamStats | null;
  sources: {
    games: DashboardDataSource;
    standings: DashboardDataSource;
    bestPlayer: DashboardDataSource;
    roster: DashboardDataSource;
    legends: DashboardDataSource;
    history: DashboardDataSource;
    teamStats: DashboardDataSource;
  };
  source: {
    games: "espn" | "mock" | "unavailable";
    standings: "espn" | "mock" | "unavailable";
    bestPlayer: "espn" | "highlightly" | "mock" | "unavailable";
  };
  message?: string;
};
