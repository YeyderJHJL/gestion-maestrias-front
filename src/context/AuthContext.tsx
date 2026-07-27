import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthUser, UserRole } from '../types/auth';
import { buildAuthUser } from '../services/userService';
import { ApiError } from '../services/api';
import { clearAuthToken, getStoredAuthToken, isAuthTokenUsable, saveAuthToken } from '../services/authTokenService';

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
  const [token, setToken] = useState<string | null>(() => getStoredAuthToken());
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(!!getStoredAuthToken());

  // Cierra sesión automáticamente cuando la sesión expira o el backend invalida el token.
  useEffect(() => {
    const handler = () => {
      clearAuthToken();
      setToken(null);
      setUser(null);
      navigate('/login', { replace: true });
    };
    window.addEventListener('session-expired', handler);
    return () => window.removeEventListener('session-expired', handler);
  }, [navigate]);

  // Rehidrata sesión al refrescar la página (F5)
  useEffect(() => {
    const savedToken = getStoredAuthToken();
    if (!isAuthTokenUsable(savedToken)) {
      clearAuthToken();
      setLoading(false);
      return;
    }

    buildAuthUser(savedToken)
      .then((authUser) => {
        setToken(savedToken);
        setUser(authUser);
      })
      .catch(() => {
        clearAuthToken();
        setToken(null);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  async function login(googleToken: string): Promise<UserRole> {
    setLoading(true);
    try {
      if (!isAuthTokenUsable(googleToken)) {
        throw new ApiError(401, 'Sesión expirada. Vuelve a iniciar sesión con Google.');
      }

      const authUser = await buildAuthUser(googleToken);
      saveAuthToken(googleToken);
      setToken(googleToken);
      setUser(authUser);
      return authUser.role;
    } catch (error) {
      clearAuthToken();
      setToken(null);
      setUser(null);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    clearAuthToken();
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
