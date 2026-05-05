"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import type { Game } from "@/types/game";
import type { Team } from "@/types/team";
import { GameCard } from "@/components/GameCard";
import { SectionTitle } from "@/components/SectionTitle";
import { getTodayGamesResult } from "@/services/gamesService";

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

  useEffect(() => {
    let cancelled = false;

    async function loadTodayGames() {
      const result = await getTodayGamesResult();

      if (cancelled) return;

      setVisibleGames(result.data);
      setFallbackMessage(result.fallback ? result.message ?? "Exibindo dados de demonstração." : null);
      setEmptyMessage(!result.fallback && result.empty ? result.message ?? "Nenhum jogo encontrado." : null);
    }

    loadTodayGames();

    return () => {
      cancelled = true;
    };
  }, [games]);

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
