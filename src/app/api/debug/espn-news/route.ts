import { NextResponse } from "next/server";
import { getRawEspnNews } from "@/integrations/espn/espnAdapter";

export const revalidate = 300;

export async function GET() {
  try {
    const data = await getRawEspnNews();

    return NextResponse.json({
      success: true,
      source: "espn",
      data
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        source: "espn",
        error: error instanceof Error ? error.message : "Erro desconhecido na ESPN API."
      },
      { status: 502 }
    );
  }
}
