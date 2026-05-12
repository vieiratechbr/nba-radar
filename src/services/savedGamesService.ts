import { createClient } from "@/lib/supabase/server";
import { hasSupabasePublicEnv } from "@/lib/supabase/env";
import { getCurrentUser } from "@/services/profileService";
import type { SavedGame, SavedGameInput } from "@/types/savedGame";

export async function getSavedGames(): Promise<SavedGame[]> {
  if (!hasSupabasePublicEnv()) return [];

  const user = await getCurrentUser();
  if (!user) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("saved_games")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return [];
  return (data ?? []) as SavedGame[];
}

export async function saveGame(input: SavedGameInput): Promise<SavedGame> {
  if (!input.espn_event_id) throw new Error("ID do evento ESPN é obrigatório.");

  const user = await getCurrentUser();
  if (!user) throw new Error("Usuário não autenticado.");

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("saved_games")
    .upsert(
      {
        user_id: user.id,
        espn_event_id: input.espn_event_id,
        home_team: input.home_team ?? null,
        visitor_team: input.visitor_team ?? null,
        game_date: input.game_date ?? null
      },
      { onConflict: "user_id,espn_event_id" }
    )
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return data as SavedGame;
}

export async function removeSavedGame(espnEventId: string): Promise<void> {
  const user = await getCurrentUser();
  if (!user) throw new Error("Usuário não autenticado.");

  const supabase = await createClient();
  const { error } = await supabase
    .from("saved_games")
    .delete()
    .eq("user_id", user.id)
    .eq("espn_event_id", espnEventId);

  if (error) throw new Error(error.message);
}
