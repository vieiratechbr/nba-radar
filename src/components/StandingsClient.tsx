"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import type { StandingTeam } from "@/types/standing";
import { getStandings } from "@/services/standingsService";

const conferenceFilters = ["Todas", "Leste", "Oeste"] as const;
type ConferenceFilter = (typeof conferenceFilters)[number];

export function StandingsClient() {
  const [standings, setStandings] = useState<StandingTeam[]>([]);
  const [activeConference, setActiveConference] = useState<ConferenceFilter>("Todas");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadStandings() {
      setLoading(true);
      const result = await getStandings();
      if (cancelled) return;

      setStandings(result.data);
      setMessage(result.fallback ? result.message ?? "Não foi possível carregar a classificação real. Exibindo demonstração." : null);
      setLoading(false);
    }

    void loadStandings();

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredStandings = useMemo(() => {
    if (activeConference === "Todas") return standings;
    return standings.filter((team) => team.conference === activeConference);
  }, [activeConference, standings]);

  return (
    <div className="grid gap-6">
      <div className="flex gap-2 overflow-x-auto pb-2">
        {conferenceFilters.map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => setActiveConference(filter)}
            className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold transition ${
              activeConference === filter
                ? "border-court-red bg-court-red text-white shadow-glow"
                : "border-white/10 bg-white/[0.04] text-zinc-300 hover:border-white/25 hover:bg-white/[0.08] hover:text-white"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4 text-sm font-semibold text-zinc-300">
          Carregando classificação da NBA...
        </div>
      ) : null}

      {message ? (
        <div className="rounded-lg border border-court-red/25 bg-court-red/10 p-4 text-sm font-semibold text-zinc-200">
          {message}
        </div>
      ) : null}

      {!loading && filteredStandings.length === 0 ? (
        <div className="rounded-lg border border-white/10 bg-white/[0.03] p-8 text-center text-sm text-zinc-400">
          Nenhum time encontrado para este filtro.
        </div>
      ) : null}

      {filteredStandings.length > 0 ? (
        <div className="overflow-hidden rounded-lg border border-white/10 bg-white/[0.03]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-sm">
              <thead className="bg-white/[0.04] text-xs uppercase tracking-[0.16em] text-zinc-500">
                <tr>
                  {["#", "Time", "Conf.", "Divisão", "V", "D", "Aprov.", "GB", "Últ. 10", "Seq.", "Casa", "Fora"].map((heading) => (
                    <th key={heading} className="px-4 py-4 text-left">{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-zinc-300">
                {filteredStandings.map((team) => (
                  <tr key={`${team.conference}-${team.id}`} className="transition hover:bg-white/[0.04]">
                    <td className="px-4 py-4 text-lg font-black text-white">{team.rank}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        {team.logoUrl ? (
                          <Image
                            src={team.logoUrl}
                            alt=""
                            width={32}
                            height={32}
                            className="h-8 w-8 rounded object-contain"
                          />
                        ) : (
                          <div className="grid h-8 w-8 place-items-center rounded bg-court-red text-xs font-black text-white">
                            {team.abbreviation}
                          </div>
                        )}
                        <div>
                          <p className="font-black text-white">{team.fullName}</p>
                          <p className="text-xs text-zinc-500">{team.abbreviation}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="rounded-full border border-white/10 px-3 py-1 text-xs font-bold text-zinc-200">
                        {team.conference ?? "-"}
                      </span>
                    </td>
                    <td className="px-4 py-4">{team.division ?? "-"}</td>
                    <td className="px-4 py-4 font-black text-white">{team.wins}</td>
                    <td className="px-4 py-4">{team.losses}</td>
                    <td className="px-4 py-4">{team.winPercentage ?? "-"}</td>
                    <td className="px-4 py-4">{team.gamesBehind ?? "-"}</td>
                    <td className="px-4 py-4">{team.lastTen ?? "-"}</td>
                    <td className="px-4 py-4 font-bold text-court-red">{team.streak ?? "-"}</td>
                    <td className="px-4 py-4">{team.homeRecord ?? "-"}</td>
                    <td className="px-4 py-4">{team.awayRecord ?? "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </div>
  );
}
