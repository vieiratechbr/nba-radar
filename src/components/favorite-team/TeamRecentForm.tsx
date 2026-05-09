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
  return (
    <section className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
      <div className="mb-4 flex items-center gap-2">
        <History className="h-5 w-5 text-court-red" aria-hidden="true" />
        <h2 className="text-xl font-black text-white">Últimos resultados</h2>
      </div>

      {form.length ? (
        <div className="mb-4 flex gap-2">
          {form.map((result, index) => (
            <span
              key={`${result}-${index}`}
              className={`grid h-8 w-8 place-items-center rounded-full text-xs font-black ${
                result === "V"
                  ? "bg-emerald-400/15 text-emerald-200"
                  : result === "D"
                  ? "bg-court-red/15 text-red-200"
                  : "bg-white/10 text-zinc-300"
              }`}
            >
              {result}
            </span>
          ))}
        </div>
      ) : null}

      {games.length ? (
        <div className="grid gap-3">
          {games.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="flex items-center justify-between gap-3 rounded-md border border-white/10 bg-black/20 p-4 text-sm transition hover:border-court-red/60 hover:bg-black/35"
            >
              <div>
                <p className="font-black text-white">
                  {item.homeAway === "home" ? "Casa" : "Fora"} vs {item.opponent}
                </p>
                <p className="mt-1 text-xs text-zinc-500">{formatShortDate(item.game.date)}</p>
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
        <div className="rounded-md border border-white/10 bg-black/20 p-4 text-sm font-semibold text-zinc-400">
          Últimos resultados ainda indisponíveis.
        </div>
      )}
    </section>
  );
}
