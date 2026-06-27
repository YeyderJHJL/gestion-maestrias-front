import { useEffect, useState } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import { listMyAssignments } from '../../../../services/assignmentsApiService';
import { getCourseStudents } from '../../../../services/coursesApiService';
import { listGrades } from '../../../../services/gradesApiService';
import type { AssignmentResponse } from '../../../../services/assignmentsApiService';

export interface CourseStats {
  notasRegistradas: number;
  totalEstudiantes: number;
}

export function useDashboard() {
  const { token } = useAuth();
  const [assignments, setAssignments] = useState<AssignmentResponse[]>([]);
  const [courseStats, setCourseStats] = useState<Record<string, CourseStats>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    setLoading(true);

    listMyAssignments(token)
      .then(async (data) => {
        setAssignments(data);

        const stats: Record<string, CourseStats> = {};
        await Promise.all(
          data.map(async (a) => {
            try {
              const [students, grades] = await Promise.all([
                getCourseStudents(token, a.courseId),
                listGrades(token, { courseId: a.courseId }),
              ]);
              stats[a.courseId] = {
                totalEstudiantes: students.filter((s) => s.stateId === 5).length,
                notasRegistradas: grades.length,
              };
            } catch {
              stats[a.courseId] = { totalEstudiantes: 0, notasRegistradas: 0 };
            }
          })
        );
        setCourseStats(stats);
      })
      .catch((e) => setError(e instanceof Error ? e.message : 'Error al cargar cursos'))
      .finally(() => setLoading(false));
  }, [token]);

  return { assignments, courseStats, loading, error };
}
