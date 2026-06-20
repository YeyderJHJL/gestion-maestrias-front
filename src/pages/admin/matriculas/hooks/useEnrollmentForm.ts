import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import {
  EnrollmentResponse,
  EnrollmentRequest,
  ENROLLMENT_STATES,
  createEnrollment,
  updateEnrollment,
  deleteEnrollment,
} from '../../../../services/enrollmentsApiService';
import { CourseResponse, listCourses } from '../../../../services/coursesApiService';
import { SemesterResponse, listSemesters } from '../../../../services/semestersApiService';
import { uploadResolution } from '../../../../services/resolutionFileService';

// ── Estado del formulario ─────────────────────────────────────────────────────

export type EnrollmentFormState = {
  courseId: string;
  semesterId: number | '';
  stateId: number;
  enrollmentDate: string;
  resolutionFile: File | null;
  observations: string;
};

const EMPTY_FORM: EnrollmentFormState = {
  courseId: '',
  semesterId: '',
  stateId: ENROLLMENT_STATES.ENROLLED.id,
  enrollmentDate: new Date().toISOString().split('T')[0],
  resolutionFile: null,
  observations: '',
};

// ── Hook ──────────────────────────────────────────────────────────────────────

interface UseEnrollmentFormOptions {
  studentId: string;
  onSuccess: () => void;
  showToast: (variant: 'success' | 'error', message: string) => void;
}

export function useEnrollmentForm({ studentId, onSuccess, showToast }: UseEnrollmentFormOptions) {
  const { token } = useAuth();

  const [courses, setCourses] = useState<CourseResponse[]>([]);
  const [semesters, setSemesters] = useState<SemesterResponse[]>([]);
  const [loadingDeps, setLoadingDeps] = useState(false);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<EnrollmentResponse | null>(null);
  const [form, setForm] = useState<EnrollmentFormState>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [deletingItem, setDeletingItem] = useState<EnrollmentResponse | null>(null);
  const [deleting, setDeleting] = useState(false);

  // ── Carga de dependencias ──────────────────────────────────────────────────
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
    } catch (e) {
      console.error('Error cargando dependencias:', e);
    } finally {
      setLoadingDeps(false);
    }
  }, [token]);

  useEffect(() => { if (isFormOpen) loadDeps(); }, [isFormOpen, loadDeps]);

  // ── Abrir modal ────────────────────────────────────────────────────────────
  const openCreate = () => {
    setEditingItem(null);
    setForm(EMPTY_FORM);
    setFormError(null);
    setIsFormOpen(true);
  };

  const openEdit = (enrollment: EnrollmentResponse) => {
    setEditingItem(enrollment);
    setForm({
      courseId: enrollment.courseId,
      semesterId: enrollment.semesterId,
      stateId: enrollment.stateId,
      enrollmentDate: enrollment.enrollmentDate,
      resolutionFile: null,
      observations: enrollment.observations ?? '',
    });
    setFormError(null);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingItem(null);
    setFormError(null);
  };

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || form.semesterId === '') return;
    setSubmitting(true);
    setFormError(null);
    try {
      let resolutionFileId: string | undefined;
      if (form.resolutionFile) {
        const uploaded = await uploadResolution(token, form.resolutionFile);
        resolutionFileId = uploaded.id;
      }

      const payload: EnrollmentRequest = {
        studentId,
        courseId: form.courseId,
        semesterId: form.semesterId as number,
        stateId: form.stateId,
        enrollmentDate: form.enrollmentDate,
        ...(resolutionFileId ? { resolutionFileId } : {}),
        ...(form.observations.trim() ? { observations: form.observations.trim() } : {}),
      };

      if (editingItem) {
        await updateEnrollment(token, editingItem.id, payload);
        showToast('success', 'Matrícula actualizada correctamente.');
      } else {
        await createEnrollment(token, payload);
        showToast('success', 'Matrícula registrada correctamente.');
      }
      closeForm();
      onSuccess();
    } catch (e) {
      setFormError(e instanceof Error ? e.message : 'Error al guardar la matrícula.');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Eliminar ───────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!token || !deletingItem) return;
    setDeleting(true);
    try {
      await deleteEnrollment(token, deletingItem.id);
      showToast('success', 'Matrícula eliminada.');
      setDeletingItem(null);
      onSuccess();
    } catch (e) {
      showToast('error', e instanceof Error ? e.message : 'Error al eliminar la matrícula.');
    } finally {
      setDeleting(false);
      setDeletingItem(null);
    }
  };

  return {
    // dependencias
    courses, semesters, loadingDeps,
    // modal form
    isFormOpen, editingItem, form, setForm,
    submitting, formError,
    openCreate, openEdit, closeForm, handleSubmit,
    // eliminar
    deletingItem, setDeletingItem, deleting, handleDelete,
  };
}
