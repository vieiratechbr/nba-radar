"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { register } from "@/services/authService";

export function RegisterForm() {
  const router = useRouter();
  const { refreshProfile } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);

    if (password !== confirmPassword) {
      setError("As senhas precisam ser iguais.");
      return;
    }

    setLoading(true);

    try {
      const result = await register(name, email, password);

      if (result.needsEmailConfirmation) {
        setMessage(result.message ?? "Cadastro criado. Verifique seu e-mail para confirmar a conta.");
        return;
      }

      await refreshProfile();
      router.refresh();
      router.push("/onboarding/time-favorito");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Não foi possível criar a conta.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5 rounded-lg border border-white/10 bg-white/[0.03] p-5 shadow-lg">
      <div>
        <h2 className="text-2xl font-black text-white">Crie sua conta e personalize sua experiência NBA.</h2>
        <p className="mt-2 text-sm leading-6 text-zinc-400">
          Escolha seu time favorito e acompanhe uma visão feita para você.
        </p>
      </div>

      {error ? (
        <div className="rounded-md border border-court-red/30 bg-court-red/10 p-3 text-sm font-semibold text-red-100">
          {error}
        </div>
      ) : null}

      {message ? (
        <div className="rounded-md border border-emerald-400/25 bg-emerald-400/10 p-3 text-sm font-semibold text-emerald-100">
          {message}
        </div>
      ) : null}

      <label className="grid gap-2 text-sm font-bold text-zinc-200">
        Nome
        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
          autoComplete="name"
          className="rounded-md border border-white/10 bg-court-black px-4 py-3 text-white outline-none transition focus:border-[var(--team-primary)]"
        />
      </label>

      <label className="grid gap-2 text-sm font-bold text-zinc-200">
        Email
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          autoComplete="email"
          className="rounded-md border border-white/10 bg-court-black px-4 py-3 text-white outline-none transition focus:border-[var(--team-primary)]"
        />
      </label>

      <label className="grid gap-2 text-sm font-bold text-zinc-200">
        Senha
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          minLength={6}
          autoComplete="new-password"
          className="rounded-md border border-white/10 bg-court-black px-4 py-3 text-white outline-none transition focus:border-[var(--team-primary)]"
        />
      </label>

      <label className="grid gap-2 text-sm font-bold text-zinc-200">
        Confirmar senha
        <input
          type="password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          required
          minLength={6}
          autoComplete="new-password"
          className="rounded-md border border-white/10 bg-court-black px-4 py-3 text-white outline-none transition focus:border-[var(--team-primary)]"
        />
      </label>

      <button
        type="submit"
        disabled={loading}
        className="rounded-full bg-[var(--team-primary)] px-5 py-3 text-sm font-black text-[var(--team-text-on-primary)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Criando conta..." : "Criar conta"}
      </button>

      <p className="text-sm text-zinc-400">
        Já tem conta?{" "}
        <Link href="/login" className="font-bold text-white transition hover:text-[var(--team-primary)]">
          Entrar
        </Link>
      </p>
    </form>
  );
}
