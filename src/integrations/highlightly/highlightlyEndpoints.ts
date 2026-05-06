export const highlightlyEndpoints = {
  liveScores: "/matches",
  matches: "/matches",
  matchDetails: "/matches/{id}",
  matchHighlights: "/highlights",
  standings: "/standings",
  predictions: "/matches/{id}",
  headToHead: "/head-2-head",
  lastFiveGames: "/last-five-games",
  statistics: "/statistics/{id}",
  teams: "/teams",
  leagues: "/leagues"
};

export function resolveHighlightlyEndpoint(endpoint: string, params: Record<string, string | number>) {
  return Object.entries(params).reduce(
    (resolvedEndpoint, [key, value]) => resolvedEndpoint.replace(`{${key}}`, String(value)),
    endpoint
  );
}
