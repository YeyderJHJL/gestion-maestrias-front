import { useState, useEffect, useMemo } from 'react';
import { EstudianteLayout } from '../../layouts/EstudianteLayout';
import { StatusBadge } from '../../components/StatusBadge';
import { InfoIcon, Loader2Icon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { listEnrollments, EnrollmentResponse } from '../../services/enrollmentsApiService';
import { listGrades, GradeResponse } from '../../services/gradesApiService';
import { ApiError } from '../../services/api';

export function EstudianteNotas() {
  const { user, token } = useAuth();
  
  const [enrollments, setEnrollments] = useState<EnrollmentResponse[]>([]);
  const [grades, setGrades] = useState<GradeResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedPeriod, setSelectedPeriod] = useState<string>('');

  useEffect(() => {
    if (!token || !user?.studentId) return;
    
    setLoading(true);
    // Para simplificar, obtenemos notas y matrículas al mismo tiempo
    Promise.all([
      listEnrollments(token, { studentId: user.studentId }),
      listGrades(token) // backend podría filtrar por token de usuario o requerir ?studentId
    ])
    .then(([enrollmentsData, gradesData]) => {
      setEnrollments(enrollmentsData);
      
      // Filtrar grades por si listGrades devuelve de todos (idealmente el backend filtra)
      const myGrades = gradesData.filter(g => g.studentId === user.studentId);
      setGrades(myGrades);
      
      // Seleccionar semestre más reciente por defecto
      if (enrollmentsData.length > 0) {
        const sorted = [...enrollmentsData].sort((a, b) => b.semesterId - a.semesterId);
        setSelectedPeriod(sorted[0].semesterCode);
      }
    })
    .catch(err => {
      if (err instanceof ApiError) setError(err.message);
      else setError('Error al cargar notas');
    })
    .finally(() => setLoading(false));
  }, [token, user]);

  const periods = useMemo(() => {
    const unique = new Set(enrollments.map(e => e.semesterCode));
    return Array.from(unique).sort((a, b) => b.localeCompare(a));
  }, [enrollments]);

  const filteredEnrollments = useMemo(() => {
    return enrollments.filter(e => e.semesterCode === selectedPeriod);
  }, [enrollments, selectedPeriod]);

  const gradesMap = useMemo(() => {
    const map = new Map<string, GradeResponse>();
    grades.forEach(g => map.set(g.enrollmentId, g));
    return map;
  }, [grades]);

  const tableData = useMemo(() => {
    return filteredEnrollments.map(enr => {
      const grade = gradesMap.get(enr.id);
      return {
        id: enr.id,
        curso: enr.courseName,
        tipo: 'Regular', // Esto podría venir del course o enrollment real
        docente: '—', // El enrollment actual no tiene docente (requeriría ver el assignments)
        notaFinal: grade?.value ?? null,
        estado: grade?.value != null ? (grade.value >= 14 ? 'aprobado' : 'desaprobado') : 'pendiente'
      };
    });
  }, [filteredEnrollments, gradesMap]);

  const hasPendingGrades = tableData.some((g) => g.estado === 'pendiente');
  const allGradesRegistered = tableData.length > 0 && tableData.every((g) => g.notaFinal !== null);
  
  const promedio = allGradesRegistered ?
    (tableData.reduce((sum, g) => sum + (g.notaFinal || 0), 0) / tableData.length).toFixed(2) 
    : null;

  return (
    <EstudianteLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-serif font-bold text-text">Mis Notas</h1>

        {loading ? (
           <div className="flex items-center justify-center py-16 gap-2 text-text-muted">
            <Loader2Icon className="w-5 h-5 animate-spin" />
            <span>Cargando notas...</span>
          </div>
        ) : error ? (
           <div className="px-4 py-3 rounded-lg bg-accent/10 border border-accent/30 text-sm text-accent">
            {error}
          </div>
        ) : enrollments.length === 0 ? (
           <div className="flex items-center justify-center py-16">
            <p className="text-text-muted text-sm">No tienes notas registradas.</p>
          </div>
        ) : (
          <>
            {/* Period Selector */}
            {periods.length > 0 && (
              <div className="bg-surface border border-border rounded-lg p-4">
                <label className="block text-sm font-medium text-text mb-2">
                  Seleccionar periodo
                </label>
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                  {periods.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Period Summary */}
            {allGradesRegistered && tableData.length > 0 && (
              <div className="bg-primary/10 border border-primary rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-text-muted text-sm mb-1">
                      Periodo: {selectedPeriod}
                    </p>
                    <p className="text-3xl font-bold text-text">
                      Promedio: {promedio}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Grades Table */}
            {tableData.length > 0 ? (
              <div className="bg-surface border border-border rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-surface-alt">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase">
                          Curso
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase">
                          Tipo
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase">
                          Nota final
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase">
                          Estado
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {tableData.map((grade, index) =>
                      <tr
                        key={grade.id}
                        className={index % 2 === 0 ? 'bg-surface' : 'bg-surface-alt'}>
                          <td className="px-6 py-4 text-sm text-text font-medium">
                            {grade.curso}
                          </td>
                          <td className="px-6 py-4">
                            <StatusBadge variant={grade.tipo === 'Regular' ? 'activo' : 'retiro'}>
                              {grade.tipo}
                            </StatusBadge>
                          </td>
                          <td className="px-6 py-4 text-sm">
                            {grade.notaFinal !== null ?
                              <span className="font-bold text-text text-base">
                                {grade.notaFinal}
                              </span> :
                              <span className="text-text-muted">—</span>
                            }
                          </td>
                          <td className="px-6 py-4">
                            <StatusBadge
                            variant={
                              grade.estado === 'aprobado' ? 'aprobado' :
                              grade.estado === 'desaprobado' ? 'desaprobado' : 'pendiente'
                            }>
                              {grade.estado === 'aprobado' ? 'Aprobado' :
                               grade.estado === 'desaprobado' ? 'Desaprobado' : 'Pendiente'}
                            </StatusBadge>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center py-8 bg-surface border border-border rounded-lg">
                <p className="text-text-muted text-sm">No hay cursos en este periodo.</p>
              </div>
            )}

            {/* Info Banner */}
            {hasPendingGrades && (
              <div className="bg-primary/10 border border-primary rounded-lg p-4 flex items-start gap-3">
                <InfoIcon className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-sm text-text">
                  Algunos cursos aún no tienen nota registrada. Si el curso ya
                  finalizó, contacta a tu docente o Administración.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </EstudianteLayout>
  );
}