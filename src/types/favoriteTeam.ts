import type { Game } from "@/types/game";
import type { UserProfile } from "@/types/profile";
import type { StandingTeam } from "@/types/standing";

export type FavoriteTeamSummary = {
  id: string;
  abbreviation?: string;
  name: string;
  fullName: string;
  logoUrl?: string;
};

export type FavoriteTeamGame = {
  id: string;
  game: Game;
  opponent: string;
  opponentAbbreviation?: string;
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

export type FavoriteTeamDashboardData = {
  profile: UserProfile;
  team: FavoriteTeamSummary;
  nextGames: FavoriteTeamGame[];
  recentGames: FavoriteTeamGame[];
  standing: StandingTeam | null;
  bestPlayer: TeamBestPlayer | null;
  recentForm: ("V" | "D" | "-")[];
  source: {
    games: "espn" | "mock" | "unavailable";
    standings: "espn" | "mock" | "unavailable";
    bestPlayer: "espn" | "highlightly" | "mock" | "unavailable";
  };
  message?: string;
};
