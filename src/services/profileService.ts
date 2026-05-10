import { createClient, createServiceRoleClient } from "@/lib/supabase/server";
import { hasSupabasePublicEnv } from "@/lib/supabase/env";
import type { AuthUser } from "@/types/user";
import type { FavoriteTeamProfileInput, UserProfile } from "@/types/profile";

type ProfileUpsertInput = {
  id: string;
  email?: string | null;
  name?: string | null;
} & Partial<FavoriteTeamProfileInput>;

function mapClaimsToUser(claims: Record<string, unknown>): AuthUser | null {
  const id = typeof claims.sub === "string" ? claims.sub : "";
  if (!id) return null;

  const userMetadata =
    typeof claims.user_metadata === "object" && claims.user_metadata !== null
      ? claims.user_metadata as Record<string, unknown>
      : {};
  const name =
    typeof userMetadata.name === "string"
      ? userMetadata.name
      : typeof claims.name === "string"
      ? claims.name
      : undefined;

  return {
    id,
    email: typeof claims.email === "string" ? claims.email : undefined,
    name
  };
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  if (!hasSupabasePublicEnv()) return null;

  try {
    const supabase = await createClient();
    const claimsResult = await supabase.auth.getClaims();
    const claims = claimsResult.data?.claims;

    if (!claimsResult.error && claims) {
      const user = mapClaimsToUser(claims as Record<string, unknown>);
      if (user) return user;
    }

    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) return null;

    return {
      id: data.user.id,
      email: data.user.email,
      name:
        typeof data.user.user_metadata?.name === "string"
          ? data.user.user_metadata.name
          : undefined
    };
  } catch {
    return null;
  }
}

export async function getProfileByUserId(userId: string): Promise<UserProfile | null> {
  if (!hasSupabasePublicEnv()) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error) return null;
  return data as UserProfile | null;
}

export async function getCurrentProfile() {
  const user = await getCurrentUser();
  if (!user) return { user: null, profile: null };

  const profile = await getProfileByUserId(user.id);
  return { user, profile };
}

export async function upsertProfile(input: ProfileUpsertInput): Promise<UserProfile | null> {
  const payload = {
    id: input.id,
    email: input.email ?? null,
    name: input.name ?? null,
    favorite_team_id: input.favorite_team_id ?? undefined,
    favorite_team_abbreviation: input.favorite_team_abbreviation ?? undefined,
    favorite_team_name: input.favorite_team_name ?? undefined,
    favorite_team_full_name: input.favorite_team_full_name ?? undefined,
    favorite_team_logo_url: input.favorite_team_logo_url ?? undefined
  };

  const serviceClient = createServiceRoleClient();
  const supabase = serviceClient ?? await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .upsert(payload, { onConflict: "id" })
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return data as UserProfile;
}

export async function updateFavoriteTeamForCurrentUser(team: FavoriteTeamProfileInput) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Usuário não autenticado.");

  return upsertProfile({
    id: user.id,
    email: user.email ?? null,
    name: user.name ?? null,
    ...team
  });
}
