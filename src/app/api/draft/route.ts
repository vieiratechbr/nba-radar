import { NextRequest, NextResponse } from "next/server";
import { mockDraftProspects } from "@/data/mockDraftProspects";
import { getEspnDraftProspects } from "@/integrations/espn/espnDraft";

export const revalidate = 86400;

function fallbackDraft(year?: string | null) {
  return year
    ? mockDraftProspects.filter((prospect) => prospect.year === year)
    : mockDraftProspects;
}

function getRequestedYear(request: NextRequest) {
  const yearParam = request.nextUrl.searchParams.get("year");
  if (yearParam) return Number(yearParam);

  const years = mockDraftProspects
    .map((prospect) => Number(prospect.year))
    .filter(Number.isFinite)
    .sort((a, b) => b - a);

  return years[0] ?? new Date().getFullYear();
}

export async function GET(request: NextRequest) {
  const yearParam = request.nextUrl.searchParams.get("year");
  const requestedYear = getRequestedYear(request);

  try {
    const onlineProspects = await getEspnDraftProspects(requestedYear);

    if (onlineProspects.length) {
      return NextResponse.json({
        data: onlineProspects,
        fallback: false,
        source: "espn",
        empty: false,
        message: "Draft carregado online pela ESPN.",
        debug: {
          requestedYear,
          onlineCount: onlineProspects.length
        }
      });
    }

    throw new Error("A ESPN não retornou picks/prospectos para o ano solicitado.");
  } catch (error) {
    const prospects = fallbackDraft(yearParam);

    return NextResponse.json({
      data: prospects,
      fallback: true,
      source: "mock",
      empty: prospects.length === 0,
      message: "Base local usada como fallback para prospects do Draft.",
      debug: {
        requestedYear,
        reason: error instanceof Error ? error.message : "Erro desconhecido ao carregar Draft online."
      }
    });
  }
}
