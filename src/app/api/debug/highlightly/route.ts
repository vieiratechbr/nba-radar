import { NextResponse } from "next/server";
import { highlightlyFetch } from "@/integrations/highlightly/highlightlyClient";
import { highlightlyEndpoints } from "@/integrations/highlightly/highlightlyEndpoints";

export const revalidate = 300;

export async function GET() {
  try {
    const data = await highlightlyFetch(highlightlyEndpoints.matches, {
      searchParams: {
        date: new Intl.DateTimeFormat("en-CA", {
          timeZone: "America/Sao_Paulo",
          year: "numeric",
          month: "2-digit",
          day: "2-digit"
        }).format(new Date()),
        timezone: "America/Sao_Paulo",
        limit: 1
      },
      revalidate: 300
    });

    return NextResponse.json({
      success: true,
      source: "highlightly",
      data
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      source: "highlightly",
      error: error instanceof Error ? error.message : "Erro desconhecido na Highlightly."
    });
  }
}
