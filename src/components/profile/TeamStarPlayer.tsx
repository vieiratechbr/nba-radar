import { Star } from "lucide-react";
import { PlayerAvatar } from "@/components/PlayerAvatar";
import type { TeamBestPlayer } from "@/types/favoriteTeam";

export function TeamStarPlayer({ player }: { player: TeamBestPlayer | null }) {
  return (
    <section className="rounded-2xl border border-[rgba(var(--team-primary-rgb),0.34)] bg-white/[0.035] p-5 shadow-[0_0_60px_rgba(var(--team-primary-rgb),0.08)]">
      <div className="mb-5 flex items-center gap-2">
        <Star className="h-5 w-5 text-[var(--team-primary)]" aria-hidden="true" />
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--team-primary)]">Destaque do elenco</p>
          <h2 className="mt-1 text-2xl font-black text-white">Principal referência</h2>
        </div>
      </div>

      {player ? (
        <div className="rounded-xl border border-white/10 bg-black/25 p-5">
          <div className="flex items-center gap-4">
            <PlayerAvatar name={player.name} imageUrl={player.imageUrl} size="xl" />
            <div>
              <p className="text-2xl font-black text-white">{player.name}</p>
              <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-zinc-500">
                {[player.teamAbbreviation, player.position].filter(Boolean).join(" · ")}
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <Metric label="PPG" value={player.pointsPerGame?.toString() ?? "-"} />
            <Metric label="RPG" value={player.reboundsPerGame?.toString() ?? "-"} />
            <Metric label="APG" value={player.assistsPerGame?.toString() ?? "-"} />
          </div>

          <p className="mt-4 text-sm leading-6 text-zinc-400">
            {player.summary ?? "Dados do principal jogador ainda indisponíveis."}
          </p>
          {player.source === "mock" ? (
            <p className="mt-3 text-xs font-semibold text-zinc-500">Base local usada como fallback.</p>
          ) : null}
        </div>
      ) : (
        <div className="rounded-xl border border-white/10 bg-black/20 p-4 text-sm font-semibold text-zinc-400">
          Dados do principal jogador ainda indisponíveis.
        </div>
      )}
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-black/30 p-3">
      <p className="text-xs font-black uppercase tracking-[0.14em] text-zinc-500">{label}</p>
      <p className="mt-1 text-lg font-black text-white">{value}</p>
    </div>
  );
}
