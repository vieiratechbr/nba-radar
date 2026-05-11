const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || "http://localhost:3000";

async function request<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`);

  if (!response.ok) {
    throw new Error(`NBA Radar API error ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export function getTodayGames() {
  return request("/api/games/today");
}

export function getGameDetails(id: string) {
  return request(`/api/games/${encodeURIComponent(id)}`);
}

export function getStandings() {
  return request("/api/standings");
}

export function getProfile() {
  return request("/api/auth/me");
}

export function getFavoriteTeamDashboard() {
  return request("/api/me/favorite-team/dashboard");
}

export { API_BASE_URL };
