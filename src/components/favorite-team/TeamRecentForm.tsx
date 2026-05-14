import Image from "next/image";
import Link from "next/link";
import { History } from "lucide-react";
import type { FavoriteTeamGame } from "@/types/favoriteTeam";
import { formatShortDate } from "@/utils/formatDate";

export function TeamRecentForm({
  games,
  form
}: {
  games: FavoriteTeamGame[];
  form: ("V" | "D" | "-")[];
}) {
  const wins = form.filter((result) => result === "V").length;
  const losses = form.filter((result) => result === "D").length;

  return (
    <section className="rounded-2xl border border-[rgba(var(--team-primary-rgb),0.34)] bg-white/[0.035] p-5 shadow-[0_0_60px_rgba(var(--team-primary-rgb),0.08)]">
      <div className="mb-5 flex items-center gap-2">
        <History className="h-5 w-5 text-[var(--team-primary)]" aria-hidden="true" />
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--team-primary)]">Forma recente</p>
          <h2 className="mt-1 text-2xl font-black text-white">Últimos resultados</h2>
        </div>
      </div>

      {form.length ? (
        <div className="mb-5 rounded-xl border border-white/10 bg-black/20 p-4">
          <div className="flex flex-wrap gap-2">
            {form.map((result, index) => (
              <span
                key={`${result}-${index}`}
                title={result === "V" ? "Vitória" : result === "D" ? "Derrota" : "Sem resultado"}
                className={`grid h-9 w-9 place-items-center rounded-full text-xs font-black ${
                  result === "V"
                    ? "bg-emerald-400/15 text-emerald-200"
                    : result === "D"
                    ? "bg-[rgba(var(--team-primary-rgb),0.18)] text-red-200"
                    : "bg-white/10 text-zinc-300"
                }`}
              >
                {result}
              </span>
            ))}
          </div>
          <p className="mt-3 text-sm font-semibold text-zinc-400">
            {wins + losses ? `${wins} vitórias nos últimos ${wins + losses} jogos` : "Forma recente indisponível."}
          </p>
        </div>
      ) : null}

      {games.length ? (
        <div className="grid gap-3">
          {games.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/25 p-4 text-sm transition hover:border-[var(--team-primary)] hover:bg-black/35"
            >
              <div className="flex min-w-0 items-center gap-3">
                {item.opponentLogoUrl ? (
                  <Image
                    src={item.opponentLogoUrl}
                    alt={item.opponent}
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-full bg-white/95 p-1.5 object-contain"
                  />
                ) : (
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/10 bg-white/10 text-[10px] font-black text-white">
                    {item.opponentAbbreviation ?? "NBA"}
                  </span>
                )}
                <div className="min-w-0">
                  <p className="truncate font-black text-white">
                    {item.homeAway === "home" ? "Casa" : "Fora"} vs {item.opponent}
                  </p>
                  <p className="mt-1 text-xs text-zinc-500">{formatShortDate(item.game.date)}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-black text-white">{item.score ?? "-"}</p>
                <p className={item.result === "V" ? "text-emerald-200" : "text-red-200"}>
                  {item.result === "V" ? "Vitória" : item.result === "D" ? "Derrota" : "-"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-white/10 bg-black/20 p-4 text-sm font-semibold text-zinc-400">
          Últimos resultados ainda indisponíveis.
        </div>
      )}
    </section>
  );
}
