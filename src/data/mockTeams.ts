import type { Team } from "@/types/team";

export const mockTeams: Team[] = [
  {
    id: "chi",
    city: "Chicago",
    name: "Bulls",
    abbreviation: "CHI",
    conference: "East",
    record: "34-31",
    seed: 7,
    colors: { primary: "#ce1141", secondary: "#111111" }
  },
  {
    id: "bos",
    city: "Boston",
    name: "Celtics",
    abbreviation: "BOS",
    conference: "East",
    record: "48-17",
    seed: 1,
    colors: { primary: "#007a33", secondary: "#ffffff" }
  },
  {
    id: "lal",
    city: "Los Angeles",
    name: "Lakers",
    abbreviation: "LAL",
    conference: "West",
    record: "41-25",
    seed: 4,
    colors: { primary: "#552583", secondary: "#fdb927" }
  },
  {
    id: "gsw",
    city: "Golden State",
    name: "Warriors",
    abbreviation: "GSW",
    conference: "West",
    record: "37-29",
    seed: 6,
    colors: { primary: "#1d428a", secondary: "#ffc72c" }
  },
  {
    id: "nyk",
    city: "New York",
    name: "Knicks",
    abbreviation: "NYK",
    conference: "East",
    record: "40-25",
    seed: 4,
    colors: { primary: "#f58426", secondary: "#006bb6" }
  },
  {
    id: "mia",
    city: "Miami",
    name: "Heat",
    abbreviation: "MIA",
    conference: "East",
    record: "33-32",
    seed: 8,
    colors: { primary: "#98002e", secondary: "#000000" }
  },
  {
    id: "den",
    city: "Denver",
    name: "Nuggets",
    abbreviation: "DEN",
    conference: "West",
    record: "45-20",
    seed: 2,
    colors: { primary: "#0e2240", secondary: "#fec524" }
  },
  {
    id: "dal",
    city: "Dallas",
    name: "Mavericks",
    abbreviation: "DAL",
    conference: "West",
    record: "39-27",
    seed: 5,
    colors: { primary: "#00538c", secondary: "#b8c4ca" }
  },
  {
    id: "mil",
    city: "Milwaukee",
    name: "Bucks",
    abbreviation: "MIL",
    conference: "East",
    record: "43-23",
    seed: 2,
    colors: { primary: "#00471b", secondary: "#eee1c6" }
  },
  {
    id: "phx",
    city: "Phoenix",
    name: "Suns",
    abbreviation: "PHX",
    conference: "West",
    record: "36-30",
    seed: 7,
    colors: { primary: "#1d1160", secondary: "#e56020" }
  }
];

export function getTeamById(teamId: string) {
  return mockTeams.find((team) => team.id === teamId);
}
