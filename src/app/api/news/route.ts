import { NextResponse } from "next/server";
import { mockNews } from "@/data/mockNews";
import { getEspnNews } from "@/integrations/espn/espnAdapter";

export const revalidate = 300;

export async function GET() {
  try {
    const articles = await getEspnNews();

    return NextResponse.json({
      data: articles,
      fallback: false,
      source: "espn",
      empty: articles.length === 0
    });
  } catch (error) {
    return NextResponse.json({
      data: mockNews,
      fallback: true,
      source: "mock",
      message: "Não foi possível carregar notícias reais agora. Exibindo demonstração.",
      debug: {
        reason: error instanceof Error ? error.message : "Erro desconhecido na ESPN API."
      }
    });
  }
}
