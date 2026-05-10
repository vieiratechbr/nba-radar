import type { GameDetails } from "@/types/gameDetails";
import { GameEmptyState } from "@/components/game/GameEmptyState";

type GamePeriodScoreProps = {
  details: GameDetails;
};

export function GamePeriodScore({ details }: GamePeriodScoreProps) {
  if (!details.linescore?.length) {
    return <GameEmptyState>Placar por período ainda não disponível.</GameEmptyState>;
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-white/10">
      <table className="w-full min-w-[560px] border-collapse text-sm">
        <thead className="bg-white/[0.055] text-xs uppercase tracking-[0.16em] text-zinc-400">
          <tr>
            <th className="px-4 py-3 text-left">Time</th>
            {details.linescore.map((line) => (
              <th key={line.period} className="px-4 py-3 text-center">{line.period}</th>
            ))}
            <th className="px-4 py-3 text-center text-white">Total</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10 bg-black/15 text-zinc-200">
          <tr className="transition hover:bg-white/[0.045]">
            <td className="px-4 py-4 font-black text-white">{details.visitorTeam.abbreviation}</td>
            {details.linescore.map((line) => (
              <td key={line.period} className="px-4 py-4 text-center">{line.visitorScore}</td>
            ))}
            <td className="px-4 py-4 text-center text-lg font-black text-white">{details.visitorTeam.score}</td>
          </tr>
          <tr className="transition hover:bg-white/[0.045]">
            <td className="px-4 py-4 font-black text-white">{details.homeTeam.abbreviation}</td>
            {details.linescore.map((line) => (
              <td key={line.period} className="px-4 py-4 text-center">{line.homeScore}</td>
            ))}
            <td className="px-4 py-4 text-center text-lg font-black text-white">{details.homeTeam.score}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
