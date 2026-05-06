import type { GameDetails } from "@/types/gameDetails";
import { toInputDate } from "@/utils/formatNbaApiDate";
import { highlightlyFetch } from "@/integrations/highlightly/highlightlyClient";
import {
  highlightlyEndpoints,
  resolveHighlightlyEndpoint
} from "@/integrations/highlightly/highlightlyEndpoints";
import {
  namesLikelyMatch,
  normalizeHighlightlyHeadToHead,
  normalizeHighlightlyHighlights,
  normalizeHighlightlyLastFiveGames,
  normalizeHighlightlyPrediction,
  normalizeHighlightlyStandings
} from "@/integrations/highlightly/highlightlyNormalizers";

type HighlightlyMatchSearch = {
  date?: string;
  leagueId?: string | number;
  limit?: number;
  offset?: number;
};

type HighlightlyTeam = {
  id?: string;
  name?: string;
};

export type HighlightlyMatchCandidate = {
  id: string;
  date?: string;
  homeTeam?: HighlightlyTeam;
  awayTeam?: HighlightlyTeam;
  raw: unknown;
};

function readRecord(value: unknown): Record<string, unknown> | undefined {
  return typeof value === "object" && value !== null ? value as Record<string, unknown> : undefined;
}

function readString(source: Record<string, unknown> | undefined, keys: string[], fallback?: string) {
  if (!source) return fallback;

  for (const key of keys) {
    const value = source[key];
    if (typeof value === "string" && value.trim()) return value;
    if (typeof value === "number") return String(value);
  }

  return fallback;
}

function readArray(raw: unknown) {
  if (Array.isArray(raw)) return raw;
  const record = readRecord(raw);
  if (!record) return [];

  for (const key of ["data", "matches", "results"]) {
    const value = record[key];
    if (Array.isArray(value)) return value;
  }

  return [];
}

function normalizeMatchCandidate(rawMatch: unknown): HighlightlyMatchCandidate | null {
  const match = readRecord(rawMatch);
  if (!match) return null;

  const homeTeam = readRecord(match.homeTeam);
  const awayTeam = readRecord(match.awayTeam);
  const id = readString(match, ["id"], "");
  if (!id) return null;

  return {
    id,
    date: readString(match, ["date"], undefined),
    homeTeam: {
      id: readString(homeTeam, ["id"], undefined),
      name: readString(homeTeam, ["name"], undefined)
    },
    awayTeam: {
      id: readString(awayTeam, ["id"], undefined),
      name: readString(awayTeam, ["name"], undefined)
    },
    raw: rawMatch
  };
}

export async function getHighlightlyLiveScores() {
  return getHighlightlyMatches({ limit: 100 });
}

export async function getHighlightlyMatches(params?: HighlightlyMatchSearch) {
  const raw = await highlightlyFetch(highlightlyEndpoints.matches, {
    searchParams: {
      date: params?.date,
      leagueId: params?.leagueId,
      timezone: "America/Sao_Paulo",
      limit: params?.limit ?? 100,
      offset: params?.offset ?? 0
    },
    revalidate: 60
  });

  return readArray(raw).map(normalizeMatchCandidate).filter(Boolean) as HighlightlyMatchCandidate[];
}

export async function getHighlightlyRawMatches(params?: HighlightlyMatchSearch) {
  return highlightlyFetch(highlightlyEndpoints.matches, {
    searchParams: {
      date: params?.date,
      leagueId: params?.leagueId,
      timezone: "America/Sao_Paulo",
      limit: params?.limit ?? 100,
      offset: params?.offset ?? 0
    },
    revalidate: 60
  });
}

export async function getHighlightlyMatchDetails(matchId: string) {
  return highlightlyFetch(resolveHighlightlyEndpoint(highlightlyEndpoints.matchDetails, { id: matchId }), {
    revalidate: 60
  });
}

export async function getHighlightlyMatchHighlights(matchId: string) {
  const raw = await highlightlyFetch(highlightlyEndpoints.matchHighlights, {
    searchParams: {
      matchId,
      limit: 20,
      offset: 0
    },
    revalidate: 900
  });

  return normalizeHighlightlyHighlights(raw);
}

export async function getHighlightlyRawHighlights(matchId: string) {
  return highlightlyFetch(highlightlyEndpoints.matchHighlights, {
    searchParams: {
      matchId,
      limit: 20,
      offset: 0
    },
    revalidate: 900
  });
}

export async function getHighlightlyStandings(params?: { leagueId?: string | number; season?: string | number }) {
  const raw = await highlightlyFetch(highlightlyEndpoints.standings, {
    searchParams: params,
    revalidate: 1800
  });

  return normalizeHighlightlyStandings(raw);
}

export async function getHighlightlyPredictions(matchId: string) {
  const raw = await getHighlightlyMatchDetails(matchId);
  return normalizeHighlightlyPrediction(raw);
}

export async function getHighlightlyHeadToHead(teamAId: string, teamBId: string) {
  const raw = await highlightlyFetch(highlightlyEndpoints.headToHead, {
    searchParams: {
      teamIdOne: teamAId,
      teamIdTwo: teamBId
    },
    revalidate: 3600
  });

  return normalizeHighlightlyHeadToHead(raw);
}

export async function getHighlightlyLastFiveGames(teamId: string, teamName?: string) {
  const raw = await highlightlyFetch(highlightlyEndpoints.lastFiveGames, {
    searchParams: {
      teamId
    },
    revalidate: 1800
  });

  return normalizeHighlightlyLastFiveGames(raw, teamId, teamName);
}

export async function findHighlightlyMatchByEspnGame(gameDetails: GameDetails) {
  const date = toInputDate(gameDetails.date);
  const matches = await getHighlightlyMatches({ date, limit: 100 });

  return matches.find((match) => {
    const homeMatches =
      namesLikelyMatch(gameDetails.homeTeam.fullName, match.homeTeam?.name ?? "") ||
      namesLikelyMatch(gameDetails.homeTeam.name, match.homeTeam?.name ?? "") ||
      namesLikelyMatch(gameDetails.homeTeam.abbreviation, match.homeTeam?.name ?? "");
    const awayMatches =
      namesLikelyMatch(gameDetails.visitorTeam.fullName, match.awayTeam?.name ?? "") ||
      namesLikelyMatch(gameDetails.visitorTeam.name, match.awayTeam?.name ?? "") ||
      namesLikelyMatch(gameDetails.visitorTeam.abbreviation, match.awayTeam?.name ?? "");

    return homeMatches && awayMatches;
  }) ?? null;
}
