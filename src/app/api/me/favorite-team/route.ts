import { NextRequest, NextResponse } from "next/server";
import { getCurrentProfile, updateFavoriteTeamForCurrentUser } from "@/services/profileService";
import type { FavoriteTeamProfileInput } from "@/types/profile";

export const dynamic = "force-dynamic";

export async function GET() {
  const { user, profile } = await getCurrentProfile();

  if (!user) {
    return NextResponse.json({ error: "Usuário não autenticado." }, { status: 401 });
  }

  return NextResponse.json({
    data: {
      id: profile?.favorite_team_id ?? null,
      abbreviation: profile?.favorite_team_abbreviation ?? null,
      name: profile?.favorite_team_name ?? null,
      fullName: profile?.favorite_team_full_name ?? null,
      logoUrl: profile?.favorite_team_logo_url ?? null
    },
    profile
  });
}

export async function POST(request: NextRequest) {
  return updateFavoriteTeam(request);
}

export async function PATCH(request: NextRequest) {
  return updateFavoriteTeam(request);
}

async function updateFavoriteTeam(request: NextRequest) {
  try {
    const body = await request.json() as Partial<FavoriteTeamProfileInput>;

    if (!body.favorite_team_id || !body.favorite_team_name || !body.favorite_team_full_name) {
      return NextResponse.json({ error: "Dados do time favorito incompletos." }, { status: 400 });
    }

    const profile = await updateFavoriteTeamForCurrentUser({
      favorite_team_id: body.favorite_team_id,
      favorite_team_abbreviation: body.favorite_team_abbreviation,
      favorite_team_name: body.favorite_team_name,
      favorite_team_full_name: body.favorite_team_full_name,
      favorite_team_logo_url: body.favorite_team_logo_url
    });

    return NextResponse.json({ data: profile });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Não foi possível salvar o time favorito."
      },
      { status: 500 }
    );
  }
}
