import { NextResponse } from "next/server";
import { getCurrentProfile } from "@/services/profileService";

export const dynamic = "force-dynamic";

export async function GET() {
  const { user, profile } = await getCurrentProfile();

  return NextResponse.json({
    user,
    profile,
    authenticated: Boolean(user),
    needsFavoriteTeam: Boolean(user && !profile?.favorite_team_id)
  });
}
