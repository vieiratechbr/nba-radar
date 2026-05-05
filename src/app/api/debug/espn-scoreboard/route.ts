import { NextRequest, NextResponse } from "next/server";
import { getRawEspnScoreboard } from "@/integrations/espn/espnAdapter";
import { formatNbaApiDate } from "@/utils/formatNbaApiDate";

export const revalidate = 60;

function countRawEvents(raw: unknown) {
  if (typeof raw !== "object" || raw === null || !("events" in raw)) return 0;
  const events = (raw as { events?: unknown }).events;
  return Array.isArray(events) ? events.length : 0;
}

export async function GET(request: NextRequest) {
  const date = request.nextUrl.searchParams.get("date") ?? undefined;
  const requestedDate = formatNbaApiDate(date);

  try {
    const result = await getRawEspnScoreboard(date);

    return NextResponse.json({
      success: true,
      source: "espn",
      requestedDate: result.requestedDate,
      rawEventsCount: countRawEvents(result.data),
      url: result.url,
      data: result.data
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        source: "espn",
        requestedDate,
        error: error instanceof Error ? error.message : "Erro desconhecido na ESPN API."
      },
      { status: 502 }
    );
  }
}
