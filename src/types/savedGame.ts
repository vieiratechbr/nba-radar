export type SavedGame = {
  id: string;
  user_id: string;
  espn_event_id: string;
  home_team?: string | null;
  visitor_team?: string | null;
  game_date?: string | null;
  created_at?: string;
};

export type SavedGameInput = {
  espn_event_id: string;
  home_team?: string | null;
  visitor_team?: string | null;
  game_date?: string | null;
};
