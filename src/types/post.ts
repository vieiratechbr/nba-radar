export type PostCategory =
  | "Resumo da rodada"
  | "Análise de jogo"
  | "Opinião"
  | "Mercado da NBA"
  | "Chicago Bulls"
  | "Playoffs"
  | "NBA Cup"
  | "Análise";

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  category: PostCategory;
  author: string;
  date: string;
  readingTime: string;
  coverImage: string;
  summary: string;
  content: string[];
  relatedSlugs: string[];
}
