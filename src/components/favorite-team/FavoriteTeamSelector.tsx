"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { TeamBadge } from "@/components/TeamBadge";
import type { Team } from "@/types/team";

interface FavoriteTeamSelectorProps {
  teams: Team[];
}

function fullTeamName(team: Team) {
  return team.fullName ?? [team.city, team.name].filter(Boolean).join(" ");
}

export function FavoriteTeamSelector({ teams }: FavoriteTeamSelectorProps) {
  const router = useRouter();
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function saveFavoriteTeam(team: Team) {
    setSelectedTeamId(team.id);
    setSaving(true);
    setError(null);

    try {
      const response = await fetch("/api/me/favorite-team", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          favorite_team_id: team.id,
          favorite_team_abbreviation: team.abbreviation,
          favorite_team_name: team.name,
          favorite_team_full_name: fullTeamName(team),
          favorite_team_logo_url: team.logoUrl
        })
      });
      const payload = await response.json().catch(() => ({})) as { error?: string };

      if (!response.ok) {
        throw new Error(payload.error ?? "Não foi possível salvar o time favorito.");
      }

      router.push("/perfil");
      router.refresh();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Não foi possível salvar o time favorito.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-6">
      {error ? (
        <div className="rounded-lg border border-court-red/30 bg-court-red/10 p-4 text-sm font-semibold text-red-100">
          {error}
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {teams.map((team) => {
          const selected = selectedTeamId === team.id;

          return (
            <button
              key={team.id}
              type="button"
              onClick={() => void saveFavoriteTeam(team)}
              disabled={saving}
              className="group rounded-lg border border-white/10 bg-court-slate/82 p-5 text-left shadow-lg transition hover:-translate-y-1 hover:border-court-red/60 hover:bg-[#1d2029] hover:shadow-glow disabled:cursor-not-allowed disabled:opacity-70"
            >
              <div className="mb-4 flex items-center justify-between gap-4">
                <TeamBadge team={team} size="lg" />
                <span className="rounded-full border border-white/10 px-3 py-1 text-xs font-black text-zinc-300">
                  {team.abbreviation ?? team.id.toUpperCase()}
                </span>
              </div>
              <h2 className="text-lg font-black text-white">{fullTeamName(team)}</h2>
              <p className="mt-2 text-sm font-semibold text-zinc-400">
                {team.conference ? `Conferência ${team.conference}` : "NBA"}
              </p>
              <span className="mt-4 inline-flex text-sm font-bold text-court-red">
                {selected && saving ? "Salvando..." : "Escolher time"}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
