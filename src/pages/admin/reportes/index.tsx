import { useEffect, useState } from 'react';
import { FileTextIcon } from 'lucide-react';
import { AdminLayout } from '../../../layouts/AdminLayout';
import { EmptyState } from '../../../components/EmptyState';
import { ReportFilterPanel } from './components/ReportFilterPanel';
import { ReportResultsTable } from './components/ReportResultsTable';
import { ReportExportBar } from './components/ReportExportBar';
import { useReportes } from './hooks/useReportes';
import { useAuth } from '../../../context/AuthContext';
import { listTeachers } from '../../../services/teachersApiService';
import { listCourses } from '../../../services/coursesApiService';
import { listStudents } from '../../../services/studentsApiService';
import { listSemesters } from '../../../services/semestersApiService';
import { listPrograms } from '../../../services/programsApiService';
import type { TeacherResponse } from '../../../services/teachersApiService';
import type { CourseResponse } from '../../../services/coursesApiService';
import type { StudentResponse } from '../../../services/studentsApiService';
import type { SemesterOption, ProgramOption } from './types/reportes.types';

export function AdminReportes() {
  const { token } = useAuth();

  const [teachers,  setTeachers]  = useState<TeacherResponse[]>([]);
  const [courses,   setCourses]   = useState<CourseResponse[]>([]);
  const [students,  setStudents]  = useState<StudentResponse[]>([]);
  const [semesters, setSemesters] = useState<SemesterOption[]>([]);
  const [programs,  setPrograms]  = useState<ProgramOption[]>([]);

  const {
    filtros,
    resultados,
    isLoading,
    error,
    handleFiltroChange,
    handleGenerar,
    handleLimpiar,
  } = useReportes();

  useEffect(() => {
    if (!token) return;
    Promise.all([
      listTeachers(token),
      listCourses(token),
      listStudents(token),
      listSemesters(token),
      listPrograms(token),
    ]).then(([t, c, s, sem, prog]) => {
      setTeachers(t);
      setCourses(c);
      setStudents(s);
      // Mapear al shape de SemesterOption / ProgramOption
      setSemesters(sem.map((x: any) => ({ id: x.id, year: x.year, code: x.code })));
      setPrograms(prog.map((x: any) => ({ id: x.id, name: x.name })));
    });
  }, [token]);

  return (
    <AdminLayout>
      <div className="space-y-6">

        {/* Encabezado */}
        <h1 className="text-3xl font-serif font-bold text-text">
          Reportes académicos
        </h1>

        {/* Panel de filtros */}
        <ReportFilterPanel
          filtros={filtros}
          isLoading={isLoading}
          semesters={semesters}
          programs={programs}
          teachers={teachers}
          courses={courses}
          students={students}
          error={error}
          onChange={handleFiltroChange}
          onGenerar={handleGenerar}
          onLimpiar={handleLimpiar}
        />

        {/* Resultados */}
        {resultados !== null ? (
          <div className="space-y-4">
            <ReportExportBar resultados={resultados} />
            <ReportResultsTable resultados={resultados} />
          </div>
        ) : (
          !isLoading && (
            <EmptyState
              icon={FileTextIcon}
              title="Selecciona el tipo de reporte y genera"
              subtitle="Los resultados aparecerán aquí"
            />
          )
        )}
      </div>
    </AdminLayout>
  );
}
