"use client";

import type { UserProfile } from "@/types/profile";
import type { AuthUser } from "@/types/user";

type AuthResponse = {
  user?: AuthUser | null;
  profile?: UserProfile | null;
  needsFavoriteTeam?: boolean;
  needsEmailConfirmation?: boolean;
  message?: string;
};

async function postAuth(path: string, payload?: unknown): Promise<AuthResponse> {
  const response = await fetch(path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: payload ? JSON.stringify(payload) : undefined
  });
  const data = await response.json().catch(() => ({})) as AuthResponse & { error?: string };

  if (!response.ok) {
    throw new Error(data.error ?? data.message ?? "Não foi possível concluir a autenticação.");
  }

  return data;
}

export function login(email: string, password: string) {
  return postAuth("/api/auth/login", { email, password });
}

export function register(name: string, email: string, password: string) {
  return postAuth("/api/auth/register", { name, email, password });
}

export function logout() {
  return postAuth("/api/auth/logout");
}
