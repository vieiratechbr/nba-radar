export type NewsCategory =
  | "Bulls"
  | "Trades"
  | "Lesões"
  | "Playoffs"
  | "Rumores"
  | "NBA Cup"
  | "Mercado"
  | "Destaques";

export interface NewsArticle {
  id: string;
  title: string;
  source: string;
  date?: string;
  category: NewsCategory | string;
  summary?: string;
  imageUrl?: string;
  externalUrl?: string;
  description?: string;
  url?: string;
  publishedAt?: string;
  teamIds?: string[];
  team?: string;
  featured?: boolean;
  sourceType?: "api" | "mock";
}
