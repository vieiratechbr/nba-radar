export type TeamTheme = {
  abbreviation: string;
  name: string;
  primary: string;
  secondary: string;
  accent?: string;
  textOnPrimary?: string;
};

export const DEFAULT_THEME: TeamTheme = {
  abbreviation: "NBA",
  name: "NBA Radar",
  primary: "#D71920",
  secondary: "#101116",
  accent: "#FFFFFF",
  textOnPrimary: "#FFFFFF"
};

export const NBA_TEAM_THEMES: Record<string, TeamTheme> = {
  ATL: { abbreviation: "ATL", name: "Atlanta Hawks", primary: "#E03A3E", secondary: "#C1D32F", accent: "#26282A", textOnPrimary: "#FFFFFF" },
  BOS: { abbreviation: "BOS", name: "Boston Celtics", primary: "#007A33", secondary: "#BA9653", accent: "#FFFFFF", textOnPrimary: "#FFFFFF" },
  BKN: { abbreviation: "BKN", name: "Brooklyn Nets", primary: "#000000", secondary: "#FFFFFF", accent: "#777777", textOnPrimary: "#FFFFFF" },
  CHA: { abbreviation: "CHA", name: "Charlotte Hornets", primary: "#1D1160", secondary: "#00788C", accent: "#A1A1A4", textOnPrimary: "#FFFFFF" },
  CHI: { abbreviation: "CHI", name: "Chicago Bulls", primary: "#CE1141", secondary: "#000000", accent: "#FFFFFF", textOnPrimary: "#FFFFFF" },
  CLE: { abbreviation: "CLE", name: "Cleveland Cavaliers", primary: "#860038", secondary: "#FDBB30", accent: "#041E42", textOnPrimary: "#FFFFFF" },
  DAL: { abbreviation: "DAL", name: "Dallas Mavericks", primary: "#00538C", secondary: "#002B5E", accent: "#B8C4CA", textOnPrimary: "#FFFFFF" },
  DEN: { abbreviation: "DEN", name: "Denver Nuggets", primary: "#0E2240", secondary: "#FEC524", accent: "#8B2131", textOnPrimary: "#FFFFFF" },
  DET: { abbreviation: "DET", name: "Detroit Pistons", primary: "#C8102E", secondary: "#1D42BA", accent: "#BEC0C2", textOnPrimary: "#FFFFFF" },
  GSW: { abbreviation: "GSW", name: "Golden State Warriors", primary: "#1D428A", secondary: "#FFC72C", accent: "#FFFFFF", textOnPrimary: "#FFFFFF" },
  HOU: { abbreviation: "HOU", name: "Houston Rockets", primary: "#CE1141", secondary: "#000000", accent: "#C4CED4", textOnPrimary: "#FFFFFF" },
  IND: { abbreviation: "IND", name: "Indiana Pacers", primary: "#002D62", secondary: "#FDBB30", accent: "#BEC0C2", textOnPrimary: "#FFFFFF" },
  LAC: { abbreviation: "LAC", name: "LA Clippers", primary: "#C8102E", secondary: "#1D428A", accent: "#BEC0C2", textOnPrimary: "#FFFFFF" },
  LAL: { abbreviation: "LAL", name: "Los Angeles Lakers", primary: "#552583", secondary: "#FDB927", accent: "#000000", textOnPrimary: "#FFFFFF" },
  MEM: { abbreviation: "MEM", name: "Memphis Grizzlies", primary: "#5D76A9", secondary: "#12173F", accent: "#F5B112", textOnPrimary: "#FFFFFF" },
  MIA: { abbreviation: "MIA", name: "Miami Heat", primary: "#98002E", secondary: "#F9A01B", accent: "#000000", textOnPrimary: "#FFFFFF" },
  MIL: { abbreviation: "MIL", name: "Milwaukee Bucks", primary: "#00471B", secondary: "#EEE1C6", accent: "#0077C0", textOnPrimary: "#FFFFFF" },
  MIN: { abbreviation: "MIN", name: "Minnesota Timberwolves", primary: "#0C2340", secondary: "#78BE20", accent: "#236192", textOnPrimary: "#FFFFFF" },
  NOP: { abbreviation: "NOP", name: "New Orleans Pelicans", primary: "#0C2340", secondary: "#C8102E", accent: "#85714D", textOnPrimary: "#FFFFFF" },
  NYK: { abbreviation: "NYK", name: "New York Knicks", primary: "#006BB6", secondary: "#F58426", accent: "#BEC0C2", textOnPrimary: "#FFFFFF" },
  OKC: { abbreviation: "OKC", name: "Oklahoma City Thunder", primary: "#007AC1", secondary: "#EF3B24", accent: "#FDBB30", textOnPrimary: "#FFFFFF" },
  ORL: { abbreviation: "ORL", name: "Orlando Magic", primary: "#0077C0", secondary: "#C4CED4", accent: "#000000", textOnPrimary: "#FFFFFF" },
  PHI: { abbreviation: "PHI", name: "Philadelphia 76ers", primary: "#006BB6", secondary: "#ED174C", accent: "#002B5C", textOnPrimary: "#FFFFFF" },
  PHX: { abbreviation: "PHX", name: "Phoenix Suns", primary: "#1D1160", secondary: "#E56020", accent: "#000000", textOnPrimary: "#FFFFFF" },
  POR: { abbreviation: "POR", name: "Portland Trail Blazers", primary: "#E03A3E", secondary: "#000000", accent: "#FFFFFF", textOnPrimary: "#FFFFFF" },
  SAC: { abbreviation: "SAC", name: "Sacramento Kings", primary: "#5A2D81", secondary: "#63727A", accent: "#000000", textOnPrimary: "#FFFFFF" },
  SAS: { abbreviation: "SAS", name: "San Antonio Spurs", primary: "#C4CED4", secondary: "#000000", accent: "#FFFFFF", textOnPrimary: "#000000" },
  TOR: { abbreviation: "TOR", name: "Toronto Raptors", primary: "#CE1141", secondary: "#000000", accent: "#A1A1A4", textOnPrimary: "#FFFFFF" },
  UTA: { abbreviation: "UTA", name: "Utah Jazz", primary: "#002B5C", secondary: "#00471B", accent: "#F9A01B", textOnPrimary: "#FFFFFF" },
  WAS: { abbreviation: "WAS", name: "Washington Wizards", primary: "#002B5C", secondary: "#E31837", accent: "#C4CED4", textOnPrimary: "#FFFFFF" }
};

export function hexToRgb(hex: string): string {
  const normalized = hex.replace("#", "");
  const value = normalized.length === 3
    ? normalized.split("").map((char) => `${char}${char}`).join("")
    : normalized;
  const numeric = Number.parseInt(value, 16);

  if (Number.isNaN(numeric)) return "215, 25, 32";

  return `${(numeric >> 16) & 255}, ${(numeric >> 8) & 255}, ${numeric & 255}`;
}

export function getTeamTheme(abbreviation?: string | null): TeamTheme {
  if (!abbreviation) return DEFAULT_THEME;
  return NBA_TEAM_THEMES[abbreviation.toUpperCase()] ?? DEFAULT_THEME;
}
