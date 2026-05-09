import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getProfileByUserId, upsertProfile } from "@/services/profileService";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json() as {
      email?: string;
      password?: string;
    };

    if (!email || !password) {
      return NextResponse.json({ error: "Informe email e senha." }, { status: 400 });
    }

    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error || !data.user) {
      return NextResponse.json(
        { error: error?.message ?? "Não foi possível entrar." },
        { status: 401 }
      );
    }

    let profile = await getProfileByUserId(data.user.id);

    if (!profile) {
      profile = await upsertProfile({
        id: data.user.id,
        email: data.user.email,
        name:
          typeof data.user.user_metadata?.name === "string"
            ? data.user.user_metadata.name
            : null
      });
    }

    return NextResponse.json({
      user: {
        id: data.user.id,
        email: data.user.email,
        name: profile?.name ?? undefined
      },
      profile,
      needsFavoriteTeam: !profile?.favorite_team_id
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Não foi possível entrar agora."
      },
      { status: 500 }
    );
  }
}
