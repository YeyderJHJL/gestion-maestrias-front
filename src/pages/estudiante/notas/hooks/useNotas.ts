import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import { listEnrollments, EnrollmentResponse } from '../../../../services/enrollmentsApiService';
import { listGrades, GradeResponse } from '../../../../services/gradesApiService';
import { ApiError } from '../../../../services/api';

export function useNotas() {
  const { user, token } = useAuth();

  const [enrollments, setEnrollments] = useState<EnrollmentResponse[]>([]);
  const [grades, setGrades] = useState<GradeResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<string>('');

  useEffect(() => {
    if (!token || !user?.studentId) return;

    setLoading(true);
    Promise.all([
      listEnrollments(token, { studentId: user.studentId }),
      listGrades(token)
    ])
    .then(([enrollmentsData, gradesData]) => {
      setEnrollments(enrollmentsData);
      const myGrades = gradesData.filter(g => g.studentId === user.studentId);
      setGrades(myGrades);

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
        tipo: 'Regular',
        docente: '—',
        notaFinal: grade?.value ?? null,
        estado: grade?.value != null ? (grade.value >= 14 ? 'aprobado' : 'desaprobado') : 'pendiente'
      };
    });
  }, [filteredEnrollments, gradesMap]);

  const hasPendingGrades = tableData.some((g) => g.estado === 'pendiente');
  const allGradesRegistered = tableData.length > 0 && tableData.every((g) => g.notaFinal !== null);

  const promedio = allGradesRegistered
    ? (tableData.reduce((sum, g) => sum + (g.notaFinal || 0), 0) / tableData.length).toFixed(2)
    : null;

  return {
    loading,
    error,
    enrollments,
    periods,
    selectedPeriod,
    setSelectedPeriod,
    tableData,
    hasPendingGrades,
    allGradesRegistered,
    promedio,
  };
}
