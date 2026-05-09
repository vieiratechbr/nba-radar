"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { logout } from "@/services/authService";
import type { UserProfile } from "@/types/profile";
import type { AuthUser } from "@/types/user";

type MePayload = {
  user: AuthUser | null;
  profile: UserProfile | null;
  authenticated: boolean;
};

export function UserMenu({ mobile = false }: { mobile?: boolean }) {
  const router = useRouter();
  const [payload, setPayload] = useState<MePayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadUser() {
      try {
        const response = await fetch("/api/auth/me", { cache: "no-store" });
        const data = await response.json() as MePayload;
        if (!cancelled) setPayload(data);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadUser();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleLogout() {
    setLoggingOut(true);
    await logout();
    setPayload({ user: null, profile: null, authenticated: false });
    router.push("/");
    router.refresh();
    setLoggingOut(false);
  }

  if (loading) {
    return <div className={mobile ? "h-10" : "h-9 w-28 rounded-full bg-white/[0.04]"} />;
  }

  if (!payload?.authenticated || !payload.user) {
    return (
      <div className={mobile ? "grid gap-2" : "flex items-center gap-2"}>
        <Link
          href="/login"
          className={mobile
            ? "rounded-md border border-white/10 px-4 py-3 text-center text-sm font-bold text-white"
            : "rounded-full border border-white/10 px-4 py-2 text-sm font-bold text-white transition hover:border-court-red hover:text-court-red"}
        >
          Entrar
        </Link>
        <Link
          href="/cadastro"
          className={mobile
            ? "rounded-md bg-court-red px-4 py-3 text-center text-sm font-black text-white"
            : "rounded-full bg-court-red px-4 py-2 text-sm font-black text-white transition hover:bg-red-600"}
        >
          Criar conta
        </Link>
      </div>
    );
  }

  const displayName = payload.profile?.name ?? payload.user.name ?? payload.user.email ?? "Perfil";

  return (
    <div className={mobile ? "grid gap-2" : "flex items-center gap-2"}>
      <Link
        href="/perfil"
        className={mobile
          ? "inline-flex items-center gap-2 rounded-md border border-white/10 px-4 py-3 text-sm font-bold text-white"
          : "inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm font-bold text-white transition hover:border-court-red hover:text-court-red"}
      >
        <UserRound className="h-4 w-4 text-court-red" aria-hidden="true" />
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
