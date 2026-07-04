import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import { listEnrollments, EnrollmentResponse } from '../../../../services/enrollmentsApiService';
import { listGrades, GradeResponse } from '../../../../services/gradesApiService';
import { listMyVouchers } from '../../../../services/vouchersApiService';
import { ApiError } from '../../../../services/api';
import { VoucherResponse } from '../../../../types/voucher';
import { getCourseTeachers } from '../../../../services/coursesApiService';
import {
  ClipboardListIcon,
  ReceiptIcon,
  AlertTriangleIcon,
  AwardIcon,
} from 'lucide-react';

export function useDashboard() {
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
          const teachersData = await getCourseTeachers(token, courseId);
          if (teachersData && teachersData.length > 0) {
            teachersMap[courseId] = teachersData[0].teacherName;
          }
        } catch {
          teachersMap[courseId] = 'Error al cargar docente';
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

  const stats = useMemo(() => {
    const cursosMatriculados = activeEnrollments.length;
    const notasPendientes = currentCourses.filter(c => c.notaFinal === null).length;
    const vouchersObservados = vouchers.filter(v => v.stateCode === 'OBSERVED').length;

    const approvedCoursesCount = enrollments.filter(e => {
      const grade = gradesMap.get(e.id);
      return grade && grade.value >= 14;
    }).length;
    const creditosAcumulados = approvedCoursesCount * 4;

    return [
      { label: 'Cursos matriculados', value: cursosMatriculados.toString(), icon: ClipboardListIcon, color: 'text-primary' },
      { label: 'Notas pendientes', value: notasPendientes.toString(), icon: AlertTriangleIcon, color: notasPendientes > 0 ? 'text-warning' : 'text-text-muted' },
      { label: 'Vouchers observados', value: vouchersObservados.toString(), icon: ReceiptIcon, color: vouchersObservados > 0 ? 'text-accent' : 'text-text-muted' },
      { label: 'Créditos acumulados', value: creditosAcumulados.toString(), icon: AwardIcon, color: 'text-primary' },
    ];
  }, [activeEnrollments, currentCourses, vouchers, enrollments, gradesMap]);

  return {
    user,
    loading,
    error,
    activeSemester,
    currentCourses,
    stats,
  };
}
