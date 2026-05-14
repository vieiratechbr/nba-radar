"use client";

import Image from "next/image";
import Link from "next/link";
import { BarChart3, DraftingCompass, RefreshCw, Sparkles, Table2 } from "lucide-react";
import { NextTeamGames } from "@/components/favorite-team/NextTeamGames";
import { TeamRecentForm } from "@/components/favorite-team/TeamRecentForm";
import { FavoriteTeamOverview } from "@/components/profile/FavoriteTeamOverview";
import { ProfileTabs } from "@/components/profile/ProfileTabs";
import { TeamHistoryPanel } from "@/components/profile/TeamHistoryPanel";
import { TeamLegends } from "@/components/profile/TeamLegends";
import { TeamRoster } from "@/components/profile/TeamRoster";
import { TeamSeasonPanel } from "@/components/profile/TeamSeasonPanel";
import { TeamStarPlayer } from "@/components/profile/TeamStarPlayer";
import { TeamStatsPanel } from "@/components/profile/TeamStatsPanel";
import { getTeamTheme } from "@/theme/nbaTeamThemes";
import type { FavoriteTeamDashboardData } from "@/types/favoriteTeam";

const quickActions = [
  { href: "/placares", label: "Ver placares", icon: BarChart3 },
  { href: "/classificacao", label: "Ver classificação", icon: Table2 },
  { href: "/draft", label: "Ver draft", icon: DraftingCompass },
  { href: "/onboarding/time-favorito", label: "Trocar time favorito", icon: RefreshCw }
];

export function FavoriteTeamDashboard({ data }: { data: FavoriteTeamDashboardData }) {
  const displayName = data.profile.name ?? data.profile.email ?? "torcedor";
  const theme = getTeamTheme(data.team.abbreviation);
  const hasLocalFallback = Object.values(data.sources).some((source) => source === "local" || source === "mock");

  const quickActionContent = (
    <section className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
      <div className="mb-5 flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-[var(--team-primary)]" aria-hidden="true" />
        <h2 className="text-2xl font-black text-white">Ações rápidas</h2>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {quickActions.map((action) => {
          const Icon = action.icon;

          return (
            <Link
              key={action.href}
              href={action.href}
              className="group flex items-center gap-3 rounded-xl border border-white/10 bg-black/25 p-4 text-sm font-black text-white transition hover:border-[var(--team-primary)]/70 hover:bg-[rgba(var(--team-primary-rgb),0.12)]"
            >
              <span className="grid h-10 w-10 place-items-center rounded-md bg-[rgba(var(--team-primary-rgb),0.16)] text-[var(--team-primary)] transition group-hover:bg-[var(--team-primary)] group-hover:text-[var(--team-text-on-primary)]">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              {action.label}
            </Link>
          );
        })}
      </div>
    </section>
  );

  return (
    <div className="grid gap-8">
      <section className="overflow-hidden rounded-[1.5rem] border border-[var(--team-primary)]/70 bg-[radial-gradient(circle_at_12%_15%,rgba(var(--team-primary-rgb),0.34),transparent_32rem),linear-gradient(135deg,rgba(var(--team-secondary-rgb),0.46),rgba(0,0,0,0.66)),#111217] p-5 shadow-[0_0_0_1px_rgba(var(--team-primary-rgb),0.18),0_34px_110px_rgba(var(--team-primary-rgb),0.18)] sm:p-7">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            {data.team.logoUrl ? (
              <Image
                src={data.team.logoUrl}
                alt={data.team.fullName}
                width={128}
                height={128}
                className="h-28 w-28 rounded-3xl border border-white/15 bg-white/95 p-4 object-contain shadow-2xl sm:h-32 sm:w-32"
                priority
              />
            ) : (
              <div className="grid h-28 w-28 place-items-center rounded-3xl bg-[var(--team-primary)] text-2xl font-black text-[var(--team-text-on-primary)] shadow-2xl sm:h-32 sm:w-32">
                {data.team.abbreviation ?? "NBA"}
              </div>
            )}
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--team-primary)]">
                Central do seu time
              </p>
              <h1 className="mt-2 text-3xl font-black text-white sm:text-5xl">
                Olá, {displayName}
              </h1>
              <p className="mt-3 text-lg font-black text-white">{data.team.fullName}</p>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-zinc-300">
                Este é o seu painel personalizado para acompanhar o {data.team.fullName}, com agenda,
                resultados, temporada, elenco e contexto da franquia.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Badge label={data.team.conference ?? "Conferência -"} />
                <Badge label={data.team.division ?? "Divisão -"} />
                <Badge label={data.team.record ? `Campanha ${data.team.record}` : "Campanha em atualização"} />
              </div>
            </div>
          </div>

          <Link
            href="/onboarding/time-favorito"
            className="inline-flex w-fit items-center gap-2 rounded-full bg-[var(--team-primary)] px-5 py-3 text-sm font-black text-[var(--team-text-on-primary)] shadow-[0_0_34px_rgba(var(--team-primary-rgb),0.28)] transition hover:brightness-110"
          >
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            Trocar time
          </Link>
        </div>

        <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <HeroMetric label="Cidade" value={data.team.city ?? "-"} />
          <HeroMetric label="Arena" value={data.team.arena ?? "-"} />
          <HeroMetric label="Primária" value={theme.primary} color={theme.primary} />
          <HeroMetric label="Secundária" value={theme.secondary} color={theme.secondary} />
        </div>
      </section>

      {data.message ? (
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm font-semibold text-zinc-300">
          {data.message}
        </div>
      ) : null}

      {hasLocalFallback ? (
        <div className="rounded-xl border border-white/10 bg-black/20 p-4 text-xs font-semibold text-zinc-500">
          Algumas seções usam base local como contexto ou fallback quando a fonte online não oferece o dado.
        </div>
      ) : null}

      <ProfileTabs
        tabs={[
          {
            id: "overview",
            label: "Visão geral",
            content: (
              <div className="grid gap-6">
                <FavoriteTeamOverview data={data} />
                <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                  <NextTeamGames games={data.nextGames} />
                  <TeamSeasonPanel standing={data.standing} />
                </div>
                <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
                  <TeamRecentForm games={data.recentGames} form={data.recentForm} />
                  <TeamStarPlayer player={data.bestPlayer} />
                </div>
              </div>
            )
          },
          {
            id: "games",
            label: "Jogos",
            content: (
              <div className="grid gap-6 xl:grid-cols-2">
                <NextTeamGames games={data.nextGames} />
                <TeamRecentForm games={data.recentGames} form={data.recentForm} />
              </div>
            )
          },
          {
            id: "roster",
            label: "Elenco",
            content: (
              <div className="grid gap-6">
                <TeamStarPlayer player={data.bestPlayer} />
                <TeamRoster players={data.roster} />
                <TeamStatsPanel stats={data.teamStats} />
              </div>
            )
          },
          {
            id: "history",
            label: "História",
            content: (
              <div className="grid gap-6">
                <TeamLegends legends={data.legends} />
                <TeamHistoryPanel history={data.history} />
                {quickActionContent}
              </div>
            )
          }
        ]}
      />
    </div>
  );
}

function Badge({ label }: { label: string }) {
  return (
    <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs font-black text-white">
      {label}
    </span>
  );
}

function HeroMetric({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/25 p-4">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-zinc-500">{label}</p>
      <div className="mt-2 flex items-center gap-2">
        {color ? <span className="h-4 w-4 rounded-full border border-white/20" style={{ backgroundColor: color }} /> : null}
        <p className="truncate font-black text-white">{value}</p>
      </div>
    </div>
  );
}
