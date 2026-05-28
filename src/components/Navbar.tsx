import React, { useEffect, useRef, useState } from 'react';
import { LogOutIcon, ChevronDownIcon, UserIcon, CreditCardIcon, HashIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types/auth';

function roleLabel(role: UserRole): string {
  switch (role) {
    case 'ADMIN':       return 'Administrador';
    case 'TEACHER':     return 'Docente';
    case 'STUDENT':     return 'Estudiante de Maestría';
    case 'COORDINATOR': return 'Coordinador';
  }
}

function initials(firstName: string, lastName: string): string {
  return `${firstName[0] ?? ''}${lastName[0] ?? ''}`.toUpperCase();
}

export function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Cierra el dropdown al hacer click fuera
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  return (
    <nav className="bg-[#1A2F5A] text-white px-6 h-14 flex items-center justify-between shadow-md">
      <div className="font-serif font-bold text-lg">SGA Maestría · UNSA</div>

      {/* Área de perfil con dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setOpen((prev) => !prev)}
          className="flex items-center gap-3 hover:bg-[#2E5FA3] px-3 py-1.5 rounded-lg transition-colors">
          {/* Avatar con iniciales */}
          <div className="w-9 h-9 rounded-full bg-[#2E5FA3] border border-white/20 flex items-center justify-center text-sm font-semibold flex-shrink-0">
            {initials(user.firstName, user.lastName)}
          </div>
          <div className="flex flex-col items-start">
            <span className="text-sm font-semibold leading-tight">
              {user.firstName} {user.lastName}
            </span>
            <span className="text-xs text-white/70 leading-tight">
              {roleLabel(user.role)}
            </span>
          </div>
          <ChevronDownIcon
            className={`w-4 h-4 text-white/70 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          />
        </button>

        {/* Dropdown */}
        {open && (
          <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50">
            {/* Cabecera del perfil */}
            <div className="px-5 py-4 bg-[#1A2F5A]/5 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-[#1A2F5A] flex items-center justify-center text-white font-bold text-base flex-shrink-0">
                  {initials(user.firstName, user.lastName)}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-[#1A2F5A] text-white">
                    {roleLabel(user.role)}
                  </span>
                </div>
              </div>
            </div>

            {/* Datos exclusivos del estudiante */}
            {user.role === 'STUDENT' && (
              <div className="px-5 py-3 border-b border-gray-100 space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <HashIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-gray-500 w-24 flex-shrink-0">CUI</span>
                  <span className="font-medium truncate">{user.cui ?? '—'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <CreditCardIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-gray-500 w-24 flex-shrink-0">Cód. Pago</span>
                  <span className="font-medium truncate">{user.paymentCode ?? '—'}</span>
                </div>
                {user.promotionName && (
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <UserIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="text-gray-500 w-24 flex-shrink-0">Promoción</span>
                    <span className="font-medium truncate">{user.promotionName}</span>
                  </div>
                )}
              </div>
            )}

            {/* Cerrar sesión */}
            <button
              onClick={() => { setOpen(false); logout(); }}
              className="w-full flex items-center gap-3 px-5 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors">
              <LogOutIcon className="w-4 h-4" />
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
