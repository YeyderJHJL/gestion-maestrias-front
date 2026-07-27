import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import { listEnrollments, EnrollmentResponse } from '../../../../services/enrollmentsApiService';
import { listGrades, GradeResponse } from '../../../../services/gradesApiService';
import { ApiError } from '../../../../services/api';

// Placeholders — el backend no devuelve créditos por curso ni total del plan aún
const CREDITS_PER_COURSE = 4;
const TOTAL_PLAN_CREDITS = 48;

export interface HistoryCourse {
  id: string;
  nombre: string;
  tipo: string;
  notaFinal: number | null;
  estado: 'aprobado' | 'desaprobado' | 'pendiente';
  creditos: number;
}

export interface HistoryPeriod {
  periodo: string;
  year: number;
  semesterId: number;
  cursos: HistoryCourse[];
  creditos: number;
}

export function useHistorial() {
  const { user, token } = useAuth();

  const [enrollments, setEnrollments] = useState<EnrollmentResponse[]>([]);
  const [grades, setGrades] = useState<GradeResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedPeriod, setExpandedPeriod] = useState<string | null>(null);

  useEffect(() => {
    if (!token || !user?.studentId) return;

    setLoading(true);
    listEnrollments(token, { studentId: user.studentId })
    .then(async (enrollmentsData) => {
      setEnrollments(enrollmentsData);

      const uniqueCourseIds = [...new Set(enrollmentsData.map(e => e.courseId))];
      const gradesResults = await Promise.allSettled(
        uniqueCourseIds.map(courseId => listGrades(token, { courseId }))
      );
      const fetchedGrades: GradeResponse[] = [];
      gradesResults.forEach(res => {
        if (res.status === 'fulfilled' && Array.isArray(res.value)) {
          fetchedGrades.push(...res.value);
        }
      });
      setGrades(fetchedGrades.filter(g => g.studentId === user.studentId));

      if (enrollmentsData.length > 0) {
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

  const history = useMemo((): HistoryPeriod[] => {
    const gradesMap = new Map<string, GradeResponse>();
    grades.forEach(g => gradesMap.set(g.enrollmentId, g));

    const periodsMap = new Map<number, {
      periodo: string;
      year: number;
      semesterId: number;
      cursos: HistoryCourse[];
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

    const periodsArray = Array.from(periodsMap.values()).sort((a, b) => b.semesterId - a.semesterId);

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

  return {
    loading,
    error,
    history,
    expandedPeriod,
    setExpandedPeriod,
    totalCreditos,
    totalCreditosPlan,
    progressPercentage,
    periodosCompletados,
  };
}
