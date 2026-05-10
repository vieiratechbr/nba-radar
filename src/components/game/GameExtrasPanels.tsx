import type { GameDetails } from "@/types/gameDetails";
import type { GamePrediction, HeadToHeadSummary, LastFiveGame, TeamRecentForm } from "@/types/gameExtras";
import { GameEmptyState } from "@/components/game/GameEmptyState";
import { formatDate } from "@/utils/formatDate";

function probabilityValue(value?: number) {
  return typeof value === "number" ? `${value.toFixed(1).replace(".", ",")}%` : "-";
}

export function GamePredictionPanel({
  prediction,
  details
}: {
  prediction: GamePrediction | null | undefined;
  details: GameDetails;
}) {
  if (!prediction) return <GameEmptyState>Previsão indisponível para esta partida.</GameEmptyState>;

  return (
    <div className="grid gap-4">
      <div className="grid gap-3 text-sm md:grid-cols-2">
        <div className="rounded-lg border border-white/10 bg-black/20 p-4">
          <span className="text-xs font-black uppercase tracking-[0.16em] text-zinc-500">{details.homeTeam.abbreviation}</span>
          <p className="mt-2 text-3xl font-black text-white">{probabilityValue(prediction.homeWinProbability)}</p>
        </div>
        <div className="rounded-lg border border-white/10 bg-black/20 p-4">
          <span className="text-xs font-black uppercase tracking-[0.16em] text-zinc-500">{details.visitorTeam.abbreviation}</span>
          <p className="mt-2 text-3xl font-black text-white">{probabilityValue(prediction.visitorWinProbability)}</p>
        </div>
      </div>
      {prediction.summary ? (
        <p className="text-sm leading-6 text-zinc-400">{prediction.summary}</p>
      ) : null}
    </div>
  );
}

export function GameHeadToHead({ headToHead }: { headToHead: HeadToHeadSummary | null | undefined }) {
  if (!headToHead?.lastMeetings?.length) {
    return <GameEmptyState>Confronto direto ainda não disponível.</GameEmptyState>;
  }

  return (
    <div className="grid gap-3">
      {headToHead.lastMeetings.slice(0, 5).map((meeting) => (
        <div key={meeting.id} className="rounded-lg border border-white/10 bg-black/20 p-4 text-sm text-zinc-400 transition hover:border-court-red/35 hover:bg-black/30">
          <p className="font-black text-white">
            {meeting.visitorTeam} {meeting.visitorScore ?? "-"} x {meeting.homeScore ?? "-"} {meeting.homeTeam}
          </p>
          <p className="mt-1 text-xs font-semibold">{meeting.date ? formatDate(meeting.date) : "Data indisponível"}</p>
        </div>
      ))}
    </div>
  );
}

function RecentForm({ form }: { form: TeamRecentForm }) {
  return (
    <div className="rounded-lg border border-white/10 bg-black/20 p-4">
      <p className="mb-3 text-sm font-black text-white">{form.teamName}</p>
      <div className="grid gap-2">
        {form.games.map((game: LastFiveGame) => (
          <div key={game.id} className="flex items-center justify-between gap-3 text-xs text-zinc-400">
            <span className="min-w-0 truncate">
              {game.homeAway === "home" ? "Casa" : "Fora"} vs {game.opponent}
            </span>
            <span className={`rounded-full px-2 py-1 font-black ${
              game.result === "W" ? "bg-emerald-400/10 text-emerald-200" :
                game.result === "L" ? "bg-court-red/10 text-red-200" : "bg-white/10 text-zinc-300"
            }`}
            >
              {(game.result ?? "-").replace("W", "V").replace("L", "D")} {game.score ? `· ${game.score}` : ""}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function GameRecentForm({
  home,
  visitor
}: {
  home: TeamRecentForm | null | undefined;
  visitor: TeamRecentForm | null | undefined;
}) {
  if (!home && !visitor) return <GameEmptyState>Últimos cinco jogos ainda não disponíveis.</GameEmptyState>;

  return (
    <div className="grid gap-3 md:grid-cols-2">
      {visitor ? <RecentForm form={visitor} /> : null}
      {home ? <RecentForm form={home} /> : null}
    </div>
  );
}
