import { NextResponse } from "next/server";
import {
  getHighlightlyConfigStatus,
  highlightlyFetchWithMeta
} from "@/integrations/highlightly/highlightlyClient";
import { highlightlyEndpoints } from "@/integrations/highlightly/highlightlyEndpoints";
import { readHighlightlyArray } from "@/integrations/highlightly/highlightlyAdapter";
import { toInputDate } from "@/utils/formatNbaApiDate";

export const revalidate = 300;

export async function GET() {
  const config = getHighlightlyConfigStatus();
  const date = toInputDate(new Date());

  if (!config.hasBaseUrl || !config.hasApiKey) {
    return NextResponse.json({
      success: false,
      source: "highlightly",
      hasBaseUrl: config.hasBaseUrl,
      hasApiKey: config.hasApiKey,
      baseUrl: config.baseUrl,
      message: "Highlightly não está configurada completamente."
    });
  }

  try {
    const result = await highlightlyFetchWithMeta(highlightlyEndpoints.matches, {
      searchParams: {
        date,
        leagueName: "NBA",
        timezone: "America/Sao_Paulo",
        limit: 1,
        offset: 0
      },
      revalidate: 300
    });
    const rows = readHighlightlyArray(result.data);

    return NextResponse.json({
      success: true,
      source: "highlightly",
      hasBaseUrl: config.hasBaseUrl,
      hasApiKey: config.hasApiKey,
      baseUrl: config.baseUrl,
      status: result.status,
      url: result.url,
      rawCount: rows.length,
      sample: rows.slice(0, 1),
      rateLimit: result.rateLimit,
      message: "Highlightly configurada."
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      source: "highlightly",
      hasBaseUrl: config.hasBaseUrl,
      hasApiKey: config.hasApiKey,
      baseUrl: config.baseUrl,
      error: error instanceof Error ? error.message : "Erro desconhecido na Highlightly."
    });
  }
}
