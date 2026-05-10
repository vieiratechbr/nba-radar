import type { GameDetails } from "@/types/gameDetails";
import { GameEmptyState } from "@/components/game/GameEmptyState";
import { PlayerAvatar } from "@/components/PlayerAvatar";

type GameLeadersProps = {
  leaders?: GameDetails["leaders"];
};

export function GameLeaders({ leaders = [] }: GameLeadersProps) {
  if (!leaders.length) {
    return <GameEmptyState>Líderes ainda não disponíveis.</GameEmptyState>;
  }

  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {leaders.slice(0, 6).map((leader) => (
        <article
          key={`${leader.team}-${leader.category}-${leader.athleteName}`}
          className="rounded-lg border border-white/10 bg-black/20 p-4 transition hover:-translate-y-0.5 hover:border-court-red/35 hover:bg-black/30"
        >
          <p className="text-xs font-black uppercase tracking-[0.16em] text-court-red">
            {leader.category} · {leader.team}
          </p>
          <div className="mt-4 flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <PlayerAvatar name={leader.athleteName} imageUrl={leader.athleteHeadshot} size="sm" />
              <div className="min-w-0">
                <p className="truncate font-black text-white">{leader.athleteName}</p>
                {leader.athleteShortName ? (
                  <p className="text-xs text-zinc-500">{leader.athleteShortName}</p>
                ) : null}
              </div>
            </div>
            <p className="shrink-0 text-2xl font-black text-white">{leader.value}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
