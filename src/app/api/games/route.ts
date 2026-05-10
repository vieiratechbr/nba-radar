import { NextRequest, NextResponse } from "next/server";
import { mockGames } from "@/data/mockGames";
import { getRawEspnScoreboard } from "@/integrations/espn/espnAdapter";
import { normalizeEspnGames } from "@/integrations/espn/espnNormalizers";
import type { Game } from "@/types/game";
import { formatNbaApiDate } from "@/utils/formatNbaApiDate";

export const dynamic = "force-dynamic";
export const revalidate = 30;

function countRawEvents(raw: unknown) {
  if (typeof raw !== "object" || raw === null || !("events" in raw)) return 0;
  const events = (raw as { events?: unknown }).events;
  return Array.isArray(events) ? events.length : 0;
}

function readStatusDebug(raw: unknown, games: Game[]) {
  if (typeof raw !== "object" || raw === null || !("events" in raw)) return [];
  const events = (raw as { events?: unknown }).events;
  if (!Array.isArray(events)) return [];

  return events.map((event) => {
    const rawEvent = typeof event === "object" && event !== null ? event as Record<string, unknown> : {};
    const competitions = Array.isArray(rawEvent.competitions) ? rawEvent.competitions : [];
    const competition = competitions[0] && typeof competitions[0] === "object"
      ? competitions[0] as Record<string, unknown>
      : {};
    const status = typeof competition.status === "object" && competition.status !== null
      ? competition.status as Record<string, unknown>
      : {};
    const type = typeof status.type === "object" && status.type !== null
      ? status.type as Record<string, unknown>
      : {};
    const id = String(rawEvent.id ?? "");

    return {
      id,
      rawState: typeof type.state === "string" ? type.state : undefined,
      rawName: typeof type.name === "string" ? type.name : undefined,
      rawShortDetail: typeof type.shortDetail === "string" ? type.shortDetail : undefined,
      rawDetail: typeof type.detail === "string" ? type.detail : undefined,
      completed: Boolean(status.completed || type.completed),
      normalized: games.find((game) => game.id === id)?.status
    };
  });
}

export async function GET(request: NextRequest) {
  const date = request.nextUrl.searchParams.get("date");
  const requestedDate = formatNbaApiDate(date ?? undefined);

  try {
    const result = await getRawEspnScoreboard(date ?? undefined, 30);
    const games = normalizeEspnGames(result.data);
    const rawEventsCount = countRawEvents(result.data);

    return NextResponse.json({
      data: games,
      fallback: false,
      source: "espn",
      empty: games.length === 0,
      message: games.length === 0 ? "Nenhum jogo encontrado para esta data." : undefined,
      debug: {
        requestedDate: result.requestedDate,
        rawEventsCount,
        normalizedGamesCount: games.length,
        statuses: readStatusDebug(result.data, games),
        url: result.url
      }
    });
  } catch (error) {
    return NextResponse.json({
      data: mockGames,
      fallback: true,
      source: "mock",
      message: "Não foi possível carregar dados reais. Exibindo demonstração.",
      debug: {
        requestedDate,
        rawEventsCount: 0,
        normalizedGamesCount: 0,
        reason: error instanceof Error ? error.message : "Erro desconhecido na ESPN API."
      }
    });
  }
}
