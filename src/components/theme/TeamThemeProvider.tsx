import type { CSSProperties, ReactNode } from "react";
import { getTeamTheme, hexToRgb } from "@/theme/nbaTeamThemes";

type TeamThemeCssProperties = CSSProperties & {
  "--team-primary": string;
  "--team-secondary": string;
  "--team-accent": string;
  "--team-text-on-primary": string;
  "--team-primary-rgb": string;
  "--team-secondary-rgb": string;
  "--team-accent-rgb": string;
};

interface TeamThemeProviderProps {
  abbreviation?: string | null;
  children: ReactNode;
}

export function TeamThemeProvider({ abbreviation, children }: TeamThemeProviderProps) {
  const theme = getTeamTheme(abbreviation);
  const accent = theme.accent ?? "#FFFFFF";
  const textOnPrimary = theme.textOnPrimary ?? "#FFFFFF";

  const style: TeamThemeCssProperties = {
    "--team-primary": theme.primary,
    "--team-secondary": theme.secondary,
    "--team-accent": accent,
    "--team-text-on-primary": textOnPrimary,
    "--team-primary-rgb": hexToRgb(theme.primary),
    "--team-secondary-rgb": hexToRgb(theme.secondary),
    "--team-accent-rgb": hexToRgb(accent)
  };

  return <div style={style}>{children}</div>;
}
