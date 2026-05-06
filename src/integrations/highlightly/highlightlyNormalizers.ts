import type {
  GamePrediction,
  HeadToHeadSummary,
  TeamRecentForm
} from "@/types/gameExtras";
import type { GameHighlight } from "@/types/highlight";
import type { StandingTeam } from "@/types/standing";

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null;
}

function readRecord(source: UnknownRecord | undefined, keys: string[]) {
  if (!source) return undefined;

  for (const key of keys) {
    const value = source[key];
    if (isRecord(value)) return value;
  }

  return undefined;
}

function readArray(source: unknown, keys: string[] = []) {
  if (Array.isArray(source)) return source;
  if (!isRecord(source)) return [];

  for (const key of keys) {
    const value = source[key];
    if (Array.isArray(value)) return value;
  }

  return [];
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

function readNumber(source: UnknownRecord | undefined, keys: string[], fallback = 0) {
  if (!source) return fallback;

  for (const key of keys) {
    const value = source[key];
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string") {
      const parsed = Number(value.replace("%", ""));
      if (Number.isFinite(parsed)) return parsed;
    }
  }

  return fallback;
}

function firstDataItem(raw: unknown) {
  const rows = readArray(raw, ["data", "matches", "results"]);
  return rows.find(isRecord) ?? (isRecord(raw) ? raw : undefined);
}

function isSafeExternalUrl(url: string) {
  return /^https:\/\//i.test(url);
}

function parseScore(score: unknown) {
  if (typeof score !== "string") return {};
  const [home, visitor] = score.split("-").map((part) => Number(part.trim()));
  return {
    homeScore: Number.isFinite(home) ? home : undefined,
    visitorScore: Number.isFinite(visitor) ? visitor : undefined
  };
}

export function normalizeTeamNameForCompare(name: string) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\b(the|nba|basketball|club)\b/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function namesLikelyMatch(a: string, b: string) {
  const first = normalizeTeamNameForCompare(a);
  const second = normalizeTeamNameForCompare(b);

  if (!first || !second) return false;
  if (first === second) return true;
  if (first.includes(second) || second.includes(first)) return true;

  const firstParts = new Set(first.split(" "));
  const secondParts = second.split(" ");
  return secondParts.some((part) => part.length > 2 && firstParts.has(part));
}

export function normalizeHighlightlyHighlights(raw: unknown): GameHighlight[] {
  const rows = readArray(raw, ["data", "highlights", "results"]);
  const highlights: GameHighlight[] = [];

  rows.filter(isRecord).forEach((highlight, index) => {
    const videoUrl = readString(highlight, ["videoUrl", "url", "video", "href"], "");
    if (!videoUrl || !isSafeExternalUrl(videoUrl)) return;

    highlights.push({
      id: readString(highlight, ["id"], `highlight-${index}`),
      title: readString(highlight, ["title", "name"], "Melhor momento da partida"),
      description: readString(highlight, ["description", "summary"], undefined),
      thumbnailUrl: readString(highlight, ["thumbnailUrl", "thumbnail", "image", "imgUrl"], undefined),
      videoUrl,
      embedUrl: readString(highlight, ["embedUrl", "embed"], undefined),
      source: "highlightly",
      publishedAt: readString(highlight, ["publishedAt", "date", "createdAt"], undefined),
      isEmbeddable: Boolean(highlight.embeddable ?? readString(highlight, ["embedUrl", "embed"], ""))
    });
  });

  return highlights;
}

export function normalizeHighlightlyPrediction(raw: unknown): GamePrediction | null {
  const root = firstDataItem(raw);
  if (!root) return null;

  const predictions = readRecord(root, ["predictions"]) ?? root;
  const live = readArray(predictions, ["live"]).filter(isRecord);
  const prematch = readArray(predictions, ["prematch"]).filter(isRecord);
  const prediction = live[0] ?? prematch[0] ?? predictions;
  if (!isRecord(prediction)) return null;

  const probabilities = readRecord(prediction, ["probabilities"]) ?? readRecord(prediction, ["prediction"]);

  const homeWinProbability =
    readNumber(prediction, ["homeWinProbability"], NaN) ||
    readNumber(probabilities, ["home"], NaN);
  const visitorWinProbability =
    readNumber(prediction, ["visitorWinProbability", "awayWinProbability"], NaN) ||
    readNumber(probabilities, ["away", "visitor"], NaN);
  const drawProbability =
    readNumber(prediction, ["drawProbability"], NaN) ||
    readNumber(probabilities, ["draw"], NaN);

  if (![homeWinProbability, visitorWinProbability, drawProbability].some(Number.isFinite)) return null;

  return {
    source: "highlightly",
    homeWinProbability: Number.isFinite(homeWinProbability) ? homeWinProbability : undefined,
    visitorWinProbability: Number.isFinite(visitorWinProbability) ? visitorWinProbability : undefined,
    drawProbability: Number.isFinite(drawProbability) ? drawProbability : undefined,
    summary: readString(prediction, ["summary", "description"], undefined)
  };
}

export function normalizeHighlightlyHeadToHead(raw: unknown): HeadToHeadSummary | null {
  const rows = readArray(raw, ["data", "matches", "results"]).filter(isRecord);
  if (!rows.length) return null;

  return {
    source: "highlightly",
    totalGames: rows.length,
    lastMeetings: rows.slice(0, 10).map((match, index) => {
      const homeTeam = readRecord(match, ["homeTeam"]);
      const awayTeam = readRecord(match, ["awayTeam"]);
      const state = readRecord(match, ["state"]);
      const score = readRecord(state, ["score"]);
      const parsedScore = parseScore(score?.current);

      return {
        id: readString(match, ["id"], `h2h-${index}`),
        date: readString(match, ["date"], ""),
        homeTeam: readString(homeTeam, ["name"], "Mandante"),
        visitorTeam: readString(awayTeam, ["name"], "Visitante"),
        homeScore: parsedScore.homeScore,
        visitorScore: parsedScore.visitorScore
      };
    })
  };
}

export function normalizeHighlightlyLastFiveGames(
  raw: unknown,
  teamId?: string,
  teamName = "Time"
): TeamRecentForm | null {
  const rows = readArray(raw, ["data", "matches", "results"]).filter(isRecord);
  if (!rows.length) return null;

  const games = rows.slice(0, 5).map((match, index) => {
    const homeTeam = readRecord(match, ["homeTeam"]);
    const awayTeam = readRecord(match, ["awayTeam"]);
    const state = readRecord(match, ["state"]);
    const score = readRecord(state, ["score"]);
    const parsedScore = parseScore(score?.current);
    const homeId = readString(homeTeam, ["id"], "");
    const isHome = teamId ? homeId === teamId : namesLikelyMatch(readString(homeTeam, ["name"], ""), teamName);
    const teamScore = isHome ? parsedScore.homeScore : parsedScore.visitorScore;
    const opponentScore = isHome ? parsedScore.visitorScore : parsedScore.homeScore;
    const hasResult = teamScore !== undefined && opponentScore !== undefined;

    return {
      id: readString(match, ["id"], `last-five-${index}`),
      date: readString(match, ["date"], ""),
      opponent: isHome ? readString(awayTeam, ["name"], "Adversário") : readString(homeTeam, ["name"], "Adversário"),
      result: hasResult ? (teamScore > opponentScore ? "W" as const : "L" as const) : "-" as const,
      homeAway: isHome ? "home" as const : "away" as const,
      score: hasResult ? `${teamScore} - ${opponentScore}` : undefined
    };
  });

  return {
    teamId: teamId ?? teamName,
    teamName,
    games
  };
}

export function normalizeHighlightlyStandings(raw: unknown): StandingTeam[] {
  const root = isRecord(raw) ? raw : {};
  const groups = readArray(root, ["groups"]).filter(isRecord);
  const standings = groups.flatMap((group) => readArray(group, ["standings"]).filter(isRecord));

  return standings.map((standing, index) => {
    const team = readRecord(standing, ["team"]);
    const wins = readNumber(standing, ["wins"], 0);
    const losses = readNumber(standing, ["loses", "losses"], 0);
    const total = wins + losses;

    return {
      id: readString(team, ["id"], `highlightly-${index}`),
      rank: readNumber(standing, ["position", "rank"], index + 1),
      name: readString(team, ["name"], "Equipe"),
      fullName: readString(team, ["name"], "Equipe"),
      abbreviation: readString(team, ["shortName", "abbreviation"], readString(team, ["name"], "NBA").slice(0, 3).toUpperCase()),
      logoUrl: readString(team, ["logo"], undefined),
      conference: readString(standing, ["conference"], "-"),
      division: readString(standing, ["division"], "-"),
      wins,
      losses,
      winPercentage: total ? (wins / total).toFixed(3) : "-",
      gamesBehind: readString(standing, ["gamesBehind"], "-"),
      lastTen: readString(standing, ["lastTen"], "-"),
      streak: readString(standing, ["streak"], "-"),
      homeRecord: readString(standing, ["homeRecord"], "-"),
      awayRecord: readString(standing, ["awayRecord"], "-")
    };
  });
}
