"use client";

import { Target } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { PlayerAvatar } from "@/components/PlayerAvatar";
import type { DraftProspect } from "@/types/draft";
import { getDraftProspects } from "@/services/draftService";

export function DraftClient() {
  const [prospects, setProspects] = useState<DraftProspect[]>([]);
  const [selectedYear, setSelectedYear] = useState("Todos");
  const [selectedPosition, setSelectedPosition] = useState("Todas");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadProspects() {
      setLoading(true);
      const result = await getDraftProspects();
      if (cancelled) return;

      setProspects(result.data);
      setMessage("Base local inicial de prospectos. Ranking sujeito a mudanças. Imagens podem usar fallback quando não houver foto oficial disponível.");
      setLoading(false);
    }

    void loadProspects();

    return () => {
      cancelled = true;
    };
  }, []);

  const years = useMemo(
    () => ["Todos", ...Array.from(new Set(prospects.map((prospect) => prospect.year))).sort((a, b) => b.localeCompare(a))],
    [prospects]
  );
  const positions = useMemo(
    () => ["Todas", ...Array.from(new Set(prospects.map((prospect) => prospect.position)))],
    [prospects]
  );
  const filteredProspects = useMemo(
    () =>
      prospects.filter((prospect) => {
        const yearMatches = selectedYear === "Todos" || prospect.year === selectedYear;
        const positionMatches = selectedPosition === "Todas" || prospect.position === selectedPosition;
        return yearMatches && positionMatches;
      }),
    [prospects, selectedPosition, selectedYear]
  );

  return (
    <div className="grid gap-6">
      <div className="grid gap-3 lg:grid-cols-2">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {years.map((year) => (
            <button
              key={year}
              type="button"
              onClick={() => setSelectedYear(year)}
              className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold transition ${
                selectedYear === year
                  ? "border-court-red bg-court-red text-white shadow-glow"
                  : "border-white/10 bg-white/[0.04] text-zinc-300 hover:border-white/25 hover:bg-white/[0.08] hover:text-white"
              }`}
            >
              {year}
            </button>
          ))}
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 lg:justify-end">
          {positions.map((position) => (
            <button
              key={position}
              type="button"
              onClick={() => setSelectedPosition(position)}
              className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold transition ${
                selectedPosition === position
                  ? "border-court-red bg-court-red text-white shadow-glow"
                  : "border-white/10 bg-white/[0.04] text-zinc-300 hover:border-white/25 hover:bg-white/[0.08] hover:text-white"
              }`}
            >
              {position}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4 text-sm font-semibold text-zinc-300">
          Carregando radar do Draft...
        </div>
      ) : null}

      {message ? (
        <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4 text-sm font-semibold text-zinc-300">
          {message}
        </div>
      ) : null}

      {!loading && filteredProspects.length === 0 ? (
        <div className="rounded-lg border border-white/10 bg-white/[0.03] p-8 text-center text-sm text-zinc-400">
          Nenhum prospecto encontrado para os filtros selecionados.
        </div>
      ) : null}

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filteredProspects.map((prospect) => (
          <article
            key={prospect.id}
            className="rounded-lg border border-white/10 bg-court-slate/82 p-5 shadow-lg transition hover:-translate-y-1 hover:border-court-red/60 hover:bg-[#1d2029] hover:shadow-glow"
          >
            <div className="mb-5 flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <PlayerAvatar name={prospect.playerName} imageUrl={prospect.imageUrl} />
                <div className="grid h-12 w-12 place-items-center rounded-md bg-court-red text-lg font-black text-white">
                  #{prospect.rank}
                </div>
              </div>
              <span className="rounded-full border border-white/10 px-3 py-1 text-xs font-bold text-zinc-300">
                Pick {prospect.projectedPick ?? "-"}
              </span>
            </div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-court-red">
              {prospect.year} · {prospect.position}
            </p>
            <h2 className="mt-3 text-2xl font-black text-white">{prospect.playerName}</h2>
            <p className="mt-2 text-sm font-semibold text-zinc-300">
              {[prospect.schoolOrTeam, prospect.nationality].filter(Boolean).join(" · ")}
            </p>
            <div className="mt-4 grid grid-cols-3 gap-2 text-xs text-zinc-400">
              <span>{prospect.age ? `${prospect.age} anos` : "-"}</span>
              <span>{prospect.height ?? "-"}</span>
              <span>{prospect.weight ?? "-"}</span>
            </div>
            <div className="mt-5 grid gap-3">
              <div>
                <div className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-zinc-500">
                  <Target className="h-3.5 w-3.5 text-court-red" aria-hidden="true" />
                  Pontos fortes
                </div>
                <div className="flex flex-wrap gap-2">
                  {prospect.strengths?.map((strength) => (
                    <span key={strength} className="rounded-full bg-white/[0.06] px-3 py-1 text-xs font-semibold text-zinc-300">
                      {strength}
                    </span>
                  ))}
                </div>
              </div>
              {prospect.weakness?.length ? (
                <p className="text-xs leading-5 text-zinc-500">
                  Pontos de atenção: {prospect.weakness.join(", ")}.
                </p>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
