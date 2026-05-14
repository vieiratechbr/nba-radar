import { getMockBestPlayerForTeam } from "@/data/mockTeamBestPlayers";
import { mockGames } from "@/data/mockGames";
import { mockStandings } from "@/data/mockStandings";
import { mockTeams } from "@/data/mockTeams";
import { getTeamHistory } from "@/data/teamHistory";
import { getTeamLegends } from "@/data/teamLegends";
import {
  getEspnStandings,
  getEspnTeams,
  getRawEspnScoreboard,
  getRawEspnScoreboardRange
} from "@/integrations/espn/espnAdapter";
import { normalizeEspnGames } from "@/integrations/espn/espnNormalizers";
import { getEspnTeamRoster } from "@/integrations/espn/espnRoster";
import { getEspnTeamStats } from "@/integrations/espn/espnTeamStats";
import type {
  DashboardDataSource,
  FavoriteTeamDashboardData,
  FavoriteTeamGame,
  FavoriteTeamSummary,
  TeamStats
} from "@/types/favoriteTeam";
import type { Game } from "@/types/game";
import type { UserProfile } from "@/types/profile";
import type { StandingTeam } from "@/types/standing";
import type { Team } from "@/types/team";
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

async function getGamesForDateRange(startOffset: number, endOffset: number) {
  const now = new Date();
  const startDate = toInputDate(addDays(now, startOffset));
  const endDate = toInputDate(addDays(now, endOffset));

  try {
    const result = await getRawEspnScoreboardRange(startDate, endDate, 600);
    const rangeGames = normalizeEspnGames(result.data);
    if (rangeGames.length) return rangeGames;
  } catch {
    // Fallback abaixo busca por dia quando a ESPN não responde bem ao range.
  }

  const dates = createDateRange(startOffset, endOffset);
  const results = await Promise.allSettled(
    dates.map(async (date) => {
      const result = await getRawEspnScoreboard(date, 600);
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
    opponentLogoUrl: opponent?.logoUrl,
    homeAway: isHome ? "home" : "away",
    result: hasFinalScore ? (ownScore > opponentScore ? "V" : "D") : "-",
    score: hasFinalScore ? `${ownScore} - ${opponentScore}` : undefined,
    href: `/jogos/${game.id}`
  };
}

async function getNextGamesForTeamWithSource(teamAbbreviation: string, daysAhead = 30) {
  try {
    const games = await getGamesForDateRange(0, daysAhead);
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

export async function getNextGamesForTeam(teamAbbreviation: string, daysAhead = 30) {
  const result = await getNextGamesForTeamWithSource(teamAbbreviation, daysAhead);
  return result.games;
}

async function getRecentGamesForTeamWithSource(teamAbbreviation: string, daysBack = 45) {
  try {
    const games = await getGamesForDateRange(-daysBack, 0);
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

export async function getRecentGamesForTeam(teamAbbreviation: string, daysBack = 45) {
  const result = await getRecentGamesForTeamWithSource(teamAbbreviation, daysBack);
  return result.games;
}

export async function getStandingForTeam(teamAbbreviation: string) {
  const abbreviation = teamAbbreviation.toUpperCase();
  let source: FavoriteTeamDashboardData["sources"]["standings"] = "espn";
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

function findTeamByAbbreviation(teams: Team[], abbreviation: string) {
  return teams.find((team) => team.abbreviation?.toUpperCase() === abbreviation.toUpperCase()) ?? null;
}

async function getTeamMeta(team: FavoriteTeamSummary, standing: StandingTeam | null) {
  const abbreviation = team.abbreviation?.toUpperCase();
  if (!abbreviation) return team;

  let espnTeam: Team | null = null;

  try {
    espnTeam = findTeamByAbbreviation(await getEspnTeams(), abbreviation);
  } catch {
    espnTeam = findTeamByAbbreviation(mockTeams, abbreviation);
  }

  const history = getTeamHistory(abbreviation);

  return {
    ...team,
    id: espnTeam?.id ?? team.id,
    name: espnTeam?.name ?? team.name,
    fullName: espnTeam?.fullName ?? team.fullName,
    logoUrl: espnTeam?.logoUrl ?? team.logoUrl,
    city: history?.city ?? espnTeam?.city,
    conference: standing?.conference ?? espnTeam?.conference,
    division: standing?.division ?? espnTeam?.division,
    arena: history?.arena,
    record: standing ? `${standing.wins}-${standing.losses}` : espnTeam?.record,
    conferenceRank: standing?.rank
  };
}

async function getRosterForTeam(teamAbbreviation: string) {
  try {
    const roster = await getEspnTeamRoster(teamAbbreviation);
    return {
      source: roster.length ? "espn" as const : "unavailable" as const,
      roster
    };
  } catch {
    return {
      source: "unavailable" as const,
      roster: []
    };
  }
}

async function getTeamStatsForTeam(teamAbbreviation: string): Promise<{ source: DashboardDataSource; stats: TeamStats | null }> {
  try {
    const stats = await getEspnTeamStats(teamAbbreviation);
    return {
      source: stats?.source ?? "unavailable",
      stats
    };
  } catch {
    return {
      source: "unavailable",
      stats: null
    };
  }
}

export async function getFavoriteTeamDashboard(profile: UserProfile): Promise<FavoriteTeamDashboardData | null> {
  const baseTeam = teamFromProfile(profile);
  const abbreviation = baseTeam?.abbreviation?.toUpperCase();

  if (!baseTeam || !abbreviation) return null;

  const [nextGamesResult, recentGamesResult, standingResult, bestPlayerResult, rosterResult, teamStatsResult] =
    await Promise.all([
      getNextGamesForTeamWithSource(abbreviation, 30),
      getRecentGamesForTeamWithSource(abbreviation, 45),
      getStandingForTeam(abbreviation),
      getBestPlayerForTeam(abbreviation),
      getRosterForTeam(abbreviation),
      getTeamStatsForTeam(abbreviation)
    ]);

  const team = await getTeamMeta(baseTeam, standingResult.standing);
  const legends = getTeamLegends(abbreviation);
  const history = getTeamHistory(abbreviation);
  const nextGames = nextGamesResult.games;
  const recentGames = recentGamesResult.games;
  const hasLocalContext = Boolean(legends.length || history);

  const sources = {
    games: nextGamesResult.source === "mock" || recentGamesResult.source === "mock" ? "mock" as const : "espn" as const,
    standings: standingResult.source,
    bestPlayer: bestPlayerResult.source,
    roster: rosterResult.source,
    legends: legends.length ? "local" as const : "unavailable" as const,
    history: history ? "local" as const : "unavailable" as const,
    teamStats: teamStatsResult.source
  };

  return {
    profile,
    team,
    nextGames,
    recentGames,
    standing: standingResult.standing,
    bestPlayer: bestPlayerResult.player,
    recentForm: recentGames.map((game) => game.result ?? "-").slice(0, 5),
    roster: rosterResult.roster,
    legends,
    history,
    teamStats: teamStatsResult.stats,
    sources,
    source: {
      games: sources.games,
      standings: sources.standings,
      bestPlayer: sources.bestPlayer
    },
    message:
      nextGames.length || recentGames.length || standingResult.standing || rosterResult.roster.length || hasLocalContext
        ? undefined
        : "Ainda não encontramos dados suficientes para este time."
  };
}
