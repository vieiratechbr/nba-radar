import { NextResponse } from "next/server";
import { mockStandings } from "@/data/mockStandings";
import { getEspnStandings } from "@/integrations/espn/espnAdapter";

export const revalidate = 3600;

export async function GET() {
  try {
    const standings = await getEspnStandings();

    return NextResponse.json({
      data: standings,
      fallback: false,
      source: "espn",
      empty: standings.length === 0,
      message: standings.length === 0 ? "Nenhum time encontrado na classificação." : undefined
    });
  } catch (error) {
    return NextResponse.json({
      data: mockStandings,
      fallback: true,
      source: "mock",
      message: "Não foi possível carregar a classificação real. Exibindo demonstração.",
      debug: {
        reason: error instanceof Error ? error.message : "Erro desconhecido na ESPN API."
      }
    });
  }
}
