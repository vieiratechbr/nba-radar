"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { clsx } from "clsx";

type PremiumAccordionProps = {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  defaultOpen?: boolean;
  children: ReactNode;
  badge?: string;
  id?: string;
};

export function PremiumAccordion({
  title,
  subtitle,
  icon,
  defaultOpen = false,
  children,
  badge,
  id
}: PremiumAccordionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section
      id={id}
      className={clsx(
        "overflow-hidden rounded-xl border border-white/10 bg-[#101116]/92 shadow-[0_18px_55px_rgba(0,0,0,0.28)]",
        "transition duration-300 hover:border-court-red/45 hover:shadow-[0_18px_70px_rgba(215,25,32,0.10)]"
      )}
    >
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex w-full items-center justify-between gap-4 bg-[linear-gradient(135deg,rgba(255,255,255,0.055),rgba(255,255,255,0.015))] px-5 py-4 text-left transition hover:bg-white/[0.055] sm:px-6"
        aria-expanded={open}
      >
        <span className="flex min-w-0 items-center gap-3">
          {icon ? (
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-court-red/25 bg-court-red/12 text-court-red">
              {icon}
            </span>
          ) : null}
          <span className="min-w-0">
            <span className="block text-base font-black text-white sm:text-lg">{title}</span>
            {subtitle ? (
              <span className="mt-1 block text-xs font-semibold leading-5 text-zinc-400 sm:text-sm">
                {subtitle}
              </span>
            ) : null}
          </span>
        </span>

        <span className="flex shrink-0 items-center gap-3">
          {badge ? (
            <span className="hidden rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-zinc-300 sm:inline-flex">
              {badge}
            </span>
          ) : null}
          <ChevronDown
            className={clsx(
              "h-5 w-5 text-zinc-400 transition duration-300",
              open && "rotate-180 text-court-red"
            )}
            aria-hidden="true"
          />
        </span>
      </button>

      <div
        className={clsx(
          "grid transition-[grid-template-rows,opacity] duration-300 ease-out",
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden">
          <div className="border-t border-white/10 p-5 sm:p-6">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}
