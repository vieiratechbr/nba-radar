import Image from "next/image";
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

const imageSizes = {
  sm: 30,
  md: 40,
  lg: 54
};

export function TeamBadge({ team, size = "md" }: TeamBadgeProps) {
  const abbreviation = team.abbreviation ?? team.name.slice(0, 3).toUpperCase();
  const primary = team.colors?.primary ?? "#d71920";
  const secondary = team.colors?.secondary ?? "#2a2d37";
  const title = `${team.city ?? team.fullName ?? ""} ${team.name}`.trim();

  if (team.logoUrl) {
    return (
      <div
        className={`${sizes[size]} grid place-items-center rounded-full border border-white/15 bg-white/95 shadow-lg ring-1 ring-black/20`}
        title={title}
      >
        <Image
          src={team.logoUrl}
          alt={team.fullName ?? team.name}
          width={imageSizes[size]}
          height={imageSizes[size]}
          className="h-[72%] w-[72%] object-contain"
        />
      </div>
    );
  }

  return (
    <div
      className={`${sizes[size]} grid place-items-center rounded-full border border-white/15 font-black text-white shadow-lg`}
      style={{
        background: `linear-gradient(135deg, ${primary}, ${secondary})`
      }}
      title={title}
    >
      {abbreviation}
    </div>
  );
}
