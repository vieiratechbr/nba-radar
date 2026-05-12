"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Menu, X } from "lucide-react";
import { useState } from "react";
import { clsx } from "clsx";
import { LayoutWrapper } from "@/components/LayoutWrapper";
import { UserMenu } from "@/components/auth/UserMenu";

const navItems = [
  { href: "/", label: "Início" },
  { href: "/placares", label: "Placares" },
  { href: "/classificacao", label: "Classificação" },
  { href: "/premios", label: "Prêmios" },
  { href: "/draft", label: "Draft" }
];

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-court-black/88 backdrop-blur-xl">
      <LayoutWrapper className="flex h-20 items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center rounded-lg border border-white/10 bg-white/95 px-2 py-1 shadow-glow transition hover:bg-white"
          onClick={() => setOpen(false)}
        >
          <Image
            src="/logos/logotext.png"
            alt="NBA Radar"
            width={160}
            height={160}
            priority
            className="hidden h-14 w-auto object-contain sm:block"
          />
          <Image
            src="/logos/logo.png"
            alt="NBA Radar"
            width={96}
            height={96}
            priority
            className="h-10 w-auto object-contain sm:hidden"
          />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Navegação principal">
          {navItems.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "rounded-full px-4 py-2 text-sm font-semibold transition",
                  active
                    ? "bg-[var(--team-primary)] text-[var(--team-text-on-primary)] shadow-[0_0_30px_rgba(var(--team-primary-rgb),0.25)]"
                    : "text-zinc-300 hover:bg-white/10 hover:text-white"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/placares"
            className="inline-flex items-center gap-2 rounded-full bg-[var(--team-primary)] px-4 py-2 text-sm font-bold text-[var(--team-text-on-primary)] shadow-[0_0_30px_rgba(var(--team-primary-rgb),0.22)] transition hover:brightness-110"
          >
            <BarChart3 className="h-4 w-4" aria-hidden="true" />
            Ver jogos de hoje
          </Link>
          <UserMenu />
        </div>

        <button
          type="button"
          className="grid h-11 w-11 place-items-center rounded-md border border-white/10 bg-white/[0.04] text-white lg:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label={open ? "Fechar menu" : "Abrir menu"}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </LayoutWrapper>

      {open ? (
        <div className="border-t border-white/10 bg-court-black lg:hidden">
          <LayoutWrapper className="py-4">
            <nav className="grid gap-2" aria-label="Navegação mobile">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-md px-3 py-3 text-sm font-semibold text-zinc-200 transition hover:bg-white/10 hover:text-white"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/placares"
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-md bg-[var(--team-primary)] px-4 py-3 text-sm font-bold text-[var(--team-text-on-primary)]"
                onClick={() => setOpen(false)}
              >
                <BarChart3 className="h-4 w-4" aria-hidden="true" />
                Ver jogos de hoje
              </Link>
              <div className="mt-2 border-t border-white/10 pt-4">
                <UserMenu mobile />
              </div>
            </nav>
          </LayoutWrapper>
        </div>
      ) : null}
    </header>
  );
}
