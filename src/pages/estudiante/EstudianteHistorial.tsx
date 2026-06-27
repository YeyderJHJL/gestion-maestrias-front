import { useState, useEffect, useMemo } from 'react';
import { EstudianteLayout } from '../../layouts/EstudianteLayout';
import { StatusBadge } from '../../components/StatusBadge';
import { ChevronDownIcon, DownloadIcon, Loader2Icon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { listEnrollments, EnrollmentResponse } from '../../services/enrollmentsApiService';
import { listGrades, GradeResponse } from '../../services/gradesApiService';
import { ApiError } from '../../services/api';

// Placeholders — el backend no devuelve créditos por curso ni total del plan aún
const CREDITS_PER_COURSE = 4;
const TOTAL_PLAN_CREDITS = 48;

export function EstudianteHistorial() {
  const { user, token } = useAuth();
  
  const [enrollments, setEnrollments] = useState<EnrollmentResponse[]>([]);
  const [grades, setGrades] = useState<GradeResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [expandedPeriod, setExpandedPeriod] = useState<string | null>(null);

  useEffect(() => {
    if (!token || !user?.studentId) return;
    
    setLoading(true);
    Promise.all([
      listEnrollments(token, { studentId: user.studentId }),
      listGrades(token)
    ])
    .then(([enrollmentsData, gradesData]) => {
      setEnrollments(enrollmentsData);
      setGrades(gradesData.filter(g => g.studentId === user.studentId));
      
      if (enrollmentsData.length > 0) {
        // Expandir por defecto el periodo más reciente
        const sorted = [...enrollmentsData].sort((a, b) => b.semesterId - a.semesterId);
        setExpandedPeriod(sorted[0].semesterCode);
      }
    })
    .catch(err => {
      if (err instanceof ApiError) setError(err.message);
      else setError('Error al cargar el historial académico');
    })
    .finally(() => setLoading(false));
  }, [token, user]);

  const history = useMemo(() => {
    const gradesMap = new Map<string, GradeResponse>();
    grades.forEach(g => gradesMap.set(g.enrollmentId, g));

    // Agrupar matrículas por semestre
    const periodsMap = new Map<number, {
      periodo: string,
      year: number,
      semesterId: number,
      cursos: any[]
    }>();

    enrollments.forEach(enr => {
      if (!periodsMap.has(enr.semesterId)) {
        periodsMap.set(enr.semesterId, {
          periodo: enr.semesterCode,
          year: enr.semesterYear,
          semesterId: enr.semesterId,
          cursos: []
        });
      }

      const grade = gradesMap.get(enr.id);
      const isApproved = grade && grade.value >= 14;

      periodsMap.get(enr.semesterId)!.cursos.push({
        id: enr.id,
        nombre: enr.courseName,
        tipo: 'Regular',
        notaFinal: grade?.value ?? null,
        estado: grade?.value != null ? (isApproved ? 'aprobado' : 'desaprobado') : 'pendiente',
        creditos: CREDITS_PER_COURSE
      });
    });

    // Convertir a array y ordenar de más reciente a más antiguo
    const periodsArray = Array.from(periodsMap.values()).sort((a, b) => b.semesterId - a.semesterId);
    
    // Calcular créditos por periodo
    return periodsArray.map(p => {
      const creditos = p.cursos
        .filter(c => c.estado === 'aprobado')
        .reduce((sum, c) => sum + c.creditos, 0);
      return { ...p, creditos };
    });
  }, [enrollments, grades]);

  const totalCreditos = useMemo(() => {
    return history.reduce((sum, p) => sum + p.creditos, 0);
  }, [history]);

  const totalCreditosPlan = TOTAL_PLAN_CREDITS;
  const progressPercentage = (totalCreditos / totalCreditosPlan) * 100;
  const periodosCompletados = history.length;

  return (
    <EstudianteLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-serif font-bold text-text">
          Historial Académico
        </h1>

        {loading ? (
          <div className="flex items-center justify-center py-16 gap-2 text-text-muted">
            <Loader2Icon className="w-5 h-5 animate-spin" />
            <span>Cargando historial...</span>
          </div>
        ) : error ? (
          <div className="px-4 py-3 rounded-lg bg-accent/10 border border-accent/30 text-sm text-accent">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - History by Period */}
            <div className="lg:col-span-2 space-y-4">
              {history.length === 0 ? (
                <div className="bg-surface border border-border rounded-lg p-8 text-center text-text-muted">
                  Aún no tienes historial académico registrado.
                </div>
              ) : (
                history.map((period) => (
                  <div
                    key={period.semesterId}
                    className="bg-surface border border-border rounded-lg overflow-hidden shadow-sm">
                    <button
                      onClick={() =>
                        setExpandedPeriod(
                          expandedPeriod === period.periodo ? null : period.periodo
                        )
                      }
                      className="w-full flex items-center justify-between px-6 py-4 bg-surface-alt hover:bg-surface transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="text-left">
                          <p className="font-serif font-bold text-text text-lg">
                            {period.periodo}
                          </p>
                          <p className="text-sm text-text-muted">
                            {period.year} · {period.creditos} créditos aprobados
                          </p>
                        </div>
                      </div>
                      <ChevronDownIcon
                        className={`w-5 h-5 text-text-muted transition-transform ${
                          expandedPeriod === period.periodo ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {expandedPeriod === period.periodo && (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-surface-alt">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase">Curso</th>
                              <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase">Tipo</th>
                              <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase">Nota final</th>
                              <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase">Estado</th>
                              <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase">Créditos</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border">
                            {period.cursos.map((curso) => (
                              <tr
                                key={curso.id}
                                className={`${
                                  curso.estado === 'aprobado'
                                    ? 'bg-success/5'
                                    : curso.estado === 'desaprobado'
                                    ? 'bg-accent/5'
                                    : 'bg-surface'
                                }`}>
                                <td className="px-6 py-4 text-sm text-text font-medium">
                                  {curso.nombre}
                                </td>
                                <td className="px-6 py-4">
                                  <StatusBadge variant={curso.tipo === 'Regular' ? 'activo' : 'retiro'}>
                                    {curso.tipo}
                                  </StatusBadge>
                                </td>
                                <td className="px-6 py-4 text-sm font-bold text-text">
                                  {curso.notaFinal !== null ? curso.notaFinal : '—'}
                                </td>
                                <td className="px-6 py-4">
                                  <StatusBadge
                                    variant={
                                      curso.estado === 'aprobado' ? 'aprobado' :
                                      curso.estado === 'desaprobado' ? 'desaprobado' : 'pendiente'
                                    }>
                                    {curso.estado === 'aprobado' ? 'Aprobado' :
                                     curso.estado === 'desaprobado' ? 'Desaprobado' : 'Pendiente'}
                                  </StatusBadge>
                                </td>
                                <td className="px-6 py-4 text-sm text-text">
                                  {curso.creditos}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Right Sidebar - Academic Summary */}
            <div className="space-y-6">
              <div className="bg-surface border border-border rounded-lg p-6 shadow-sm sticky top-24">
                <div className="border-b-2 border-accent pb-2 mb-6">
                  <h2 className="text-lg font-serif font-bold text-text">
                    Resumen académico
                  </h2>
                </div>

                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-text-muted">Créditos acumulados</span>
                      <span className="font-bold text-text">
                        {totalCreditos} / {totalCreditosPlan}
                      </span>
                    </div>
                    <div className="w-full bg-surface-alt rounded-full h-3">
                      <div
                        className="bg-primary h-3 rounded-full transition-all"
                        style={{
                          width: `${Math.min(progressPercentage, 100)}%`
                        }}
                      />
                    </div>
                    <p className="text-xs text-text-muted mt-1">
                      {Math.min(progressPercentage, 100).toFixed(0)}% del plan de estudios
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-text-muted text-sm">
                        Periodos registrados
                      </span>
                      <span className="font-semibold text-text">
                        {periodosCompletados}
                      </span>
                    </div>
                    <div className="pt-3 border-t border-border">
                      <StatusBadge variant="activo">Al día</StatusBadge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Download Button */}
              <button 
                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors font-semibold shadow-sm"
                onClick={() => alert('La descarga de PDF aún no está implementada por RF-MA-31')}
              >
                <DownloadIcon className="w-5 h-5" />
                Descargar récord académico en PDF
              </button>
            </div>
          </div>
        )}
      </div>
    </EstudianteLayout>
  );
}