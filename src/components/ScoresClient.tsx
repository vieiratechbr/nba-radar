"use client";

import { CalendarDays, Search } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { Game } from "@/types/game";
import type { Team } from "@/types/team";
import { FilterTabs } from "@/components/FilterTabs";
import { GameCard } from "@/components/GameCard";
import { SectionTitle } from "@/components/SectionTitle";
import { useAutoRefresh } from "@/hooks/useAutoRefresh";
import { getGamesResult } from "@/services/gamesService";
import { filterGames, scoreFilters, type ScoreFilter } from "@/utils/filterHelpers";
import { formatLastUpdated } from "@/utils/formatGameTime";
import { toInputDate } from "@/utils/formatNbaApiDate";
import { getAutoRefreshLabel, shouldAutoRefreshGames } from "@/utils/gameRefresh";

interface ScoresClientProps {
  games: Game[];
  teams: Team[];
}

function createDateState() {
  const now = new Date();
  const yesterday = new Date(now);
  const tomorrow = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  tomorrow.setDate(now.getDate() + 1);

  return {
    selectedDate: toInputDate(now),
    quickDates: [
      { label: "Ontem", value: toInputDate(yesterday) },
      { label: "Hoje", value: toInputDate(now) },
      { label: "Amanhã", value: toInputDate(tomorrow) }
    ]
  };
}

export function ScoresClient({ games, teams }: ScoresClientProps) {
  const [selectedStatus, setSelectedStatus] = useState<ScoreFilter>("Todos");
  const [dateState, setDateState] = useState(createDateState);
  const [selectedTeam, setSelectedTeam] = useState("all");
  const [visibleGames, setVisibleGames] = useState(games);
  const [loading, setLoading] = useState(true);
  const [fallbackMessage, setFallbackMessage] = useState<string | null>(null);
  const [emptyMessage, setEmptyMessage] = useState<string | null>(null);
  const [liveEmpty, setLiveEmpty] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const autoRefreshEnabled = useMemo(() => shouldAutoRefreshGames(visibleGames), [visibleGames]);
  const autoRefreshLabel = useMemo(() => getAutoRefreshLabel(visibleGames), [visibleGames]);
  const refreshInterval = useMemo(
    () => visibleGames.some((game) => game.status === "live") ? 30000 : 60000,
    [visibleGames]
  );

  const loadGames = useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true);
    const result = await getGamesResult(dateState.selectedDate);

    if (result.source === "espn") {
      setLiveEmpty(!result.data.some((game) => game.status === "live"));
      setFallbackMessage(null);
      setEmptyMessage(result.empty ? result.message ?? "Nenhum jogo encontrado." : null);
      setVisibleGames(result.data);
    } else {
      setLiveEmpty(!result.data.some((game) => game.status === "live"));
      setFallbackMessage(
        result.message ??
          "Não foi possível carregar os dados reais agora. Exibindo dados de demonstração."
      );
      setEmptyMessage(null);
      setVisibleGames(result.data.length ? result.data : games);
    }

    setLastUpdated(new Date());
    if (showLoading) setLoading(false);
  }, [dateState.selectedDate, games]);

  useEffect(() => {
    let cancelled = false;

    async function loadInitialGames() {
      setLoading(true);
      const result = await getGamesResult(dateState.selectedDate);

      if (cancelled) return;

      if (result.source === "espn") {
        setLiveEmpty(!result.data.some((game) => game.status === "live"));
        setFallbackMessage(null);
        setEmptyMessage(result.empty ? result.message ?? "Nenhum jogo encontrado." : null);
        setVisibleGames(result.data);
      } else {
        setLiveEmpty(!result.data.some((game) => game.status === "live"));
        setFallbackMessage(
          result.message ??
            "Não foi possível carregar os dados reais agora. Exibindo dados de demonstração."
        );
        setEmptyMessage(null);
        setVisibleGames(result.data.length ? result.data : games);
      }

      setLastUpdated(new Date());
      setLoading(false);
    }

    void loadInitialGames();

    return () => {
      cancelled = true;
    };
  }, [dateState.selectedDate, games]);

  useAutoRefresh(() => {
    void loadGames(false);
  }, refreshInterval, autoRefreshEnabled);

  const filteredGames = useMemo(
    () => filterGames(visibleGames, selectedStatus, selectedTeam),
    [selectedStatus, selectedTeam, visibleGames]
  );

  return (
    <div className="grid gap-8">
      <section className="rounded-lg border border-white/10 bg-white/[0.03] p-4 sm:p-5">
        <div className="grid gap-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex gap-2">
              {dateState.quickDates.map((date) => (
                <button
                  key={date.label}
                  type="button"
                  onClick={() =>
                    setDateState((current) => ({ ...current, selectedDate: date.value }))
                  }
                  className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-bold text-zinc-300 transition hover:border-court-red hover:text-white"
                >
                  {date.label}
                </button>
              ))}
            </div>
            <label className="relative block md:w-64">
              <span className="sr-only">Selecionar data</span>
              <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <input
                type="date"
                value={dateState.selectedDate}
                onChange={(event) =>
                  setDateState((current) => ({ ...current, selectedDate: event.target.value }))
                }
                className="w-full rounded-full border border-white/10 bg-court-black py-2 pl-10 pr-4 text-sm font-semibold text-zinc-200 outline-none transition hover:border-white/25 focus:border-court-red"
              />
            </label>
          </div>

          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <FilterTabs options={scoreFilters} active={selectedStatus} onChange={setSelectedStatus} />

            <label className="relative block min-w-0 xl:w-72">
              <span className="sr-only">Filtrar por time</span>
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <select
                value={selectedTeam}
                onChange={(event) => setSelectedTeam(event.target.value)}
                className="w-full appearance-none rounded-full border border-white/10 bg-court-black py-2 pl-10 pr-4 text-sm font-semibold text-zinc-200 outline-none transition hover:border-white/25 focus:border-court-red"
              >
                <option value="all">Todos os times</option>
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.abbreviation ?? team.id.toUpperCase()} - {team.city ?? team.fullName ?? ""} {team.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </section>

      {loading ? (
        <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4 text-sm font-semibold text-zinc-300">
          Carregando dados da NBA...
        </div>
      ) : null}

      {fallbackMessage ? (
        <div className="rounded-lg border border-court-red/25 bg-court-red/10 p-4 text-sm font-semibold text-zinc-200">
          {fallbackMessage}
        </div>
      ) : null}

      {liveEmpty && visibleGames.length > 0 && selectedStatus === "Ao vivo" ? (
        <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4 text-sm font-semibold text-zinc-300">
          Nenhum jogo ao vivo no momento.
        </div>
      ) : null}

      {emptyMessage ? (
        <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4 text-sm font-semibold text-zinc-300">
          {emptyMessage}
        </div>
      ) : null}

      {lastUpdated ? (
        <div className={`rounded-lg border p-3 text-xs font-bold ${
          autoRefreshEnabled
            ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-200"
            : "border-white/10 bg-white/[0.03] text-zinc-400"
        }`}
        >
          {autoRefreshLabel}
          {` · Última atualização: ${formatLastUpdated(lastUpdated)}`}
        </div>
      ) : null}

      <section>
        <SectionTitle
          eyebrow="Resultados"
          title={`${filteredGames.length} jogos encontrados`}
          description="Use os filtros por data, status e time para navegar pela rodada. Dados reais aparecem quando a API estiver disponível."
        />

        {filteredGames.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredGames.map((game) => (
              <GameCard key={game.id} game={game} teams={teams} />
            ))}
          </div>
        ) : (
          <div className="grid gap-5">
            <div className="rounded-lg border border-white/10 bg-white/[0.03] p-8 text-center text-sm text-zinc-400">
              {liveEmpty && selectedStatus === "Ao vivo"
                ? "Nenhum jogo ao vivo no momento."
                : "Nenhum jogo encontrado para os filtros selecionados."}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
