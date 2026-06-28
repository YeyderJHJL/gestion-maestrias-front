import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import { listEnrollments, EnrollmentResponse } from '../../../../services/enrollmentsApiService';
import { ApiError } from '../../../../services/api';

export function useMatricula() {
  const { user, token } = useAuth();
  const [enrollments, setEnrollments] = useState<EnrollmentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [previewFileId, setPreviewFileId] = useState<string | null>(null);

  useEffect(() => {
    if (!token || !user?.studentId) return;

    setLoading(true);
    listEnrollments(token, { studentId: user.studentId })
      .then(setEnrollments)
      .catch((err) => {
        if (err instanceof ApiError) setError(err.message);
        else setError('Error al cargar matrículas');
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

  return {
    loading,
    error,
    enrollments,
    activeSemester,
    activeEnrollments,
    previewFileId,
    setPreviewFileId,
  };
}
