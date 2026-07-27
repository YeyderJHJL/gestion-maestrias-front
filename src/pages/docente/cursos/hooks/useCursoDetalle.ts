import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import { getCourse } from '../../../../services/coursesApiService';
import { getCourseStudents } from '../../../../services/coursesApiService';
import {
  listGrades,
  createGrade,
  updateGrade,
} from '../../../../services/gradesApiService';
import type { GradeResponse, GradeRequest } from '../../../../services/gradesApiService';
import { uploadSyllabus, getFileUrl } from '../../../../services/filesApiService';
import { listMyAssignments, updateAssignmentSyllabus } from '../../../../services/assignmentsApiService';
import type { CourseResponse } from '../../../../services/coursesApiService';
import type { EnrollmentResponse } from '../../../../services/enrollmentsApiService';
import type { StoredFileSummary } from '../../../../services/filesApiService';


type TabKey = 'silabo' | 'estudiantes' | 'notas';

export interface EditingGrade {
  gradeId?: string;
  enrollmentId: string;
  studentId: string;
  studentName: string;
  currentValue?: number;
}

export interface StudentGradeRow {
  enrollment: EnrollmentResponse;
  grade: GradeResponse | null;
}

export function useCursoDetalle(courseId: string) {
  const { token } = useAuth();

  const [course, setCourse] = useState<CourseResponse | null>(null);
  const [students, setStudents] = useState<EnrollmentResponse[]>([]);
  const [grades, setGrades] = useState<GradeResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [accessDenied, setAccessDenied] = useState(false);

  const [activeTab, setActiveTab] = useState<TabKey>('silabo');
  const [silaboUploading, setSilaboUploading] = useState(false);
  const [syllabusFile, setSyllabusFile] = useState<StoredFileSummary | null>(null);
  const [syllabusUrl, setSyllabusUrl] = useState<string | null>(null);
  const [loadingSyllabus, setLoadingSyllabus] = useState(false);

  const [editingGrade, setEditingGrade] = useState<EditingGrade | null>(null);
  const [gradeValue, setGradeValue] = useState('');
  const [gradeReason, setGradeReason] = useState('');
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
    setAccessDenied(false);
    try {
      const assignmentsData = await listMyAssignments(token);
      const matching = assignmentsData.find((a) => a.courseId === courseId);

      if (!matching) {
        setAccessDenied(true);
        setLoading(false);
        return;
      }

      const [courseData, studentsData, gradesData] = await Promise.all([
        getCourse(token, courseId),
        getCourseStudents(token, courseId),
        listGrades(token, { courseId }),
      ]);
      setCourse(courseData);
      setStudents(studentsData);
      setGrades(gradesData);
      setSyllabusFile(matching.syllabusFile ?? null);
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
    setEditingGrade({
      gradeId: grade.id,
      enrollmentId: grade.enrollmentId,
      studentId: grade.studentId,
      studentName,
      currentValue: grade.value,
    });
    setGradeValue(String(grade.value));
    setGradeReason('');
  };

  const openCreateGrade = (enrollment: EnrollmentResponse) => {
    setEditingGrade({
      enrollmentId: enrollment.id,
      studentId: enrollment.studentId,
      studentName: enrollment.studentName,
    });
    setGradeValue('');
    setGradeReason('');
  };

  const closeEditGrade = () => {
    setEditingGrade(null);
    setGradeValue('');
    setGradeReason('');
  };

  const gradesByStudentId = new Map<string, GradeResponse>();
  grades.forEach((g) => gradesByStudentId.set(g.studentId, g));

  const mergedRows: StudentGradeRow[] = students
    .map((enrollment) => ({
      enrollment,
      grade: gradesByStudentId.get(enrollment.studentId) ?? null,
    }));

  const handleSaveGrade = async () => {
    if (!token || !editingGrade) return;
    setSavingGrade(true);
    try {
      const request: GradeRequest = {
        enrollmentId: editingGrade.enrollmentId,
        stateId: Number(gradeValue) >= 11 ? 3 : 4,
        value: Number(gradeValue),
        ...(editingGrade.gradeId ? { reason: gradeReason } : {}),
      };

      if (editingGrade.gradeId) {
        await updateGrade(token, editingGrade.gradeId, request);
        showToast('success', 'Nota actualizada correctamente');
      } else {
        await createGrade(token, request);
        showToast('success', 'Nota registrada correctamente');
      }

      closeEditGrade();
      loadData();
    } catch (e) {
      showToast('error', 'Error al guardar la nota');
    } finally {
      setSavingGrade(false);
    }
  };

  const notasRegistradas = mergedRows.filter((r) => r.grade !== null).length;
  const totalEstudiantes = mergedRows.length;

  return {
    course, students, grades,
    syllabusFile,
    mergedRows,
    loading, error, accessDenied,
    activeTab, setActiveTab,
    silaboUploading, handleSyllabusUpload,
    syllabusUrl, loadingSyllabus, loadSyllabusUrl,
    editingGrade, gradeValue, setGradeValue, gradeReason, setGradeReason,
    openEditGrade, openCreateGrade, closeEditGrade, handleSaveGrade, savingGrade,
    toast, setToast,
    notasRegistradas, totalEstudiantes,
  };
}
