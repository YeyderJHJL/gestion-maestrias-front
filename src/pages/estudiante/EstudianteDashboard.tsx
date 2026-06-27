import { useState, useEffect, useMemo } from 'react';
import { EstudianteLayout } from '../../layouts/EstudianteLayout';
import { StatusBadge } from '../../components/StatusBadge';
import {
  ClipboardListIcon,
  ReceiptIcon,
  AlertTriangleIcon,
  AwardIcon,
  Loader2Icon
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { listEnrollments, EnrollmentResponse } from '../../services/enrollmentsApiService';
import { listGrades, GradeResponse } from '../../services/gradesApiService';
import { listMyVouchers } from '../../services/vouchersApiService';
import { ApiError } from '../../services/api';
import { VoucherResponse } from '../../types/voucher';
import { getCourseTeachers } from '../../services/coursesApiService';

export function EstudianteDashboard() {
  const { user, token } = useAuth();
  
  const [enrollments, setEnrollments] = useState<EnrollmentResponse[]>([]);
  const [grades, setGrades] = useState<GradeResponse[]>([]);
  const [vouchers, setVouchers] = useState<VoucherResponse[]>([]);
  const [courseTeachers, setCourseTeachers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token || !user?.studentId) return;
    
    setLoading(true);
    Promise.all([
      listEnrollments(token, { studentId: user.studentId }),
      listGrades(token),
      listMyVouchers(token)
    ])
    .then(async ([enrollmentsData, gradesData, vouchersData]) => {
      setEnrollments(enrollmentsData);
      setGrades(gradesData.filter(g => g.studentId === user.studentId));
      setVouchers(vouchersData);

      const teachersMap: Record<string, string> = {};
      const uniqueCourseIds = [...new Set(enrollmentsData.map(e => e.courseId))];
      
      await Promise.all(uniqueCourseIds.map(async courseId => {
        try {
          const teachersData = await getCourseTeachers(token, courseId) as any[];
          if (teachersData && teachersData.length > 0) {
            teachersMap[courseId] = teachersData[0].teacherName;
          }
        } catch (e) {
          console.error(e);
        }
      }));
      setCourseTeachers(teachersMap);
    })
    .catch(err => {
      if (err instanceof ApiError) setError(err.message);
      else setError('Error al cargar datos del dashboard');
    })
    .finally(() => setLoading(false));
  }, [token, user]);

  const activeSemester = useMemo(() => {
    if (enrollments.length === 0) return null;
    const sorted = [...enrollments].sort((a, b) => b.semesterId - a.semesterId);
    return {
      id: sorted[0].semesterId,
      code: sorted[0].semesterCode,
      year: sorted[0].semesterYear,
    };
  }, [enrollments]);

  const activeEnrollments = useMemo(() => {
    if (!activeSemester) return [];
    return enrollments.filter(e => e.semesterId === activeSemester.id);
  }, [enrollments, activeSemester]);

  const gradesMap = useMemo(() => {
    const map = new Map<string, GradeResponse>();
    grades.forEach(g => map.set(g.enrollmentId, g));
    return map;
  }, [grades]);

  const currentCourses = useMemo(() => {
    return activeEnrollments.map(enr => {
      const grade = gradesMap.get(enr.id);
      return {
        id: enr.id,
        nombre: enr.courseName,
        docente: courseTeachers[enr.courseId] || '—',
        tipo: 'Regular', 
        notaFinal: grade?.value ?? null,
        estado: grade?.value != null ? (grade.value >= 14 ? 'aprobado' : 'desaprobado') : 'pendiente'
      };
    });
  }, [activeEnrollments, gradesMap, courseTeachers]);

  // Calcular estadísticas
  const stats = useMemo(() => {
    const cursosMatriculados = activeEnrollments.length;
    const notasPendientes = currentCourses.filter(c => c.notaFinal === null).length;
    const vouchersObservados = vouchers.filter(v => v.stateCode === 'OBSERVED').length;
    
    // Asumiremos 4 créditos por curso aprobado, ya que el API no lo devuelve actualmente
    const approvedCoursesCount = enrollments.filter(e => {
      const grade = gradesMap.get(e.id);
      return grade && grade.value >= 14;
    }).length;
    const creditosAcumulados = approvedCoursesCount * 4;

    return [
      {
        label: 'Cursos matriculados',
        value: cursosMatriculados.toString(),
        icon: ClipboardListIcon,
        color: 'text-primary'
      },
      {
        label: 'Notas pendientes',
        value: notasPendientes.toString(),
        icon: AlertTriangleIcon,
        color: notasPendientes > 0 ? 'text-warning' : 'text-text-muted'
      },
      {
        label: 'Vouchers observados',
        value: vouchersObservados.toString(),
        icon: ReceiptIcon,
        color: vouchersObservados > 0 ? 'text-accent' : 'text-text-muted'
      },
      {
        label: 'Créditos acumulados',
        value: creditosAcumulados.toString(),
        icon: AwardIcon,
        color: 'text-primary'
      }
    ];
  }, [activeEnrollments, currentCourses, vouchers, enrollments, gradesMap]);

  if (loading) {
    return (
      <EstudianteLayout>
        <div className="flex items-center justify-center py-16 gap-2 text-text-muted">
          <Loader2Icon className="w-5 h-5 animate-spin" />
          <span>Cargando dashboard...</span>
        </div>
      </EstudianteLayout>
    );
  }

  if (error) {
    return (
      <EstudianteLayout>
        <div className="px-4 py-3 rounded-lg bg-accent/10 border border-accent/30 text-sm text-accent">
          {error}
        </div>
      </EstudianteLayout>
    );
  }

  return (
    <EstudianteLayout>
      <div className="space-y-8">
        {/* Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-primary text-white rounded-lg p-6">
          <h1 className="text-3xl font-serif font-bold">
            Bienvenido/a, {user?.firstName}
          </h1>
          <p className="text-white/90 mt-1">
            Periodo activo: {activeSemester ? `${activeSemester.code} · Año ${activeSemester.year}` : 'Sin periodo activo'}
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-surface border border-border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-text-muted text-sm font-medium">
                      {stat.label}
                    </p>
                    <p className="text-3xl font-bold text-text">{stat.value}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Current Courses */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-surface border border-border rounded-lg shadow-sm overflow-hidden">
          
          <div className="px-6 py-4 border-b border-border">
            <h2 className="text-xl font-serif font-bold text-text">
              Cursos actuales
            </h2>
          </div>

          {currentCourses.length === 0 ? (
            <div className="px-6 py-8 text-center text-text-muted">
              No estás matriculado en ningún curso este semestre.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-surface-alt">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase">Curso</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase">Docente</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase">Tipo</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase">Nota final</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {currentCourses.map((course, index) =>
                  <tr
                    key={course.id}
                    className={index % 2 === 0 ? 'bg-surface' : 'bg-surface-alt'}>
                      <td className="px-6 py-4 text-sm text-text font-medium">
                        {course.nombre}
                      </td>
                      <td className="px-6 py-4 text-sm text-text-muted">
                        {course.docente}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge variant={course.tipo === 'Regular' ? 'activo' : 'retiro'}>
                          {course.tipo}
                        </StatusBadge>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {course.notaFinal !== null ? (
                          <span className="font-semibold text-text">
                            {course.notaFinal}
                          </span>
                        ) : (
                          <span className="text-text-muted">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge
                        variant={
                          course.estado === 'aprobado' ? 'aprobado' :
                          course.estado === 'desaprobado' ? 'desaprobado' : 'pendiente'
                        }>
                          {course.estado === 'aprobado' ? 'Aprobado' :
                           course.estado === 'desaprobado' ? 'Desaprobado' : 'Pendiente'}
                        </StatusBadge>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </EstudianteLayout>
  );
}