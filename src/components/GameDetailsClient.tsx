"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  BarChart3,
  Clock,
  ExternalLink,
  ListOrdered,
  MapPin,
  Play,
  RefreshCw,
  Trophy,
  Users
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { GameExtras, LastFiveGame, TeamRecentForm } from "@/types/gameExtras";
import type { GameDetails, PlayerBoxScore } from "@/types/gameDetails";
import type { GameHighlight } from "@/types/highlight";
import { StatusBadge } from "@/components/StatusBadge";
import { useAutoRefresh } from "@/hooks/useAutoRefresh";
import { getGameDetails, getGameExtras } from "@/services/gamesService";
import { formatDate } from "@/utils/formatDate";
import {
  formatGameDateTimeBrasilia,
  formatLastUpdated,
  isUnavailableGameTime
} from "@/utils/formatGameTime";

interface GameDetailsClientProps {
  gameId: string;
}

const statusText = {
  live: "Jogo ao vivo",
  final: "Jogo finalizado",
  scheduled: "Jogo futuro"
} as const;

function EmptyState({ children }: { children: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.03] p-5 text-sm font-semibold text-zinc-400">
      {children}
    </div>
  );
}

function TeamPanel({ team, align = "left" }: { team: GameDetails["homeTeam"]; align?: "left" | "right" }) {
  return (
    <div className={align === "right" ? "text-right" : "text-left"}>
      <div className={`flex items-center gap-3 ${align === "right" ? "justify-end" : ""}`}>
        {team.logoUrl ? (
          <Image
            src={team.logoUrl}
            alt={team.fullName}
            width={52}
            height={52}
            className="h-12 w-12 rounded-md border border-white/15 bg-white/95 p-1 object-contain"
          />
        ) : (
          <div className="grid h-12 w-12 place-items-center rounded-md bg-court-red text-sm font-black text-white">
            {team.abbreviation}
          </div>
        )}
        <div className="min-w-0">
          <p className="truncate text-lg font-black text-white">{team.fullName}</p>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-500">
            {team.abbreviation}
            {team.record ? ` · ${team.record}` : ""}
          </p>
        </div>
      </div>
    </div>
  );
}

function playerValue(player: PlayerBoxScore, key: keyof PlayerBoxScore) {
  const value = player[key];
  return value === undefined || value === "" ? "-" : value;
}

function probabilityValue(value?: number) {
  return typeof value === "number" ? `${value.toFixed(1).replace(".", ",")}%` : "-";
}

function highlightsEmptyMessage(status: GameDetails["status"]) {
  if (status === "live") return "Melhores momentos serão exibidos após o fim da partida.";
  if (status === "scheduled") return "Melhores momentos ficarão disponíveis após o jogo.";
  return "Melhores momentos ainda não disponíveis.";
}

function HighlightCard({ highlight }: { highlight: GameHighlight }) {
  return (
    <a
      href={highlight.embedUrl ?? highlight.videoUrl}
      target="_blank"
      rel="noreferrer"
      className="group overflow-hidden rounded-md border border-white/10 bg-black/20 transition hover:border-court-red/60 hover:bg-black/35"
    >
      <div className="relative aspect-video bg-court-black">
        {highlight.thumbnailUrl ? (
          <Image
            src={highlight.thumbnailUrl}
            alt=""
            fill
            sizes="(min-width: 1024px) 33vw, 100vw"
            className="object-cover opacity-90 transition group-hover:opacity-100"
          />
        ) : (
          <div className="grid h-full place-items-center bg-[radial-gradient(circle_at_top,rgba(215,25,32,0.28),transparent_45%),#101116]">
            <Play className="h-9 w-9 text-court-red" aria-hidden="true" />
          </div>
        )}
        <span className="absolute bottom-3 left-3 inline-flex items-center gap-2 rounded-full bg-black/75 px-3 py-1 text-xs font-black text-white">
          <Play className="h-3.5 w-3.5 text-court-red" aria-hidden="true" />
          Assistir
        </span>
      </div>
      <div className="p-4">
        <p className="text-sm font-black text-white">{highlight.title}</p>
        {highlight.description ? (
          <p className="mt-2 line-clamp-2 text-xs leading-5 text-zinc-400">{highlight.description}</p>
        ) : null}
        <span className="mt-3 inline-flex items-center gap-2 text-xs font-bold text-court-red">
          Abrir vídeo
          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
        </span>
      </div>
    </a>
  );
}

function RecentForm({ form }: { form: TeamRecentForm }) {
  return (
    <div className="rounded-md border border-white/10 bg-black/20 p-4">
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
              {game.result ?? "-"} {game.score ? `· ${game.score}` : ""}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function GameDetailsClient({ gameId }: GameDetailsClientProps) {
  const [details, setDetails] = useState<GameDetails | null>(null);
  const [extras, setExtras] = useState<GameExtras | null>(null);
  const [loading, setLoading] = useState(true);
  const [extrasLoading, setExtrasLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchDetails = useCallback(() => getGameDetails(gameId), [gameId]);

  const loadExtras = useCallback(async (showLoading = true) => {
    if (showLoading) setExtrasLoading(true);

    try {
      const data = await getGameExtras(gameId);
      setExtras(data);
    } finally {
      if (showLoading) setExtrasLoading(false);
    }
  }, [gameId]);

  const refreshDetails = useCallback(async (silent = false) => {
    if (!silent) setRefreshing(true);
    setError(null);

    try {
      const data = await fetchDetails();
      setDetails(data);
      setLastUpdated(new Date());
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Não foi possível carregar detalhes reais do jogo."
      );
    } finally {
      if (!silent) setRefreshing(false);
    }
  }, [fetchDetails]);

  useEffect(() => {
    let cancelled = false;

    async function loadInitialExtras() {
      setExtrasLoading(true);
      const data = await getGameExtras(gameId);

      if (!cancelled) {
        setExtras(data);
        setExtrasLoading(false);
      }
    }

    void loadInitialExtras();

    return () => {
      cancelled = true;
    };
  }, [gameId]);

  useEffect(() => {
    let cancelled = false;

    async function loadInitialDetails() {
      try {
        const data = await fetchDetails();
        if (cancelled) return;
        setDetails(data);
        setLastUpdated(new Date());
      } catch (requestError) {
        if (cancelled) return;
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Não foi possível carregar detalhes reais do jogo."
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadInitialDetails();

    return () => {
      cancelled = true;
    };
  }, [fetchDetails]);

  const liveAutoRefreshEnabled = details?.status === "live";
  const refreshLiveData = useCallback(() => {
    void refreshDetails(true);
    void loadExtras(false);
  }, [loadExtras, refreshDetails]);

  useAutoRefresh(refreshLiveData, 15000, liveAutoRefreshEnabled);

  const total = useMemo(() => {
    if (!details) return null;
    return {
      home: details.homeTeam.score,
      visitor: details.visitorTeam.score
    };
  }, [details]);

  if (loading) {
    return (
      <div className="rounded-lg border border-white/10 bg-white/[0.03] p-6 text-sm font-semibold text-zinc-300">
        Carregando central da partida...
      </div>
    );
  }

  if (error || !details) {
    return (
      <div className="grid gap-5">
        <Link
          href="/placares"
          className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm font-bold text-white transition hover:border-court-red hover:text-court-red"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Voltar para placares
        </Link>
        <div className="rounded-lg border border-court-red/30 bg-court-red/10 p-6">
          <p className="text-lg font-black text-white">Detalhes indisponíveis</p>
          <p className="mt-2 text-sm text-zinc-300">
            {error ?? "Não foi possível carregar detalhes reais do jogo."}
          </p>
        </div>
      </div>
    );
  }

  const recentPlays = details.plays?.slice(0, 24) ?? [];
  const hasLinescore = Boolean(details.linescore?.length);
  const hasLeaders = Boolean(details.leaders?.length);
  const hasTeamStats = Boolean(details.teamStats?.some((group) => group.stats.length));
  const hasPlayerStats = Boolean(details.playerStats?.length);
  const highlights = extras?.highlights ?? [];
  const prediction = extras?.prediction;
  const headToHead = extras?.headToHead;
  const hasRecentForm = Boolean(extras?.recentForm.home || extras?.recentForm.visitor);
  const scheduledDateTime = formatGameDateTimeBrasilia(details.date);
  const scheduledStartLabel = isUnavailableGameTime(scheduledDateTime)
    ? scheduledDateTime
    : `Início: ${scheduledDateTime} BRT`;

  return (
    <div className="grid gap-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/placares"
          className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm font-bold text-white transition hover:border-court-red hover:text-court-red"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Voltar para placares
        </Link>
        <button
          type="button"
          onClick={() => void refreshDetails(false)}
          disabled={refreshing}
          className="inline-flex w-fit items-center gap-2 rounded-full bg-court-red px-4 py-2 text-sm font-black text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} aria-hidden="true" />
          Atualizar dados
        </button>
      </div>

      {liveAutoRefreshEnabled ? (
        <div className="rounded-lg border border-emerald-400/20 bg-emerald-400/10 p-3 text-xs font-bold text-emerald-200">
          Atualização automática ativa
          {lastUpdated ? ` · Última atualização: ${formatLastUpdated(lastUpdated)}` : ""}
        </div>
      ) : null}

      <section className="overflow-hidden rounded-lg border border-white/10 bg-court-slate/90 shadow-lg">
        <div className="border-b border-white/10 bg-[radial-gradient(circle_at_top,rgba(215,25,32,0.20),transparent_38rem)] p-5 sm:p-7">
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <StatusBadge status={details.status} />
            {details.status === "live" ? (
              <span className="inline-flex items-center rounded-full bg-court-red px-3 py-1 text-xs font-black uppercase tracking-[0.14em] text-white">
                AO VIVO
              </span>
            ) : null}
            <span className="text-sm font-semibold text-zinc-400">
              {details.status === "scheduled" ? scheduledStartLabel : statusText[details.status]}
            </span>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
            <TeamPanel team={details.visitorTeam} />
            <div className="rounded-lg border border-white/10 bg-black/30 px-6 py-5 text-center">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-zinc-500">Placar</p>
              <div className="mt-2 flex items-center justify-center gap-5">
                <span className="text-5xl font-black text-white">{total?.visitor ?? "-"}</span>
                <span className="text-lg font-black text-court-red">x</span>
                <span className="text-5xl font-black text-white">{total?.home ?? "-"}</span>
              </div>
              <p className="mt-3 text-sm font-semibold text-zinc-400">
                {details.status === "scheduled"
                  ? scheduledStartLabel
                  : details.period ? `${details.period}º quarto` : details.clock ? "Em andamento" : statusText[details.status]}
                {details.clock ? ` · ${details.clock}` : ""}
              </p>
            </div>
            <TeamPanel team={details.homeTeam} align="right" />
          </div>

          <div className="mt-6 grid gap-3 text-sm text-zinc-400 sm:grid-cols-3">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-court-red" aria-hidden="true" />
              <span>{[details.venue, details.city].filter(Boolean).join(", ") || "Arena não informada"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-court-red" aria-hidden="true" />
              <span>{details.status === "scheduled" ? scheduledStartLabel : formatDate(details.date)}</span>
            </div>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-court-red" aria-hidden="true" />
              <span>{details.shortName ?? details.name}</span>
            </div>
          </div>
        </div>
      </section>

      {hasLinescore ? (
        <section className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
          <div className="mb-4 flex items-center gap-2">
            <ListOrdered className="h-5 w-5 text-court-red" aria-hidden="true" />
            <h2 className="text-xl font-black text-white">Placar por período</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-sm">
              <thead className="text-xs uppercase tracking-[0.16em] text-zinc-500">
                <tr>
                  <th className="py-3 text-left">Time</th>
                  {details.linescore?.map((line) => (
                    <th key={line.period} className="px-3 py-3 text-center">{line.period}</th>
                  ))}
                  <th className="px-3 py-3 text-center">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-zinc-200">
                <tr>
                  <td className="py-3 font-bold">{details.visitorTeam.abbreviation}</td>
                  {details.linescore?.map((line) => (
                    <td key={line.period} className="px-3 py-3 text-center">{line.visitorScore}</td>
                  ))}
                  <td className="px-3 py-3 text-center font-black text-white">{details.visitorTeam.score}</td>
                </tr>
                <tr>
                  <td className="py-3 font-bold">{details.homeTeam.abbreviation}</td>
                  {details.linescore?.map((line) => (
                    <td key={line.period} className="px-3 py-3 text-center">{line.homeScore}</td>
                  ))}
                  <td className="px-3 py-3 text-center font-black text-white">{details.homeTeam.score}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
          <div className="mb-4 flex items-center gap-2">
            <Trophy className="h-5 w-5 text-court-red" aria-hidden="true" />
            <h2 className="text-xl font-black text-white">Líderes do jogo</h2>
          </div>
          {hasLeaders ? (
            <div className="grid gap-3">
              {details.leaders?.slice(0, 6).map((leader) => (
                <article key={`${leader.team}-${leader.category}-${leader.athleteName}`} className="rounded-md border border-white/10 bg-black/20 p-4">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-court-red">
                    {leader.category} · {leader.team}
                  </p>
                  <div className="mt-2 flex items-center justify-between gap-3">
                    <div>
                      <p className="font-black text-white">{leader.athleteName}</p>
                      {leader.athleteShortName ? (
                        <p className="text-xs text-zinc-500">{leader.athleteShortName}</p>
                      ) : null}
                    </div>
                    <p className="text-2xl font-black text-white">{leader.value}</p>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState>Líderes ainda não disponíveis.</EmptyState>
          )}
        </div>

        <div className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
          <div className="mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-court-red" aria-hidden="true" />
            <h2 className="text-xl font-black text-white">Estatísticas dos times</h2>
          </div>
          {hasTeamStats ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {details.teamStats?.map((group) => (
                <div key={group.team} className="rounded-md border border-white/10 bg-black/20 p-4">
                  <p className="mb-3 text-sm font-black uppercase tracking-[0.16em] text-white">{group.team}</p>
                  <div className="grid gap-2">
                    {group.stats.slice(0, 10).map((stat) => (
                      <div key={`${group.team}-${stat.label}`} className="flex items-center justify-between gap-3 text-sm">
                        <span className="text-zinc-400">{stat.label}</span>
                        <span className="font-black text-white">{stat.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState>Estatísticas dos times ainda não disponíveis.</EmptyState>
          )}
        </div>
      </section>

      <section className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
        <div className="mb-4 flex items-center gap-2">
          <Play className="h-5 w-5 text-court-red" aria-hidden="true" />
          <h2 className="text-xl font-black text-white">Melhores momentos</h2>
        </div>
        {extrasLoading ? (
          <EmptyState>Buscando dados complementares da Highlightly...</EmptyState>
        ) : highlights.length ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {highlights.slice(0, 6).map((highlight) => (
              <HighlightCard key={highlight.id} highlight={highlight} />
            ))}
          </div>
        ) : (
          <div className="grid gap-2">
            <EmptyState>{highlightsEmptyMessage(details.status)}</EmptyState>
            {process.env.NODE_ENV !== "production" && details.status === "final" && extras?.debug?.reason ? (
              <p className="text-xs font-semibold text-zinc-500">
                Highlightly conectada, mas nenhum vídeo encontrado para esta partida. Debug: {extras.debug.reason}
              </p>
            ) : null}
          </div>
        )}
      </section>

      {prediction || headToHead?.lastMeetings?.length || hasRecentForm ? (
        <section className="grid gap-6 lg:grid-cols-3">
          {prediction ? (
            <div className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
              <div className="mb-4 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-court-red" aria-hidden="true" />
                <h2 className="text-xl font-black text-white">Previsão</h2>
              </div>
              <div className="grid gap-3 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-zinc-400">{details.homeTeam.abbreviation}</span>
                  <span className="font-black text-white">{probabilityValue(prediction.homeWinProbability)}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-zinc-400">{details.visitorTeam.abbreviation}</span>
                  <span className="font-black text-white">{probabilityValue(prediction.visitorWinProbability)}</span>
                </div>
                {prediction.drawProbability ? (
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-zinc-400">Empate</span>
                    <span className="font-black text-white">{probabilityValue(prediction.drawProbability)}</span>
                  </div>
                ) : null}
              </div>
              {prediction.summary ? (
                <p className="mt-4 text-sm leading-6 text-zinc-400">{prediction.summary}</p>
              ) : null}
            </div>
          ) : null}

          {headToHead?.lastMeetings?.length ? (
            <div className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
              <div className="mb-4 flex items-center gap-2">
                <Trophy className="h-5 w-5 text-court-red" aria-hidden="true" />
                <h2 className="text-xl font-black text-white">Confronto direto</h2>
              </div>
              <div className="grid gap-2">
                {headToHead.lastMeetings.slice(0, 5).map((meeting) => (
                  <div key={meeting.id} className="rounded-md border border-white/10 bg-black/20 p-3 text-xs text-zinc-400">
                    <p className="font-bold text-white">
                      {meeting.visitorTeam} {meeting.visitorScore ?? "-"} x {meeting.homeScore ?? "-"} {meeting.homeTeam}
                    </p>
                    <p className="mt-1">{meeting.date ? formatDate(meeting.date) : "Data indisponível"}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {hasRecentForm ? (
            <div className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
              <div className="mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5 text-court-red" aria-hidden="true" />
                <h2 className="text-xl font-black text-white">Últimos 5 jogos</h2>
              </div>
              <div className="grid gap-3">
                {extras?.recentForm.visitor ? <RecentForm form={extras.recentForm.visitor} /> : null}
                {extras?.recentForm.home ? <RecentForm form={extras.recentForm.home} /> : null}
              </div>
            </div>
          ) : null}
        </section>
      ) : null}

      <section className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
        <div className="mb-4 flex items-center gap-2">
          <Users className="h-5 w-5 text-court-red" aria-hidden="true" />
          <h2 className="text-xl font-black text-white">Box score dos jogadores</h2>
        </div>
        {hasPlayerStats ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-sm">
              <thead className="text-xs uppercase tracking-[0.16em] text-zinc-500">
                <tr>
                  {["Jogador", "Time", "MIN", "PTS", "REB", "AST", "STL", "BLK", "TO", "FG", "3PT", "FT"].map((heading) => (
                    <th key={heading} className="px-3 py-3 text-left">{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-zinc-300">
                {details.playerStats?.map((player) => (
                  <tr key={`${player.team}-${player.athleteId ?? player.athleteName}`}>
                    <td className="px-3 py-3 font-bold text-white">{player.athleteName}</td>
                    <td className="px-3 py-3">{player.team}</td>
                    <td className="px-3 py-3">{playerValue(player, "minutes")}</td>
                    <td className="px-3 py-3">{playerValue(player, "points")}</td>
                    <td className="px-3 py-3">{playerValue(player, "rebounds")}</td>
                    <td className="px-3 py-3">{playerValue(player, "assists")}</td>
                    <td className="px-3 py-3">{playerValue(player, "steals")}</td>
                    <td className="px-3 py-3">{playerValue(player, "blocks")}</td>
                    <td className="px-3 py-3">{playerValue(player, "turnovers")}</td>
                    <td className="px-3 py-3">{playerValue(player, "fieldGoals")}</td>
                    <td className="px-3 py-3">{playerValue(player, "threePointers")}</td>
                    <td className="px-3 py-3">{playerValue(player, "freeThrows")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState>Box score ainda não disponível.</EmptyState>
        )}
      </section>

      <section className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
        <div className="mb-4 flex items-center gap-2">
          <Clock className="h-5 w-5 text-court-red" aria-hidden="true" />
          <h2 className="text-xl font-black text-white">Últimos lances</h2>
        </div>
        {recentPlays.length ? (
          <div className="grid gap-3">
            {recentPlays.map((play) => (
              <article key={play.id} className="relative rounded-md border border-white/10 bg-black/20 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-zinc-500">
                  {play.period ? `${play.period}º quarto` : "Partida"} {play.clock ? `· ${play.clock}` : ""}
                  {play.team ? ` · ${play.team}` : ""}
                </p>
                <p className="mt-2 text-sm font-semibold leading-6 text-white">{play.text}</p>
                {play.score ? <p className="mt-2 text-sm font-black text-court-red">{play.score}</p> : null}
              </article>
            ))}
          </div>
        ) : (
          <EmptyState>Lances detalhados ainda não disponíveis para esta partida.</EmptyState>
        )}
      </section>
    </div>
  );
}
