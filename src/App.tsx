import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Login } from './pages/Login';
import { NotFound } from './pages/NotFound';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminUsuarios } from './pages/admin/AdminUsuarios';
import { AdminCursos } from './pages/admin/AdminCursos';
import { AdminMatriculas } from './pages/admin/AdminMatriculas';
import { AdminVouchers } from './pages/admin/AdminVouchers';
import { AdminReportes } from './pages/admin/AdminReportes';
import { DocenteDashboard } from './pages/docente/DocenteDashboard';
import { DocenteCursoDetalle } from './pages/docente/DocenteCursoDetalle';
import { EstudianteDashboard } from './pages/estudiante/EstudianteDashboard';
import { EstudianteMatricula } from './pages/estudiante/EstudianteMatricula';
import { EstudianteNotas } from './pages/estudiante/EstudianteNotas';
import { EstudiantePagos } from './pages/estudiante/EstudiantePagos';
import { EstudianteHistorial } from './pages/estudiante/EstudianteHistorial';

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Pública */}
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Admin */}
          <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/usuarios" element={<AdminUsuarios />} />
            <Route path="/admin/cursos" element={<AdminCursos />} />
            <Route path="/admin/matriculas" element={<AdminMatriculas />} />
            <Route path="/admin/vouchers" element={<AdminVouchers />} />
            <Route path="/admin/reportes" element={<AdminReportes />} />
          </Route>

          {/* Docente */}
          <Route element={<ProtectedRoute allowedRoles={['TEACHER']} />}>
            <Route path="/docente/dashboard" element={<DocenteDashboard />} />
            <Route path="/docente/cursos/:id" element={<DocenteCursoDetalle />} />
          </Route>

          {/* Estudiante */}
          <Route element={<ProtectedRoute allowedRoles={['STUDENT']} />}>
            <Route path="/estudiante/dashboard" element={<EstudianteDashboard />} />
            <Route path="/estudiante/matricula" element={<EstudianteMatricula />} />
            <Route path="/estudiante/notas" element={<EstudianteNotas />} />
            <Route path="/estudiante/pagos" element={<EstudiantePagos />} />
            <Route path="/estudiante/historial" element={<EstudianteHistorial />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}