import { NextResponse } from "next/server";
import { getFavoriteTeamDashboard } from "@/services/favoriteTeamService";
import { getCurrentProfile } from "@/services/profileService";

export const dynamic = "force-dynamic";

export async function GET() {
  const { user, profile } = await getCurrentProfile();

  if (!user) {
    return NextResponse.json({ error: "Usuário não autenticado." }, { status: 401 });
  }

  if (!profile?.favorite_team_id) {
    return NextResponse.json(
      { error: "Time favorito ainda não definido." },
      { status: 400 }
    );
  }

  try {
    const data = await getFavoriteTeamDashboard(profile);

    return NextResponse.json({
      data,
      source: data?.source,
      message: data?.message
    });
  } catch (error) {
    return NextResponse.json(
      {
        data: null,
        message: "Não foi possível carregar sua área personalizada agora.",
        error: error instanceof Error ? error.message : "Erro desconhecido."
      },
      { status: 500 }
    );
  }
}
