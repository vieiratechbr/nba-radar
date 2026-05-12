import Image from "next/image";
import Link from "next/link";
import { BarChart3, DraftingCompass, RefreshCw, Shield, Table2 } from "lucide-react";
import { NextTeamGames } from "@/components/favorite-team/NextTeamGames";
import { TeamBestPlayer } from "@/components/favorite-team/TeamBestPlayer";
import { TeamRecentForm } from "@/components/favorite-team/TeamRecentForm";
import { TeamSeasonSummary } from "@/components/favorite-team/TeamSeasonSummary";
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
  const division = data.standing?.division ?? "Divisão ainda não informada";
  const conference = data.standing?.conference ?? "Conferência em atualização";

  return (
    <div className="grid gap-8">
      <section className="overflow-hidden rounded-2xl border border-[var(--team-primary)]/70 bg-[radial-gradient(circle_at_top_left,rgba(var(--team-primary-rgb),0.32),transparent_34rem),linear-gradient(135deg,rgba(var(--team-secondary-rgb),0.36),rgba(0,0,0,0.58)),#111217] p-5 shadow-[0_0_0_1px_rgba(var(--team-primary-rgb),0.18),0_28px_90px_rgba(var(--team-primary-rgb),0.16)] sm:p-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            {data.team.logoUrl ? (
              <Image
                src={data.team.logoUrl}
                alt={data.team.fullName}
                width={96}
                height={96}
                className="h-24 w-24 rounded-2xl border border-white/15 bg-white/95 p-3 object-contain shadow-2xl"
              />
            ) : (
              <div className="grid h-24 w-24 place-items-center rounded-2xl bg-[var(--team-primary)] text-xl font-black text-[var(--team-text-on-primary)] shadow-2xl">
                {data.team.abbreviation ?? "NBA"}
              </div>
            )}
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-[var(--team-secondary)]">
                Seu radar personalizado da NBA
              </p>
              <h1 className="mt-2 text-3xl font-black text-white sm:text-5xl">Olá, {displayName}</h1>
              <p className="mt-2 text-base font-semibold text-zinc-200">{data.team.fullName}</p>
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
      </section>

      {data.message ? (
        <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4 text-sm font-semibold text-zinc-300">
          {data.message}
        </div>
      ) : null}

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-2xl border border-[var(--team-primary)]/60 bg-[linear-gradient(135deg,rgba(var(--team-primary-rgb),0.18),rgba(0,0,0,0.48))] p-6 shadow-[0_0_70px_rgba(var(--team-primary-rgb),0.12)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--team-secondary)]">Time favorito</p>
              <h2 className="mt-2 text-3xl font-black text-white">{data.team.fullName}</h2>
            </div>
            <Shield className="h-9 w-9 text-[var(--team-primary)]" aria-hidden="true" />
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <InfoPill label="Conferência" value={conference} />
            <InfoPill label="Divisão" value={division} />
            <InfoPill label="Primária" value={theme.primary} color={theme.primary} />
            <InfoPill label="Secundária" value={theme.secondary} color={theme.secondary} />
          </div>

          <Link
            href="/onboarding/time-favorito"
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-[var(--team-primary)]/60 px-4 py-2 text-sm font-bold text-white transition hover:bg-[var(--team-primary)] hover:text-[var(--team-text-on-primary)]"
          >
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            Trocar time
          </Link>
        </div>

        <div className="grid gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:grid-cols-2">
          <h2 className="sm:col-span-2 text-xl font-black text-white">Ações rápidas</h2>
          {quickActions.map((action) => {
            const Icon = action.icon;

            return (
              <Link
                key={action.href}
                href={action.href}
                className="group flex items-center gap-3 rounded-lg border border-white/10 bg-black/20 p-4 text-sm font-black text-white transition hover:border-[var(--team-primary)]/70 hover:bg-[rgba(var(--team-primary-rgb),0.12)]"
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

      <div className="grid gap-6 xl:grid-cols-2">
        <NextTeamGames games={data.nextGames} />
        <TeamRecentForm games={data.recentGames} form={data.recentForm} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <TeamSeasonSummary standing={data.standing} />
        <TeamBestPlayer player={data.bestPlayer} />
      </div>

      {data.source.bestPlayer === "mock" ? (
        <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4 text-xs font-semibold text-zinc-400">
          Melhor jogador usando base local inicial. Estatísticas detalhadas exigem integração dedicada.
        </div>
      ) : null}
    </div>
  );
}

function InfoPill({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-black/25 p-4">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-zinc-500">{label}</p>
      <div className="mt-2 flex items-center gap-2">
        {color ? <span className="h-4 w-4 rounded-full border border-white/20" style={{ backgroundColor: color }} /> : null}
        <p className="font-black text-white">{value}</p>
      </div>
    </div>
  );
}
