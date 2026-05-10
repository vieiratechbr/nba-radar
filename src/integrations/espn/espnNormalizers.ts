import type { Game, GameStatus, TeamSide } from "@/types/game";
import type {
  GameDetails,
  GameLeader,
  GamePlay,
  PlayerBoxScore,
  TeamStatGroup
} from "@/types/gameDetails";
import type { NewsArticle } from "@/types/news";
import type { StandingTeam } from "@/types/standing";
import type { Team } from "@/types/team";
import { formatGameTimeBrasilia } from "@/utils/formatGameTime";
import { translatePlayText } from "@/utils/translatePlayText";

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

function readArray(source: UnknownRecord | undefined, keys: string[]) {
  if (!source) return [];

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
      const parsed = Number(value);
      if (Number.isFinite(parsed)) return parsed;
    }
  }

  return fallback;
}

function readLogo(team: UnknownRecord | undefined) {
  const logo = readString(team, ["logo"], "");
  if (logo) return logo;

  const logos = readArray(team, ["logos"]);
  const firstLogo = logos.find(isRecord);
  return readString(firstLogo, ["href", "url"], undefined);
}

function statMatches(stat: UnknownRecord, names: string[]) {
  const variants = [
    readString(stat, ["name"], ""),
    readString(stat, ["type"], ""),
    readString(stat, ["abbreviation"], ""),
    readString(stat, ["shortDisplayName"], ""),
    readString(stat, ["displayName"], "")
  ].map((value) => value.toLowerCase().replace(/[\s._-]/g, ""));

  return names.some((name) => variants.includes(name.toLowerCase().replace(/[\s._-]/g, "")));
}

function getStat(stats: UnknownRecord[], names: string[], field: "display" | "value" = "display") {
  const stat = stats.find((candidate) => statMatches(candidate, names));
  if (!stat) return undefined;

  if (field === "value") {
    const value = readNumber(stat, ["value"], NaN);
    return Number.isFinite(value) ? value : undefined;
  }

  return readString(stat, ["displayValue", "summary"], undefined);
}

function displayStat(value: string | number | undefined) {
  return value === undefined ? undefined : String(value);
}

function normalizeConference(value: string) {
  const normalized = value.toLowerCase();
  if (normalized.includes("east") || normalized.includes("leste")) return "Leste";
  if (normalized.includes("west") || normalized.includes("oeste")) return "Oeste";
  return value || undefined;
}

function normalizeStatus(status: UnknownRecord | undefined): GameStatus {
  const type = readRecord(status, ["type"]);
  const state = readString(type, ["state"], "").toLowerCase();
  const name = readString(type, ["name", "shortDetail", "detail", "description"], "").toLowerCase();
  const completed = Boolean(status?.completed || type?.completed);

  if (completed || state === "post" || name.includes("final")) return "final";
  if (state === "in" || name.includes("progress") || name.includes("halftime")) return "live";

  return "scheduled";
}

function normalizeTeamSide(competitor: UnknownRecord | undefined, fallback: string): TeamSide {
  const team = readRecord(competitor, ["team"]);
  const displayName = readString(team, ["displayName", "name"], fallback);
  const shortName = readString(team, ["shortDisplayName", "name"], displayName);

  return {
    id: readString(team, ["id"], undefined),
    name: shortName,
    fullName: displayName,
    abbreviation: readString(team, ["abbreviation"], shortName.slice(0, 3).toUpperCase()),
    score: readNumber(competitor, ["score"], 0),
    logoUrl: readLogo(team),
    color: readString(team, ["color"], undefined)
  };
}

export function normalizeEspnGame(event: unknown): Game {
  const rawEvent = isRecord(event) ? event : {};
  const competitions = readArray(rawEvent, ["competitions"]).filter(isRecord);
  const competition = competitions[0];
  const competitors = readArray(competition, ["competitors"]).filter(isRecord);
  const status = readRecord(competition, ["status"]) ?? readRecord(rawEvent, ["status"]);
  const venue = readRecord(competition, ["venue"]);
  const address = readRecord(venue, ["address"]);
  const home = competitors.find((competitor) => readString(competitor, ["homeAway"], "") === "home");
  const away = competitors.find((competitor) => readString(competitor, ["homeAway"], "") === "away");
  const homeTeam = normalizeTeamSide(home, "Home");
  const visitorTeam = normalizeTeamSide(away, "Away");
  const date = readString(rawEvent, ["date"], new Date().toISOString());
  const statusType = readRecord(status, ["type"]);
  const gameStatus = normalizeStatus(status);

  return {
    id: readString(rawEvent, ["id", "uid"], `${homeTeam.abbreviation}-${visitorTeam.abbreviation}-${date}`),
    date,
    status: gameStatus,
    period: readNumber(status, ["period"], 0) || undefined,
    clock: readString(status, ["displayClock"], undefined),
    time: gameStatus === "scheduled"
      ? formatGameTimeBrasilia(date)
      : readString(statusType, ["shortDetail", "detail"], undefined),
    homeTeam,
    visitorTeam,
    arena: readString(venue, ["fullName"], undefined),
    city: readString(address, ["city"], undefined),
    highlight: readString(rawEvent, ["shortName", "name"], "Dados via ESPN"),
    source: "espn"
  };
}

export function normalizeEspnGames(raw: unknown): Game[] {
  if (!isRecord(raw)) return [];
  const events = readArray(raw, ["events"]).filter(isRecord);
  return events.map(normalizeEspnGame);
}

function readTeamRecord(competitor: UnknownRecord | undefined) {
  const records = readArray(competitor, ["records"]).filter(isRecord);
  const overall = records.find(
    (record) => readString(record, ["type"], "").toLowerCase() === "total"
  );
  return readString(overall ?? records[0], ["summary", "displayValue"], undefined);
}

function normalizeDetailsTeamSide(
  competitor: UnknownRecord | undefined,
  fallback: string
): GameDetails["homeTeam"] {
  return {
    ...normalizeTeamSide(competitor, fallback),
    record: readTeamRecord(competitor)
  };
}

function normalizeLinescore(
  home: UnknownRecord | undefined,
  away: UnknownRecord | undefined
): GameDetails["linescore"] {
  const homeLines = readArray(home, ["linescores"]).filter(isRecord);
  const awayLines = readArray(away, ["linescores"]).filter(isRecord);
  const length = Math.max(homeLines.length, awayLines.length);

  return Array.from({ length }, (_, index) => {
    const homeLine = homeLines[index];
    const awayLine = awayLines[index];
    const label = readString(homeLine ?? awayLine, ["displayValue", "period"], `${index + 1}`);

    return {
      period: /^\d+$/.test(label) ? `${label}Q` : label,
      homeScore: readNumber(homeLine, ["value", "score"], 0),
      visitorScore: readNumber(awayLine, ["value", "score"], 0)
    };
  });
}

function normalizeLeaders(raw: UnknownRecord): GameLeader[] {
  const teamLeaders = readArray(raw, ["leaders"]).filter(isRecord);

  return teamLeaders.flatMap((teamLeader) => {
    const team = readRecord(teamLeader, ["team"]);
    const teamName = readString(team, ["abbreviation", "displayName"], "NBA");
    const categories = readArray(teamLeader, ["leaders"]).filter(isRecord);

    return categories.flatMap((category) => {
      const leaderRows = readArray(category, ["leaders"]).filter(isRecord);
      const categoryName = readString(category, ["displayName", "name"], "Líder");

      return leaderRows.slice(0, 1).map((leader) => {
        const athlete = readRecord(leader, ["athlete"]);
        const headshot = readRecord(athlete, ["headshot"]);
        const mainStat = readRecord(leader, ["mainStat"]);

        return {
          team: teamName,
          athleteName: readString(athlete, ["displayName", "fullName"], "Atleta"),
          athleteShortName: readString(athlete, ["shortName"], undefined),
          athleteHeadshot: readString(headshot, ["href"], undefined),
          category: categoryName,
          value: readString(mainStat, ["value"], readString(leader, ["displayValue"], "-"))
        };
      });
    });
  });
}

const preferredTeamStats = new Set([
  "FG",
  "Field Goal %",
  "3PT",
  "Three Point %",
  "FT",
  "Free Throw %",
  "Rebounds",
  "Assists",
  "Steals",
  "Blocks",
  "Turnovers",
  "Fouls"
]);

function normalizeTeamStats(raw: UnknownRecord): TeamStatGroup[] {
  const boxscore = readRecord(raw, ["boxscore"]);
  const teams = readArray(boxscore, ["teams"]).filter(isRecord);

  return teams.map((row) => {
    const team = readRecord(row, ["team"]);
    const statistics = readArray(row, ["statistics"]).filter(isRecord);

    return {
      team: readString(team, ["abbreviation", "displayName"], "NBA"),
      stats: statistics
        .map((stat) => {
          const label = readString(stat, ["label", "abbreviation", "name"], "Stat");
          return {
            label,
            value: readString(stat, ["displayValue"], "-")
          };
        })
        .filter((stat) => preferredTeamStats.has(stat.label))
    };
  });
}

function statByKey(keys: string[], stats: unknown[], key: string) {
  const index = keys.indexOf(key);
  if (index < 0) return undefined;
  const value = stats[index];
  if (typeof value === "string" || typeof value === "number") return value;
  return undefined;
}

function normalizePlayerStats(raw: UnknownRecord): PlayerBoxScore[] {
  const boxscore = readRecord(raw, ["boxscore"]);
  const playerGroups = readArray(boxscore, ["players"]).filter(isRecord);

  return playerGroups.flatMap((teamGroup) => {
    const team = readRecord(teamGroup, ["team"]);
    const teamName = readString(team, ["abbreviation", "displayName"], "NBA");
    const statGroups = readArray(teamGroup, ["statistics"]).filter(isRecord);

    return statGroups.flatMap((statGroup) => {
      const keys = readArray(statGroup, ["keys"]).map(String);
      const athletes = readArray(statGroup, ["athletes"]).filter(isRecord);

      return athletes.map((row) => {
        const athlete = readRecord(row, ["athlete"]);
        const position = readRecord(athlete, ["position"]);
        const stats = readArray(row, ["stats"]);

        return {
          team: teamName,
          athleteName: readString(athlete, ["displayName", "shortName"], "Atleta"),
          athleteId: readString(athlete, ["id"], undefined),
          position: readString(position, ["abbreviation", "displayName"], undefined),
          minutes: String(statByKey(keys, stats, "minutes") ?? ""),
          points: statByKey(keys, stats, "points"),
          rebounds: statByKey(keys, stats, "rebounds"),
          assists: statByKey(keys, stats, "assists"),
          steals: statByKey(keys, stats, "steals"),
          blocks: statByKey(keys, stats, "blocks"),
          turnovers: statByKey(keys, stats, "turnovers"),
          fieldGoals: String(statByKey(keys, stats, "fieldGoalsMade-fieldGoalsAttempted") ?? ""),
          threePointers: String(
            statByKey(keys, stats, "threePointFieldGoalsMade-threePointFieldGoalsAttempted") ?? ""
          ),
          freeThrows: String(statByKey(keys, stats, "freeThrowsMade-freeThrowsAttempted") ?? "")
        };
      });
    });
  });
}

function normalizePlays(
  raw: UnknownRecord,
  homeTeam: TeamSide,
  visitorTeam: TeamSide
): GamePlay[] {
  const plays = readArray(raw, ["plays"]).filter(isRecord);

  return plays
    .map((play, index) => {
      const period = readRecord(play, ["period"]);
      const clock = readRecord(play, ["clock"]);
      const team = readRecord(play, ["team"]);
      const homeScore = readNumber(play, ["homeScore"], NaN);
      const awayScore = readNumber(play, ["awayScore"], NaN);
      const hasScore = Number.isFinite(homeScore) && Number.isFinite(awayScore);
      const playType = readRecord(play, ["type"]);

      const originalText = readString(play, ["text", "shortDescription"], "Lance da partida");

      return {
        id: readString(play, ["id"], `play-${index}`),
        period: readNumber(period, ["number"], 0) || undefined,
        clock: readString(clock, ["displayValue"], undefined),
        team: readString(team, ["abbreviation", "displayName"], undefined),
        text: translatePlayText(originalText) || originalText,
        originalText,
        score: hasScore
          ? `${homeTeam.abbreviation} ${homeScore} - ${visitorTeam.abbreviation} ${awayScore}`
          : undefined,
        type: readString(playType, ["text"], undefined)
      };
    })
    .reverse();
}

export function normalizeEspnGameDetails(raw: unknown): GameDetails {
  const root = isRecord(raw) ? raw : {};
  const header = readRecord(root, ["header"]);
  const competitions = readArray(header, ["competitions"]).filter(isRecord);
  const competition = competitions[0] ?? {};
  const competitors = readArray(competition, ["competitors"]).filter(isRecord);
  const home = competitors.find((competitor) => readString(competitor, ["homeAway"], "") === "home");
  const away = competitors.find((competitor) => readString(competitor, ["homeAway"], "") === "away");
  const homeTeam = normalizeDetailsTeamSide(home, "Home");
  const visitorTeam = normalizeDetailsTeamSide(away, "Away");
  const status = readRecord(competition, ["status"]);
  const venue = readRecord(competition, ["venue"]);
  const address = readRecord(venue, ["address"]);

  return {
    id: readString(header, ["id"], readString(competition, ["id"], "espn-game")),
    name: readString(header, ["name"], `${visitorTeam.fullName} at ${homeTeam.fullName}`),
    shortName: readString(header, ["shortName"], undefined),
    date: readString(header, ["date"], readString(competition, ["date"], new Date().toISOString())),
    status: normalizeStatus(status),
    period: readNumber(status, ["period"], 0) || undefined,
    clock: readString(status, ["displayClock"], undefined),
    venue: readString(venue, ["fullName"], undefined),
    city: readString(address, ["city"], undefined),
    homeTeam,
    visitorTeam,
    linescore: normalizeLinescore(home, away),
    leaders: normalizeLeaders(root),
    teamStats: normalizeTeamStats(root),
    playerStats: normalizePlayerStats(root),
    plays: normalizePlays(root, homeTeam, visitorTeam),
    source: "espn"
  };
}

function readArticleUrl(article: UnknownRecord) {
  const links = readRecord(article, ["links"]);
  const web = readRecord(links, ["web"]);
  return readString(web, ["href"], readString(article, ["link", "url"], "#"));
}

function readArticleImage(article: UnknownRecord) {
  const images = readArray(article, ["images"]);
  const firstImage = images.find(isRecord);
  return readString(firstImage, ["url"], undefined);
}

export function normalizeEspnNews(raw: unknown): NewsArticle[] {
  if (!isRecord(raw)) return [];

  const rows = [...readArray(raw, ["articles"]), ...readArray(raw, ["headlines"])]
    .filter(isRecord);

  return rows.map((article, index) => {
    const publishedAt = readString(
      article,
      ["published", "lastModified"],
      new Date().toISOString()
    );

    return {
      id: readString(article, ["id"], `${publishedAt}-${index}`),
      title: readString(article, ["headline", "title"], "Notícia da NBA"),
      description: readString(article, ["description", "story"], "Resumo indisponível na fonte original."),
      summary: readString(article, ["description", "story"], "Resumo indisponível na fonte original."),
      source: readString(article, ["source"], "ESPN"),
      url: readArticleUrl(article),
      externalUrl: readArticleUrl(article),
      imageUrl: readArticleImage(article),
      publishedAt,
      date: publishedAt,
      category: "Destaques",
      sourceType: "api"
    };
  });
}

export function normalizeEspnTeams(raw: unknown): Team[] {
  if (!isRecord(raw)) return [];
  const sports = readArray(raw, ["sports"]).filter(isRecord);
  const leagues = sports.flatMap((sport) => readArray(sport, ["leagues"]).filter(isRecord));
  const teams = leagues.flatMap((league) => readArray(league, ["teams"]).filter(isRecord));

  return teams.map((row) => {
    const team = readRecord(row, ["team"]) ?? row;
    const displayName = readString(team, ["displayName", "name"], "Equipe NBA");
    const shortName = readString(team, ["shortDisplayName", "name"], displayName);

    return {
      id: readString(team, ["id"], readString(team, ["abbreviation"], shortName)),
      city: readString(team, ["location"], displayName.replace(shortName, "").trim() || displayName),
      name: shortName,
      fullName: displayName,
      abbreviation: readString(team, ["abbreviation"], shortName.slice(0, 3).toUpperCase()),
      conference: readString(team, ["conference"], undefined),
      division: readString(team, ["division"], undefined),
      logoUrl: readLogo(team),
      colors: {
        primary: `#${readString(team, ["color"], "d71920").replace("#", "")}`,
        secondary: `#${readString(team, ["alternateColor"], "2a2d37").replace("#", "")}`
      }
    };
  });
}

function readStandingEntries(raw: UnknownRecord) {
  const rows: { entry: UnknownRecord; conference?: string }[] = [];

  function collect(node: UnknownRecord | undefined, inheritedConference?: string) {
    if (!node) return;

    const nodeName = readString(node, ["name", "displayName", "shortName"], inheritedConference ?? "");
    const conference = normalizeConference(nodeName) ?? inheritedConference;
    const standings = readRecord(node, ["standings"]);
    const directEntries = readArray(node, ["entries"]).filter(isRecord);
    const standingEntries = readArray(standings, ["entries"]).filter(isRecord);

    [...directEntries, ...standingEntries].forEach((entry) => {
      rows.push({ entry, conference });
    });

    ["children", "groups", "standings"].forEach((key) => {
      readArray(node, [key]).filter(isRecord).forEach((child) => collect(child, conference));
    });
  }

  collect(raw);
  return rows;
}

export function normalizeEspnStandings(raw: unknown): StandingTeam[] {
  if (!isRecord(raw)) return [];

  const rows = readStandingEntries(raw);

  return rows
    .map(({ entry, conference }, index) => {
      const team = readRecord(entry, ["team"]) ?? entry;
      const stats = readArray(entry, ["stats", "statistics"]).filter(isRecord);
      const wins = getStat(stats, ["wins", "overallWins", "W"], "value") ?? 0;
      const losses = getStat(stats, ["losses", "overallLosses", "L"], "value") ?? 0;
      const seed = getStat(stats, ["playoffSeed", "rank", "position"], "value");
      const logos = readArray(team, ["logos"]).filter(isRecord);
      const firstLogo = logos[0];

      return {
        id: readString(team, ["id", "uid"], readString(team, ["abbreviation"], `team-${index}`)),
        rank: seed ? Number(seed) : index + 1,
        name: readString(team, ["shortDisplayName", "name"], "Equipe"),
        fullName: readString(team, ["displayName", "fullName"], "Equipe NBA"),
        abbreviation: readString(team, ["abbreviation"], "NBA"),
        logoUrl: readString(firstLogo, ["href", "url"], readLogo(team)),
        conference: conference ?? "-",
        division: "-",
        wins: Number(wins),
        losses: Number(losses),
        winPercentage: displayStat(getStat(stats, ["winPercent", "winPercentage", "pct"])),
        gamesBehind: displayStat(getStat(stats, ["gamesBehind", "gb"])),
        lastTen: displayStat(getStat(stats, ["lastTen", "lastTenRecord", "L10", "lastTenGames"])),
        streak: displayStat(getStat(stats, ["streak", "streakSummary", "STRK"])),
        homeRecord: displayStat(getStat(stats, ["home", "homeRecord", "HOME"])),
        awayRecord: displayStat(getStat(stats, ["away", "road", "awayRecord", "AWAY"]))
      };
    })
    .sort((a, b) => {
      const conferenceOrder = String(a.conference).localeCompare(String(b.conference));
      return conferenceOrder || a.rank - b.rank;
    });
}
