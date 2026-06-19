import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import {
  CourseResponse,
  listCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  CourseRequest,
} from '../../../../services/coursesApiService';

export type CursoFormState = {
  code: string;
  name: string;
  startDate: string;
  endDate: string;
  observations: string;
};

const EMPTY_FORM: CursoFormState = {
  code: '',
  name: '',
  startDate: '',
  endDate: '',
  observations: '',
};

type Toast = { visible: boolean; variant: 'success' | 'error'; message: string };

export function useCursos() {
  const { token } = useAuth();

  // ── Lista ──────────────────────────────────────────────────────────────────
  const [cursos, setCursos] = useState<CourseResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── Modal lista ────────────────────────────────────────────────────────────
  const [isListOpen, setIsListOpen] = useState(false);

  // ── Modal form (crear / editar) ────────────────────────────────────────────
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CourseResponse | null>(null);
  const [form, setForm] = useState<CursoFormState>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // ── Confirmación eliminar ──────────────────────────────────────────────────
  const [deletingItem, setDeletingItem] = useState<CourseResponse | null>(null);

  // ── Toast ──────────────────────────────────────────────────────────────────
  const [toast, setToast] = useState<Toast>({ visible: false, variant: 'success', message: '' });
  const showToast = (variant: Toast['variant'], message: string) =>
    setToast({ visible: true, variant, message });

  // ── Carga inicial ──────────────────────────────────────────────────────────
  const loadCursos = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const data = await listCourses(token);
      setCursos(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar los cursos.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadCursos();
  }, [loadCursos]);

  // ── Abrir modal lista ──────────────────────────────────────────────────────
  const openList = () => setIsListOpen(true);
  const closeList = () => setIsListOpen(false);

  // ── Abrir modal form ───────────────────────────────────────────────────────
  const openCreate = () => {
    setEditingItem(null);
    setForm(EMPTY_FORM);
    setFormError(null);
    setIsFormOpen(true);
  };

  const openEdit = (curso: CourseResponse) => {
    setEditingItem(curso);
    setForm({
      code: curso.code,
      name: curso.name,
      startDate: curso.startDate,
      endDate: curso.endDate,
      observations: curso.observations ?? '',
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
    if (!token) return;

    setSubmitting(true);
    setFormError(null);

    const payload: CourseRequest = {
      code: form.code.trim(),
      name: form.name.trim(),
      startDate: form.startDate,
      endDate: form.endDate,
      observations: form.observations.trim(),
    };

    try {
      if (editingItem) {
        const updated = await updateCourse(token, editingItem.id, payload);
        setCursos((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
        showToast('success', 'Curso actualizado correctamente.');
      } else {
        const created = await createCourse(token, payload);
        setCursos((prev) => [created, ...prev]);
        showToast('success', 'Curso creado correctamente.');
      }
      closeForm();
    } catch (e) {
      setFormError(e instanceof Error ? e.message : 'Error al guardar el curso.');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Eliminar ───────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!token || !deletingItem) return;
    try {
      await deleteCourse(token, deletingItem.id);
      setCursos((prev) => prev.filter((c) => c.id !== deletingItem.id));
      showToast('success', `Curso "${deletingItem.name}" eliminado.`);
    } catch (e) {
      showToast('error', e instanceof Error ? e.message : 'Error al eliminar el curso.');
    } finally {
      setDeletingItem(null);
    }
  };

  return {
    // lista
    cursos,
    loading,
    error,
    // modal lista
    isListOpen,
    openList,
    closeList,
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
