import { NextRequest, NextResponse } from "next/server";
import { getHighlightlyRawMatches } from "@/integrations/highlightly/highlightlyAdapter";

export async function GET(request: NextRequest) {
  const date = request.nextUrl.searchParams.get("date") ?? undefined;

  try {
    const data = await getHighlightlyRawMatches({
      date,
      limit: 100
    });

    return NextResponse.json({
      success: true,
      source: "highlightly",
      requestedDate: date,
      data
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      source: "highlightly",
      requestedDate: date,
      error: error instanceof Error ? error.message : "Erro desconhecido na Highlightly."
    });
  }
}
