import { espnFetch } from "@/integrations/espn/espnClient";
import { espnEndpoints } from "@/integrations/espn/espnEndpoints";
import type { TeamStatMetric, TeamStats } from "@/types/favoriteTeam";

type UnknownRecord = Record<string, unknown>;

const preferredStats = [
  { name: "avgPoints", label: "Pontos por jogo" },
  { name: "avgRebounds", label: "Rebotes por jogo" },
  { name: "avgAssists", label: "Assistências por jogo" },
  { name: "avgSteals", label: "Roubos por jogo" },
  { name: "avgBlocks", label: "Tocos por jogo" },
  { name: "avgTurnovers", label: "Turnovers por jogo" },
  { name: "fieldGoalPct", label: "Aproveitamento de quadra" },
  { name: "threePointFieldGoalPct", label: "Aproveitamento de 3" },
  { name: "freeThrowPct", label: "Lances livres" }
];

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null;
}

function readString(source: UnknownRecord | undefined, keys: string[], fallback = "") {
  if (!source) return fallback;

  for (const key of keys) {
    const value = source[key];
    if (typeof value === "string" && value.trim()) return value;
    if (typeof value === "number") return String(value);
  }

  return fallback;
}

function readArray(source: UnknownRecord | undefined, key: string) {
  const value = source?.[key];
  return Array.isArray(value) ? value : [];
}

function readNestedStats(raw: UnknownRecord) {
  const results = isRecord(raw.results) ? raw.results : {};
  const statsRoot = isRecord(results.stats) ? results.stats : {};
  return readArray(statsRoot, "categories")
    .filter(isRecord)
    .flatMap((category) => readArray(category, "stats").filter(isRecord));
}

export function normalizeEspnTeamStats(raw: unknown): TeamStats | null {
  if (!isRecord(raw)) return null;

  const stats = readNestedStats(raw);
  const metrics = preferredStats
    .map<TeamStatMetric | null>((preferred) => {
      const stat = stats.find((candidate) => readString(candidate, ["name"], "") === preferred.name);
      if (!stat) return null;

      return {
        label: preferred.label,
        value: readString(stat, ["displayValue"], "-"),
        abbreviation: readString(stat, ["abbreviation"], undefined)
      };
    })
    .filter((metric): metric is TeamStatMetric => Boolean(metric));

  if (!metrics.length) return null;

  return {
    metrics,
    source: "espn"
  };
}

export async function getEspnTeamStats(teamIdentifier: string) {
  const url = `${espnEndpoints.nbaTeamStatistics}/${teamIdentifier.toLowerCase()}/statistics`;
  const raw = await espnFetch(url, { revalidate: 3600 });
  return normalizeEspnTeamStats(raw);
}
