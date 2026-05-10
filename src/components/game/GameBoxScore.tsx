import type { GameDetails, PlayerBoxScore } from "@/types/gameDetails";
import { GameEmptyState } from "@/components/game/GameEmptyState";

type GameBoxScoreProps = {
  details: GameDetails;
};

const columns: Array<{ key: keyof PlayerBoxScore; label: string; align?: "left" | "center" }> = [
  { key: "minutes", label: "MIN", align: "center" },
  { key: "points", label: "PTS", align: "center" },
  { key: "rebounds", label: "REB", align: "center" },
  { key: "assists", label: "AST", align: "center" },
  { key: "steals", label: "STL", align: "center" },
  { key: "blocks", label: "BLK", align: "center" },
  { key: "turnovers", label: "TO", align: "center" },
  { key: "fieldGoals", label: "FG", align: "center" },
  { key: "threePointers", label: "3PT", align: "center" },
  { key: "freeThrows", label: "FT", align: "center" }
];

function playerValue(player: PlayerBoxScore, key: keyof PlayerBoxScore) {
  const value = player[key];
  return value === undefined || value === "" ? "-" : value;
}

function points(player: PlayerBoxScore) {
  const parsed = Number(player.points);
  return Number.isFinite(parsed) ? parsed : 0;
}

function TeamBoxScore({ team, players }: { team: string; players: PlayerBoxScore[] }) {
  const sortedPlayers = [...players].sort((a, b) => points(b) - points(a));
  const topPoints = points(sortedPlayers[0]);

  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-black/15">
      <div className="flex items-center justify-between gap-3 border-b border-white/10 bg-white/[0.055] px-4 py-3">
        <h3 className="text-sm font-black uppercase tracking-[0.16em] text-white">{team}</h3>
        <span className="rounded-full border border-court-red/25 bg-court-red/10 px-3 py-1 text-xs font-black text-court-red">
          {players.length} jogadores
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[920px] border-collapse text-sm">
          <thead className="bg-[#151821] text-xs uppercase tracking-[0.16em] text-zinc-400">
            <tr>
              <th className="px-4 py-3 text-left">Jogador</th>
              {columns.map((column) => (
                <th key={column.key} className="px-3 py-3 text-center">{column.label}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10 text-zinc-300">
            {sortedPlayers.map((player, index) => {
              const isTopScorer = topPoints > 0 && points(player) === topPoints;

              return (
                <tr
                  key={`${player.team}-${player.athleteId ?? player.athleteName}-${index}`}
                  className="transition odd:bg-white/[0.015] hover:bg-court-red/10"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div>
                        <p className="font-black text-white">{player.athleteName}</p>
                        {player.position ? <p className="text-xs text-zinc-500">{player.position}</p> : null}
                      </div>
                      {isTopScorer ? (
                        <span className="rounded-full border border-court-red/25 bg-court-red/10 px-2 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-court-red">
                          Cestinha
                        </span>
                      ) : null}
                    </div>
                  </td>
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={`px-3 py-3 ${column.key === "points" ? "font-black text-white" : ""} text-center`}
                    >
                      {playerValue(player, column.key)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function GameBoxScore({ details }: GameBoxScoreProps) {
  const players = details.playerStats ?? [];
  if (!players.length) {
    return <GameEmptyState>Box score ainda não disponível para esta partida.</GameEmptyState>;
  }

  const groups = Array.from(new Set(players.map((player) => player.team))).map((team) => ({
    team,
    players: players.filter((player) => player.team === team)
  }));

  return (
    <div className="grid gap-5">
      {groups.map((group) => (
        <TeamBoxScore key={group.team} team={group.team} players={group.players} />
      ))}
    </div>
  );
}
