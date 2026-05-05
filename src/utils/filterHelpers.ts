import type { Game } from "@/types/game";
import type { NewsArticle, NewsCategory } from "@/types/news";

export const scoreFilters = [
  "Todos",
  "Ao vivo",
  "Finalizados",
  "Próximos jogos"
] as const;

export type ScoreFilter = (typeof scoreFilters)[number];

export const newsFilters = [
  "Todas",
  "Bulls",
  "Trades",
  "Lesões",
  "Playoffs",
  "Rumores",
  "NBA Cup",
  "Mercado",
  "Destaques"
] as const;

export type NewsFilter = (typeof newsFilters)[number];

export function filterGames(games: Game[], filter: ScoreFilter, teamId?: string) {
  let filtered = games;

  if (filter === "Ao vivo") filtered = filtered.filter((game) => game.status === "live");
  if (filter === "Finalizados") filtered = filtered.filter((game) => game.status === "final");
  if (filter === "Próximos jogos") {
    filtered = filtered.filter((game) => game.status === "scheduled");
  }

  if (teamId && teamId !== "all") {
    const normalizedTeam = teamId.toLowerCase();

    filtered = filtered.filter((game) => {
      const homeAbbreviation = game.homeTeam?.abbreviation.toLowerCase();
      const visitorAbbreviation = game.visitorTeam?.abbreviation.toLowerCase();

      return (
        game.homeTeamId === teamId ||
        game.awayTeamId === teamId ||
        homeAbbreviation === normalizedTeam ||
        visitorAbbreviation === normalizedTeam ||
        String(game.homeTeam?.id ?? "").toLowerCase() === normalizedTeam ||
        String(game.visitorTeam?.id ?? "").toLowerCase() === normalizedTeam
      );
    });
  }

  return filtered;
}

export function filterNews(articles: NewsArticle[], filter: NewsFilter, query: string) {
  const normalizedQuery = query.trim().toLowerCase();

  return articles.filter((article) => {
    const categoryMatches =
      filter === "Todas" || article.category === (filter as NewsCategory);
    const searchableText = [
      article.title,
      article.summary,
      article.description,
      article.source,
      article.team,
      article.category
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    const queryMatches = normalizedQuery.length === 0 || searchableText.includes(normalizedQuery);

    return categoryMatches && queryMatches;
  });
}
