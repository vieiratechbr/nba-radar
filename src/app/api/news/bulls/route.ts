import { NextResponse } from "next/server";
import { mockNews } from "@/data/mockNews";
import { getEspnNews } from "@/integrations/espn/espnAdapter";

export const revalidate = 300;

function isBullsArticle(text: string) {
  const normalized = text.toLowerCase();
  return normalized.includes("chicago bulls") || normalized.includes("bulls") || normalized.includes(" chi ");
}

export async function GET() {
  const bullsFallback = mockNews.filter(
    (article) => article.category === "Bulls" || article.teamIds?.includes("chi")
  );

  try {
    const articles = (await getEspnNews()).filter((article) =>
      isBullsArticle(`${article.title} ${article.description ?? article.summary ?? ""}`)
    );

    return NextResponse.json({
      data: articles,
      fallback: false,
      source: "espn",
      empty: articles.length === 0
    });
  } catch (error) {
    return NextResponse.json({
      data: bullsFallback,
      fallback: true,
      source: "mock",
      message: "Não foi possível carregar notícias reais do Bulls agora. Exibindo demonstração.",
      debug: {
        reason: error instanceof Error ? error.message : "Erro desconhecido na ESPN API."
      }
    });
  }
}
