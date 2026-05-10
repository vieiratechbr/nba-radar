import { Table2 } from "lucide-react";
import type { StandingTeam } from "@/types/standing";

export function TeamSeasonSummary({ standing }: { standing: StandingTeam | null }) {
  return (
    <section className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
      <div className="mb-4 flex items-center gap-2">
        <Table2 className="h-5 w-5 text-court-red" aria-hidden="true" />
        <h2 className="text-xl font-black text-white">Temporada do time</h2>
      </div>

      {standing ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            ["Posição", `#${standing.rank}`],
            ["Campanha", `${standing.wins}-${standing.losses}`],
            ["Aproveitamento", standing.winPercentage ?? "-"],
            ["Conferência", standing.conference ?? "-"],
            ["Jogos atrás", standing.gamesBehind ?? "-"],
            ["Últimos 10", standing.lastTen ?? "-"],
            ["Sequência", standing.streak ?? "-"],
            ["Casa/Fora", `${standing.homeRecord ?? "-"} · ${standing.awayRecord ?? "-"}`]
          ].map(([label, value]) => (
            <div key={label} className="rounded-md border border-white/10 bg-black/20 p-4">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-zinc-500">{label}</p>
              <p className="mt-2 text-lg font-black text-white">{value}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-md border border-white/10 bg-black/20 p-4 text-sm font-semibold text-zinc-400">
          Classificação do time ainda indisponível.
        </div>
      )}
    </section>
  );
}
