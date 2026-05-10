import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { upsertProfile } from "@/services/profileService";

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json() as {
      name?: string;
      email?: string;
      password?: string;
    };

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Informe nome, email e senha." }, { status: 400 });
    }

    const supabase = await createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
        emailRedirectTo: `${request.nextUrl.origin}/login`
      }
    });

    if (error || !data.user) {
      return NextResponse.json(
        { error: error?.message ?? "Não foi possível criar a conta." },
        { status: 400 }
      );
    }

    const profile = await upsertProfile({
      id: data.user.id,
      email: data.user.email ?? email,
      name
    });

    return NextResponse.json({
      user: {
        id: data.user.id,
        email: data.user.email ?? email,
        name
      },
      profile,
      needsFavoriteTeam: Boolean(data.session),
      needsEmailConfirmation: !data.session,
      message: data.session
        ? "Conta criada. Escolha seu time favorito."
        : "Conta criada. Confirme seu email para entrar no NBA Radar."
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Não foi possível criar a conta agora."
      },
      { status: 500 }
    );
  }
}
