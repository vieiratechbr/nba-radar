import { NextRequest, NextResponse } from "next/server";
import {
  getHighlightlyRawMatchesResponse,
  readHighlightlyArray
} from "@/integrations/highlightly/highlightlyAdapter";

export async function GET(request: NextRequest) {
  const date = request.nextUrl.searchParams.get("date") ?? undefined;
  const leagueName = request.nextUrl.searchParams.get("leagueName") ?? "NBA";

  try {
    const result = await getHighlightlyRawMatchesResponse({
      date,
      leagueName,
      limit: 100
    });
    const rows = readHighlightlyArray(result.data);
    const normalizedSample = rows.slice(0, 8).map((row) => {
      const match = typeof row === "object" && row !== null ? row as Record<string, unknown> : {};
      const homeTeam = typeof match.homeTeam === "object" && match.homeTeam !== null
        ? match.homeTeam as Record<string, unknown>
        : {};
      const awayTeam = typeof match.awayTeam === "object" && match.awayTeam !== null
        ? match.awayTeam as Record<string, unknown>
        : {};
      const league = typeof match.league === "object" && match.league !== null
        ? match.league as Record<string, unknown>
        : {};

      return {
        id: match.id,
        date: match.date,
        league: league.name,
        homeTeam: homeTeam.name,
        awayTeam: awayTeam.name,
        state: match.state
      };
    });

    return NextResponse.json({
      success: true,
      source: "highlightly",
      date,
      leagueName,
      status: result.status,
      url: result.url,
      rawCount: rows.length,
      normalizedCount: normalizedSample.length,
      sample: normalizedSample,
      rateLimit: result.rateLimit
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      source: "highlightly",
      date,
      leagueName,
      error: error instanceof Error ? error.message : "Erro desconhecido na Highlightly."
    });
  }
}
