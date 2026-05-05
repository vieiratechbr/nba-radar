"use client";

import { useEffect, useState } from "react";
import type { NewsArticle } from "@/types/news";
import { NewsGrid } from "@/components/NewsGrid";
import { getBullsNewsResult } from "@/services/newsService";

interface BullsNewsClientProps {
  articles: NewsArticle[];
}

export function BullsNewsClient({ articles }: BullsNewsClientProps) {
  const [visibleArticles, setVisibleArticles] = useState(articles);
  const [loading, setLoading] = useState(true);
  const [fallbackMessage, setFallbackMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadBullsNews() {
      setLoading(true);
      const result = await getBullsNewsResult();

      if (cancelled) return;

      setVisibleArticles(result.data.length ? result.data : articles);
      setFallbackMessage(
        result.source === "mock"
          ? result.error ??
              "Não foi possível carregar os dados reais agora. Exibindo dados de demonstração."
          : null
      );
      setLoading(false);
    }

    loadBullsNews();

    return () => {
      cancelled = true;
    };
  }, [articles]);

  return (
    <div className="grid gap-4">
      {loading ? (
        <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4 text-sm font-semibold text-zinc-300">
          Carregando dados da NBA...
        </div>
      ) : null}

      {fallbackMessage ? (
        <div className="rounded-lg border border-court-red/25 bg-court-red/10 p-4 text-sm font-semibold text-zinc-200">
          {fallbackMessage}
        </div>
      ) : null}

      <NewsGrid articles={visibleArticles} />
    </div>
  );
}
