import { NextRequest, NextResponse } from "next/server";
import { getEspnGameSummary } from "@/integrations/espn/espnAdapter";
import {
  findEspnVideoFields,
  normalizeEspnHighlights
} from "@/integrations/espn/espnHighlights";

export async function GET(request: NextRequest) {
  const event = request.nextUrl.searchParams.get("event");

  if (!event) {
    return NextResponse.json(
      {
        success: false,
        source: "espn",
        error: "Informe ?event=EVENT_ID para testar highlights da ESPN."
      },
      { status: 400 }
    );
  }

  try {
    const raw = await getEspnGameSummary(event);
    const normalizedHighlights = normalizeEspnHighlights(raw);

    return NextResponse.json({
      success: true,
      source: "espn",
      event,
      rawKeys: raw && typeof raw === "object" ? Object.keys(raw) : [],
      possibleVideoFieldsFound: findEspnVideoFields(raw),
      normalizedHighlightsCount: normalizedHighlights.length,
      normalizedHighlights: normalizedHighlights.slice(0, 8)
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        source: "espn",
        event,
        error: error instanceof Error ? error.message : "Erro desconhecido ao buscar summary da ESPN."
      },
      { status: 502 }
    );
  }
}
