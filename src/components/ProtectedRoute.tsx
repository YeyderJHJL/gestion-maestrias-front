import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
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

interface ProtectedRouteProps {
  allowedRoles: UserRole[];
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-[#F4F3F0]">
        <div className="w-10 h-10 border-4 border-[#1A2F5A] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={defaultRouteFor(user.role)} replace />;
  }

  return <Outlet />;
}
