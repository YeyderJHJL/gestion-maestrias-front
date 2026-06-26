import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import { getCourse } from '../../../../services/coursesApiService';
import { getCourseStudents } from '../../../../services/coursesApiService';
import { listGrades, updateGrade } from '../../../../services/gradesApiService';
import { uploadSyllabus, getFileUrl } from '../../../../services/filesApiService';
import { updateAssignmentSyllabus } from '../../../../services/assignmentsApiService';
import type { CourseResponse } from '../../../../services/coursesApiService';
import type { EnrollmentResponse } from '../../../../services/enrollmentsApiService';
import type { GradeResponse } from '../../../../services/gradesApiService';


type TabKey = 'silabo' | 'estudiantes' | 'notas';

export interface EditingGrade {
  gradeId: string;
  studentName: string;
  currentValue: number;
}

export function useCursoDetalle(courseId: string) {
  const { token } = useAuth();

  const [course, setCourse] = useState<CourseResponse | null>(null);
  const [students, setStudents] = useState<EnrollmentResponse[]>([]);
  const [grades, setGrades] = useState<GradeResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<TabKey>('silabo');
  const [silaboUploading, setSilaboUploading] = useState(false);
  const [syllabusUrl, setSyllabusUrl] = useState<string | null>(null);
  const [loadingSyllabus, setLoadingSyllabus] = useState(false);

  const [editingGrade, setEditingGrade] = useState<EditingGrade | null>(null);
  const [gradeValue, setGradeValue] = useState('');
  const [gradeMotivo, setGradeMotivo] = useState('');
  const [savingGrade, setSavingGrade] = useState(false);

  const [toast, setToast] = useState<{
    visible: boolean; variant: 'success' | 'error'; message: string
  }>({ visible: false, variant: 'success', message: '' });

  const showToast = (variant: 'success' | 'error', message: string) =>
    setToast({ visible: true, variant, message });

  const loadData = useCallback(async () => {
    if (!token || !courseId) return;
    setLoading(true);
    setError(null);
    try {
      const [courseData, studentsData, gradesData] = await Promise.all([
        getCourse(token, courseId),
        getCourseStudents(token, courseId),
        listGrades(token),
      ]);
      setCourse(courseData);
      setStudents(studentsData);
      setGrades(gradesData.filter((g) => g.courseId === courseId));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar datos del curso');
    } finally {
      setLoading(false);
    }
  }, [token, courseId]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleSyllabusUpload = async (file: File) => {
    if (!token || !courseId) return;
    setSilaboUploading(true);
    try {
      const uploaded = await uploadSyllabus(token, file);
      const semesterId = students[0]?.semesterId;
      if (semesterId) {
        await updateAssignmentSyllabus(token, courseId, semesterId, {
          syllabusFileId: uploaded.id,
        });
      }
      showToast('success', 'Sílabo subido correctamente');
      loadData();
    } catch (e) {
      showToast('error', 'Error al subir el sílabo');
    } finally {
      setSilaboUploading(false);
    }
  };

  const loadSyllabusUrl = useCallback(async (fileId: string) => {
    if (!token) return;
    setLoadingSyllabus(true);
    try {
      const file = await getFileUrl(token, fileId);
      setSyllabusUrl(file.downloadUrl);
    } catch {
      setSyllabusUrl(null);
    } finally {
      setLoadingSyllabus(false);
    }
  }, [token]);

  const openEditGrade = (grade: GradeResponse, studentName: string) => {
    setEditingGrade({ gradeId: grade.id, studentName, currentValue: grade.value });
    setGradeValue(String(grade.value));
    setGradeMotivo('');
  };

  const closeEditGrade = () => {
    setEditingGrade(null);
    setGradeValue('');
    setGradeMotivo('');
  };

  const handleSaveGrade = async () => {
    if (!token || !editingGrade) return;
    setSavingGrade(true);
    try {
      await updateGrade(token, editingGrade.gradeId, {
        enrollmentId: '',
        stateId: Number(gradeValue) >= 11 ? 3 : 4,
        value: Number(gradeValue),
      });
      showToast('success', 'Nota actualizada correctamente');
      closeEditGrade();
      loadData();
    } catch (e) {
      showToast('error', 'Error al actualizar la nota');
    } finally {
      setSavingGrade(false);
    }
  };

  const notasRegistradas = grades.length;
  const totalEstudiantes = students.length;

  return {
    course, students, grades,
    loading, error,
    activeTab, setActiveTab,
    silaboUploading, handleSyllabusUpload,
    syllabusUrl, loadingSyllabus, loadSyllabusUrl,
    editingGrade, gradeValue, setGradeValue, gradeMotivo, setGradeMotivo,
    openEditGrade, closeEditGrade, handleSaveGrade, savingGrade,
    toast, setToast,
    notasRegistradas, totalEstudiantes,
  };
}
