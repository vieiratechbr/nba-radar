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
    <section className="rounded-lg border border-[rgba(var(--team-primary-rgb),0.28)] bg-white/[0.03] p-5 shadow-[0_0_46px_rgba(var(--team-primary-rgb),0.06)]">
      <div className="mb-4 flex items-center gap-2">
        <CalendarClock className="h-5 w-5 text-[var(--team-primary)]" aria-hidden="true" />
        <h2 className="text-xl font-black text-white">Próximos jogos</h2>
      </div>

      {games.length ? (
        <div className="grid gap-3">
          {games.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="rounded-md border border-white/10 bg-black/20 p-4 transition hover:border-[var(--team-primary)] hover:bg-black/35"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-black text-white">
                    {item.homeAway === "home" ? "Casa" : "Fora"} vs {item.opponent}
                  </p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
                    {item.opponentAbbreviation ?? "NBA"} · {item.game.arena ?? "Arena a confirmar"} · {statusLabel[item.game.status]}
                  </p>
                </div>
                <p className="text-right text-sm font-bold text-zinc-300">
                  {formatGameDateTimeBrasilia(item.game.date)} BRT
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-md border border-white/10 bg-black/20 p-4 text-sm font-semibold text-zinc-400">
          Nenhum próximo jogo encontrado para este time.
        </div>
      )}
    </section>
  );
}
