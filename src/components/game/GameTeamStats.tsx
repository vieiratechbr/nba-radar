import type { GameDetails, TeamStatGroup } from "@/types/gameDetails";
import { GameEmptyState } from "@/components/game/GameEmptyState";

type GameTeamStatsProps = {
  details: GameDetails;
};

function parseMetricValue(value: string) {
  const parsed = Number(value.replace(",", ".").replace(/[^0-9.-]/g, ""));
  return Number.isFinite(parsed) ? parsed : undefined;
}

function getTeamGroup(groups: TeamStatGroup[], abbreviation: string) {
  return groups.find((group) => group.team === abbreviation) ?? groups.find((group) => group.stats.length);
}

function getStatValue(group: TeamStatGroup | undefined, label: string) {
  return group?.stats.find((stat) => stat.label === label)?.value ?? "-";
}

export function GameTeamStats({ details }: GameTeamStatsProps) {
  const groups = details.teamStats?.filter((group) => group.stats.length) ?? [];
  if (!groups.length) {
    return <GameEmptyState>Estatísticas dos times ainda não disponíveis.</GameEmptyState>;
  }

  const visitorGroup = getTeamGroup(groups, details.visitorTeam.abbreviation);
  const homeGroup = getTeamGroup(groups.filter((group) => group !== visitorGroup), details.homeTeam.abbreviation);
  const labels = Array.from(new Set(groups.flatMap((group) => group.stats.map((stat) => stat.label))));

  return (
    <div className="overflow-hidden rounded-lg border border-white/10">
      <div className="grid grid-cols-[0.8fr_1.2fr_0.8fr] bg-white/[0.055] px-4 py-3 text-xs font-black uppercase tracking-[0.16em] text-zinc-400">
        <span>{details.visitorTeam.abbreviation}</span>
        <span className="text-center">Métrica</span>
        <span className="text-right">{details.homeTeam.abbreviation}</span>
      </div>
      <div className="divide-y divide-white/10 bg-black/15">
        {labels.map((label) => {
          const visitorValue = getStatValue(visitorGroup, label);
          const homeValue = getStatValue(homeGroup, label);
          const visitorNumber = parseMetricValue(visitorValue);
          const homeNumber = parseMetricValue(homeValue);
          const max = Math.max(visitorNumber ?? 0, homeNumber ?? 0, 1);
          const visitorLeads = visitorNumber !== undefined && homeNumber !== undefined && visitorNumber > homeNumber;
          const homeLeads = visitorNumber !== undefined && homeNumber !== undefined && homeNumber > visitorNumber;

          return (
            <div key={label} className="grid grid-cols-[0.8fr_1.2fr_0.8fr] items-center gap-3 px-4 py-4 text-sm transition hover:bg-white/[0.035]">
              <span className={`font-black ${visitorLeads ? "text-court-red" : "text-white"}`}>{visitorValue}</span>
              <div className="min-w-0">
                <div className="mb-2 text-center text-xs font-bold uppercase tracking-[0.14em] text-zinc-500">
                  {label}
                </div>
                <div className="grid grid-cols-2 gap-1">
                  <div className="flex justify-end">
                    <span
                      className={`h-1.5 rounded-l-full ${visitorLeads ? "bg-court-red" : "bg-white/20"}`}
                      style={{ width: `${Math.max(((visitorNumber ?? 0) / max) * 100, 8)}%` }}
                    />
                  </div>
                  <div>
                    <span
                      className={`block h-1.5 rounded-r-full ${homeLeads ? "bg-court-red" : "bg-white/20"}`}
                      style={{ width: `${Math.max(((homeNumber ?? 0) / max) * 100, 8)}%` }}
                    />
                  </div>
                </div>
              </div>
              <span className={`text-right font-black ${homeLeads ? "text-court-red" : "text-white"}`}>{homeValue}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
