import { getPlayerImageUrl } from "@/utils/playerImages";
import type { TeamBestPlayer } from "@/types/favoriteTeam";

const localBestPlayers: Record<string, Omit<TeamBestPlayer, "teamAbbreviation" | "source">> = {
  OKC: {
    name: "Shai Gilgeous-Alexander",
    position: "G",
    imageUrl: getPlayerImageUrl("Shai Gilgeous-Alexander"),
    summary: "Base local inicial. Estatísticas detalhadas ainda dependem de integração dedicada."
  },
  DEN: {
    name: "Nikola Jokic",
    position: "C",
    imageUrl: getPlayerImageUrl("Nikola Jokic"),
    summary: "Base local inicial. Estatísticas detalhadas ainda dependem de integração dedicada."
  },
  BOS: {
    name: "Jayson Tatum",
    position: "F",
    summary: "Base local inicial. Estatísticas detalhadas ainda dependem de integração dedicada."
  },
  DAL: {
    name: "Luka Doncic",
    position: "G",
    summary: "Base local inicial. Estatísticas detalhadas ainda dependem de integração dedicada."
  },
  MIL: {
    name: "Giannis Antetokounmpo",
    position: "F",
    summary: "Base local inicial. Estatísticas detalhadas ainda dependem de integração dedicada."
  },
  NYK: {
    name: "Jalen Brunson",
    position: "G",
    imageUrl: getPlayerImageUrl("Jalen Brunson"),
    summary: "Base local inicial. Estatísticas detalhadas ainda dependem de integração dedicada."
  }
};

export function getMockBestPlayerForTeam(teamAbbreviation?: string): TeamBestPlayer | null {
  if (!teamAbbreviation) return null;
  const player = localBestPlayers[teamAbbreviation.toUpperCase()];
  if (!player) return null;

  return {
    ...player,
    teamAbbreviation: teamAbbreviation.toUpperCase(),
    source: "mock"
  };
}
