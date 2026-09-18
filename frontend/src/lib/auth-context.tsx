"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { apiClient, setAccessToken } from "./api-client";
import type { AuthUser } from "@/types/auth";

interface SignupInput {
  companyName: string;
  contactEmail: string;
  contactPhone?: string;
  adminFullName: string;
  adminEmail: string;
  password: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  signup: (input: SignupInput) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const refreshed = await apiClient.refresh();
      if (refreshed) {
        try {
          const me = await apiClient.get<AuthUser>("/auth/me");
          setUser(me);
        } catch {
          setUser(null);
        }
      }
      setIsLoading(false);
    })();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const result = await apiClient.post<{ accessToken: string; user: AuthUser }>(
      "/auth/login",
      { email, password }
    );
    setAccessToken(result.accessToken);
    setUser(result.user);
    return result.user;
  }, []);

  const signup = useCallback(async (input: SignupInput) => {
    const result = await apiClient.post<{ accessToken: string; user: AuthUser }>(
      "/auth/signup",
      input
    );
    setAccessToken(result.accessToken);
    setUser(result.user);
  }, []);

  const logout = useCallback(async () => {
    await apiClient.post("/auth/logout").catch(() => undefined);
    setAccessToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
