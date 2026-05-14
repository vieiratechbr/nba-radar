import { Activity } from "lucide-react";
import type { TeamStats } from "@/types/favoriteTeam";

export function TeamStatsPanel({ stats }: { stats: TeamStats | null }) {
  return (
    <section className="rounded-2xl border border-[rgba(var(--team-primary-rgb),0.34)] bg-white/[0.035] p-5 shadow-[0_0_60px_rgba(var(--team-primary-rgb),0.08)]">
      <div className="mb-5 flex items-center gap-2">
        <Activity className="h-5 w-5 text-[var(--team-primary)]" aria-hidden="true" />
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--team-primary)]">Estatísticas do time</p>
          <h2 className="mt-1 text-2xl font-black text-white">Indicadores de temporada</h2>
        </div>
      </div>

      {stats?.metrics.length ? (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {stats.metrics.map((metric) => (
            <div key={metric.label} className="rounded-xl border border-white/10 bg-black/25 p-4">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-zinc-500">
                {metric.abbreviation ?? "STAT"}
              </p>
              <p className="mt-2 text-2xl font-black text-white">{metric.value}</p>
              <p className="mt-1 text-sm text-zinc-400">{metric.label}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-white/10 bg-black/20 p-4 text-sm font-semibold text-zinc-400">
          Estatísticas avançadas do time ainda indisponíveis.
        </div>
      )}
    </section>
  );
}
