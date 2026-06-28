import { useEffect, useState } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import { getCourse, getCourseTeachers, CourseResponse } from '../../../../services/coursesApiService';
import { AssignmentResponse } from '../../../../services/assignmentsApiService';
import { ApiError } from '../../../../services/api';

export function useCursoDetalle(courseId: string | undefined) {
  const { token } = useAuth();

  const [course, setCourse] = useState<CourseResponse | null>(null);
  const [teachers, setTeachers] = useState<AssignmentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [syllabusPreviewOpen, setSyllabusPreviewOpen] = useState(false);

  useEffect(() => {
    if (!token || !courseId) return;

    setLoading(true);
    Promise.all([
      getCourse(token, courseId),
      getCourseTeachers(token, courseId)
    ])
    .then(([courseData, teachersData]) => {
      setCourse(courseData);
      setTeachers(teachersData);
    })
    .catch(err => {
      if (err instanceof ApiError) setError(err.message);
      else setError('Error al cargar la información del curso');
    })
    .finally(() => setLoading(false));
  }, [token, courseId]);

  const availableSyllabus = course?.syllabusFile || teachers.find(t => t.syllabusFile)?.syllabusFile;

  return {
    course,
    teachers,
    loading,
    error,
    availableSyllabus,
    syllabusPreviewOpen,
    setSyllabusPreviewOpen,
  };
}
