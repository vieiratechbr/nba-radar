import { NextRequest, NextResponse } from "next/server";
import { mockAwards } from "@/data/mockAwards";

export async function GET(request: NextRequest) {
  const season = request.nextUrl.searchParams.get("season");
  const awards = season ? mockAwards.filter((award) => award.season === season) : mockAwards;

  return NextResponse.json({
    data: awards,
    fallback: true,
    source: "mock",
    empty: awards.length === 0,
    message: "Dados de prêmios usando base local inicial."
  });
}
