import { NextRequest, NextResponse } from "next/server";
import { mockDraftProspects } from "@/data/mockDraftProspects";

export async function GET(request: NextRequest) {
  const year = request.nextUrl.searchParams.get("year");
  const prospects = year
    ? mockDraftProspects.filter((prospect) => prospect.year === year)
    : mockDraftProspects;

  return NextResponse.json({
    data: prospects,
    fallback: true,
    source: "mock",
    empty: prospects.length === 0,
    message: "Prospectos usando base local inicial."
  });
}
