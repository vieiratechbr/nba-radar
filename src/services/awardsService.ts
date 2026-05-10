import { mockAwards } from "@/data/mockAwards";
import type { AwardWinner } from "@/types/award";
import type { ServiceResult } from "@/types/service";

type AwardsApiPayload = {
  data?: AwardWinner[];
  fallback?: boolean;
  source?: "espn" | "mock";
  message?: string;
  empty?: boolean;
};

const localAwardsMessage = "Dados de prêmios usando base local inicial.";

export async function getAwards(season?: string): Promise<ServiceResult<AwardWinner[]>> {
  if (typeof window === "undefined") {
    const data = season ? mockAwards.filter((award) => award.season === season) : mockAwards;
    return { data, source: "mock", fallback: true, message: localAwardsMessage };
  }

  try {
    const path = season ? `/api/awards?season=${encodeURIComponent(season)}` : "/api/awards";
    const response = await fetch(path, { cache: "no-store" });
    const payload = (await response.json()) as AwardsApiPayload;

    return {
      data: payload.data ?? [],
      source: payload.source ?? "mock",
      fallback: payload.fallback ?? true,
      empty: payload.empty ?? (payload.data?.length ?? 0) === 0,
      message: payload.message ?? localAwardsMessage
    };
  } catch {
    const data = season ? mockAwards.filter((award) => award.season === season) : mockAwards;
    return { data, source: "mock", fallback: true, message: localAwardsMessage };
  }
}
