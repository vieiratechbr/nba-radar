import { mockTeams } from "@/data/mockTeams";
import type { ServiceResult } from "@/types/service";
import type { Team } from "@/types/team";

type TeamsApiPayload = {
  data?: Team[];
  fallback?: boolean;
  source?: "espn" | "mock";
  message?: string;
  debug?: {
    reason?: string;
  };
};

export async function getTeams(): Promise<ServiceResult<Team[]>> {
  if (typeof window === "undefined") {
    return { data: mockTeams, source: "mock", fallback: true };
  }

  try {
    const response = await fetch("/api/teams", { cache: "no-store" });
    const payload = (await response.json()) as TeamsApiPayload;

    return {
      data: payload.data?.length ? payload.data : mockTeams,
      source: payload.source ?? "mock",
      fallback: payload.fallback ?? payload.source !== "espn",
      message: payload.message,
      error: payload.debug?.reason
    };
  } catch {
    return {
      data: mockTeams,
      source: "mock",
      fallback: true,
      message: "Não foi possível carregar times reais agora. Exibindo demonstração."
    };
  }
}
