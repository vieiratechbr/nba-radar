import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { FavoriteTeamDashboardData } from "@/types/favoriteTeam";
import { formatGameDateTimeBrasilia } from "@/utils/formatGameTime";

export function FavoriteTeamCard({ data }: { data: FavoriteTeamDashboardData }) {
  const nextGame = data.nextGames[0];
  const lastGame = data.recentGames[0];

  return (
    <section className="rounded-2xl border border-[var(--team-primary)] bg-[radial-gradient(circle_at_top_left,rgba(var(--team-primary-rgb),0.28),transparent_30rem),linear-gradient(135deg,rgba(var(--team-secondary-rgb),0.34),rgba(0,0,0,0.62)),#111217] p-5 shadow-[0_0_0_1px_rgba(var(--team-primary-rgb),0.16),0_26px_80px_rgba(var(--team-primary-rgb),0.14)]">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          {data.team.logoUrl ? (
            <Image
              src={data.team.logoUrl}
              alt={data.team.fullName}
              width={88}
              height={88}
              className="h-20 w-20 rounded-2xl border border-white/15 bg-white/95 p-3 object-contain"
            />
          ) : (
            <div className="grid h-20 w-20 place-items-center rounded-2xl bg-[var(--team-primary)] text-lg font-black text-[var(--team-text-on-primary)]">
              {data.team.abbreviation ?? "NBA"}
            </div>
          )}
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--team-secondary)]">Seu Radar</p>
            <h2 className="mt-2 text-2xl font-black text-white">{data.team.fullName}</h2>
            <p className="mt-1 text-sm text-zinc-300">
              {data.standing
                ? `#${data.standing.rank} · ${data.standing.wins}-${data.standing.losses} · ${data.standing.conference ?? "NBA"}`
                : "Temporada em acompanhamento"}
            </p>
          </div>
        </div>

        <div className="grid gap-3 text-sm lg:min-w-96 lg:grid-cols-3">
          <RadarStat label="Próximo jogo" value={nextGame ? `vs ${nextGame.opponent}` : "A definir"} detail={nextGame ? `${formatGameDateTimeBrasilia(nextGame.game.date)} BRT` : "Nenhum jogo encontrado"} />
          <RadarStat label="Último resultado" value={lastGame ? `${lastGame.result} · ${lastGame.score ?? "-"}` : "Sem resultado"} detail={lastGame ? `vs ${lastGame.opponent}` : "Aguardando dados"} />
          <RadarStat label="Classificação" value={data.standing ? `#${data.standing.rank}` : "-"} detail={data.standing ? `${data.standing.wins}-${data.standing.losses}` : "Em atualização"} />
        </div>

        <Link
          href="/perfil"
          className="inline-flex w-fit items-center gap-2 rounded-full bg-[var(--team-primary)] px-5 py-3 text-sm font-black text-[var(--team-text-on-primary)] transition hover:brightness-110"
        >
          Ver meu painel
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}

function RadarStat({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-black/25 p-3">
      <p className="text-xs font-black uppercase tracking-[0.14em] text-zinc-500">{label}</p>
      <p className="mt-1 font-black text-white">{value}</p>
      <p className="mt-1 text-xs text-zinc-400">{detail}</p>
    </div>
  );
}
