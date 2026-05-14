import { Building2, MapPin, Shield } from "lucide-react";
import type { FavoriteTeamDashboardData } from "@/types/favoriteTeam";

export function FavoriteTeamOverview({ data }: { data: FavoriteTeamDashboardData }) {
  const rows = [
    ["Nome completo", data.team.fullName],
    ["Abreviação", data.team.abbreviation ?? "-"],
    ["Conferência", data.team.conference ?? "-"],
    ["Divisão", data.team.division ?? "-"],
    ["Cidade", data.team.city ?? "-"],
    ["Arena", data.team.arena ?? "-"],
    ["Campanha", data.team.record ?? "-"],
    ["Posição", data.team.conferenceRank ? `#${data.team.conferenceRank}` : "-"]
  ];

  return (
    <section className="rounded-2xl border border-[rgba(var(--team-primary-rgb),0.34)] bg-white/[0.035] p-5 shadow-[0_0_60px_rgba(var(--team-primary-rgb),0.08)]">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--team-primary)]">
            Resumo do time favorito
          </p>
          <h2 className="mt-2 text-2xl font-black text-white">Identidade da franquia</h2>
        </div>
        <Shield className="h-7 w-7 text-[var(--team-primary)]" aria-hidden="true" />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {rows.map(([label, value]) => (
          <div key={label} className="rounded-xl border border-white/10 bg-black/25 p-4">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-zinc-500">{label}</p>
            <p className="mt-2 text-sm font-black text-white">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-black/20 p-4">
          <div className="mb-2 flex items-center gap-2 text-[var(--team-primary)]">
            <MapPin className="h-4 w-4" aria-hidden="true" />
            <p className="text-xs font-black uppercase tracking-[0.14em]">Base</p>
          </div>
          <p className="text-sm text-zinc-400">
            {data.team.city ?? "Cidade ainda indisponível"} · {data.team.arena ?? "Arena ainda indisponível"}
          </p>
        </div>
        <div className="rounded-xl border border-white/10 bg-black/20 p-4">
          <div className="mb-2 flex items-center gap-2 text-[var(--team-primary)]">
            <Building2 className="h-4 w-4" aria-hidden="true" />
            <p className="text-xs font-black uppercase tracking-[0.14em]">Fonte</p>
          </div>
          <p className="text-sm text-zinc-400">
            Dados do time combinam ESPN, classificação atual e base local histórica quando necessário.
          </p>
        </div>
      </div>
    </section>
  );
}
