import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import {
  AssignmentResponse,
  listAssignments,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  AssignmentRequest,
} from '../../../../services/assignmentsApiService';
import { TeacherResponse, listTeachers } from '../../../../services/teachersApiService';
import { CourseResponse, listCourses } from '../../../../services/coursesApiService';

export type AsignacionFormState = {
  courseId: string;
  teacherId: string;
  assignmentDate: string;
};

const EMPTY_FORM: AsignacionFormState = {
  courseId: '',
  teacherId: '',
  assignmentDate: new Date().toISOString().split('T')[0],
};

type Toast = { visible: boolean; variant: 'success' | 'error'; message: string };

export function useAsignaciones() {
  const { user, token } = useAuth();
  const isCoordinator = user?.role === 'Coordinador';

  // ── Lista ──────────────────────────────────────────────────────────────────
  const [assignments, setAssignments] = useState<AssignmentResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── Dependencias del form ──────────────────────────────────────────────────
  const [teachers, setTeachers] = useState<TeacherResponse[]>([]);
  const [courses, setCourses] = useState<CourseResponse[]>([]);
  const [loadingDeps, setLoadingDeps] = useState(false);

  // ── Modal form ─────────────────────────────────────────────────────────────
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AssignmentResponse | null>(null);
  const [targetSemesterId, setTargetSemesterId] = useState<number | null>(null);
  const [form, setForm] = useState<AsignacionFormState>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // ── Confirmación eliminar ──────────────────────────────────────────────────
  const [deletingItem, setDeletingItem] = useState<AssignmentResponse | null>(null);

  // ── Toast ──────────────────────────────────────────────────────────────────
  const [toast, setToast] = useState<Toast>({ visible: false, variant: 'success', message: '' });
  const showToast = (variant: Toast['variant'], message: string) =>
    setToast({ visible: true, variant, message });

  // ── Carga asignaciones ─────────────────────────────────────────────────────
  const loadAssignments = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const data = await listAssignments(token);
      setAssignments(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar las asignaciones.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadAssignments();
  }, [loadAssignments]);

  // ── Carga dependencias cuando abre el form ─────────────────────────────────
  const loadDeps = useCallback(async () => {
    if (!token) return;
    setLoadingDeps(true);
    try {
      const [teachersData, coursesData] = await Promise.all([
        listTeachers(token),
        listCourses(token),
      ]);
      setTeachers(teachersData);
      setCourses(coursesData);
    } catch (e) {
      console.error('Error cargando dependencias:', e);
    } finally {
      setLoadingDeps(false);
    }
  }, [token]);

  useEffect(() => {
    if (isFormOpen) loadDeps();
  }, [isFormOpen, loadDeps]);

  // ── Modal form ─────────────────────────────────────────────────────────────
  const openCreate = (semesterId: number) => {
    setEditingItem(null);
    setTargetSemesterId(semesterId);
    setForm(EMPTY_FORM);
    setFormError(null);
    setIsFormOpen(true);
  };

  const openEdit = (assignment: AssignmentResponse) => {
    setEditingItem(assignment);
    setTargetSemesterId(assignment.semesterId);
    setForm({
      courseId: assignment.courseId,
      teacherId: assignment.teacherId,
      assignmentDate: assignment.assignmentDate,
    });
    setFormError(null);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingItem(null);
    setTargetSemesterId(null);
    setFormError(null);
  };

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || targetSemesterId === null) return;

    setSubmitting(true);
    setFormError(null);

    const payload: AssignmentRequest = {
      courseId: form.courseId,
      teacherId: form.teacherId,
      semesterId: targetSemesterId,
      assignmentDate: form.assignmentDate,
    };

    try {
      if (editingItem) {
        await updateAssignment(
          token,
          {
            courseId: editingItem.courseId,
            teacherId: editingItem.teacherId,
            semesterId: editingItem.semesterId,
          },
          payload
        );
        showToast('success', 'Asignación actualizada correctamente.');
      } else {
        await createAssignment(token, payload);
        showToast('success', 'Asignación creada correctamente.');
      }
      closeForm();
      loadAssignments();
    } catch (e) {
      setFormError(e instanceof Error ? e.message : 'Error al guardar la asignación.');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Eliminar ───────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!token || !deletingItem) return;
    try {
      await deleteAssignment(token, {
        courseId: deletingItem.courseId,
        teacherId: deletingItem.teacherId,
        semesterId: deletingItem.semesterId,
      });
      showToast('success', 'Asignación eliminada.');
      loadAssignments();
    } catch (e) {
      showToast('error', e instanceof Error ? e.message : 'Error al eliminar la asignación.');
    } finally {
      setDeletingItem(null);
    }
  };

  return {
    assignments,
    loading,
    error,
    isCoordinator,
    // dependencias
    teachers,
    courses,
    loadingDeps,
    // modal form
    isFormOpen,
    editingItem,
    form,
    setForm,
    submitting,
    formError,
    openCreate,
    openEdit,
    closeForm,
    handleSubmit,
    // eliminar
    deletingItem,
    setDeletingItem,
    handleDelete,
    // toast
    toast,
    setToast,
  };
}
