import type { GameDetails } from "@/types/gameDetails";
import { getHighlightlyMatches, type HighlightlyMatchCandidate } from "@/integrations/highlightly/highlightlyAdapter";
import { toInputDate } from "@/utils/formatNbaApiDate";

export const NBA_TEAM_ALIASES: Record<string, string[]> = {
  ATL: ["atlanta hawks", "hawks"],
  BOS: ["boston celtics", "celtics"],
  BKN: ["brooklyn nets", "nets"],
  CHA: ["charlotte hornets", "hornets"],
  CHI: ["chicago bulls", "bulls"],
  CLE: ["cleveland cavaliers", "cavaliers", "cavs"],
  DAL: ["dallas mavericks", "mavericks", "mavs"],
  DEN: ["denver nuggets", "nuggets"],
  DET: ["detroit pistons", "pistons"],
  GSW: ["golden state warriors", "warriors"],
  HOU: ["houston rockets", "rockets"],
  IND: ["indiana pacers", "pacers"],
  LAC: ["la clippers", "los angeles clippers", "clippers"],
  LAL: ["los angeles lakers", "la lakers", "lakers"],
  MEM: ["memphis grizzlies", "grizzlies"],
  MIA: ["miami heat", "heat"],
  MIL: ["milwaukee bucks", "bucks"],
  MIN: ["minnesota timberwolves", "timberwolves", "wolves"],
  NOP: ["new orleans pelicans", "pelicans"],
  NYK: ["new york knicks", "knicks"],
  OKC: ["oklahoma city thunder", "thunder"],
  ORL: ["orlando magic", "magic"],
  PHI: ["philadelphia 76ers", "sixers", "76ers"],
  PHX: ["phoenix suns", "suns"],
  POR: ["portland trail blazers", "trail blazers", "blazers"],
  SAC: ["sacramento kings", "kings"],
  SAS: ["san antonio spurs", "spurs"],
  TOR: ["toronto raptors", "raptors"],
  UTA: ["utah jazz", "jazz"],
  WAS: ["washington wizards", "wizards"]
};

type EspnTeamForLookup = {
  fullName: string;
  name: string;
  abbreviation: string;
};

export type HighlightlyMatchLookupDebug = {
  checkedDates: string[];
  candidatesCount: number;
  candidatesSample: {
    id: string;
    date?: string;
    leagueName?: string;
    homeTeam?: string;
    awayTeam?: string;
  }[];
  reason?: string;
};

export type HighlightlyMatchLookupResult = {
  match: HighlightlyMatchCandidate | null;
  debug: HighlightlyMatchLookupDebug;
};

export function normalizeTeamNameForCompare(name: string) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\b(the|nba|basketball|club|team)\b/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function getDateInTimeZone(date: string, timeZone: string) {
  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return "";

  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(parsedDate);
}

function createDateCandidates(date: string) {
  const parsedDate = new Date(date);
  const baseDates = [
    toInputDate(date),
    getDateInTimeZone(date, "America/New_York"),
    getDateInTimeZone(date, "America/Sao_Paulo"),
    getDateInTimeZone(date, "Etc/UTC")
  ].filter(Boolean);

  const nearbyDates = Number.isNaN(parsedDate.getTime())
    ? []
    : [-3, -2, -1, 0, 1, 2, 3].map((days) => {
        const nextDate = new Date(parsedDate);
        nextDate.setUTCDate(nextDate.getUTCDate() + days);
        return getDateInTimeZone(nextDate.toISOString(), "America/New_York");
      });

  return Array.from(new Set([...baseDates, ...nearbyDates].filter(Boolean)));
}

function aliasesForTeam(team: EspnTeamForLookup) {
  const aliases = [
    team.fullName,
    team.name,
    team.abbreviation,
    ...(NBA_TEAM_ALIASES[team.abbreviation.toUpperCase()] ?? [])
  ];

  return Array.from(new Set(aliases.map(normalizeTeamNameForCompare).filter(Boolean)));
}

function teamMatches(espnTeam: EspnTeamForLookup, highlightlyName?: string) {
  const normalizedHighlightlyName = normalizeTeamNameForCompare(highlightlyName ?? "");
  if (!normalizedHighlightlyName) return false;

  return aliasesForTeam(espnTeam).some((alias) => {
    if (alias === normalizedHighlightlyName) return true;
    if (alias.includes(normalizedHighlightlyName) || normalizedHighlightlyName.includes(alias)) return true;

    const aliasTokens = new Set(alias.split(" ").filter((token) => token.length > 2));
    return normalizedHighlightlyName
      .split(" ")
      .some((token) => token.length > 2 && aliasTokens.has(token));
  });
}

function matchPair(game: GameDetails, candidate: HighlightlyMatchCandidate) {
  const normalOrder =
    teamMatches(game.homeTeam, candidate.homeTeam?.name) &&
    teamMatches(game.visitorTeam, candidate.awayTeam?.name);
  const swappedOrder =
    teamMatches(game.homeTeam, candidate.awayTeam?.name) &&
    teamMatches(game.visitorTeam, candidate.homeTeam?.name);

  return normalOrder || swappedOrder;
}

function sampleCandidates(candidates: HighlightlyMatchCandidate[]) {
  return candidates.slice(0, 8).map((candidate) => ({
    id: candidate.id,
    date: candidate.date,
    leagueName: candidate.leagueName,
    homeTeam: candidate.homeTeam?.name,
    awayTeam: candidate.awayTeam?.name
  }));
}

export async function findHighlightlyMatchByEspnGameWithDebug(
  gameDetails: GameDetails
): Promise<HighlightlyMatchLookupResult> {
  const checkedDates = createDateCandidates(gameDetails.date);
  let allCandidates: HighlightlyMatchCandidate[] = [];

  for (const date of checkedDates) {
    const nbaCandidates = await getHighlightlyMatches({ date, leagueName: "NBA", limit: 100 });
    allCandidates = [...allCandidates, ...nbaCandidates];

    const nbaMatch = nbaCandidates.find((candidate) => matchPair(gameDetails, candidate));
    if (nbaMatch) {
      return {
        match: nbaMatch,
        debug: {
          checkedDates,
          candidatesCount: allCandidates.length,
          candidatesSample: sampleCandidates(allCandidates)
        }
      };
    }

    if (nbaCandidates.length === 0) {
      const broadCandidates = await getHighlightlyMatches({ date, limit: 100 });
      allCandidates = [...allCandidates, ...broadCandidates];

      const broadMatch = broadCandidates.find((candidate) => matchPair(gameDetails, candidate));
      if (broadMatch) {
        return {
          match: broadMatch,
          debug: {
            checkedDates,
            candidatesCount: allCandidates.length,
            candidatesSample: sampleCandidates(allCandidates)
          }
        };
      }
    }
  }

  return {
    match: null,
    debug: {
      checkedDates,
      candidatesCount: allCandidates.length,
      candidatesSample: sampleCandidates(allCandidates),
      reason: "Não foi possível mapear ESPN event.id para Highlightly matchId."
    }
  };
}

export async function findHighlightlyMatchByEspnGame(gameDetails: GameDetails) {
  const result = await findHighlightlyMatchByEspnGameWithDebug(gameDetails);
  return result.match;
}
