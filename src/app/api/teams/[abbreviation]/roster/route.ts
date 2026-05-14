import { NextRequest, NextResponse } from "next/server";
import { getEspnTeamRoster } from "@/integrations/espn/espnRoster";

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ abbreviation: string }> }
) {
  const { abbreviation } = await context.params;

  try {
    const data = await getEspnTeamRoster(abbreviation);
    return NextResponse.json({
      data,
      source: data.length ? "espn" : "unavailable",
      fallback: false
    });
  } catch (error) {
    return NextResponse.json(
      {
        data: [],
        source: "unavailable",
        fallback: false,
        message: "Elenco ainda indisponível.",
        error: error instanceof Error ? error.message : "Erro desconhecido."
      },
      { status: 200 }
    );
  }
}
