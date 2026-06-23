import { useEffect, useState } from 'react';
import { FileTextIcon } from 'lucide-react';
import { AdminLayout } from '../../../layouts/AdminLayout';
import { EmptyState } from '../../../components/EmptyState';
import { ReportTypeSelector } from './components/ReportTypeSelector';
import { ReportFilterPanel } from './components/ReportFilterPanel';
import { ReportResultsTable } from './components/ReportResultsTable';
import { ReportExportBar } from './components/ReportExportBar';
import { useReportes } from './hooks/useReportes';
import { useAuth } from '../../../context/AuthContext';
import { listTeachers } from '../../../services/teachersApiService';
import { listCourses } from '../../../services/coursesApiService';
import { listStudents } from '../../../services/studentsApiService';
import type { TeacherResponse } from '../../../services/teachersApiService';
import type { CourseResponse } from '../../../services/coursesApiService';
import type { StudentResponse } from '../../../services/studentsApiService';

export function AdminReportes() {
  const { token } = useAuth();

  // Listas para los selects de filtros
  const [teachers, setTeachers] = useState<TeacherResponse[]>([]);
  const [courses, setCourses] = useState<CourseResponse[]>([]);
  const [students, setStudents] = useState<StudentResponse[]>([]);

  const {
    tipoActivo,
    filtros,
    resultados,
    isLoading,
    error,
    handleCambioTipo,
    handleFiltroChange,
    handleGenerar,
    handleLimpiar,
  } = useReportes();

  // Carga las listas al montar (necesarias para los selects)
  useEffect(() => {
    if (!token) return;
    Promise.all([
      listTeachers(token),
      listCourses(token),
      listStudents(token),
    ]).then(([t, c, s]) => {
      setTeachers(t);
      setCourses(c);
      setStudents(s);
    });
  }, [token]);

  const tieneResultados = resultados !== null;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Encabezado */}
        <div className="border-b-2 border-accent pb-2">
          <h1 className="text-3xl font-serif font-bold text-text">
            Reportes académicos
          </h1>
        </div>

        {/* Selector de tipo de reporte */}
        <ReportTypeSelector activo={tipoActivo} onChange={handleCambioTipo} />

        {/* Panel de filtros */}
        <ReportFilterPanel
          tipo={tipoActivo}
          filtros={filtros}
          isLoading={isLoading}
          teachers={teachers}
          courses={courses}
          students={students}
          error={error}
          onChange={handleFiltroChange}
          onGenerar={handleGenerar}
          onLimpiar={handleLimpiar}
        />

        {/* Resultados */}
        {tieneResultados ? (
          <div className="space-y-4">
            <ReportExportBar resultados={resultados} />
            <ReportResultsTable resultados={resultados} />
          </div>
        ) : (
          !isLoading && (
            <EmptyState
              icon={FileTextIcon}
              title="Selecciona el tipo de reporte y aplica los filtros"
              subtitle="Los resultados aparecerán aquí"
            />
          )
        )}
      </div>
    </AdminLayout>
  );
}
