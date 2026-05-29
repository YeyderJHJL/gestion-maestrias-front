import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types/auth';

function defaultRouteFor(role: UserRole): string {
  switch (role) {
    case 'ADMIN':       return '/admin/dashboard';
    case 'TEACHER':     return '/docente/dashboard';
    case 'STUDENT':     return '/estudiante/dashboard';
    case 'COORDINATOR': return '/admin/dashboard';
  }
}

export function NotFound() {
  const navigate = useNavigate();
  const { user } = useAuth();

  function handleGoBack() {
    if (user) {
      navigate(defaultRouteFor(user.role), { replace: true });
    } else {
      navigate('/login', { replace: true });
    }
  }

  return (
    <div className="h-full flex items-center justify-center bg-[#1A2F5A]">
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-sm mx-4 text-center space-y-6">
        <div className="space-y-2">
          <p className="text-8xl font-serif font-bold text-[#1A2F5A]">404</p>
          <h1 className="text-xl font-serif font-bold text-gray-800">
            Página no encontrada
          </h1>
          <p className="text-sm text-gray-500">
            La ruta que intentas acceder no existe o no tienes permiso para verla.
          </p>
        </div>
        <button
          onClick={handleGoBack}
          className="w-full bg-[#1A2F5A] text-white px-4 py-3 rounded-xl hover:bg-[#2E5FA3] transition-colors font-semibold text-sm">
          {user ? 'Volver al inicio' : 'Ir al login'}
        </button>
      </div>
    </div>
  );
}
