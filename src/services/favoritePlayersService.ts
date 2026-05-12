import { createClient } from "@/lib/supabase/server";
import { hasSupabasePublicEnv } from "@/lib/supabase/env";
import { getCurrentUser } from "@/services/profileService";
import type { FavoritePlayer, FavoritePlayerInput } from "@/types/favoritePlayer";

export async function getFavoritePlayers(): Promise<FavoritePlayer[]> {
  if (!hasSupabasePublicEnv()) return [];

  const user = await getCurrentUser();
  if (!user) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("favorite_players")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return [];
  return (data ?? []) as FavoritePlayer[];
}

export async function addFavoritePlayer(input: FavoritePlayerInput): Promise<FavoritePlayer> {
  if (!input.player_name) throw new Error("Nome do jogador é obrigatório.");

  const user = await getCurrentUser();
  if (!user) throw new Error("Usuário não autenticado.");

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("favorite_players")
    .upsert(
      {
        user_id: user.id,
        player_id: input.player_id ?? null,
        player_name: input.player_name,
        team_abbreviation: input.team_abbreviation ?? null,
        image_url: input.image_url ?? null
      },
      { onConflict: "user_id,player_name" }
    )
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return data as FavoritePlayer;
}

export async function removeFavoritePlayer(playerName: string): Promise<void> {
  const user = await getCurrentUser();
  if (!user) throw new Error("Usuário não autenticado.");

  const supabase = await createClient();
  const { error } = await supabase
    .from("favorite_players")
    .delete()
    .eq("user_id", user.id)
    .eq("player_name", playerName);

  if (error) throw new Error(error.message);
}
