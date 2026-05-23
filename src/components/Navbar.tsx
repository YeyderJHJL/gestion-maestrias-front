import React from 'react';
import { LogOutIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
interface NavbarProps {
  userName: string;
  userRole: 'Administrador' | 'Docente' | 'Estudiante de Maestría';
  avatarUrl?: string;
}
export function Navbar({ userName, userRole, avatarUrl }: NavbarProps) {
  const navigate = useNavigate();
  const handleLogout = () => {
    navigate('/login');
  };
  return (
    <nav className="bg-[#1A2F5A] text-white px-6 h-14 flex items-center justify-between shadow-md">
      <div className="font-serif font-bold text-lg">SGA Maestría · UNSA</div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          {avatarUrl ?
          <img
            src={avatarUrl}
            alt={userName}
            className="w-9 h-9 rounded-full" /> :


          <div className="w-9 h-9 rounded-full bg-[#2E5FA3] flex items-center justify-center text-sm font-semibold">
              {userName.
            split(' ').
            map((n) => n[0]).
            join('').
            slice(0, 2)}
            </div>
          }
          <div className="flex flex-col">
            <span className="text-sm font-semibold">{userName}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#1A2F5A] border border-white/20">
              {userRole}
            </span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="p-2 hover:bg-[#2E5FA3] rounded-md transition-colors"
          aria-label="Cerrar sesión">
          
          <LogOutIcon className="w-5 h-5" />
        </button>
      </div>
    </nav>);

}