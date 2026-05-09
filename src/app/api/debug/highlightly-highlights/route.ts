import { NextRequest, NextResponse } from "next/server";
import {
  getHighlightlyRawHighlightsResponse,
  readHighlightlyArray
} from "@/integrations/highlightly/highlightlyAdapter";
import { normalizeHighlightlyHighlights } from "@/integrations/highlightly/highlightlyNormalizers";

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
    const result = await getHighlightlyRawHighlightsResponse(matchId);
    const rows = readHighlightlyArray(result.data);
    const normalized = normalizeHighlightlyHighlights(result.data);

    return NextResponse.json({
      success: true,
      source: "highlightly",
      matchId,
      status: result.status,
      url: result.url,
      rawCount: rows.length,
      normalizedCount: normalized.length,
      sample: normalized.slice(0, 5),
      rawSample: rows.slice(0, 3),
      rateLimit: result.rateLimit
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
