import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthUser, UserRole } from '../types/auth';
import { buildAuthUser } from '../services/userService';

const TOKEN_KEY = 'sga_token';

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  login: (googleToken: string) => Promise<UserRole>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(
    () => sessionStorage.getItem(TOKEN_KEY)
  );
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(!!sessionStorage.getItem(TOKEN_KEY));

  // Rehidrata sesión al refrescar la página (F5)
  useEffect(() => {
    const savedToken = sessionStorage.getItem(TOKEN_KEY);
    if (!savedToken) {
      setLoading(false);
      return;
    }
    buildAuthUser(savedToken)
      .then((authUser) => {
        setToken(savedToken);
        setUser(authUser);
      })
      .catch(() => {
        sessionStorage.removeItem(TOKEN_KEY);
        setToken(null);
      })
      .finally(() => setLoading(false));
  }, []);

  async function login(googleToken: string): Promise<UserRole> {
    setLoading(true);
    try {
      const authUser = await buildAuthUser(googleToken);
      sessionStorage.setItem(TOKEN_KEY, googleToken);
      setToken(googleToken);
      setUser(authUser);
      return authUser.role;
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    sessionStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
    navigate('/login', { replace: true });
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
}
