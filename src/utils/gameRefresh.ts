import type { Game } from "@/types/game";
import type { GameDetails } from "@/types/gameDetails";

const nearStartBeforeMs = 30 * 60 * 1000;
const nearStartAfterMs = 180 * 60 * 1000;

type RefreshableGame = Pick<Game | GameDetails, "date" | "status">;

export function isScheduledNearStart(date?: string | Date) {
  if (!date) return false;

  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return false;

  const diff = Date.now() - parsedDate.getTime();
  return diff >= -nearStartBeforeMs && diff <= nearStartAfterMs;
}

export function shouldAutoRefreshGame(game: RefreshableGame) {
  return game.status === "live" || (game.status === "scheduled" && isScheduledNearStart(game.date));
}

export function shouldAutoRefreshGames(games: RefreshableGame[]) {
  return games.some(shouldAutoRefreshGame);
}

export function getAutoRefreshLabel(games: RefreshableGame[]) {
  if (games.some((game) => game.status === "live")) return "Atualização automática ativa";
  if (games.some((game) => game.status === "scheduled" && isScheduledNearStart(game.date))) {
    return "Aguardando atualização da fonte";
  }

  return "Atualização automática pausada";
}
