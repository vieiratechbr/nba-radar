export type GameHighlight = {
  id: string;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  videoUrl?: string;
  embedUrl?: string;
  source: "highlightly" | "espn" | "external";
  publishedAt?: string;
  isEmbeddable?: boolean;
};
