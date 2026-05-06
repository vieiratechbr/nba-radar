import { NextRequest, NextResponse } from "next/server";
import { getHighlightlyRawHighlights } from "@/integrations/highlightly/highlightlyAdapter";

export async function GET(request: NextRequest) {
  const matchId = request.nextUrl.searchParams.get("matchId");

  if (!matchId) {
    return NextResponse.json(
      {
        success: false,
        source: "highlightly",
        error: "Query param matchId é obrigatório."
      },
      { status: 400 }
    );
  }

  try {
    const data = await getHighlightlyRawHighlights(matchId);

    return NextResponse.json({
      success: true,
      source: "highlightly",
      matchId,
      data
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      source: "highlightly",
      matchId,
      error: error instanceof Error ? error.message : "Erro desconhecido na Highlightly."
    });
  }
}
