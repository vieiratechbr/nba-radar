import { Crown } from "lucide-react";
import { PlayerAvatar } from "@/components/PlayerAvatar";
import type { TeamLegend } from "@/types/favoriteTeam";

export function TeamLegends({ legends }: { legends: TeamLegend[] }) {
  return (
    <section className="rounded-2xl border border-[rgba(var(--team-primary-rgb),0.34)] bg-white/[0.035] p-5 shadow-[0_0_60px_rgba(var(--team-primary-rgb),0.08)]">
      <div className="mb-5 flex items-center gap-2">
        <Crown className="h-5 w-5 text-[var(--team-primary)]" aria-hidden="true" />
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--team-primary)]">Lendas da franquia</p>
          <h2 className="mt-1 text-2xl font-black text-white">Nomes históricos</h2>
        </div>
      </div>

      {legends.length ? (
        <div className="grid gap-3 md:grid-cols-2">
          {legends.map((legend) => (
            <article key={legend.id} className="rounded-xl border border-white/10 bg-black/25 p-4 transition hover:border-[var(--team-primary)]/60 hover:bg-black/35">
              <div className="flex items-start gap-4">
                <PlayerAvatar name={legend.name} imageUrl={legend.imageUrl} size="lg" />
                <div>
                  <div className="mb-2 inline-flex rounded-full border border-[rgba(var(--team-primary-rgb),0.35)] bg-[rgba(var(--team-primary-rgb),0.12)] px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-white">
                    Lenda
                  </div>
                  <h3 className="text-lg font-black text-white">{legend.name}</h3>
                  <p className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-zinc-500">
                    {[legend.position, legend.years].filter(Boolean).join(" · ")}
                  </p>
                  {legend.description ? (
                    <p className="mt-3 text-sm leading-6 text-zinc-400">{legend.description}</p>
                  ) : null}
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-white/10 bg-black/20 p-4 text-sm font-semibold text-zinc-400">
          Lista de lendas em atualização para este time.
        </div>
      )}
    </section>
  );
}
