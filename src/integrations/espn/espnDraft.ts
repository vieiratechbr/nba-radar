import type { DraftProspect } from "@/types/draft";

const espnDraftBaseUrl = "https://sports.core.api.espn.com/v2/sports/basketball/leagues/nba/seasons";
const picksPerRound = 30;
const roundsToTry = [1, 2];

type UnknownRecord = Record<string, unknown>;

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

function readNumber(source: UnknownRecord | undefined, keys: string[], fallback?: number) {
  if (!source) return fallback;

  for (const key of keys) {
    const value = source[key];
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string") {
      const parsed = Number(value);
      if (Number.isFinite(parsed)) return parsed;
    }
  }

  return fallback;
}

function readRecord(source: UnknownRecord | undefined, keys: string[]) {
  if (!source) return undefined;

  for (const key of keys) {
    const value = source[key];
    if (isRecord(value)) return value;
  }

  return undefined;
}

function readRef(source: UnknownRecord | undefined, key: string) {
  const ref = readRecord(source, [key]);
  const value = readString(ref, ["$ref"], "");
  return value ? value.replace(/^http:\/\//, "https://") : "";
}

function stripHtml(value: string) {
  return value
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function splitAnalysis(text: string, marker: "Strengths" | "Improvement areas") {
  const stripped = stripHtml(text);
  const start = stripped.indexOf(marker);
  if (start < 0) return [];

  const nextMarker = marker === "Strengths" ? stripped.indexOf("Improvement areas", start) : stripped.indexOf("Projected role", start);
  const section = stripped.slice(start + marker.length, nextMarker > start ? nextMarker : undefined);

  return section
    .split(/\s-\s/g)
    .map((item) => item.replace(/^[\s:-]+/, "").trim())
    .filter(Boolean)
    .slice(0, 3);
}

async function fetchEspnJson(url: string, revalidate = 86400) {
  const response = await fetch(url, {
    headers: {
      Accept: "application/json"
    },
    next: {
      revalidate
    }
  });

  if (!response.ok) {
    throw new Error(`ESPN Draft API error ${response.status}`);
  }

  return response.json();
}

async function fetchPick(year: number, round: number, pick: number) {
  const url = `${espnDraftBaseUrl}/${year}/draft/rounds/${round}/picks/${pick}?lang=en&region=us`;
  return fetchEspnJson(url);
}

function findPredraftAnalysis(athlete: UnknownRecord) {
  const analysis = Array.isArray(athlete.analysis) ? athlete.analysis.filter(isRecord) : [];
  return analysis.find((item) => readString(item, ["type"], "") === "predraft");
}

function normalizePick(year: number, pick: UnknownRecord, athlete: UnknownRecord): DraftProspect | null {
  const playerName = readString(athlete, ["displayName", "fullName", "shortName"], "");
  if (!playerName) return null;

  const position = readRecord(athlete, ["position"]);
  const headshot = readRecord(athlete, ["headshot"]);
  const predraft = findPredraftAnalysis(athlete);
  const analysisText = readString(predraft, ["text"], "");
  const overall = readNumber(pick, ["overall"], readNumber(pick, ["pick"], 0)) ?? 0;

  return {
    id: `espn-draft-${year}-${overall || playerName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    year: String(year),
    rank: overall || readNumber(pick, ["pick"], 999) || 999,
    projectedPick: overall || readNumber(pick, ["pick"], undefined),
    playerName,
    position: readString(position, ["abbreviation", "displayName"], undefined),
    height: readString(athlete, ["displayHeight"], undefined),
    weight: readString(athlete, ["displayWeight"], undefined),
    schoolOrTeam: "ESPN Draft",
    nationality: "Draft ESPN",
    strengths: analysisText ? splitAnalysis(analysisText, "Strengths") : undefined,
    weaknesses: analysisText ? splitAnalysis(analysisText, "Improvement areas") : undefined,
    imageUrl: readString(headshot, ["href"], undefined),
    source: "espn"
  };
}

export async function getEspnDraftProspects(year: number): Promise<DraftProspect[]> {
  const pickRequests = roundsToTry.flatMap((round) =>
    Array.from({ length: picksPerRound }, (_, index) => ({ round, pick: index + 1 }))
  );

  const pickResults = await Promise.allSettled(
    pickRequests.map(({ round, pick }) => fetchPick(year, round, pick))
  );

  const picks = pickResults
    .filter((result): result is PromiseFulfilledResult<unknown> => result.status === "fulfilled")
    .map((result) => result.value)
    .filter(isRecord)
    .filter((pick) => readRef(pick, "athlete"));

  const athleteResults = await Promise.allSettled(
    picks.map(async (pick) => ({
      pick,
      athlete: await fetchEspnJson(readRef(pick, "athlete"))
    }))
  );

  return athleteResults
    .filter((result): result is PromiseFulfilledResult<{ pick: UnknownRecord; athlete: unknown }> => result.status === "fulfilled")
    .map((result) => isRecord(result.value.athlete) ? normalizePick(year, result.value.pick, result.value.athlete) : null)
    .filter((prospect): prospect is DraftProspect => Boolean(prospect))
    .sort((a, b) => a.rank - b.rank);
}
