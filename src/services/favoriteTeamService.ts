import { getMockBestPlayerForTeam } from "@/data/mockTeamBestPlayers";
import { mockGames } from "@/data/mockGames";
import { mockStandings } from "@/data/mockStandings";
import { getRawEspnScoreboard, getEspnStandings } from "@/integrations/espn/espnAdapter";
import { normalizeEspnGames } from "@/integrations/espn/espnNormalizers";
import type {
  FavoriteTeamDashboardData,
  FavoriteTeamGame,
  FavoriteTeamSummary
} from "@/types/favoriteTeam";
import type { Game } from "@/types/game";
import type { UserProfile } from "@/types/profile";
import type { StandingTeam } from "@/types/standing";
import { toInputDate } from "@/utils/formatNbaApiDate";

function addDays(date: Date, days: number) {
  const nextDate = new Date(date);
  nextDate.setUTCDate(nextDate.getUTCDate() + days);
  return nextDate;
}

function createDateRange(startOffset: number, endOffset: number) {
  const dates: string[] = [];
  const now = new Date();

  for (let offset = startOffset; offset <= endOffset; offset += 1) {
    dates.push(toInputDate(addDays(now, offset)));
  }

  return Array.from(new Set(dates));
}

function teamFromProfile(profile: UserProfile): FavoriteTeamSummary | null {
  if (!profile.favorite_team_id || !profile.favorite_team_full_name) return null;

  return {
    id: profile.favorite_team_id,
    abbreviation: profile.favorite_team_abbreviation ?? undefined,
    name: profile.favorite_team_name ?? profile.favorite_team_full_name,
    fullName: profile.favorite_team_full_name,
    logoUrl: profile.favorite_team_logo_url ?? undefined
  };
}

function gameHasTeam(game: Game, teamAbbreviation: string) {
  const abbreviation = teamAbbreviation.toUpperCase();
  return (
    game.homeTeam?.abbreviation?.toUpperCase() === abbreviation ||
    game.visitorTeam?.abbreviation?.toUpperCase() === abbreviation
  );
}

async function getGamesForDates(dates: string[]) {
  const results = await Promise.allSettled(
    dates.map(async (date) => {
      const result = await getRawEspnScoreboard(date, 300);
      return normalizeEspnGames(result.data);
    })
  );

  return results.flatMap((result) => result.status === "fulfilled" ? result.value : []);
}

function dedupeGames(games: Game[]) {
  const seen = new Set<string>();
  return games.filter((game) => {
    if (seen.has(game.id)) return false;
    seen.add(game.id);
    return true;
  });
}

function toFavoriteTeamGame(game: Game, teamAbbreviation: string): FavoriteTeamGame {
  const abbreviation = teamAbbreviation.toUpperCase();
  const isHome = game.homeTeam?.abbreviation?.toUpperCase() === abbreviation;
  const ownTeam = isHome ? game.homeTeam : game.visitorTeam;
  const opponent = isHome ? game.visitorTeam : game.homeTeam;
  const ownScore = ownTeam?.score ?? 0;
  const opponentScore = opponent?.score ?? 0;
  const hasFinalScore = game.status === "final";

  return {
    id: game.id,
    game,
    opponent: opponent?.fullName ?? opponent?.name ?? "Adversário",
    opponentAbbreviation: opponent?.abbreviation,
    homeAway: isHome ? "home" : "away",
    result: hasFinalScore ? (ownScore > opponentScore ? "V" : "D") : "-",
    score: hasFinalScore ? `${ownScore} - ${opponentScore}` : undefined,
    href: `/jogos/${game.id}`
  };
}

async function getNextGamesForTeamWithSource(teamAbbreviation: string, daysAhead = 14) {
  try {
    const games = await getGamesForDates(createDateRange(0, daysAhead));
    return {
      source: "espn" as const,
      games: dedupeGames(games)
      .filter((game) => gameHasTeam(game, teamAbbreviation))
      .filter((game) => game.status !== "final")
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 5)
        .map((game) => toFavoriteTeamGame(game, teamAbbreviation))
    };
  } catch {
    return {
      source: "mock" as const,
      games: mockGames
        .filter((game) => gameHasTeam(game, teamAbbreviation))
        .map((game) => toFavoriteTeamGame(game, teamAbbreviation))
    };
  }
}

export async function getNextGamesForTeam(teamAbbreviation: string, daysAhead = 14) {
  const result = await getNextGamesForTeamWithSource(teamAbbreviation, daysAhead);
  return result.games;
}

async function getRecentGamesForTeamWithSource(teamAbbreviation: string, daysBack = 30) {
  try {
    const games = await getGamesForDates(createDateRange(-daysBack, 0));
    return {
      source: "espn" as const,
      games: dedupeGames(games)
      .filter((game) => gameHasTeam(game, teamAbbreviation))
      .filter((game) => game.status === "final")
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5)
        .map((game) => toFavoriteTeamGame(game, teamAbbreviation))
    };
  } catch {
    return {
      source: "mock" as const,
      games: mockGames
        .filter((game) => gameHasTeam(game, teamAbbreviation))
        .map((game) => toFavoriteTeamGame(game, teamAbbreviation))
    };
  }
}

export async function getRecentGamesForTeam(teamAbbreviation: string, daysBack = 30) {
  const result = await getRecentGamesForTeamWithSource(teamAbbreviation, daysBack);
  return result.games;
}

export async function getStandingForTeam(teamAbbreviation: string) {
  const abbreviation = teamAbbreviation.toUpperCase();
  let source: FavoriteTeamDashboardData["source"]["standings"] = "espn";
  let standings: StandingTeam[] = [];

  try {
    standings = await getEspnStandings();
  } catch {
    source = "mock";
    standings = mockStandings;
  }

  return {
    source,
    standing: standings.find((team) => team.abbreviation.toUpperCase() === abbreviation) ?? null
  };
}

export async function getBestPlayerForTeam(teamAbbreviation: string) {
  const player = getMockBestPlayerForTeam(teamAbbreviation);

  return {
    player,
    source: player?.source ?? "unavailable" as const
  };
}

export async function getFavoriteTeamDashboard(profile: UserProfile): Promise<FavoriteTeamDashboardData | null> {
  const team = teamFromProfile(profile);
  const abbreviation = team?.abbreviation;

  if (!team || !abbreviation) return null;

  const [nextGamesResult, recentGamesResult, standingResult, bestPlayerResult] = await Promise.all([
    getNextGamesForTeamWithSource(abbreviation),
    getRecentGamesForTeamWithSource(abbreviation),
    getStandingForTeam(abbreviation),
    getBestPlayerForTeam(abbreviation)
  ]);
  const nextGames = nextGamesResult.games;
  const recentGames = recentGamesResult.games;

  return {
    profile,
    team,
    nextGames,
    recentGames,
    standing: standingResult.standing,
    bestPlayer: bestPlayerResult.player,
    recentForm: recentGames.map((game) => game.result ?? "-").slice(0, 5),
    source: {
      games: nextGamesResult.source === "mock" || recentGamesResult.source === "mock" ? "mock" : "espn",
      standings: standingResult.source,
      bestPlayer: bestPlayerResult.source
    },
    message:
      nextGames.length || recentGames.length || standingResult.standing
        ? undefined
        : "Ainda não encontramos dados suficientes para este time."
  };
}
