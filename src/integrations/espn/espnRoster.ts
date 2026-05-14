import { espnFetch } from "@/integrations/espn/espnClient";
import { espnEndpoints } from "@/integrations/espn/espnEndpoints";
import type { TeamPlayer } from "@/types/favoriteTeam";

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null;
}

function readRecord(source: UnknownRecord | undefined, key: string) {
  const value = source?.[key];
  return isRecord(value) ? value : undefined;
}

function readArray(source: UnknownRecord | undefined, key: string) {
  const value = source?.[key];
  return Array.isArray(value) ? value : [];
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

function readNumber(source: UnknownRecord | undefined, keys: string[]) {
  if (!source) return undefined;

  for (const key of keys) {
    const value = source[key];
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string") {
      const parsed = Number(value);
      if (Number.isFinite(parsed)) return parsed;
    }
  }

  return undefined;
}

export function normalizeEspnRoster(raw: unknown): TeamPlayer[] {
  if (!isRecord(raw)) return [];

  return readArray(raw, "athletes")
    .filter(isRecord)
    .map((athlete, index) => {
      const position = readRecord(athlete, "position");
      const headshot = readRecord(athlete, "headshot");

      return {
        id: readString(athlete, ["id", "uid"], `espn-player-${index}`),
        name: readString(athlete, ["displayName", "fullName", "shortName"], "Atleta"),
        position: readString(position, ["abbreviation", "displayName", "name"], undefined),
        jersey: readString(athlete, ["jersey"], undefined),
        age: readNumber(athlete, ["age"]),
        height: readString(athlete, ["displayHeight"], undefined),
        weight: readString(athlete, ["displayWeight"], undefined),
        imageUrl: readString(headshot, ["href"], undefined),
        source: "espn"
      };
    });
}

export async function getEspnTeamRoster(teamIdentifier: string) {
  const url = `${espnEndpoints.nbaTeamRoster}/${teamIdentifier.toLowerCase()}/roster`;
  const raw = await espnFetch(url, { revalidate: 3600 });
  return normalizeEspnRoster(raw);
}
