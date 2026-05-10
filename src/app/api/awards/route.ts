import { NextRequest, NextResponse } from "next/server";
import { mockAwards } from "@/data/mockAwards";
import {
  getEspnAwardsByYear,
  seasonToEspnAwardsYear
} from "@/integrations/espn/espnAwards";

export const revalidate = 43200;

function fallbackAwards(season?: string | null) {
  return season ? mockAwards.filter((award) => award.season === season) : mockAwards;
}

function getRequestedYears(request: NextRequest) {
  const yearParam = request.nextUrl.searchParams.get("year");
  const seasonParam = request.nextUrl.searchParams.get("season");

  if (yearParam) return [Number(yearParam)].filter(Number.isFinite);

  const seasonYear = seasonToEspnAwardsYear(seasonParam);
  if (seasonYear) return [seasonYear];

  return [2026, 2025, 2024];
}

export async function GET(request: NextRequest) {
  const season = request.nextUrl.searchParams.get("season");
  const years = getRequestedYears(request);

  try {
    const results = await Promise.allSettled(years.map((year) => getEspnAwardsByYear(year)));
    const awards = results.flatMap((result) => result.status === "fulfilled" ? result.value : []);

    if (!awards.length) throw new Error("Nenhum prêmio retornado pela ESPN.");

    const filteredAwards = season ? awards.filter((award) => award.season === season) : awards;

    return NextResponse.json({
      data: filteredAwards,
      fallback: false,
      source: "espn",
      empty: filteredAwards.length === 0,
      message: "Prêmios carregados da ESPN."
    });
  } catch (error) {
    const awards = fallbackAwards(season);

    return NextResponse.json({
      data: awards,
      fallback: true,
      source: "mock",
      empty: awards.length === 0,
      message: "Não foi possível carregar prêmios online. Exibindo base local.",
      debug: {
        reason: error instanceof Error ? error.message : "Erro desconhecido ao carregar prêmios."
      }
    });
  }
}
