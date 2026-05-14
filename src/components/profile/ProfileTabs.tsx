"use client";

import { useState, type ReactNode } from "react";
import { clsx } from "clsx";

type ProfileTab = {
  id: string;
  label: string;
  content: ReactNode;
};

export function ProfileTabs({ tabs }: { tabs: ProfileTab[] }) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id ?? "");
  const activeContent = tabs.find((tab) => tab.id === activeTab)?.content ?? tabs[0]?.content;

  return (
    <section className="grid gap-5">
      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-black/25 p-2">
        <div className="flex min-w-max gap-2">
          {tabs.map((tab) => {
            const active = tab.id === activeTab;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={clsx(
                  "rounded-full px-4 py-2 text-sm font-black transition",
                  active
                    ? "bg-[var(--team-primary)] text-[var(--team-text-on-primary)] shadow-[0_0_28px_rgba(var(--team-primary-rgb),0.28)]"
                    : "text-zinc-400 hover:bg-white/10 hover:text-white"
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div>{activeContent}</div>
    </section>
  );
}
