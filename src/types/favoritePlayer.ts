export type FavoritePlayer = {
  id: string;
  user_id: string;
  player_id?: string | null;
  player_name: string;
  team_abbreviation?: string | null;
  image_url?: string | null;
  created_at?: string;
};

export type FavoritePlayerInput = {
  player_id?: string | null;
  player_name: string;
  team_abbreviation?: string | null;
  image_url?: string | null;
};
