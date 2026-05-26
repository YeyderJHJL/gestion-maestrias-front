import React from 'react';
import { useNavigate } from 'react-router-dom';
export function Login() {
  const navigate = useNavigate();
  const showError = false;
  const handleGoogleLogin = () => {
    navigate('/admin/dashboard');
  };
  return (
    <div className="h-full flex bg-[#F4F3F0]">
      {/* Left Half - Branding */}
      <div className="w-1/2 bg-[#1A2F5A] flex flex-col items-center justify-center p-12 text-white text-center">
        <div className="max-w-md space-y-6">
          {/* Logo container with background circle */}
          <div className="mb-4">
            <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/5 shadow-2xl backdrop-blur-sm">
              <img 
                src="/img/escudoUNSA.webp" 
                alt="Logo UNSA" 
                className="w-[90%] h-[90%] object-contain"
              />
            </div>
            <p className="text-sm font-serif uppercase tracking-widest text-white/80">
              Universidad Nacional de San Agustín
            </p>
          </div>

          <h1 className="text-5xl font-serif font-bold leading-tight">
            Sistema de Gestión Académica
          </h1>

          <p className="text-xl text-white/90">
            Maestría en Informática · UNSA
          </p>

          <p className="text-white/80 text-lg">
            Gestión académica centralizada para docentes, estudiantes y
            administración.
          </p>
        </div>
      </div>

      {/* Right Half - Login Form */}
      <div className="w-1/2 bg-[#F4F3F0] flex items-center justify-center p-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg border border-[#D5D2CC] shadow-sm p-6 space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-serif font-bold text-gray-900">
                Iniciar sesión
              </h2>
              <p className="text-gray-600">Usa tu correo institucional UNSA</p>
            </div>

            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 bg-[#1A2F5A] text-white px-4 py-2 rounded-md hover:bg-[#2E5FA3] transition-colors font-semibold">
              
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                
              </svg>
              Continuar con Google
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#D5D2CC]"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">o</span>
              </div>
            </div>

            <p className="text-sm text-gray-600 text-center">
              El acceso requiere una cuenta Google institucional (@unsa.edu.pe)
              provista por la OTI.
            </p>

            {showError &&
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md text-sm">
                Tu cuenta no está registrada en el sistema o fue desactivada.
                Contacta a Administración.
              </div>
            }
          </div>
        </div>
      </div>
    </div>);

}