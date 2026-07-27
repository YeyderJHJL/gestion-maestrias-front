import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import { ApiError } from '../../../../services/api';
import { CourseResponse, listCourses } from '../../../../services/coursesApiService';
import { SemesterResponse, listSemesters } from '../../../../services/semestersApiService';
import {
  EnrollmentResponse,
  EnrollmentBulkResponse,
  ENROLLMENT_STATES,
  createBulkEnrollment,
} from '../../../../services/enrollmentsApiService';
import { StudentResponse } from '../../../../services/studentsApiService';
import { uploadResolution } from '../../../../services/resolutionFileService';
import { BulkFormState } from '../components/EnrollmentBulkForm';

const EMPTY_BULK_FORM: BulkFormState = {
  courseId: '',
  semesterId: '',
  stateId: ENROLLMENT_STATES.ENROLLED.id,
  enrollmentDate: new Date().toISOString().split('T')[0],
  resolutionFile: null,
  observations: '',
};

type BulkPhase = 'selecting' | 'confirming' | 'processing' | 'results';

interface UseBulkEnrollmentOptions {
  students: StudentResponse[];
  allEnrollments: EnrollmentResponse[];
  showToast: (variant: 'success' | 'error', message: string) => void;
  onSuccess: () => void;
}

export function useBulkEnrollment({
  students,
  allEnrollments,
  showToast,
  onSuccess,
}: UseBulkEnrollmentOptions) {
  const { token, user } = useAuth();
  const isCoordinator = user?.role === 'COORDINATOR';

  const [isBulkMode, setIsBulkMode] = useState(false);
  const [phase, setPhase] = useState<BulkPhase>('selecting');

  const [bulkForm, setBulkForm] = useState<BulkFormState>(EMPTY_BULK_FORM);
  const [courses, setCourses] = useState<CourseResponse[]>([]);
  const [semesters, setSemesters] = useState<SemesterResponse[]>([]);
  const [loadingDeps, setLoadingDeps] = useState(false);

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkResult, setBulkResult] = useState<EnrollmentBulkResponse | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // ── Alumnos ya matriculados en el curso destino ────────────────────────────
  const enrolledInTargetCourse = useMemo(() => {
    if (!bulkForm.courseId) return new Set<string>();
    return new Set(
      allEnrollments
        .filter((e) => e.courseId === bulkForm.courseId)
        .map((e) => e.studentId)
    );
  }, [allEnrollments, bulkForm.courseId]);

  // ── Cargar dependencias al activar modo masivo ────────────────────────────
  const loadDeps = useCallback(async () => {
    if (!token) return;
    setLoadingDeps(true);
    try {
      const [coursesData, semestersData] = await Promise.all([
        listCourses(token),
        listSemesters(token),
      ]);
      setCourses(coursesData);
      setSemesters(semestersData);
    } catch {
      showToast('error', 'Error al cargar cursos y semestres.');
    } finally {
      setLoadingDeps(false);
    }
  }, [token, showToast]);

  // ── Activar / desactivar modo masivo ──────────────────────────────────────
  const activate = () => {
    setIsBulkMode(true);
    setPhase('selecting');
    setBulkForm(EMPTY_BULK_FORM);
    setBulkResult(null);
    setSelectedIds(new Set());
    loadDeps();
  };

  const deactivate = () => {
    setIsBulkMode(false);
    setPhase('selecting');
    setBulkForm(EMPTY_BULK_FORM);
    setBulkResult(null);
    setSelectedIds(new Set());
  };

  // Recargar dependencias si se vuelve a activar sin desactivar antes
  useEffect(() => {
    if (isBulkMode && phase === 'selecting' && courses.length === 0) {
      loadDeps();
    }
  }, [isBulkMode, phase, courses.length, loadDeps]);

  // ── Manejo de selección ───────────────────────────────────────────────────
  const toggleSelect = (studentId: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(studentId)) next.delete(studentId);
      else next.add(studentId);
      return next;
    });
  };

  const selectableStudents = useMemo(
    () => students.filter((s) => !enrolledInTargetCourse.has(s.id)),
    [students, enrolledInTargetCourse]
  );

  const isAllSelectableSelected =
    selectableStudents.length > 0 &&
    selectableStudents.every((s) => selectedIds.has(s.id));

  const isPartiallySelected =
    !isAllSelectableSelected &&
    selectableStudents.some((s) => selectedIds.has(s.id));

  const toggleSelectAll = () => {
    setSelectedIds((prev) => {
      if (isAllSelectableSelected) {
        const next = new Set(prev);
        selectableStudents.forEach((s) => next.delete(s.id));
        return next;
      }
      const next = new Set(prev);
      selectableStudents.forEach((s) => next.add(s.id));
      return next;
    });
  };

  // ── Limpiar selección al cambiar de curso ────────────────────────────────
  useEffect(() => {
    setSelectedIds(new Set());
  }, [bulkForm.courseId]);

  // ── Validación del formulario ─────────────────────────────────────────────
  const canSubmit =
    !isCoordinator &&
    bulkForm.courseId !== '' &&
    bulkForm.semesterId !== '' &&
    selectedIds.size > 0;

  // ── Envío ─────────────────────────────────────────────────────────────────
  const handleConfirm = async () => {
    if (!token || !canSubmit) return;
    setPhase('processing');
    setSubmitting(true);
    try {
      let resolutionFileId: string | undefined;
      if (bulkForm.resolutionFile) {
        const uploaded = await uploadResolution(token, bulkForm.resolutionFile);
        resolutionFileId = uploaded.id;
      }

      const result = await createBulkEnrollment(token, {
        studentIds: Array.from(selectedIds),
        courseId: bulkForm.courseId,
        semesterId: bulkForm.semesterId as number,
        stateId: bulkForm.stateId,
        enrollmentDate: bulkForm.enrollmentDate,
        ...(resolutionFileId ? { resolutionFileId } : {}),
        ...(bulkForm.observations.trim() ? { observations: bulkForm.observations.trim() } : {}),
      });

      setBulkResult(result);
      setPhase('results');
      showToast(
        'success',
        `Matrícula masiva completada: ${result.enrolled} registrado(s), ${result.rejected} rechazado(s).`
      );
      onSuccess();
    } catch (e) {
      showToast(
        'error',
        e instanceof ApiError ? e.message : 'Error al procesar la matrícula masiva.'
      );
      setPhase('selecting');
    } finally {
      setSubmitting(false);
    }
  };

  const resetToSelecting = () => {
    setPhase('selecting');
    setBulkResult(null);
    setSelectedIds(new Set());
    setBulkForm(EMPTY_BULK_FORM);
  };

  // ── Etiqueta de semestre para la barra de resumen ────────────────────────
  const semesterLabel = useMemo(() => {
    if (bulkForm.semesterId === '') return '';
    const s = semesters.find((sm) => sm.id === bulkForm.semesterId);
    return s ? `${s.code} (${s.year})` : '';
  }, [bulkForm.semesterId, semesters]);

  const selectedCourse = useMemo(
    () => courses.find((c) => c.id === bulkForm.courseId),
    [courses, bulkForm.courseId]
  );

  return {
    isBulkMode,
    isCoordinator,
    activate,
    deactivate,
    phase,
    bulkForm,
    setBulkForm,
    courses,
    semesters,
    loadingDeps,
    selectedIds,
    selectableStudents,
    enrolledInTargetCourse,
    toggleSelect,
    toggleSelectAll,
    isAllSelectableSelected,
    isPartiallySelected,
    canSubmit,
    submitting,
    handleConfirm,
    resetToSelecting,
    bulkResult,
    semesterLabel,
    selectedCourse,
  };
}