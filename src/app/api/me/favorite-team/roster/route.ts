import { NextResponse } from "next/server";
import { getEspnTeamRoster } from "@/integrations/espn/espnRoster";
import { getCurrentProfile } from "@/services/profileService";

export const dynamic = "force-dynamic";

export async function GET() {
  const { user, profile } = await getCurrentProfile();

  if (!user) {
    return NextResponse.json({ error: "Usuário não autenticado." }, { status: 401 });
  }

  const abbreviation = profile?.favorite_team_abbreviation;

  if (!abbreviation) {
    return NextResponse.json({ error: "Time favorito ainda não definido." }, { status: 400 });
  }

  try {
    const data = await getEspnTeamRoster(abbreviation);
    return NextResponse.json({
      data,
      source: data.length ? "espn" : "unavailable",
      fallback: false
    });
  } catch (error) {
    return NextResponse.json(
      {
        data: [],
        source: "unavailable",
        fallback: false,
        message: "Elenco ainda indisponível.",
        error: error instanceof Error ? error.message : "Erro desconhecido."
      },
      { status: 200 }
    );
  }
}
