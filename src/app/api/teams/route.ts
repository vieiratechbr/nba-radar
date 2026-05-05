import { NextResponse } from "next/server";
import { mockTeams } from "@/data/mockTeams";
import { getEspnTeams } from "@/integrations/espn/espnAdapter";

export const revalidate = 3600;

export async function GET() {
  try {
    const teams = await getEspnTeams();

    return NextResponse.json({
      data: teams,
      fallback: false,
      source: "espn",
      empty: teams.length === 0
    });
  } catch (error) {
    return NextResponse.json({
      data: mockTeams,
      fallback: true,
      source: "mock",
      message: "Não foi possível carregar times reais agora. Exibindo demonstração.",
      debug: {
        reason: error instanceof Error ? error.message : "Erro desconhecido na ESPN API."
      }
    });
  }
}
