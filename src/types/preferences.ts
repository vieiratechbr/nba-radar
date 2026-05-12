export type ThemeMode = "system" | "dark";

export type UserPreferences = {
  id: string;
  user_id: string;
  notify_before_game: boolean;
  notify_game_start: boolean;
  notify_final_score: boolean;
  notify_highlights_available: boolean;
  theme_mode: ThemeMode;
  created_at?: string;
  updated_at?: string;
};

export type UserPreferencesInput = Partial<
  Pick<
    UserPreferences,
    | "notify_before_game"
    | "notify_game_start"
    | "notify_final_score"
    | "notify_highlights_available"
    | "theme_mode"
  >
>;
