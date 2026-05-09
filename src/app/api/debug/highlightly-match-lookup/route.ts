import { NextRequest, NextResponse } from "next/server";
import { getEspnGameSummary } from "@/integrations/espn/espnAdapter";
import { normalizeEspnGameDetails } from "@/integrations/espn/espnNormalizers";
import { findHighlightlyMatchByEspnGameWithDebug } from "@/integrations/highlightly/highlightlyMatchMapper";

export async function GET(request: NextRequest) {
  const espnEventId = request.nextUrl.searchParams.get("espnEventId");

  if (!espnEventId) {
    return NextResponse.json(
      {
        success: false,
        source: "highlightly",
        error: "Query param espnEventId é obrigatório."
      },
      { status: 400 }
    );
  }

  try {
    const rawEspnSummary = await getEspnGameSummary(espnEventId);
    const details = normalizeEspnGameDetails(rawEspnSummary);
    const lookup = await findHighlightlyMatchByEspnGameWithDebug(details);

    return NextResponse.json({
      success: Boolean(lookup.match),
      source: "highlightly",
      espnEventId,
      espnGame: {
        id: details.id,
        date: details.date,
        homeTeam: details.homeTeam.fullName,
        visitorTeam: details.visitorTeam.fullName
      },
      highlightlyMatchId: lookup.match?.id ?? null,
      match: lookup.match
        ? {
            id: lookup.match.id,
            date: lookup.match.date,
            leagueName: lookup.match.leagueName,
            homeTeam: lookup.match.homeTeam?.name,
            awayTeam: lookup.match.awayTeam?.name
          }
        : null,
      debug: lookup.debug
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      source: "highlightly",
      espnEventId,
      error: error instanceof Error ? error.message : "Erro desconhecido no lookup ESPN -> Highlightly."
    });
  }
}
