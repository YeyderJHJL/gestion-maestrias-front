import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import { ApiError } from '../services/api';
import { UserRole } from '../types/auth';

function dashboardFor(role: UserRole): string {
  switch (role) {
    case 'ADMIN':       return '/admin/dashboard';
    case 'TEACHER':     return '/docente/dashboard';
    case 'STUDENT':     return '/estudiante/dashboard';
    case 'COORDINATOR': return '/admin/dashboard';
  }
}

export function Login() {
  const navigate = useNavigate();
  const { login, user, loading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && user) {
      navigate(dashboardFor(user.role), { replace: true });
    }
  }, [user, loading, navigate]);

  async function handleSuccess(credential: string) {
    setError(null);
    setIsLoading(true);
    try {
      const role = await login(credential);
      navigate(dashboardFor(role), { replace: true });
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setError('Tu cuenta no está registrada en el sistema o fue desactivada.\nContacta a Administración.');
      } else {
        setError('Error al iniciar sesión. Intenta nuevamente.');
      }
    } finally {
      setIsLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-[#1A2F5A]">
        <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-full flex items-center justify-center bg-[#1A2F5A]">
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-sm mx-4 space-y-8 text-center">

        {/* Logo */}
        <div className="flex flex-col items-center space-y-3">
          <div
            className="w-52 h-52 bg-white rounded-full overflow-hidden flex items-center justify-center border-4 border-[#1A2F5A]/10 shadow-lg"
            style={{ isolation: 'isolate' }}>
            <img
              src="/img/posgrado_LOGO.webp"
              alt="Posgrado 360° UNSA"
              className="w-full h-full object-contain p-3"
              style={{ mixBlendMode: 'multiply' }}
            />
          </div>
          <p className="text-xs font-serif uppercase tracking-widest text-[#1A2F5A]/60">
            Universidad Nacional de San Agustín
          </p>
        </div>

        {/* Título */}
        <div className="space-y-1">
          <h1 className="text-2xl font-serif font-bold text-[#1A2F5A]">
            Sistema de Gestión Académica
          </h1>
          <p className="text-sm text-gray-500">Maestrías, Grados y Títulos</p>
        </div>

        {/* Botón Google */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="w-full flex items-center justify-center gap-3 bg-[#1A2F5A]/10 text-[#1A2F5A] px-4 py-3 rounded-xl text-sm font-semibold">
              <div className="w-5 h-5 border-2 border-[#1A2F5A] border-t-transparent rounded-full animate-spin" />
              Verificando cuenta...
            </div>
          ) : (
            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={(res) => {
                  if (res.credential) handleSuccess(res.credential);
                }}
                onError={() => setError('Error al iniciar sesión con Google.')}
                theme="outline"
                size="large"
                text="signin_with"
                shape="rectangular"
                width={280}
              />
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm text-left whitespace-pre-line">
              {error}
            </div>
          )}

          <p className="text-xs text-gray-400">
            Requiere cuenta institucional @unsa.edu.pe provista por la OTI
          </p>
        </div>
      </div>
    </div>
  );
}
