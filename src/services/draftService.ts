import { mockDraftProspects } from "@/data/mockDraftProspects";
import type { DraftProspect } from "@/types/draft";
import type { ServiceResult } from "@/types/service";

type DraftApiPayload = {
  data?: DraftProspect[];
  fallback?: boolean;
  source?: "mock";
  message?: string;
  empty?: boolean;
};

export async function getDraftProspects(year?: string): Promise<ServiceResult<DraftProspect[]>> {
  if (typeof window === "undefined") {
    const data = year
      ? mockDraftProspects.filter((prospect) => prospect.year === year)
      : mockDraftProspects;
    return { data, source: "mock", fallback: true, message: "Prospectos usando base local inicial." };
  }

  try {
    const path = year ? `/api/draft?year=${encodeURIComponent(year)}` : "/api/draft";
    const response = await fetch(path, { cache: "no-store" });
    const payload = (await response.json()) as DraftApiPayload;

    return {
      data: payload.data ?? [],
      source: "mock",
      fallback: payload.fallback ?? true,
      empty: payload.empty ?? (payload.data?.length ?? 0) === 0,
      message: payload.message ?? "Prospectos usando base local inicial."
    };
  } catch {
    const data = year
      ? mockDraftProspects.filter((prospect) => prospect.year === year)
      : mockDraftProspects;
    return { data, source: "mock", fallback: true, message: "Prospectos usando base local inicial." };
  }
}
