import type { Team } from "@/types/team";

interface TeamBadgeProps {
  team: Team;
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: "h-9 w-9 text-xs",
  md: "h-12 w-12 text-sm",
  lg: "h-16 w-16 text-base"
};

export function TeamBadge({ team, size = "md" }: TeamBadgeProps) {
  const abbreviation = team.abbreviation ?? team.name.slice(0, 3).toUpperCase();
  const primary = team.colors?.primary ?? "#d71920";
  const secondary = team.colors?.secondary ?? "#2a2d37";

  return (
    <div
      className={`${sizes[size]} grid place-items-center rounded-full border border-white/15 font-black text-white shadow-lg`}
      style={{
        background: `linear-gradient(135deg, ${primary}, ${secondary})`
      }}
      title={`${team.city ?? team.fullName ?? ""} ${team.name}`.trim()}
    >
      {abbreviation}
    </div>
  );
}
