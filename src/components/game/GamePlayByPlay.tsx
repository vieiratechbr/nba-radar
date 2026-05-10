"use client";

import { useMemo, useState } from "react";
import type { GamePlay } from "@/types/gameDetails";
import { GameEmptyState } from "@/components/game/GameEmptyState";

type GamePlayByPlayProps = {
  plays?: GamePlay[];
};

function periodLabel(period?: number) {
  if (!period) return "Partida";
  return `${period}º quarto`;
}

export function GamePlayByPlay({ plays = [] }: GamePlayByPlayProps) {
  const [showAll, setShowAll] = useState(false);
  const visiblePlays = showAll ? plays : plays.slice(0, 20);

  const groupedPlays = useMemo(() => {
    return visiblePlays.reduce<Record<string, GamePlay[]>>((groups, play) => {
      const label = periodLabel(play.period);
      groups[label] = groups[label] ?? [];
      groups[label].push(play);
      return groups;
    }, {});
  }, [visiblePlays]);

  if (!plays.length) {
    return <GameEmptyState>Lances detalhados ainda não disponíveis.</GameEmptyState>;
  }

  return (
    <div className="grid gap-5">
      {Object.entries(groupedPlays).map(([period, periodPlays]) => (
        <div key={period} className="grid gap-3">
          <div className="flex items-center gap-3">
            <span className="h-px flex-1 bg-white/10" />
            <span className="rounded-full border border-white/10 bg-white/[0.055] px-3 py-1 text-xs font-black uppercase tracking-[0.14em] text-zinc-300">
              {period}
            </span>
            <span className="h-px flex-1 bg-white/10" />
          </div>
          <div className="relative grid gap-3 before:absolute before:left-3 before:top-0 before:h-full before:w-px before:bg-white/10">
            {periodPlays.map((play) => (
              <article key={play.id} className="relative ml-7 rounded-lg border border-white/10 bg-black/20 p-4 transition hover:border-court-red/35 hover:bg-black/30">
                <span className="absolute -left-[1.82rem] top-5 h-2.5 w-2.5 rounded-full border border-court-red bg-[#101116] shadow-[0_0_18px_rgba(215,25,32,0.5)]" />
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-zinc-500">
                  {play.clock ? play.clock : "Relógio indisponível"}
                  {play.team ? ` · ${play.team}` : ""}
                </p>
                <p className="mt-2 text-sm font-semibold leading-6 text-white">{play.text}</p>
                {play.score ? <p className="mt-2 text-sm font-black text-court-red">{play.score}</p> : null}
              </article>
            ))}
          </div>
        </div>
      ))}

      {plays.length > 20 ? (
        <button
          type="button"
          onClick={() => setShowAll((current) => !current)}
          className="mx-auto inline-flex rounded-full border border-white/10 px-4 py-2 text-sm font-black text-white transition hover:border-court-red hover:bg-court-red/10 hover:text-court-red"
        >
          {showAll ? "Mostrar menos lances" : "Ver mais lances"}
        </button>
      ) : null}
    </div>
  );
}
