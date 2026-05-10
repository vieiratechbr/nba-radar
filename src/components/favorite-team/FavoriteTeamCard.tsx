import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { FavoriteTeamDashboardData } from "@/types/favoriteTeam";
import { formatGameDateTimeBrasilia } from "@/utils/formatGameTime";

export function FavoriteTeamCard({ data }: { data: FavoriteTeamDashboardData }) {
  const nextGame = data.nextGames[0];
  const lastGame = data.recentGames[0];

  return (
    <section className="rounded-lg border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(215,25,32,0.24),transparent_30rem),#111217] p-5 shadow-glow">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          {data.team.logoUrl ? (
            <Image
              src={data.team.logoUrl}
              alt={data.team.fullName}
              width={72}
              height={72}
              className="h-16 w-16 rounded-lg border border-white/15 bg-white/95 p-2 object-contain"
            />
          ) : (
            <div className="grid h-16 w-16 place-items-center rounded-lg bg-court-red text-lg font-black text-white">
              {data.team.abbreviation ?? "NBA"}
            </div>
          )}
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-court-red">Seu Radar</p>
            <h2 className="mt-2 text-2xl font-black text-white">{data.team.fullName}</h2>
            <p className="mt-1 text-sm text-zinc-400">
              {data.standing
                ? `#${data.standing.rank} · ${data.standing.wins}-${data.standing.losses}`
                : "Temporada em acompanhamento"}
            </p>
          </div>
        </div>

        <div className="grid gap-3 text-sm lg:min-w-80">
          <div className="rounded-md border border-white/10 bg-black/20 p-3">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-zinc-500">Próximo jogo</p>
            <p className="mt-1 font-bold text-white">
              {nextGame ? `vs ${nextGame.opponent}` : "Nenhum próximo jogo encontrado"}
            </p>
            {nextGame ? (
              <p className="mt-1 text-zinc-400">{formatGameDateTimeBrasilia(nextGame.game.date)} BRT</p>
            ) : null}
          </div>
          <div className="rounded-md border border-white/10 bg-black/20 p-3">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-zinc-500">Último resultado</p>
            <p className="mt-1 font-bold text-white">
              {lastGame ? `${lastGame.result} · ${lastGame.score ?? "-"} vs ${lastGame.opponent}` : "Sem resultado recente"}
            </p>
          </div>
        </div>

        <Link
          href="/perfil"
          className="inline-flex w-fit items-center gap-2 rounded-full bg-court-red px-4 py-2 text-sm font-black text-white transition hover:bg-red-600"
        >
          Ver meu time
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
