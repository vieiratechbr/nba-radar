import { Table2 } from "lucide-react";
import type { StandingTeam } from "@/types/standing";

export function TeamSeasonPanel({ standing }: { standing: StandingTeam | null }) {
  return (
    <section className="rounded-2xl border border-[rgba(var(--team-primary-rgb),0.34)] bg-white/[0.035] p-5 shadow-[0_0_60px_rgba(var(--team-primary-rgb),0.08)]">
      <div className="mb-5 flex items-center gap-2">
        <Table2 className="h-5 w-5 text-[var(--team-primary)]" aria-hidden="true" />
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--team-primary)]">Temporada atual</p>
          <h2 className="mt-1 text-2xl font-black text-white">Classificação e campanha</h2>
        </div>
      </div>

      {standing ? (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[
            ["Posição", `#${standing.rank}`],
            ["Vitórias", String(standing.wins)],
            ["Derrotas", String(standing.losses)],
            ["Aproveitamento", standing.winPercentage ?? "-"],
            ["Conferência", standing.conference ?? "-"],
            ["Jogos atrás", standing.gamesBehind ?? "-"],
            ["Últimos 10", standing.lastTen ?? "-"],
            ["Sequência", standing.streak ?? "-"],
            ["Casa", standing.homeRecord ?? "-"],
            ["Fora", standing.awayRecord ?? "-"]
          ].map(([label, value]) => (
            <div key={label} className="rounded-xl border border-white/10 bg-black/25 p-4">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-zinc-500">{label}</p>
              <p className="mt-2 text-xl font-black text-white">{value}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-white/10 bg-black/20 p-4 text-sm font-semibold text-zinc-400">
          Classificação do time ainda indisponível.
        </div>
      )}
    </section>
  );
}
