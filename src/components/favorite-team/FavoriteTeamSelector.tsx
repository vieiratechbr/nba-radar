"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { TeamBadge } from "@/components/TeamBadge";
import { getTeamTheme } from "@/theme/nbaTeamThemes";
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
  const selectedTeam = useMemo(
    () => teams.find((team) => team.id === selectedTeamId) ?? null,
    [selectedTeamId, teams]
  );
  const selectedTheme = getTeamTheme(selectedTeam?.abbreviation);

  async function saveFavoriteTeam() {
    if (!selectedTeam) {
      setError("Selecione um time para continuar.");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const response = await fetch("/api/me/favorite-team", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          favorite_team_id: selectedTeam.id,
          favorite_team_abbreviation: selectedTeam.abbreviation,
          favorite_team_name: selectedTeam.name,
          favorite_team_full_name: fullTeamName(selectedTeam),
          favorite_team_logo_url: selectedTeam.logoUrl
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
          const theme = getTeamTheme(team.abbreviation);

          return (
            <button
              key={team.id}
              type="button"
              onClick={() => setSelectedTeamId(team.id)}
              disabled={saving}
              className="group rounded-lg border bg-court-slate/82 p-5 text-left shadow-lg transition hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-70"
              style={{
                borderColor: selected ? theme.primary : "rgba(255,255,255,0.10)",
                background: selected
                  ? `linear-gradient(135deg, ${theme.primary}30, rgba(25,27,34,0.92))`
                  : undefined,
                boxShadow: selected ? `0 0 0 1px ${theme.primary}55, 0 24px 70px ${theme.primary}22` : undefined
              }}
              onMouseEnter={(event) => {
                event.currentTarget.style.borderColor = theme.primary;
                event.currentTarget.style.boxShadow = `0 0 0 1px ${theme.primary}33, 0 22px 60px ${theme.primary}18`;
              }}
              onMouseLeave={(event) => {
                event.currentTarget.style.borderColor = selected ? theme.primary : "rgba(255,255,255,0.10)";
                event.currentTarget.style.boxShadow = selected ? `0 0 0 1px ${theme.primary}55, 0 24px 70px ${theme.primary}22` : "";
              }}
            >
              <div className="mb-4 flex items-center justify-between gap-4">
                <TeamBadge team={team} size="lg" />
                <span
                  className="rounded-full border px-3 py-1 text-xs font-black text-zinc-200"
                  style={{ borderColor: selected ? theme.secondary : "rgba(255,255,255,0.10)" }}
                >
                  {team.abbreviation ?? team.id.toUpperCase()}
                </span>
              </div>
              <h2 className="text-lg font-black text-white">{fullTeamName(team)}</h2>
              <p className="mt-2 text-sm font-semibold text-zinc-400">
                {team.conference ? `Conferência ${team.conference}` : "NBA"}
              </p>
              <span className="mt-4 inline-flex text-sm font-bold" style={{ color: theme.primary }}>
                {selected ? "Selecionado" : "Escolher time"}
              </span>
            </button>
          );
        })}
      </div>

      <div className="sticky bottom-4 z-10 rounded-2xl border border-white/10 bg-court-black/90 p-4 backdrop-blur-xl">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-semibold text-zinc-300">
            {selectedTeam ? `Time selecionado: ${fullTeamName(selectedTeam)}` : "Selecione seu time favorito para liberar o painel personalizado."}
          </p>
          <button
            type="button"
            onClick={() => void saveFavoriteTeam()}
            disabled={!selectedTeam || saving}
            className="inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-black transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
            style={{
              backgroundColor: selectedTeam ? selectedTheme.primary : "#2a2d37",
              color: selectedTeam ? selectedTheme.textOnPrimary ?? "#FFFFFF" : "#a1a1aa"
            }}
          >
            {saving ? "Salvando..." : "Confirmar time"}
          </button>
        </div>
      </div>
    </div>
  );
}
