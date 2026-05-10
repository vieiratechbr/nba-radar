export type GameHighlight = {
  id: string;
  title: string;
  originalTitle?: string;
  description?: string;
  originalDescription?: string;
  thumbnailUrl?: string;
  videoUrl?: string;
  embedUrl?: string;
  source: "highlightly" | "espn" | "external";
  publishedAt?: string;
  isEmbeddable?: boolean;
};
