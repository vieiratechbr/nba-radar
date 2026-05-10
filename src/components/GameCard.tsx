import Link from "next/link";
import { ArrowRight, Clock, MapPin, Sparkles } from "lucide-react";
import type { Game } from "@/types/game";
import type { Team } from "@/types/team";
import { StatusBadge } from "@/components/StatusBadge";
import { TeamBadge } from "@/components/TeamBadge";
import { formatShortDate } from "@/utils/formatDate";
import { formatGameTimeBrasilia, isUnavailableGameTime } from "@/utils/formatGameTime";
import { isScheduledNearStart } from "@/utils/gameRefresh";

interface GameCardProps {
  game: Game;
  teams: Team[];
  compact?: boolean;
}

function resolveTeam(teams: Team[], teamId: string) {
  const team = teams.find((candidate) => candidate.id === teamId);
  if (!team) {
    return {
      id: teamId,
      city: teamId.toUpperCase(),
      name: "Equipe",
      abbreviation: teamId.toUpperCase().slice(0, 3),
      conference: "East" as const,
      record: "-",
      seed: 0,
      colors: { primary: "#d71920", secondary: "#2a2d37" }
    };
  }
  return team;
}

export function GameCard({ game, teams, compact = false }: GameCardProps) {
  const homeTeam = game.homeTeam
    ? toTeamDisplay(game.homeTeam, teams)
    : resolveTeam(teams, game.homeTeamId ?? "home");
  const awayTeam = game.visitorTeam
    ? toTeamDisplay(game.visitorTeam, teams)
    : resolveTeam(teams, game.awayTeamId ?? "away");
  const homeScore = game.homeTeam?.score ?? game.homeScore;
  const awayScore = game.visitorTeam?.score ?? game.awayScore;
  const hasScore = typeof homeScore === "number" && typeof awayScore === "number";
  const scheduledTime = game.time ?? formatGameTimeBrasilia(game.date);
  const scheduledNearStart = game.status === "scheduled" && isScheduledNearStart(game.date);
  const periodLabel =
    game.status === "scheduled"
      ? `Agendado · ${scheduledTime}${isUnavailableGameTime(scheduledTime) ? "" : " BRT"}${scheduledNearStart ? " · aguardando atualização" : ""}`
      : typeof game.period === "number"
      ? `${game.period}º quarto`
      : game.period ?? game.clock ?? game.time ?? "Horário indefinido";
  const location = [game.arena ?? "Arena não informada", game.city].filter(Boolean).join(", ");

  function toTeamDisplay(snapshot: NonNullable<Game["homeTeam"]>, knownTeams: Team[]): Team {
    const knownTeam = knownTeams.find(
      (team) => team.abbreviation?.toLowerCase() === snapshot.abbreviation.toLowerCase()
    );

    if (knownTeam) {
      return {
        ...knownTeam,
        name: snapshot.name || knownTeam.name,
        city: snapshot.fullName.replace(snapshot.name, "").trim() || knownTeam.city,
        fullName: snapshot.fullName || knownTeam.fullName,
        abbreviation: snapshot.abbreviation || knownTeam.abbreviation,
        logoUrl: snapshot.logoUrl ?? knownTeam.logoUrl,
        colors: {
          primary: snapshot.color ? `#${snapshot.color.replace("#", "")}` : knownTeam.colors?.primary ?? "#d71920",
          secondary: knownTeam.colors?.secondary ?? "#2a2d37"
        }
      };
    }

    return {
      id: String(snapshot.id ?? snapshot.abbreviation),
      city: snapshot.fullName.replace(snapshot.name, "").trim() || snapshot.fullName,
      name: snapshot.name,
      fullName: snapshot.fullName,
      abbreviation: snapshot.abbreviation,
      logoUrl: snapshot.logoUrl,
      conference: "East",
      record: "-",
      seed: 0,
      colors: {
        primary: snapshot.color ? `#${snapshot.color.replace("#", "")}` : "#d71920",
        secondary: "#2a2d37"
      }
    };
  }

  return (
    <article
      id={game.id}
      className="group rounded-lg border border-white/10 bg-court-slate/82 p-5 shadow-lg transition duration-300 hover:-translate-y-1 hover:border-court-red/60 hover:bg-[#1d2029] hover:shadow-glow"
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <StatusBadge status={game.status} />
        <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400">
          <Clock className="h-4 w-4" aria-hidden="true" />
          <span>{periodLabel}</span>
        </div>
      </div>

      <div className="grid gap-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <TeamBadge team={awayTeam} size={compact ? "sm" : "md"} />
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-white">{awayTeam.city}</p>
              <p className="truncate text-xs text-zinc-400">{awayTeam.name}</p>
            </div>
          </div>
          <span className="text-2xl font-black text-white">{hasScore ? awayScore : "-"}</span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <TeamBadge team={homeTeam} size={compact ? "sm" : "md"} />
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-white">{homeTeam.city}</p>
              <p className="truncate text-xs text-zinc-400">{homeTeam.name}</p>
            </div>
          </div>
          <span className="text-2xl font-black text-white">{hasScore ? homeScore : "-"}</span>
        </div>
      </div>

      <div className="my-5 h-px bg-white/10" />

      <div className="grid gap-3 text-sm text-zinc-400">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-court-red" aria-hidden="true" />
          <span>{location}</span>
        </div>
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-court-red" aria-hidden="true" />
          <span>{game.highlight ?? "Destaque indisponível"}</span>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
          {formatShortDate(game.date)}
        </span>
        {game.id ? (
          <Link
            href={`/jogos/${game.id}`}
            className="inline-flex items-center gap-2 text-sm font-bold text-white transition group-hover:text-court-red"
          >
            Conferir detalhes
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        ) : (
          <span className="text-sm font-bold text-zinc-500">Detalhes indisponíveis</span>
        )}
      </div>
    </article>
  );
}

