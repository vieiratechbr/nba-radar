"use client";

import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { NewsArticle } from "@/types/news";
import { FilterTabs } from "@/components/FilterTabs";
import { NewsGrid } from "@/components/NewsGrid";
import { SectionTitle } from "@/components/SectionTitle";
import { getBullsNewsResult, getNewsResult } from "@/services/newsService";
import { filterNews, newsFilters, type NewsFilter } from "@/utils/filterHelpers";

interface NewsClientProps {
  articles: NewsArticle[];
}

const fallbackText =
  "Não foi possível carregar os dados reais agora. Exibindo dados de demonstração.";

export function NewsClient({ articles }: NewsClientProps) {
  const [activeFilter, setActiveFilter] = useState<NewsFilter>("Todas");
  const [query, setQuery] = useState("");
  const [allArticles, setAllArticles] = useState(articles);
  const [bullsArticles, setBullsArticles] = useState<NewsArticle[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [bullsLoading, setBullsLoading] = useState(false);
  const [fallbackMessage, setFallbackMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadNews() {
      setLoading(true);
      const result = await getNewsResult();

      if (cancelled) return;

      setAllArticles(result.data.length ? result.data : articles);
      setFallbackMessage(result.source === "mock" ? result.error ?? fallbackText : null);
      setLoading(false);
    }

    loadNews();

    return () => {
      cancelled = true;
    };
  }, [articles]);

  useEffect(() => {
    if (activeFilter !== "Bulls" || bullsArticles) return;

    let cancelled = false;

    async function loadBullsNews() {
      setBullsLoading(true);
      const result = await getBullsNewsResult();

      if (cancelled) return;

      setBullsArticles(result.data);
      if (result.source === "mock") {
        setFallbackMessage(result.error ?? fallbackText);
      }
      setBullsLoading(false);
    }

    loadBullsNews();

    return () => {
      cancelled = true;
    };
  }, [activeFilter, bullsArticles]);

  const sourceArticles = activeFilter === "Bulls" && bullsArticles ? bullsArticles : allArticles;
  const effectiveFilter = activeFilter === "Bulls" && bullsArticles ? "Todas" : activeFilter;

  const filteredArticles = useMemo(
    () => filterNews(sourceArticles, effectiveFilter, query),
    [effectiveFilter, query, sourceArticles]
  );

  return (
    <div className="grid gap-8">
      <section className="rounded-lg border border-white/10 bg-white/[0.03] p-4 sm:p-5">
        <div className="grid gap-4">
          <FilterTabs options={newsFilters} active={activeFilter} onChange={setActiveFilter} />

          <label className="relative block">
            <span className="sr-only">Buscar notícia por palavra-chave</span>
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar por time, fonte ou palavra-chave"
              className="w-full rounded-md border border-white/10 bg-court-black py-3 pl-11 pr-4 text-sm text-zinc-200 outline-none transition placeholder:text-zinc-600 hover:border-white/25 focus:border-court-red"
            />
          </label>
        </div>
      </section>

      {loading || bullsLoading ? (
        <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4 text-sm font-semibold text-zinc-300">
          Carregando dados da NBA...
        </div>
      ) : null}

      {fallbackMessage ? (
        <div className="rounded-lg border border-court-red/25 bg-court-red/10 p-4 text-sm font-semibold text-zinc-200">
          {fallbackMessage}
        </div>
      ) : null}

      <section>
        <SectionTitle
          eyebrow="Feed"
          title={`${filteredArticles.length} notícias encontradas`}
          description="Cards preparados para exibir resumos e apontar para a fonte original quando o projeto consumir APIs reais."
        />
        <NewsGrid articles={filteredArticles} />
      </section>
    </div>
  );
}
