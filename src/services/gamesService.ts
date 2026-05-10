import { mockGames } from "@/data/mockGames";
import { mockTeams } from "@/data/mockTeams";
import type { Game } from "@/types/game";
import type { GameDetails } from "@/types/gameDetails";
import type { GameExtras } from "@/types/gameExtras";
import type { ServiceResult } from "@/types/service";
import { getTeams as getTeamsResult } from "@/services/teamsService";

type GamesApiPayload = {
  data?: Game[];
  fallback?: boolean;
  source?: "espn" | "mock";
  message?: string;
  debug?: {
    requestedDate?: string;
    rawEventsCount?: number;
    normalizedGamesCount?: number;
    liveGamesCount?: number;
    url?: string;
    reason?: string;
  };
  empty?: boolean;
};

type GameDetailsApiPayload = {
  data?: GameDetails | null;
  fallback?: boolean;
  source?: "espn";
  message?: string;
  debug?: {
    reason?: string;
  };
};

type GameExtrasApiPayload = {
  data?: GameExtras;
  fallback?: boolean;
  source?: "espn" | "highlightly" | "none";
  message?: string;
};

const fallbackMessage = "Não foi possível carregar dados reais. Exibindo demonstração.";

const emptyGameExtras: GameExtras = {
  highlights: [],
  prediction: null,
  headToHead: null,
  recentForm: {
    home: null,
    visitor: null
  },
  source: "none"
};

async function fetchInternalGames(path: string): Promise<ServiceResult<Game[]>> {
  if (typeof window === "undefined") {
    return { data: mockGames, source: "mock", fallback: true };
  }

  try {
    const response = await fetch(path, { cache: "no-store" });
    const payload = (await response.json()) as GamesApiPayload;

    if (!response.ok || payload.fallback) {
      return {
        data: payload.data?.length ? payload.data : mockGames,
        source: "mock",
        fallback: true,
        message: payload.message ?? fallbackMessage,
        error: payload.debug?.reason
      };
    }

    return {
      data: payload.data ?? [],
      source: payload.source ?? "espn",
      fallback: false,
      empty: payload.empty ?? (payload.data?.length ?? 0) === 0,
      message: payload.message
    };
  } catch {
    return {
      data: mockGames,
      source: "mock",
      fallback: true,
      message: fallbackMessage
    };
  }
}

export async function getGamesResult(date?: string): Promise<ServiceResult<Game[]>> {
  const path = date ? `/api/games?date=${encodeURIComponent(date)}` : "/api/games";
  return fetchInternalGames(path);
}

export async function getGames(date?: string): Promise<Game[]> {
  const result = await getGamesResult(date);
  return result.data;
}

export async function getTodayGamesResult(): Promise<ServiceResult<Game[]>> {
  return fetchInternalGames("/api/games/today");
}

export async function getTodayGames(): Promise<Game[]> {
  const result = await getTodayGamesResult();
  return result.data;
}

export async function getLiveGamesResult(): Promise<ServiceResult<Game[]>> {
  return fetchInternalGames("/api/games/live");
}

export async function getLiveGames(): Promise<Game[]> {
  const result = await getLiveGamesResult();
  return result.data;
}

export async function getGameDetails(id: string): Promise<GameDetails> {
  const response = await fetch(`/api/games/${encodeURIComponent(id)}`, { cache: "no-store" });
  const payload = (await response.json()) as GameDetailsApiPayload;

  if (!response.ok || !payload.data) {
    throw new Error(payload.message ?? payload.debug?.reason ?? "Detalhes indisponíveis.");
  }

  return payload.data;
}

export async function getGameSummary(id: string) {
  return getGameDetails(id);
}

export async function getGameExtras(id: string): Promise<GameExtras> {
  try {
    const response = await fetch(`/api/games/${encodeURIComponent(id)}/extras`, { cache: "no-store" });
    const payload = (await response.json()) as GameExtrasApiPayload;

    return payload.data ?? {
      ...emptyGameExtras,
      message: payload.message
    };
  } catch {
    return {
      ...emptyGameExtras,
      message: "Dados complementares indisponíveis agora."
    };
  }
}

export async function getGamesByDate(date: string): Promise<Game[]> {
  return getGames(date);
}

export async function getGamesByTeam(teamId: string): Promise<Game[]> {
  const games = await getGames();
  const normalizedTeamId = teamId.toLowerCase();

  return games.filter((game) => {
    const text = [
      game.homeTeamId,
      game.awayTeamId,
      game.homeTeam?.id,
      game.homeTeam?.abbreviation,
      game.homeTeam?.name,
      game.homeTeam?.fullName,
      game.visitorTeam?.id,
      game.visitorTeam?.abbreviation,
      game.visitorTeam?.name,
      game.visitorTeam?.fullName
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return text.includes(normalizedTeamId);
  });
}

export async function getBullsGames(): Promise<Game[]> {
  const games = await getGames();

  return games.filter((game) => {
    const home = `${game.homeTeam?.abbreviation ?? ""} ${game.homeTeam?.fullName ?? ""}`.toLowerCase();
    const visitor = `${game.visitorTeam?.abbreviation ?? ""} ${game.visitorTeam?.fullName ?? ""}`.toLowerCase();

    return (
      game.homeTeamId === "chi" ||
      game.awayTeamId === "chi" ||
      home.includes("chi") ||
      home.includes("bulls") ||
      visitor.includes("chi") ||
      visitor.includes("bulls")
    );
  });
}

export async function getTeams() {
  const result = await getTeamsResult();
  return result.data.length ? result.data : mockTeams;
}
