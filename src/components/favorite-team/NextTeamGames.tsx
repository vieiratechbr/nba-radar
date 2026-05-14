import Image from "next/image";
import Link from "next/link";
import { CalendarClock } from "lucide-react";
import type { FavoriteTeamGame } from "@/types/favoriteTeam";
import { formatGameDateTimeBrasilia } from "@/utils/formatGameTime";

const statusLabel = {
  scheduled: "Agendado",
  live: "Ao vivo",
  final: "Finalizado"
};

export function NextTeamGames({ games }: { games: FavoriteTeamGame[] }) {
  return (
    <section className="rounded-2xl border border-[rgba(var(--team-primary-rgb),0.34)] bg-white/[0.035] p-5 shadow-[0_0_60px_rgba(var(--team-primary-rgb),0.08)]">
      <div className="mb-5 flex items-center gap-2">
        <CalendarClock className="h-5 w-5 text-[var(--team-primary)]" aria-hidden="true" />
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--team-primary)]">Agenda</p>
          <h2 className="mt-1 text-2xl font-black text-white">Próximos jogos</h2>
        </div>
      </div>

      {games.length ? (
        <div className="grid gap-3">
          {games.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="rounded-xl border border-white/10 bg-black/25 p-4 transition hover:border-[var(--team-primary)] hover:bg-black/35"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  {item.opponentLogoUrl ? (
                    <Image
                      src={item.opponentLogoUrl}
                      alt={item.opponent}
                      width={44}
                      height={44}
                      className="h-11 w-11 rounded-full bg-white/95 p-1.5 object-contain"
                    />
                  ) : (
                    <span className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-[rgba(var(--team-primary-rgb),0.18)] text-xs font-black text-white">
                      {item.opponentAbbreviation ?? "NBA"}
                    </span>
                  )}
                  <div>
                    <p className="font-black text-white">
                      {item.homeAway === "home" ? "Casa" : "Fora"} vs {item.opponent}
                    </p>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
                      {item.game.arena ?? "Arena a confirmar"} · {statusLabel[item.game.status]}
                    </p>
                  </div>
                </div>
                <p className="text-sm font-bold text-zinc-300">
                  {formatGameDateTimeBrasilia(item.game.date)} BRT
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-white/10 bg-black/20 p-4 text-sm font-semibold text-zinc-400">
          Nenhum próximo jogo encontrado nos próximos 30 dias.
        </div>
      )}
    </section>
  );
}
