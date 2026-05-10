import type { AwardWinner } from "@/types/award";
import { getPlayerImageUrl } from "@/utils/playerImages";

const espnAwardsBaseUrl = "https://www.espn.com/nba/history/awards/_/year";

export const primaryAwardNames = [
  "MVP",
  "Rookie of the Year",
  "Defensive Player of the Year",
  "Sixth Man of the Year",
  "Most Improved Player",
  "Coach of the Year",
  "Finals MVP",
  "Clutch Player of the Year"
];

const teamNamesByAbbreviation: Record<string, string> = {
  ATL: "Atlanta Hawks",
  BOS: "Boston Celtics",
  BKN: "Brooklyn Nets",
  CHA: "Charlotte Hornets",
  CHI: "Chicago Bulls",
  CLE: "Cleveland Cavaliers",
  DAL: "Dallas Mavericks",
  DEN: "Denver Nuggets",
  DET: "Detroit Pistons",
  GSW: "Golden State Warriors",
  HOU: "Houston Rockets",
  IND: "Indiana Pacers",
  LAC: "LA Clippers",
  LAL: "Los Angeles Lakers",
  MEM: "Memphis Grizzlies",
  MIA: "Miami Heat",
  MIL: "Milwaukee Bucks",
  MIN: "Minnesota Timberwolves",
  NO: "New Orleans Pelicans",
  NOP: "New Orleans Pelicans",
  NY: "New York Knicks",
  NYK: "New York Knicks",
  OKC: "Oklahoma City Thunder",
  ORL: "Orlando Magic",
  PHI: "Philadelphia 76ers",
  PHX: "Phoenix Suns",
  POR: "Portland Trail Blazers",
  SA: "San Antonio Spurs",
  SAS: "San Antonio Spurs",
  SAC: "Sacramento Kings",
  TOR: "Toronto Raptors",
  UTA: "Utah Jazz",
  WAS: "Washington Wizards"
};

function decodeHtml(value: string) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function stripTags(value: string) {
  return decodeHtml(value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim());
}

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function yearToSeason(year: number) {
  return `${year - 1}-${String(year).slice(-2)}`;
}

export function seasonToEspnAwardsYear(season?: string | null) {
  if (!season) return undefined;

  const match = season.match(/^(\d{4})-(\d{2})$/);
  if (!match) return undefined;

  const century = match[1].slice(0, 2);
  return Number(`${century}${match[2]}`);
}

function inferYearFromHtml(html: string) {
  const match = html.match(/NBA History - (\d{4}) Awards/i);
  return match ? Number(match[1]) : new Date().getFullYear();
}

function getPlayerIdFromHref(cellHtml: string) {
  return cellHtml.match(/\/id\/(\d+)\//)?.[1];
}

function getTeamFromRecipient(cellHtml: string) {
  const withoutAnchor = cellHtml.replace(/<a[\s\S]*?<\/a>/i, "");
  const text = stripTags(withoutAnchor).replace(/^,/, "").trim();
  const abbreviation = text.split(/\s+/)[0]?.replace(/[^A-Z]/g, "");
  if (!abbreviation) return undefined;
  return teamNamesByAbbreviation[abbreviation] ?? abbreviation;
}

function getCells(rowHtml: string) {
  return Array.from(rowHtml.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)).map((match) => match[1]);
}

function createAwardSummary(statsCell: string) {
  const stats = stripTags(statsCell);
  return stats ? `Estatísticas ESPN: ${stats}.` : "Vencedor listado no histórico de prêmios da ESPN.";
}

export function completePrimaryAwards(awards: AwardWinner[], season: string) {
  const existingAwards = new Set(awards.map((award) => award.award));
  const pendingAwards = primaryAwardNames
    .filter((award) => !existingAwards.has(award))
    .map((award) => ({
      id: `${season}-${slugify(award)}`,
      season,
      award,
      playerName: "A definir",
      status: "pending" as const,
      summary: "Vencedor ainda não encontrado na fonte online.",
      source: "espn" as const
    }));

  return [...awards, ...pendingAwards].sort((a, b) => {
    const first = primaryAwardNames.indexOf(a.award);
    const second = primaryAwardNames.indexOf(b.award);
    const normalizedFirst = first === -1 ? primaryAwardNames.length : first;
    const normalizedSecond = second === -1 ? primaryAwardNames.length : second;
    return normalizedFirst - normalizedSecond || a.award.localeCompare(b.award);
  });
}

export function parseEspnAwardsHtml(html: string, explicitYear?: number): AwardWinner[] {
  const year = explicitYear ?? inferYearFromHtml(html);
  const season = yearToSeason(year);
  const tableMatch = html.match(/<table[^>]*class="tablehead"[\s\S]*?<\/table>/i);
  if (!tableMatch) return [];

  const rowMatches = Array.from(tableMatch[0].matchAll(/<tr class="(?:oddrow|evenrow)">([\s\S]*?)(?=<tr class=|<\/table>)/gi));

  return rowMatches.flatMap((match) => {
    const cells = getCells(match[1]);
    if (cells.length < 2) return [];

    const award = stripTags(cells[0]);
    const recipientCell = cells[1];
    const playerName = stripTags(recipientCell.match(/<a[^>]*>([\s\S]*?)<\/a>/i)?.[1] ?? "");
    if (!award || !playerName) return [];

    const playerId = getPlayerIdFromHref(recipientCell);
    const imageUrl = playerId
      ? `https://a.espncdn.com/i/headshots/nba/players/full/${playerId}.png`
      : getPlayerImageUrl(playerName);

    return [{
      id: `${season}-${slugify(award)}-${slugify(playerName)}`,
      season,
      award,
      playerName,
      team: getTeamFromRecipient(recipientCell),
      imageUrl: getPlayerImageUrl(playerName, imageUrl),
      summary: createAwardSummary(cells[2] ?? ""),
      status: "confirmed" as const,
      source: "espn" as const
    }];
  });
}

export async function getEspnAwardsHtmlByYear(year: number) {
  const response = await fetch(`${espnAwardsBaseUrl}/${year}`, {
    headers: {
      Accept: "text/html"
    },
    next: {
      revalidate: 60 * 60 * 12
    }
  });

  if (!response.ok) {
    throw new Error(`ESPN awards error ${response.status}`);
  }

  return response.text();
}

export async function getEspnAwardsByYear(year: number) {
  const html = await getEspnAwardsHtmlByYear(year);
  const parsedAwards = parseEspnAwardsHtml(html, year);
  return completePrimaryAwards(parsedAwards, yearToSeason(year));
}
