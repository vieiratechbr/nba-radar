"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, UserRound } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/providers/AuthProvider";

export function UserMenu({ mobile = false }: { mobile?: boolean }) {
  const router = useRouter();
  const { user, profile, loading, signOut } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await signOut();
      router.push("/");
      router.refresh();
    } finally {
      setLoggingOut(false);
    }
  }

  if (loading) {
    return <div className={mobile ? "h-10" : "h-9 w-28 rounded-full bg-white/[0.04]"} />;
  }

  if (!user) {
    return (
      <div className={mobile ? "grid gap-2" : "flex items-center gap-2"}>
        <Link
          href="/login"
          className={mobile
            ? "rounded-md border border-white/10 px-4 py-3 text-center text-sm font-bold text-white"
            : "rounded-full border border-white/10 px-4 py-2 text-sm font-bold text-white transition hover:border-[var(--team-primary)] hover:text-[var(--team-primary)]"}
        >
          Entrar
        </Link>
        <Link
          href="/cadastro"
          className={mobile
            ? "rounded-md bg-[var(--team-primary)] px-4 py-3 text-center text-sm font-black text-[var(--team-text-on-primary)]"
            : "rounded-full bg-[var(--team-primary)] px-4 py-2 text-sm font-black text-[var(--team-text-on-primary)] transition hover:brightness-110"}
        >
          Criar conta
        </Link>
      </div>
    );
  }

  const displayName = profile?.name ?? user.name ?? user.email ?? "Minha conta";

  return (
    <div className={mobile ? "grid gap-2" : "flex items-center gap-2"}>
      <Link
        href="/perfil"
        className={mobile
          ? "inline-flex items-center gap-2 rounded-md border border-white/10 px-4 py-3 text-sm font-bold text-white"
          : "inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm font-bold text-white transition hover:border-[var(--team-primary)] hover:text-[var(--team-primary)]"}
      >
        <UserRound className="h-4 w-4 text-[var(--team-primary)]" aria-hidden="true" />
        <span className="max-w-36 truncate">{displayName}</span>
      </Link>
      <button
        type="button"
        onClick={() => void handleLogout()}
        disabled={loggingOut}
        className={mobile
          ? "inline-flex items-center justify-center gap-2 rounded-md bg-white/[0.06] px-4 py-3 text-sm font-bold text-zinc-200"
          : "inline-flex items-center gap-2 rounded-full bg-white/[0.06] px-3 py-2 text-sm font-bold text-zinc-200 transition hover:bg-white/10 hover:text-white disabled:opacity-60"}
      >
        <LogOut className="h-4 w-4" aria-hidden="true" />
        {loggingOut ? "Saindo..." : "Sair"}
      </button>
    </div>
  );
}
