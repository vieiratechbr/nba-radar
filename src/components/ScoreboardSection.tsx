"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { Game } from "@/types/game";
import type { Team } from "@/types/team";
import { GameCard } from "@/components/GameCard";
import { SectionTitle } from "@/components/SectionTitle";
import { useAutoRefresh } from "@/hooks/useAutoRefresh";
import { getTodayGamesResult } from "@/services/gamesService";
import { formatLastUpdated } from "@/utils/formatGameTime";
import { getAutoRefreshLabel, shouldAutoRefreshGames } from "@/utils/gameRefresh";

interface ScoreboardSectionProps {
  games: Game[];
  teams: Team[];
  title?: string;
  description?: string;
}

export function ScoreboardSection({
  games,
  teams,
  title = "Jogos de hoje",
  description = "Placar, status, arena e destaque da partida em cards rápidos para acompanhar a rodada."
}: ScoreboardSectionProps) {
  const [visibleGames, setVisibleGames] = useState(games);
  const [fallbackMessage, setFallbackMessage] = useState<string | null>(null);
  const [emptyMessage, setEmptyMessage] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const autoRefreshEnabled = useMemo(() => shouldAutoRefreshGames(visibleGames), [visibleGames]);
  const autoRefreshLabel = useMemo(() => getAutoRefreshLabel(visibleGames), [visibleGames]);
  const refreshInterval = useMemo(
    () => visibleGames.some((game) => game.status === "live") ? 30000 : 60000,
    [visibleGames]
  );

  const loadTodayGames = useCallback(async () => {
    const result = await getTodayGamesResult();

    setVisibleGames(result.data);
    setFallbackMessage(result.fallback ? result.message ?? "Exibindo dados de demonstração." : null);
    setEmptyMessage(!result.fallback && result.empty ? result.message ?? "Nenhum jogo encontrado." : null);
    setLastUpdated(new Date());
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadInitialTodayGames() {
      const result = await getTodayGamesResult();

      if (cancelled) return;

      setVisibleGames(result.data);
      setFallbackMessage(result.fallback ? result.message ?? "Exibindo dados de demonstração." : null);
      setEmptyMessage(!result.fallback && result.empty ? result.message ?? "Nenhum jogo encontrado." : null);
      setLastUpdated(new Date());
    }

    void loadInitialTodayGames();

    return () => {
      cancelled = true;
    };
  }, [games]);

  useAutoRefresh(() => {
    void loadTodayGames();
  }, refreshInterval, autoRefreshEnabled);

  return (
    <section>
      <SectionTitle
        eyebrow="Scoreboard"
        title={title}
        description={description}
        action={
          <Link
            href="/placares"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm font-bold text-white transition hover:border-court-red hover:text-court-red"
          >
            Ver todos
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        }
      />
      {fallbackMessage ? (
        <div className="mb-5 rounded-lg border border-court-red/25 bg-court-red/10 p-4 text-sm font-semibold text-zinc-200">
          {fallbackMessage}
        </div>
      ) : null}
      {emptyMessage ? (
        <div className="mb-5 rounded-lg border border-white/10 bg-white/[0.03] p-4 text-sm font-semibold text-zinc-300">
          {emptyMessage}
        </div>
      ) : null}
      {lastUpdated ? (
        <div className={`mb-5 rounded-lg border p-3 text-xs font-bold ${
          autoRefreshEnabled
            ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-200"
            : "border-white/10 bg-white/[0.03] text-zinc-400"
        }`}
        >
          {autoRefreshLabel}
          {` · Última atualização: ${formatLastUpdated(lastUpdated)}`}
        </div>
      ) : null}
      {visibleGames.length > 0 ? (
        <div className="grid gap-5 lg:grid-cols-3">
          {visibleGames.slice(0, 3).map((game) => (
            <GameCard key={game.id} game={game} teams={teams} />
          ))}
        </div>
      ) : null}
    </section>
  );
}
