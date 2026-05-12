import type { ReactNode } from "react";
import { LayoutWrapper } from "@/components/LayoutWrapper";

type LegalPageLayoutProps = {
  title: string;
  subtitle?: string;
  updatedAt?: string;
  children: ReactNode;
};

export function LegalPageLayout({ title, subtitle, updatedAt, children }: LegalPageLayoutProps) {
  return (
    <section className="border-b border-white/10 bg-[radial-gradient(circle_at_18%_12%,rgba(var(--team-primary-rgb),0.22),transparent_32rem),#07080b]">
      <LayoutWrapper className="py-12 sm:py-16">
        <div className="mx-auto max-w-4xl">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.24em] text-[var(--team-primary)]">
            Institucional
          </p>
          <h1 className="text-4xl font-black leading-tight text-white sm:text-5xl">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-4 max-w-3xl text-sm leading-7 text-zinc-400 sm:text-base">
              {subtitle}
            </p>
          ) : null}
          {updatedAt ? (
            <p className="mt-5 inline-flex rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-bold text-zinc-300">
              Última atualização: {updatedAt}
            </p>
          ) : null}
        </div>

        <article className="legal-content mx-auto mt-8 max-w-4xl rounded-2xl border border-white/10 bg-court-slate/82 p-5 shadow-[0_24px_90px_rgba(0,0,0,0.28)] sm:p-8">
          {children}
        </article>
      </LayoutWrapper>
    </section>
  );
}
