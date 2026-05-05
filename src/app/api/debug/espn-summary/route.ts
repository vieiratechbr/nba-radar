import { NextRequest, NextResponse } from "next/server";
import { getEspnGameSummary } from "@/integrations/espn/espnAdapter";

export const revalidate = 30;

export async function GET(request: NextRequest) {
  const eventId = request.nextUrl.searchParams.get("event");

  if (!eventId) {
    return NextResponse.json(
      {
        success: false,
        source: "espn",
        error: "Informe o parâmetro event."
      },
      { status: 400 }
    );
  }

  try {
    const data = await getEspnGameSummary(eventId);

    return NextResponse.json({
      success: true,
      source: "espn",
      eventId,
      hasBoxscore: Boolean(data?.boxscore),
      leadersCount: Array.isArray(data?.leaders) ? data.leaders.length : 0,
      playsCount: Array.isArray(data?.plays) ? data.plays.length : 0,
      data
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        source: "espn",
        eventId,
        error: error instanceof Error ? error.message : "Erro desconhecido na ESPN API."
      },
      { status: 502 }
    );
  }
}
