"use client";

import Link from "next/link";
import {
  ArrowLeft,
  BarChart3,
  Clock,
  Film,
  ListOrdered,
  Play,
  Shield,
  Sparkles,
  Trophy,
  Users
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { GameBoxScore } from "@/components/game/GameBoxScore";
import { GameEmptyState } from "@/components/game/GameEmptyState";
import { GameHeadToHead, GamePredictionPanel, GameRecentForm } from "@/components/game/GameExtrasPanels";
import { GameHeader } from "@/components/game/GameHeader";
import { GameHighlightsSection } from "@/components/game/GameHighlightsSection";
import { GameLeaders } from "@/components/game/GameLeaders";
import { GamePeriodScore } from "@/components/game/GamePeriodScore";
import { GamePlayByPlay } from "@/components/game/GamePlayByPlay";
import { GameSummary } from "@/components/game/GameSummary";
import { GameTeamStats } from "@/components/game/GameTeamStats";
import { PremiumAccordion } from "@/components/ui/PremiumAccordion";
import type { GameExtras } from "@/types/gameExtras";
import type { GameDetails } from "@/types/gameDetails";
import { useAutoRefresh } from "@/hooks/useAutoRefresh";
import { getGameDetails, getGameExtras } from "@/services/gamesService";
import { getAutoRefreshLabel, shouldAutoRefreshGame } from "@/utils/gameRefresh";

interface GameDetailsClientProps {
  gameId: string;
}

const navItems = [
  { href: "#resumo", label: "Resumo" },
  { href: "#videos", label: "Vídeos" },
  { href: "#estatisticas", label: "Estatísticas" },
  { href: "#jogadores", label: "Jogadores" },
  { href: "#lances", label: "Lances" }
];

function loadingPanel(message: string) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 text-sm font-semibold text-zinc-300">
      {message}
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

  const refreshAll = useCallback((silent = false) => {
    void refreshDetails(silent);
    void loadExtras(false);
  }, [loadExtras, refreshDetails]);

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

  const autoRefreshEnabled = details ? shouldAutoRefreshGame(details) : false;
  const autoRefreshLabel = details ? getAutoRefreshLabel([details]) : "";
  const refreshInterval = details?.status === "live" ? 15000 : 30000;

  useAutoRefresh(() => refreshAll(true), refreshInterval, autoRefreshEnabled);

  if (loading) {
    return loadingPanel("Carregando central da partida...");
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
        <div className="rounded-xl border border-court-red/30 bg-court-red/10 p-6">
          <p className="text-lg font-black text-white">Detalhes indisponíveis</p>
          <p className="mt-2 text-sm text-zinc-300">
            {error ?? "Não foi possível carregar detalhes reais do jogo."}
          </p>
        </div>
      </div>
    );
  }

  const highlights = extras?.highlights ?? [];
  const hasLinescore = Boolean(details.linescore?.length);
  const hasLeaders = Boolean(details.leaders?.length);
  const hasPlayerStats = Boolean(details.playerStats?.length);
  const hasTeamStats = Boolean(details.teamStats?.some((group) => group.stats.length));
  const hasPlays = Boolean(details.plays?.length);
  const prediction = extras?.prediction;
  const headToHead = extras?.headToHead;
  const hasRecentForm = Boolean(extras?.recentForm.home || extras?.recentForm.visitor);

  return (
    <div className="grid gap-8">
      <GameHeader
        details={details}
        refreshing={refreshing}
        autoRefreshEnabled={autoRefreshEnabled}
        autoRefreshLabel={autoRefreshLabel}
        lastUpdated={lastUpdated}
        onRefresh={() => refreshAll(false)}
      />

      <nav className="sticky top-20 z-20 -mx-1 flex gap-2 overflow-x-auto rounded-2xl border border-white/10 bg-[#0b0c10]/85 p-2 shadow-[0_18px_55px_rgba(0,0,0,0.28)] backdrop-blur">
        {navItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="whitespace-nowrap rounded-full border border-white/10 bg-white/[0.035] px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-zinc-300 transition hover:border-court-red/50 hover:bg-court-red/10 hover:text-white"
          >
            {item.label}
          </a>
        ))}
      </nav>

      <div className="grid gap-4">
        <PremiumAccordion
          id="resumo"
          title="Resumo da partida"
          subtitle="Status, arena, horário em Brasília e dados principais"
          icon={<Sparkles className="h-5 w-5" aria-hidden="true" />}
          defaultOpen
          badge={details.status === "live" ? "AO VIVO" : details.status === "final" ? "Final" : "Agendado"}
        >
          <GameSummary details={details} />
        </PremiumAccordion>

        <PremiumAccordion
          id="videos"
          title="Melhores momentos"
          subtitle="Vídeos oficiais quando a fonte permite embed ou reprodução segura"
          icon={<Film className="h-5 w-5" aria-hidden="true" />}
          defaultOpen={highlights.length > 0}
          badge={highlights.length ? `${highlights.length} vídeos` : undefined}
        >
          <GameHighlightsSection
            status={details.status}
            highlights={highlights}
            loading={extrasLoading}
            debugReason={extras?.debug?.reason}
          />
        </PremiumAccordion>

        <PremiumAccordion
          title="Placar por período"
          subtitle="Pontuação por quarto e total da partida"
          icon={<ListOrdered className="h-5 w-5" aria-hidden="true" />}
          defaultOpen={hasLinescore}
          badge={hasLinescore ? "Períodos" : undefined}
        >
          <GamePeriodScore details={details} />
        </PremiumAccordion>

        <PremiumAccordion
          id="estatisticas"
          title="Estatísticas dos times"
          subtitle="Comparativo lado a lado das principais métricas"
          icon={<BarChart3 className="h-5 w-5" aria-hidden="true" />}
          defaultOpen={hasTeamStats}
          badge={hasTeamStats ? "Comparativo" : undefined}
        >
          <GameTeamStats details={details} />
        </PremiumAccordion>

        <PremiumAccordion
          id="jogadores"
          title="Pontuação dos jogadores"
          subtitle="Box score completo separado por equipe"
          icon={<Users className="h-5 w-5" aria-hidden="true" />}
          defaultOpen={false}
          badge={hasPlayerStats ? `${details.playerStats?.length ?? 0} atletas` : undefined}
        >
          <GameBoxScore details={details} />
        </PremiumAccordion>

        <PremiumAccordion
          title="Líderes da partida"
          subtitle="Principais destaques individuais"
          icon={<Trophy className="h-5 w-5" aria-hidden="true" />}
          defaultOpen={hasLeaders && details.status === "final"}
          badge={hasLeaders ? "Destaques" : undefined}
        >
          <GameLeaders leaders={details.leaders} />
        </PremiumAccordion>

        <PremiumAccordion
          id="lances"
          title="Últimos lances"
          subtitle="Timeline da partida com lances traduzidos"
          icon={<Play className="h-5 w-5" aria-hidden="true" />}
          defaultOpen={details.status === "live"}
          badge={hasPlays ? `${details.plays?.length ?? 0} lances` : undefined}
        >
          <GamePlayByPlay plays={details.plays} />
        </PremiumAccordion>

        {prediction ? (
          <PremiumAccordion
            title="Previsão da partida"
            subtitle="Probabilidades complementares quando disponíveis"
            icon={<BarChart3 className="h-5 w-5" aria-hidden="true" />}
            defaultOpen={false}
          >
            <GamePredictionPanel prediction={prediction} details={details} />
          </PremiumAccordion>
        ) : null}

        {headToHead?.lastMeetings?.length ? (
          <PremiumAccordion
            title="Confronto direto"
            subtitle="Histórico recente entre as equipes"
            icon={<Shield className="h-5 w-5" aria-hidden="true" />}
            defaultOpen={false}
          >
            <GameHeadToHead headToHead={headToHead} />
          </PremiumAccordion>
        ) : null}

        {hasRecentForm ? (
          <PremiumAccordion
            title="Últimos 5 jogos"
            subtitle="Forma recente das duas equipes"
            icon={<Clock className="h-5 w-5" aria-hidden="true" />}
            defaultOpen={false}
          >
            <GameRecentForm home={extras?.recentForm.home} visitor={extras?.recentForm.visitor} />
          </PremiumAccordion>
        ) : null}

        {!prediction && !headToHead?.lastMeetings?.length && !hasRecentForm ? (
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
            <GameEmptyState>Dados complementares ainda não disponíveis para esta partida.</GameEmptyState>
          </div>
        ) : null}
      </div>
    </div>
  );
}
