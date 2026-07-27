const TOKEN_KEY = 'sga_token';

type JwtPayload = {
  exp?: number;
};

function decodeBase64Url(value: string): string {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), '=');
  return atob(padded);
}

export function getStoredAuthToken(): string | null {
  return sessionStorage.getItem(TOKEN_KEY);
}

export function saveAuthToken(token: string): void {
  sessionStorage.setItem(TOKEN_KEY, token);
}

export function clearAuthToken(): void {
  sessionStorage.removeItem(TOKEN_KEY);
}

export function decodeJwtPayload(token: string): JwtPayload | null {
  const segments = token.split('.');
  if (segments.length < 2) {
    return null;
  }

  try {
    return JSON.parse(decodeBase64Url(segments[1])) as JwtPayload;
  } catch {
    return null;
  }
}

export function getTokenExpirationMs(token: string): number | null {
  const payload = decodeJwtPayload(token);
  if (!payload?.exp) {
    return null;
  }

  return payload.exp * 1000;
}

export function isAuthTokenExpired(token: string, nowMs = Date.now()): boolean {
  const expirationMs = getTokenExpirationMs(token);
  return expirationMs !== null && expirationMs <= nowMs;
}

export function isAuthTokenUsable(token: unknown): token is string {
  return typeof token === 'string' && token.length > 0 && !isAuthTokenExpired(token);
}
