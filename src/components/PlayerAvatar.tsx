"use client";

import Image from "next/image";
import { useState } from "react";

type PlayerAvatarProps = {
  name: string;
  imageUrl?: string;
  size?: "sm" | "md" | "lg" | "xl";
};

const sizeClasses = {
  sm: "h-11 w-11 text-xs",
  md: "h-14 w-14 text-sm",
  lg: "h-16 w-16 text-lg",
  xl: "h-20 w-20 text-xl"
};

const imageSizes = {
  sm: 44,
  md: 56,
  lg: 64,
  xl: 80
};

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function PlayerAvatar({ name, imageUrl, size = "md" }: PlayerAvatarProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const safeImageUrl = imageUrl && !imageFailed && name !== "A definir" ? imageUrl : undefined;
  const initials = name === "A definir" ? "?" : getInitials(name);

  if (safeImageUrl) {
    return (
      <Image
        src={safeImageUrl}
        alt={name}
        width={imageSizes[size]}
        height={imageSizes[size]}
        onError={() => setImageFailed(true)}
        className={`${sizeClasses[size]} rounded-full border border-white/15 bg-white/95 object-cover shadow-lg ring-1 ring-black/20`}
      />
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} grid place-items-center rounded-full border border-[rgba(var(--team-primary-rgb),0.4)] bg-[radial-gradient(circle_at_top,rgba(var(--team-primary-rgb),0.34),rgba(14,15,20,0.96))] font-black text-white shadow-lg`}
      title={name}
    >
      {initials}
    </div>
  );
}
