import { NextResponse } from "next/server";
import { mockGames } from "@/data/mockGames";
import { getRawEspnScoreboard } from "@/integrations/espn/espnAdapter";
import { normalizeEspnGames } from "@/integrations/espn/espnNormalizers";
import { getNbaTodayDate } from "@/utils/formatNbaApiDate";

export const dynamic = "force-dynamic";
export const revalidate = 15;

function countRawEvents(raw: unknown) {
  if (typeof raw !== "object" || raw === null || !("events" in raw)) return 0;
  const events = (raw as { events?: unknown }).events;
  return Array.isArray(events) ? events.length : 0;
}

export async function GET() {
  const requestedDate = getNbaTodayDate();

  try {
    const result = await getRawEspnScoreboard(requestedDate, 0);
    const allGames = normalizeEspnGames(result.data);
    const games = allGames.filter((game) => game.status === "live");

    return NextResponse.json({
      data: games,
      fallback: false,
      source: "espn",
      empty: games.length === 0,
      message: games.length === 0 ? "Nenhum jogo ao vivo no momento." : undefined,
      debug: {
        requestedDate: result.requestedDate,
        rawEventsCount: countRawEvents(result.data),
        normalizedGamesCount: allGames.length,
        liveGamesCount: games.length,
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
        liveGamesCount: 0,
        reason: error instanceof Error ? error.message : "Erro desconhecido na ESPN API."
      }
    });
  }
}
