import type { AuthSession, User } from '../types';

/**
 * Mock auth backend backed by localStorage. Passwords are stored in plain
 * text here — this exists only to simulate API behavior during development.
 */

const USERS_KEY = 'deployready:users';
const RESET_TOKENS_KEY = 'deployready:reset-tokens';
const MOCK_LATENCY_MS = 900;
const RESET_TOKEN_TTL_MS = 15 * 60 * 1000;

export const DEMO_CREDENTIALS = {
  email: 'demo@deployready.dev',
  password: 'password123',
} as const;

interface StoredUser extends User {
  password: string;
}

interface ResetToken {
  email: string;
  expiresAt: number;
}

export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthError';
  }
}

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

// getRandomValues works outside secure contexts, unlike crypto.randomUUID.
const randomId = () =>
  Array.from(crypto.getRandomValues(new Uint8Array(16)), (b) => b.toString(16).padStart(2, '0')).join('');

const normalizeEmail = (email: string) => email.trim().toLowerCase();

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage unavailable (private mode, quota) — mock data just won't persist.
  }
}

function getUsers(): Record<string, StoredUser> {
  const users = readJson<Record<string, StoredUser>>(USERS_KEY, {});
  if (!users[DEMO_CREDENTIALS.email]) {
    users[DEMO_CREDENTIALS.email] = {
      id: 'demo-user',
      name: 'Demo Developer',
      email: DEMO_CREDENTIALS.email,
      password: DEMO_CREDENTIALS.password,
      createdAt: new Date(0).toISOString(),
    };
  }
  return users;
}

function toPublicUser({ password: _password, ...user }: StoredUser): User {
  return user;
}

const createSession = (user: StoredUser): AuthSession => ({
  user: toPublicUser(user),
  token: `mock_${randomId()}`,
});

export async function login(email: string, password: string): Promise<AuthSession> {
  await delay(MOCK_LATENCY_MS);
  const user = getUsers()[normalizeEmail(email)];
  if (!user || user.password !== password) {
    throw new AuthError('Invalid email or password.');
  }
  return createSession(user);
}

export async function signUp(name: string, email: string, password: string): Promise<AuthSession> {
  await delay(MOCK_LATENCY_MS);
  const users = getUsers();
  const key = normalizeEmail(email);
  if (users[key]) {
    throw new AuthError('An account with this email already exists.');
  }
  const user: StoredUser = {
    id: randomId(),
    name: name.trim(),
    email: key,
    password,
    createdAt: new Date().toISOString(),
  };
  writeJson(USERS_KEY, { ...users, [key]: user });
  return createSession(user);
}

/** Always resolves, so callers can't probe which emails have accounts. */
export async function requestPasswordReset(email: string): Promise<void> {
  await delay(MOCK_LATENCY_MS);
  const key = normalizeEmail(email);
  if (!getUsers()[key]) return;

  const token = randomId();
  const tokens = readJson<Record<string, ResetToken>>(RESET_TOKENS_KEY, {});
  writeJson(RESET_TOKENS_KEY, {
    ...tokens,
    [token]: { email: key, expiresAt: Date.now() + RESET_TOKEN_TTL_MS },
  });
  // Stands in for the email a real backend would send.
  console.info(`[mock email] Password reset requested for ${key}. Reset token: ${token}`);
}

export async function resetPassword(token: string, newPassword: string): Promise<void> {
  await delay(MOCK_LATENCY_MS);
  const tokens = readJson<Record<string, ResetToken>>(RESET_TOKENS_KEY, {});
  const entry = tokens[token];
  if (!entry || entry.expiresAt < Date.now()) {
    throw new AuthError('This reset link is invalid or has expired.');
  }

  const users = getUsers();
  const user = users[entry.email];
  if (!user) {
    throw new AuthError('This reset link is invalid or has expired.');
  }
  writeJson(USERS_KEY, { ...users, [entry.email]: { ...user, password: newPassword } });

  const { [token]: _used, ...remaining } = tokens;
  writeJson(RESET_TOKENS_KEY, remaining);
}

export const getErrorMessage = (err: unknown) =>
  err instanceof Error ? err.message : 'Something went wrong. Please try again.';
