import { mockStandings } from "@/data/mockStandings";
import type { ServiceResult } from "@/types/service";
import type { StandingTeam } from "@/types/standing";

type StandingsApiPayload = {
  data?: StandingTeam[];
  fallback?: boolean;
  source?: "espn" | "mock";
  message?: string;
  empty?: boolean;
  debug?: {
    reason?: string;
  };
};

export async function getStandings(): Promise<ServiceResult<StandingTeam[]>> {
  if (typeof window === "undefined") {
    return { data: mockStandings, source: "mock", fallback: true };
  }

  try {
    const response = await fetch("/api/standings", { cache: "no-store" });
    const payload = (await response.json()) as StandingsApiPayload;

    if (!response.ok || payload.fallback) {
      return {
        data: payload.data?.length ? payload.data : mockStandings,
        source: "mock",
        fallback: true,
        message: payload.message ?? "Não foi possível carregar a classificação real. Exibindo demonstração.",
        error: payload.debug?.reason
      };
    }

    return {
      data: payload.data ?? [],
      source: payload.source ?? "espn",
      fallback: false,
      empty: payload.empty ?? (payload.data?.length ?? 0) === 0,
      message: payload.message
    };
  } catch {
    return {
      data: mockStandings,
      source: "mock",
      fallback: true,
      message: "Não foi possível carregar a classificação real. Exibindo demonstração."
    };
  }
}
