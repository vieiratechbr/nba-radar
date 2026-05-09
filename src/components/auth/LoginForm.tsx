"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { login } from "@/services/authService";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await login(email, password);
      router.push(redirectTo || (result.needsFavoriteTeam ? "/onboarding/time-favorito" : "/perfil"));
      router.refresh();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Não foi possível entrar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5 rounded-lg border border-white/10 bg-white/[0.03] p-5 shadow-lg">
      <div>
        <h2 className="text-2xl font-black text-white">Bem-vindo de volta ao NBA Radar.</h2>
        <p className="mt-2 text-sm leading-6 text-zinc-400">
          Entre para ver seu radar personalizado e acompanhar seu time de coração.
        </p>
      </div>

      {error ? (
        <div className="rounded-md border border-court-red/30 bg-court-red/10 p-3 text-sm font-semibold text-red-100">
          {error}
        </div>
      ) : null}

      <label className="grid gap-2 text-sm font-bold text-zinc-200">
        Email
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          autoComplete="email"
          className="rounded-md border border-white/10 bg-court-black px-4 py-3 text-white outline-none transition focus:border-court-red"
        />
      </label>

      <label className="grid gap-2 text-sm font-bold text-zinc-200">
        Senha
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          autoComplete="current-password"
          className="rounded-md border border-white/10 bg-court-black px-4 py-3 text-white outline-none transition focus:border-court-red"
        />
      </label>

      <button
        type="submit"
        disabled={loading}
        className="rounded-full bg-court-red px-5 py-3 text-sm font-black text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Entrando..." : "Entrar"}
      </button>

      <p className="text-sm text-zinc-400">
        Ainda não tem conta?{" "}
        <Link href="/cadastro" className="font-bold text-white transition hover:text-court-red">
          Criar conta
        </Link>
      </p>
    </form>
  );
}
