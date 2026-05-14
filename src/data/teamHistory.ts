import type { TeamHistory } from "@/types/favoriteTeam";

// Base local de contexto histórico. Mantida separada de dados online para não confundir fonte.
export const teamHistories: TeamHistory[] = [
  {
    teamAbbreviation: "CHA",
    founded: "1988",
    city: "Charlotte, Carolina do Norte",
    arena: "Spectrum Center",
    championships: 0,
    summary:
      "A franquia de Charlotte tem forte identidade regional, uma torcida marcante e uma história ligada a nomes populares como Kemba Walker, Larry Johnson e Muggsy Bogues."
  },
  {
    teamAbbreviation: "LAL",
    founded: "1947",
    city: "Los Angeles, Califórnia",
    arena: "Crypto.com Arena",
    championships: 17,
    summary:
      "Os Lakers são uma das franquias mais tradicionais da NBA, associados a eras históricas como Showtime, Kobe/Shaq e múltiplas gerações de estrelas."
  },
  {
    teamAbbreviation: "CHI",
    founded: "1966",
    city: "Chicago, Illinois",
    arena: "United Center",
    championships: 6,
    summary:
      "Os Bulls construíram sua identidade global com a dinastia dos anos 1990 liderada por Michael Jordan, Scottie Pippen e Phil Jackson."
  },
  {
    teamAbbreviation: "BOS",
    founded: "1946",
    city: "Boston, Massachusetts",
    arena: "TD Garden",
    championships: 18,
    summary:
      "Os Celtics são uma das franquias fundadoras e mais vitoriosas da NBA, com tradição defensiva, cultura de títulos e gerações históricas."
  },
  {
    teamAbbreviation: "GSW",
    founded: "1946",
    city: "San Francisco, Califórnia",
    arena: "Chase Center",
    championships: 7,
    summary:
      "Os Warriors atravessaram diferentes cidades e eras até se tornarem uma potência moderna liderada por arremesso, movimento e Stephen Curry."
  }
];

export function getTeamHistory(teamAbbreviation?: string) {
  if (!teamAbbreviation) return null;
  return teamHistories.find(
    (history) => history.teamAbbreviation.toUpperCase() === teamAbbreviation.toUpperCase()
  ) ?? null;
}
