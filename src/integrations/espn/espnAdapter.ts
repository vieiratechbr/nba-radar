import { espnFetch } from "@/integrations/espn/espnClient";
import { espnEndpoints } from "@/integrations/espn/espnEndpoints";
import {
  normalizeEspnGames,
  normalizeEspnNews,
  normalizeEspnStandings,
  normalizeEspnTeams
} from "@/integrations/espn/espnNormalizers";
import { formatNbaApiDate, getNbaTodayDate } from "@/utils/formatNbaApiDate";

export async function getEspnScoreboardByDate(date?: Date | string) {
  const result = await getRawEspnScoreboard(date ?? getNbaTodayDate());
  return normalizeEspnGames(result.data);
}

export async function getEspnTodayGames() {
  return getEspnScoreboardByDate(getNbaTodayDate());
}

export async function getEspnLiveGames() {
  const games = await getEspnTodayGames();
  return games.filter((game) => game.status === "live");
}

export async function getEspnGameSummary(eventId: string) {
  const url = new URL(espnEndpoints.nbaSummary);
  url.searchParams.set("event", eventId);

  return espnFetch(url.toString(), { revalidate: 30 });
}

export async function getEspnNews() {
  const raw = await espnFetch(espnEndpoints.nbaNews, { revalidate: 300 });
  return normalizeEspnNews(raw);
}

export async function getEspnTeams() {
  const raw = await espnFetch(espnEndpoints.nbaTeams, { revalidate: 3600 });
  return normalizeEspnTeams(raw);
}

export async function getEspnStandings() {
  try {
    const raw = await espnFetch(espnEndpoints.nbaStandings, { revalidate: 3600 });
    return normalizeEspnStandings(raw);
  } catch {
    const raw = await espnFetch(espnEndpoints.nbaStandingsAlt, { revalidate: 3600 });
    return normalizeEspnStandings(raw);
  }
}

export async function getRawEspnScoreboard(date?: Date | string) {
  const formattedDate = formatNbaApiDate(date ?? getNbaTodayDate());
  const url = new URL(espnEndpoints.nbaScoreboard);
  url.searchParams.set("dates", formattedDate);

  return {
    requestedDate: formattedDate,
    url: url.toString(),
    data: await espnFetch(url.toString(), { revalidate: 60 })
  };
}

export async function getRawEspnNews() {
  return espnFetch(espnEndpoints.nbaNews, { revalidate: 300 });
}
