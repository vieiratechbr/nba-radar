"use client";

import { clsx } from "clsx";

interface FilterTabsProps<T extends string> {
  options: readonly T[];
  active: T;
  onChange: (option: T) => void;
}

export function FilterTabs<T extends string>({ options, active, onChange }: FilterTabsProps<T>) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={clsx(
            "whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold transition",
            active === option
              ? "border-court-red bg-court-red text-white shadow-glow"
              : "border-white/10 bg-white/[0.04] text-zinc-300 hover:border-white/25 hover:bg-white/[0.08] hover:text-white"
          )}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
