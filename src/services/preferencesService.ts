import { createClient, createServiceRoleClient } from "@/lib/supabase/server";
import { hasSupabasePublicEnv } from "@/lib/supabase/env";
import { getCurrentUser } from "@/services/profileService";
import type { UserPreferences, UserPreferencesInput } from "@/types/preferences";

const DEFAULT_PREFERENCES: Required<UserPreferencesInput> = {
  notify_before_game: true,
  notify_game_start: true,
  notify_final_score: true,
  notify_highlights_available: true,
  theme_mode: "system"
};

export async function getPreferences(userId?: string): Promise<UserPreferences | null> {
  if (!hasSupabasePublicEnv()) return null;

  const currentUser = userId ? null : await getCurrentUser();
  const targetUserId = userId ?? currentUser?.id;
  if (!targetUserId) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("user_preferences")
    .select("*")
    .eq("user_id", targetUserId)
    .maybeSingle();

  if (error) return null;
  return data as UserPreferences | null;
}

export async function upsertPreferences(
  input: UserPreferencesInput = {},
  userId?: string
): Promise<UserPreferences | null> {
  if (!hasSupabasePublicEnv()) return null;

  const currentUser = userId ? null : await getCurrentUser();
  const targetUserId = userId ?? currentUser?.id;
  if (!targetUserId) throw new Error("Usuário não autenticado.");

  const serviceClient = createServiceRoleClient();
  const supabase = serviceClient ?? await createClient();
  const { data: existing } = await supabase
    .from("user_preferences")
    .select("*")
    .eq("user_id", targetUserId)
    .maybeSingle();

  const existingPreferences = existing as UserPreferences | null;
  const payload = {
    user_id: targetUserId,
    ...DEFAULT_PREFERENCES,
    ...(existingPreferences
      ? {
          notify_before_game: existingPreferences.notify_before_game,
          notify_game_start: existingPreferences.notify_game_start,
          notify_final_score: existingPreferences.notify_final_score,
          notify_highlights_available: existingPreferences.notify_highlights_available,
          theme_mode: existingPreferences.theme_mode
        }
      : {}),
    ...input
  };

  const { data, error } = await supabase
    .from("user_preferences")
    .upsert(payload, { onConflict: "user_id" })
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return data as UserPreferences;
}
