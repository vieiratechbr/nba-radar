import { mockNews } from "@/data/mockNews";
import type { NewsArticle, NewsCategory } from "@/types/news";
import type { ServiceResult } from "@/types/service";

type NewsApiPayload = {
  data?: NewsArticle[];
  fallback?: boolean;
  source?: "espn" | "mock";
  message?: string;
  debug?: {
    reason?: string;
  };
  empty?: boolean;
};

const newsFallbackMessage = "Não foi possível carregar notícias reais agora. Exibindo demonstração.";

function isBullsArticle(article: NewsArticle) {
  const text = `${article.title} ${article.description ?? ""} ${article.summary ?? ""}`.toLowerCase();
  return text.includes("chicago bulls") || text.includes("bulls") || text.includes(" chi ");
}

async function fetchInternalNews(
  path: string,
  fallback: NewsArticle[]
): Promise<ServiceResult<NewsArticle[]>> {
  if (typeof window === "undefined") {
    return { data: fallback, source: "mock", fallback: true };
  }

  try {
    const response = await fetch(path, { cache: "no-store" });
    const payload = (await response.json()) as NewsApiPayload;

    if (!response.ok || payload.fallback) {
      return {
        data: payload.data?.length ? payload.data : fallback,
        source: "mock",
        fallback: true,
        message: payload.message ?? newsFallbackMessage,
        error: payload.debug?.reason
      };
    }

    return {
      data: payload.data ?? [],
      source: payload.source ?? "espn",
      fallback: false,
      empty: payload.empty ?? (payload.data?.length ?? 0) === 0,
      message: payload.message
    };
  } catch {
    return {
      data: fallback,
      source: "mock",
      fallback: true,
      message: newsFallbackMessage
    };
  }
}

export async function getNews(): Promise<NewsArticle[]> {
  const result = await getNewsResult();
  return result.data.length ? result.data : mockNews;
}

export async function getNewsResult(): Promise<ServiceResult<NewsArticle[]>> {
  return fetchInternalNews("/api/news", mockNews);
}

export async function getNewsByCategory(category: NewsCategory): Promise<NewsArticle[]> {
  const news = await getNews();
  return news.filter((article) => article.category === category);
}

export async function getBullsNews(): Promise<NewsArticle[]> {
  const result = await getBullsNewsResult();
  return result.data.length
    ? result.data
    : mockNews.filter((article) => article.category === "Bulls" || article.teamIds?.includes("chi"));
}

export async function getBullsNewsResult(): Promise<ServiceResult<NewsArticle[]>> {
  const fallback = mockNews.filter(
    (article) => article.category === "Bulls" || article.teamIds?.includes("chi")
  );
  const result = await fetchInternalNews("/api/news", fallback);

  if (result.source === "mock") return result;

  return {
    ...result,
    data: result.data.filter(isBullsArticle),
    empty: result.data.filter(isBullsArticle).length === 0
  };
}

export async function getFeaturedNews(limit = 4): Promise<NewsArticle[]> {
  const news = await getNews();
  return news
    .filter((article) => article.featured)
    .concat(news.filter((article) => !article.featured))
    .slice(0, limit);
}
