import { NextRequest, NextResponse } from "next/server";
import {
  getEspnAwardsHtmlByYear,
  parseEspnAwardsHtml
} from "@/integrations/espn/espnAwards";

export async function GET(request: NextRequest) {
  const year = Number(request.nextUrl.searchParams.get("year") ?? new Date().getFullYear());

  if (!Number.isFinite(year)) {
    return NextResponse.json(
      {
        success: false,
        source: "espn",
        error: "Informe um ano válido em ?year=2026."
      },
      { status: 400 }
    );
  }

  try {
    const html = await getEspnAwardsHtmlByYear(year);
    const parsed = parseEspnAwardsHtml(html, year);

    return NextResponse.json({
      success: true,
      year,
      source: "espn",
      rawLength: html.length,
      parsedCount: parsed.length,
      sample: parsed.slice(0, 8)
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        year,
        source: "espn",
        error: error instanceof Error ? error.message : "Erro desconhecido ao buscar prêmios ESPN."
      },
      { status: 502 }
    );
  }
}
