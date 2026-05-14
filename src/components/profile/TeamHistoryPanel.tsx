import { Landmark } from "lucide-react";
import type { TeamHistory } from "@/types/favoriteTeam";

export function TeamHistoryPanel({ history }: { history: TeamHistory | null }) {
  return (
    <section className="rounded-2xl border border-[rgba(var(--team-primary-rgb),0.34)] bg-white/[0.035] p-5 shadow-[0_0_60px_rgba(var(--team-primary-rgb),0.08)]">
      <div className="mb-5 flex items-center gap-2">
        <Landmark className="h-5 w-5 text-[var(--team-primary)]" aria-hidden="true" />
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--team-primary)]">Histórico da franquia</p>
          <h2 className="mt-1 text-2xl font-black text-white">Contexto e legado</h2>
        </div>
      </div>

      {history ? (
        <>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <Info label="Fundação" value={history.founded ?? "-"} />
            <Info label="Cidade" value={history.city ?? "-"} />
            <Info label="Arena" value={history.arena ?? "-"} />
            <Info label="Títulos NBA" value={`${history.championships ?? 0} títulos da NBA`} />
          </div>
          {history.summary ? (
            <p className="mt-5 rounded-xl border border-white/10 bg-black/20 p-4 text-sm leading-7 text-zinc-400">
              {history.summary}
            </p>
          ) : null}
        </>
      ) : (
        <div className="rounded-xl border border-white/10 bg-black/20 p-4 text-sm font-semibold text-zinc-400">
          Histórico da franquia em atualização.
        </div>
      )}
    </section>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/25 p-4">
      <p className="text-xs font-black uppercase tracking-[0.14em] text-zinc-500">{label}</p>
      <p className="mt-2 text-sm font-black text-white">{value}</p>
    </div>
  );
}
