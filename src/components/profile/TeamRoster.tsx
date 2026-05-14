"use client";

import { useState } from "react";
import { UsersRound } from "lucide-react";
import { PlayerAvatar } from "@/components/PlayerAvatar";
import type { TeamPlayer } from "@/types/favoriteTeam";

export function TeamRoster({ players }: { players: TeamPlayer[] }) {
  const [expanded, setExpanded] = useState(false);
  const visiblePlayers = expanded ? players : players.slice(0, 8);

  return (
    <section className="rounded-2xl border border-[rgba(var(--team-primary-rgb),0.34)] bg-white/[0.035] p-5 shadow-[0_0_60px_rgba(var(--team-primary-rgb),0.08)]">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <UsersRound className="h-5 w-5 text-[var(--team-primary)]" aria-hidden="true" />
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--team-primary)]">Elenco principal</p>
            <h2 className="mt-1 text-2xl font-black text-white">Roster da equipe</h2>
          </div>
        </div>
        {players.length > 8 ? (
          <button
            type="button"
            onClick={() => setExpanded((value) => !value)}
            className="rounded-full border border-white/10 px-4 py-2 text-xs font-black text-white transition hover:border-[var(--team-primary)] hover:text-[var(--team-primary)]"
          >
            {expanded ? "Ver menos" : "Ver elenco completo"}
          </button>
        ) : null}
      </div>

      {players.length ? (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {visiblePlayers.map((player) => (
            <article key={player.id} className="rounded-xl border border-white/10 bg-black/25 p-4 transition hover:border-[var(--team-primary)]/60 hover:bg-black/35">
              <div className="flex items-center gap-3">
                <PlayerAvatar name={player.name} imageUrl={player.imageUrl} size="md" />
                <div className="min-w-0">
                  <p className="truncate font-black text-white">{player.name}</p>
                  <p className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-zinc-500">
                    {[player.position, player.jersey ? `#${player.jersey}` : null].filter(Boolean).join(" · ") || "NBA"}
                  </p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-zinc-400">
                <span>{player.height ?? "Altura -"}</span>
                <span>{player.weight ?? "Peso -"}</span>
                <span>{player.age ? `${player.age} anos` : "Idade -"}</span>
                <span className="text-zinc-500">{player.source.toUpperCase()}</span>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-white/10 bg-black/20 p-4 text-sm font-semibold text-zinc-400">
          Elenco ainda indisponível para este time.
        </div>
      )}
    </section>
  );
}
