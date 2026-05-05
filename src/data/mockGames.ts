import { mockTeams } from "@/data/mockTeams";
import type { Game, TeamSide } from "@/types/game";

function side(teamId: string, score = 0): TeamSide {
  const team = mockTeams.find((candidate) => candidate.id === teamId);

  return {
    id: teamId,
    name: team?.name ?? teamId.toUpperCase(),
    fullName: team?.fullName ?? `${team?.city ?? ""} ${team?.name ?? teamId.toUpperCase()}`.trim(),
    abbreviation: team?.abbreviation ?? teamId.toUpperCase(),
    score
  };
}

export const mockGames: Game[] = [
  {
    id: "game-chi-bos-1",
    date: "2026-05-03T21:30:00-03:00",
    day: "yesterday",
    homeTeamId: "chi",
    awayTeamId: "bos",
    homeScore: 112,
    awayScore: 108,
    homeTeam: side("chi", 112),
    visitorTeam: side("bos", 108),
    status: "final",
    time: "21:30",
    arena: "United Center",
    city: "Chicago",
    highlight: "Coby White - 27 pontos",
    featured: true,
    source: "mock"
  },
  {
    id: "game-lal-gsw-1",
    date: "2026-05-04T23:00:00-03:00",
    day: "today",
    homeTeamId: "lal",
    awayTeamId: "gsw",
    homeScore: 120,
    awayScore: 116,
    homeTeam: side("lal", 120),
    visitorTeam: side("gsw", 116),
    status: "live",
    period: 4,
    clock: "4º quarto",
    time: "23:00",
    arena: "Crypto.com Arena",
    city: "Los Angeles",
    highlight: "LeBron James - 31 pontos",
    featured: true,
    source: "mock"
  },
  {
    id: "game-nyk-mia-1",
    date: "2026-05-04T20:00:00-03:00",
    day: "today",
    homeTeamId: "nyk",
    awayTeamId: "mia",
    homeScore: 89,
    awayScore: 84,
    homeTeam: side("nyk", 89),
    visitorTeam: side("mia", 84),
    status: "live",
    period: 3,
    clock: "3º quarto",
    time: "20:00",
    arena: "Madison Square Garden",
    city: "New York",
    highlight: "Jalen Brunson controla o ritmo",
    source: "mock"
  },
  {
    id: "game-den-dal-1",
    date: "2026-05-04T22:30:00-03:00",
    day: "today",
    homeTeamId: "den",
    awayTeamId: "dal",
    homeTeam: side("den"),
    visitorTeam: side("dal"),
    status: "scheduled",
    time: "22:30",
    arena: "Ball Arena",
    city: "Denver",
    highlight: "Duelo de criadores no perímetro",
    source: "mock"
  },
  {
    id: "game-chi-mil-1",
    date: "2026-05-05T21:00:00-03:00",
    day: "tomorrow",
    homeTeamId: "mil",
    awayTeamId: "chi",
    homeTeam: side("mil"),
    visitorTeam: side("chi"),
    status: "scheduled",
    time: "21:00",
    arena: "Fiserv Forum",
    city: "Milwaukee",
    highlight: "Bulls tentam roubar jogo fora de casa",
    source: "mock"
  },
  {
    id: "game-phx-lal-1",
    date: "2026-05-03T22:00:00-03:00",
    day: "yesterday",
    homeTeamId: "phx",
    awayTeamId: "lal",
    homeScore: 104,
    awayScore: 109,
    homeTeam: side("phx", 104),
    visitorTeam: side("lal", 109),
    status: "final",
    time: "22:00",
    arena: "Footprint Center",
    city: "Phoenix",
    highlight: "Anthony Davis decide no garrafão",
    source: "mock"
  },
  {
    id: "game-bos-mia-1",
    date: "2026-05-05T20:30:00-03:00",
    day: "tomorrow",
    homeTeamId: "bos",
    awayTeamId: "mia",
    homeTeam: side("bos"),
    visitorTeam: side("mia"),
    status: "scheduled",
    time: "20:30",
    arena: "TD Garden",
    city: "Boston",
    highlight: "Rivalidade do Leste em noite nacional",
    source: "mock"
  },
  {
    id: "game-dal-gsw-1",
    date: "2026-05-04T21:00:00-03:00",
    day: "today",
    homeTeamId: "dal",
    awayTeamId: "gsw",
    homeTeam: side("dal"),
    visitorTeam: side("gsw"),
    status: "scheduled",
    time: "21:00",
    arena: "American Airlines Center",
    city: "Dallas",
    highlight: "Arremessos de três podem definir a noite",
    source: "mock"
  }
];
