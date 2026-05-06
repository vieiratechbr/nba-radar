"use client";

import Image from "next/image";
import { Trophy } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { AwardWinner } from "@/types/award";
import { getAwards } from "@/services/awardsService";

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function sortSeasonsDesc(seasons: string[]) {
  return [...seasons].sort((a, b) => b.localeCompare(a));
}

function PlayerAvatar({ award }: { award: AwardWinner }) {
  const playerName = award.playerName ?? "A definir";

  if (award.imageUrl) {
    return (
      <Image
        src={award.imageUrl}
        alt={playerName}
        width={72}
        height={72}
        className="h-16 w-16 rounded-full border border-white/15 object-cover"
      />
    );
  }

  return (
    <div className="grid h-16 w-16 place-items-center rounded-full border border-court-red/40 bg-[radial-gradient(circle_at_top,rgba(215,25,32,0.34),rgba(14,15,20,0.96))] text-lg font-black text-white shadow-lg">
      {award.status === "pending" ? "?" : getInitials(playerName)}
    </div>
  );
}

export function AwardsClient() {
  const [awards, setAwards] = useState<AwardWinner[]>([]);
  const [selectedSeason, setSelectedSeason] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadAwards() {
      setLoading(true);
      const result = await getAwards();
      if (cancelled) return;

      const sortedSeasons = sortSeasonsDesc(Array.from(new Set(result.data.map((award) => award.season))));

      setAwards(result.data);
      setSelectedSeason((current) => current || sortedSeasons[0] || "Todas");
      setMessage("Base local inicial. Alguns dados podem exigir atualização manual.");
      setLoading(false);
    }

    void loadAwards();

    return () => {
      cancelled = true;
    };
  }, []);

  const seasons = useMemo(() => {
    const sorted = sortSeasonsDesc(Array.from(new Set(awards.map((award) => award.season))));
    return [...sorted, "Todas"];
  }, [awards]);

  const filteredAwards = useMemo(
    () => selectedSeason === "Todas" ? awards : awards.filter((award) => award.season === selectedSeason),
    [awards, selectedSeason]
  );

  const hasOnlyPendingAwards = Boolean(
    filteredAwards.length && filteredAwards.every((award) => award.status === "pending")
  );

  return (
    <div className="grid gap-6">
      <div className="flex gap-2 overflow-x-auto pb-2">
        {seasons.map((season) => (
          <button
            key={season}
            type="button"
            onClick={() => setSelectedSeason(season)}
            className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold transition ${
              selectedSeason === season
                ? "border-court-red bg-court-red text-white shadow-glow"
                : "border-white/10 bg-white/[0.04] text-zinc-300 hover:border-white/25 hover:bg-white/[0.08] hover:text-white"
            }`}
          >
            {season}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4 text-sm font-semibold text-zinc-300">
          Carregando prêmios da NBA...
        </div>
      ) : null}

      {message ? (
        <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4 text-sm font-semibold text-zinc-300">
          {message}
        </div>
      ) : null}

      {hasOnlyPendingAwards ? (
        <div className="rounded-lg border border-court-red/25 bg-court-red/10 p-4 text-sm font-semibold text-zinc-200">
          Alguns prêmios desta temporada ainda não foram definidos oficialmente.
        </div>
      ) : null}

      {!loading && filteredAwards.length === 0 ? (
        <div className="rounded-lg border border-white/10 bg-white/[0.03] p-8 text-center text-sm text-zinc-400">
          Nenhum prêmio encontrado para esta temporada.
        </div>
      ) : null}

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filteredAwards.map((award) => {
          const isPending = award.status === "pending";
          const playerName = award.playerName ?? "A definir";

          return (
            <article
              key={award.id}
              className="rounded-lg border border-white/10 bg-court-slate/82 p-5 shadow-lg transition hover:-translate-y-1 hover:border-court-red/60 hover:bg-[#1d2029] hover:shadow-glow"
            >
              <div className="mb-5 flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <PlayerAvatar award={award} />
                  <div className="grid h-11 w-11 place-items-center rounded-md bg-court-red/20 text-court-red">
                    <Trophy className="h-5 w-5" aria-hidden="true" />
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="rounded-full border border-white/10 px-3 py-1 text-xs font-bold text-zinc-300">
                    {award.season}
                  </span>
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-bold ${
                      isPending
                        ? "border-amber-400/30 bg-amber-400/10 text-amber-200"
                        : "border-emerald-400/25 bg-emerald-400/10 text-emerald-200"
                    }`}
                  >
                    {isPending ? "A definir" : "Confirmado"}
                  </span>
                </div>
              </div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-court-red">
                {award.award}
              </p>
              <h2 className="mt-3 text-2xl font-black text-white">{playerName}</h2>
              <p className="mt-2 text-sm font-semibold text-zinc-300">
                {[award.team, award.position].filter(Boolean).join(" · ") || "NBA"}
              </p>
              {award.summary ? (
                <p className="mt-4 text-sm leading-6 text-zinc-400">{award.summary}</p>
              ) : null}
            </article>
          );
        })}
      </div>
    </div>
  );
}
