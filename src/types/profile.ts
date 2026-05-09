export type UserProfile = {
  id: string;
  email?: string | null;
  name?: string | null;
  favorite_team_id?: string | null;
  favorite_team_abbreviation?: string | null;
  favorite_team_name?: string | null;
  favorite_team_full_name?: string | null;
  favorite_team_logo_url?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type FavoriteTeamProfileInput = {
  favorite_team_id: string;
  favorite_team_abbreviation?: string;
  favorite_team_name: string;
  favorite_team_full_name: string;
  favorite_team_logo_url?: string;
};
