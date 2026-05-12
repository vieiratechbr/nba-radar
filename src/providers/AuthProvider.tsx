"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react";
import { useRouter } from "next/navigation";
import type { Session, User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { logout } from "@/services/authService";
import type { UserProfile } from "@/types/profile";
import type { AuthUser } from "@/types/user";

type MePayload = {
  user: AuthUser | null;
  profile: UserProfile | null;
  authenticated: boolean;
};

type AuthContextValue = {
  user: AuthUser | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
};

type AuthProviderProps = {
  initialUser?: AuthUser | null;
  initialProfile?: UserProfile | null;
  children: ReactNode;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function debugLog(label: string, value: unknown) {
  if (process.env.NODE_ENV === "development") {
    console.log(label, value);
  }
}

function mapSupabaseUser(user: User | null): AuthUser | null {
  if (!user) return null;

  return {
    id: user.id,
    email: user.email,
    name:
      typeof user.user_metadata?.name === "string"
        ? user.user_metadata.name
        : undefined
  };
}

function createSafeSupabaseClient() {
  try {
    return createClient();
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("[auth] Supabase client unavailable:", error);
    }
    return null;
  }
}

export function AuthProvider({ initialUser = null, initialProfile = null, children }: AuthProviderProps) {
  const router = useRouter();
  const supabase = useMemo(() => createSafeSupabaseClient(), []);
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<AuthUser | null>(initialUser);
  const [profile, setProfile] = useState<UserProfile | null>(initialProfile);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async (nextSession?: Session | null) => {
    try {
      const resolvedSession =
        supabase && nextSession !== undefined
          ? nextSession
          : supabase
          ? (await supabase.auth.getSession()).data.session
          : null;

      setSession(resolvedSession ?? null);

      const response = await fetch("/api/auth/me", { cache: "no-store" });
      const payload = await response.json().catch(() => null) as MePayload | null;
      const mappedUser = payload?.user ?? mapSupabaseUser(resolvedSession?.user ?? null);

      if (!response.ok || !payload?.authenticated || !mappedUser) {
        setUser(null);
        setProfile(null);
        debugLog("[auth] user:", null);
        debugLog("[profile] favorite team:", null);
        return;
      }

      setUser(mappedUser);
      setProfile(payload.profile ?? null);
      debugLog("[auth] user:", mappedUser.email);
      debugLog("[profile] favorite team:", payload.profile?.favorite_team_abbreviation ?? null);
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("[auth] failed to refresh profile:", error);
      }
      setUser(null);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  const refreshProfile = useCallback(async () => {
    setLoading(true);
    await loadProfile();
  }, [loadProfile]);

  const signOut = useCallback(async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }

    await logout().catch((error) => {
      if (process.env.NODE_ENV === "development") {
        console.error("[auth] server logout failed:", error);
      }
    });

    setSession(null);
    setUser(null);
    setProfile(null);
    router.refresh();
  }, [router, supabase]);

  useEffect(() => {
    queueMicrotask(() => {
      void loadProfile();
    });

    if (!supabase) return undefined;

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      void loadProfile(nextSession);
      router.refresh();
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, [loadProfile, router, supabase]);

  useEffect(() => {
    debugLog("[theme] active theme:", profile?.favorite_team_abbreviation ?? "default");
  }, [profile?.favorite_team_abbreviation]);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    session,
    profile,
    loading,
    isAuthenticated: Boolean(user),
    refreshProfile,
    signOut
  }), [loading, profile, refreshProfile, session, signOut, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
