import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import * as mockAuthApi from '../services/mockAuthApi';
import type { AuthSession } from '../types';
import { AuthContext, type AuthContextValue } from './auth';

const SESSION_KEY = 'deployready:session';

function loadSession(): AuthSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<AuthSession>;
    if (typeof parsed.token === 'string' && typeof parsed.user?.email === 'string') {
      return parsed as AuthSession;
    }
  } catch {
    // Corrupt or inaccessible storage — treat as logged out.
  }
  return null;
}

function saveSession(session: AuthSession | null) {
  try {
    if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    else localStorage.removeItem(SESSION_KEY);
  } catch {
    // Session still works in memory for this tab.
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(loadSession);

  // Keep login state in sync across browser tabs.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === SESSION_KEY) setSession(loadSession());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const startSession = useCallback((next: AuthSession) => {
    saveSession(next);
    setSession(next);
    return next.user;
  }, []);

  const login = useCallback(
    async (email: string, password: string) => startSession(await mockAuthApi.login(email, password)),
    [startSession],
  );

  const signUp = useCallback(
    async (name: string, email: string, password: string) =>
      startSession(await mockAuthApi.signUp(name, email, password)),
    [startSession],
  );

  const logout = useCallback(() => {
    saveSession(null);
    setSession(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: session?.user ?? null,
      token: session?.token ?? null,
      isAuthenticated: session !== null,
      login,
      signUp,
      requestPasswordReset: mockAuthApi.requestPasswordReset,
      resetPassword: mockAuthApi.resetPassword,
      logout,
    }),
    [session, login, signUp, logout],
  );

  return <AuthContext value={value}>{children}</AuthContext>;
}
