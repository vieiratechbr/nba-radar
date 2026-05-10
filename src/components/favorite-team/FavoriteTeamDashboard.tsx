import Image from "next/image";
import Link from "next/link";
import { RefreshCw } from "lucide-react";
import { NextTeamGames } from "@/components/favorite-team/NextTeamGames";
import { TeamBestPlayer } from "@/components/favorite-team/TeamBestPlayer";
import { TeamRecentForm } from "@/components/favorite-team/TeamRecentForm";
import { TeamSeasonSummary } from "@/components/favorite-team/TeamSeasonSummary";
import type { FavoriteTeamDashboardData } from "@/types/favoriteTeam";

export function FavoriteTeamDashboard({ data }: { data: FavoriteTeamDashboardData }) {
  const displayName = data.profile.name ?? data.profile.email ?? "torcedor";

  return (
    <div className="grid gap-8">
      <section className="overflow-hidden rounded-lg border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(215,25,32,0.24),transparent_34rem),#111217] p-5 shadow-glow sm:p-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            {data.team.logoUrl ? (
              <Image
                src={data.team.logoUrl}
                alt={data.team.fullName}
                width={84}
                height={84}
                className="h-20 w-20 rounded-lg border border-white/15 bg-white/95 p-2 object-contain"
              />
            ) : (
              <div className="grid h-20 w-20 place-items-center rounded-lg bg-court-red text-xl font-black text-white">
                {data.team.abbreviation ?? "NBA"}
              </div>
            )}
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-court-red">
                Seu radar personalizado da NBA
              </p>
              <h1 className="mt-2 text-3xl font-black text-white sm:text-4xl">
                Olá, {displayName}
              </h1>
              <p className="mt-2 text-sm font-semibold text-zinc-300">
                Seu time: {data.team.fullName}
              </p>
            </div>
          </div>

          <Link
            href="/onboarding/time-favorito"
            className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm font-bold text-white transition hover:border-court-red hover:text-court-red"
          >
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            Trocar time favorito
          </Link>
        </div>
      </section>

      {data.message ? (
        <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4 text-sm font-semibold text-zinc-300">
          {data.message}
        </div>
      ) : null}

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
