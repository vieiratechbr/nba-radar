import { Star } from "lucide-react";
import { PlayerAvatar } from "@/components/PlayerAvatar";
import type { TeamBestPlayer as TeamBestPlayerType } from "@/types/favoriteTeam";

export function TeamBestPlayer({ player }: { player: TeamBestPlayerType | null }) {
  return (
    <section className="rounded-lg border border-[rgba(var(--team-primary-rgb),0.28)] bg-white/[0.03] p-5 shadow-[0_0_46px_rgba(var(--team-primary-rgb),0.06)]">
      <div className="mb-4 flex items-center gap-2">
        <Star className="h-5 w-5 text-[var(--team-primary)]" aria-hidden="true" />
        <h2 className="text-xl font-black text-white">Melhor jogador da temporada</h2>
      </div>

      {player ? (
        <div className="rounded-md border border-white/10 bg-black/20 p-4">
          <div className="flex items-center gap-4">
            <PlayerAvatar name={player.name} imageUrl={player.imageUrl} size="lg" />
            <div>
              <p className="text-lg font-black text-white">{player.name}</p>
              <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-zinc-500">
                {[player.teamAbbreviation, player.position].filter(Boolean).join(" · ")}
              </p>
            </div>
          </div>

          <div className="mt-4 grid gap-2 text-sm text-zinc-400">
            <p>{player.summary ?? "Base local inicial. Estatísticas detalhadas ainda não disponíveis."}</p>
            {player.pointsPerGame || player.reboundsPerGame || player.assistsPerGame ? (
              <p className="font-bold text-zinc-200">
                {player.pointsPerGame ? `${player.pointsPerGame} PPG` : ""}
                {player.reboundsPerGame ? ` · ${player.reboundsPerGame} RPG` : ""}
                {player.assistsPerGame ? ` · ${player.assistsPerGame} APG` : ""}
              </p>
            ) : null}
          </div>
        </div>
      ) : (
        <div className="rounded-md border border-white/10 bg-black/20 p-4 text-sm font-semibold text-zinc-400">
          Dados do principal jogador ainda indisponíveis.
        </div>
      )}
    </section>
  );
}
