import { NextRequest, NextResponse } from "next/server";
import { getEspnGameSummary } from "@/integrations/espn/espnAdapter";
import { normalizeEspnGameDetails } from "@/integrations/espn/espnNormalizers";

interface GameSummaryRouteProps {
  params: Promise<{
    id: string;
  }>;
}

export const revalidate = 30;

export async function GET(_request: NextRequest, { params }: GameSummaryRouteProps) {
  const { id } = await params;

  try {
    const raw = await getEspnGameSummary(id);
    const data = normalizeEspnGameDetails(raw);

    return NextResponse.json({
      data,
      fallback: false,
      source: "espn",
      debug: {
        eventId: id,
        hasBoxscore: Boolean(raw?.boxscore),
        leadersCount: Array.isArray(raw?.leaders) ? raw.leaders.length : 0,
        playsCount: Array.isArray(raw?.plays) ? raw.plays.length : 0
      }
    });
  } catch (error) {
    return NextResponse.json(
      {
        data: null,
        fallback: true,
        source: "espn",
        message: "Não foi possível carregar detalhes reais do jogo.",
        debug: {
          eventId: id,
          reason: error instanceof Error ? error.message : "Erro desconhecido na ESPN API."
        }
      },
      { status: 502 }
    );
  }
}
