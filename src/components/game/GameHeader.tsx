import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, BarChart3, Clock, MapPin, RefreshCw } from "lucide-react";
import type { GameDetails } from "@/types/gameDetails";
import { StatusBadge } from "@/components/StatusBadge";
import { formatDate } from "@/utils/formatDate";
import {
  formatGameDateTimeBrasilia,
  formatLastUpdated,
  isUnavailableGameTime
} from "@/utils/formatGameTime";

type GameHeaderProps = {
  details: GameDetails;
  refreshing: boolean;
  autoRefreshEnabled: boolean;
  autoRefreshLabel: string;
  lastUpdated: Date | null;
  onRefresh: () => void;
};

const statusText = {
  live: "Jogo ao vivo",
  final: "Jogo finalizado",
  scheduled: "Jogo futuro"
} as const;

function scheduledStartLabel(date: string) {
  const scheduledDateTime = formatGameDateTimeBrasilia(date);
  return isUnavailableGameTime(scheduledDateTime)
    ? scheduledDateTime
    : `Início: ${scheduledDateTime} BRT`;
}

function TeamPanel({ team, align = "left" }: { team: GameDetails["homeTeam"]; align?: "left" | "right" }) {
  return (
    <div className={align === "right" ? "text-right" : "text-left"}>
      <div className={`flex items-center gap-3 ${align === "right" ? "justify-end" : ""}`}>
        {team.logoUrl ? (
          <Image
            src={team.logoUrl}
            alt={team.fullName}
            width={60}
            height={60}
            className="h-14 w-14 rounded-xl border border-white/15 bg-white/95 p-1.5 object-contain shadow-[0_12px_35px_rgba(0,0,0,0.35)]"
          />
        ) : (
          <div className="grid h-14 w-14 place-items-center rounded-xl border border-court-red/35 bg-court-red/20 text-sm font-black text-white">
            {team.abbreviation}
          </div>
        )}
        <div className="min-w-0">
          <p className="truncate text-lg font-black text-white sm:text-xl">{team.fullName}</p>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-500">
            {team.abbreviation}
            {team.record ? ` · ${team.record}` : ""}
          </p>
        </div>
      </div>
    </div>
  );
}

export function GameHeader({
  details,
  refreshing,
  autoRefreshEnabled,
  autoRefreshLabel,
  lastUpdated,
  onRefresh
}: GameHeaderProps) {
  const total = {
    home: details.homeTeam.score,
    visitor: details.visitorTeam.score
  };
  const startLabel = scheduledStartLabel(details.date);
  const headerStatus = details.status === "scheduled" ? startLabel : statusText[details.status];

  return (
    <div className="grid gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/placares"
          className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-4 py-2 text-sm font-bold text-white transition hover:border-court-red hover:bg-court-red/10 hover:text-court-red"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Voltar para placares
        </Link>
        <button
          type="button"
          onClick={onRefresh}
          disabled={refreshing}
          className="inline-flex w-fit items-center gap-2 rounded-full bg-court-red px-4 py-2 text-sm font-black text-white shadow-[0_14px_35px_rgba(215,25,32,0.22)] transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} aria-hidden="true" />
          Atualizar dados
        </button>
      </div>

      {autoRefreshEnabled ? (
        <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-3 text-xs font-bold text-emerald-200">
          {autoRefreshLabel || "Atualização automática ativa"}
          {lastUpdated ? ` · Última atualização: ${formatLastUpdated(lastUpdated)}` : ""}
        </div>
      ) : null}

      <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#101116]/95 shadow-[0_28px_90px_rgba(0,0,0,0.38)]">
        <div className="border-b border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(215,25,32,0.28),transparent_34rem),linear-gradient(135deg,rgba(255,255,255,0.07),rgba(255,255,255,0.018))] p-5 sm:p-7">
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <StatusBadge status={details.status} />
            {details.status === "live" ? (
              <span className="inline-flex items-center rounded-full bg-court-red px-3 py-1 text-xs font-black uppercase tracking-[0.14em] text-white shadow-[0_0_25px_rgba(215,25,32,0.35)]">
                AO VIVO
              </span>
            ) : null}
            <span className="text-sm font-semibold text-zinc-400">{headerStatus}</span>
          </div>

          <div className="grid gap-7 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
            <TeamPanel team={details.visitorTeam} />
            <div className="rounded-2xl border border-white/10 bg-black/35 px-7 py-6 text-center shadow-inner">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-zinc-500">Placar</p>
              <div className="mt-2 flex items-center justify-center gap-5">
                <span className="text-5xl font-black text-white sm:text-6xl">{total.visitor ?? "-"}</span>
                <span className="text-lg font-black text-court-red">x</span>
                <span className="text-5xl font-black text-white sm:text-6xl">{total.home ?? "-"}</span>
              </div>
              <p className="mt-4 text-sm font-semibold text-zinc-400">
                {details.status === "scheduled"
                  ? startLabel
                  : details.period ? `${details.period}º quarto` : details.clock ? "Em andamento" : statusText[details.status]}
                {details.clock ? ` · ${details.clock}` : ""}
              </p>
            </div>
            <TeamPanel team={details.homeTeam} align="right" />
          </div>

          <div className="mt-7 grid gap-3 text-sm text-zinc-400 sm:grid-cols-3">
            <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-black/20 px-3 py-2">
              <MapPin className="h-4 w-4 text-court-red" aria-hidden="true" />
              <span>{[details.venue, details.city].filter(Boolean).join(", ") || "Arena não informada"}</span>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-black/20 px-3 py-2">
              <Clock className="h-4 w-4 text-court-red" aria-hidden="true" />
              <span>{details.status === "scheduled" ? startLabel : formatDate(details.date)}</span>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-black/20 px-3 py-2">
              <BarChart3 className="h-4 w-4 text-court-red" aria-hidden="true" />
              <span>{details.shortName ?? details.name}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export function getScheduledStartLabel(date: string) {
  return scheduledStartLabel(date);
}
