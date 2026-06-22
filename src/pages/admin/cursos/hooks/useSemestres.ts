import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import {
  SemesterResponse,
  listSemesters,
  createSemester,
  updateSemester,
  deleteSemester,
  SemesterRequest,
} from '../../../../services/semestersApiService';

export type SemestreFormState = {
  year: number;
  code: string;
};

const EMPTY_FORM: SemestreFormState = {
  year: new Date().getFullYear(),
  code: '',
};

type Toast = { visible: boolean; variant: 'success' | 'error'; message: string };

export function useSemestres() {
  const { user, token } = useAuth();
  const isCoordinator = user?.role === 'COORDINATOR';

  // ── Lista ──────────────────────────────────────────────────────────────────
  const [semestres, setSemestres] = useState<SemesterResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── Modal form ─────────────────────────────────────────────────────────────
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SemesterResponse | null>(null);
  const [form, setForm] = useState<SemestreFormState>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // ── Confirmación eliminar ──────────────────────────────────────────────────
  const [deletingItem, setDeletingItem] = useState<SemesterResponse | null>(null);

  // ── Toast ──────────────────────────────────────────────────────────────────
  const [toast, setToast] = useState<Toast>({ visible: false, variant: 'success', message: '' });
  const showToast = (variant: Toast['variant'], message: string) =>
    setToast({ visible: true, variant, message });

  // ── Carga ──────────────────────────────────────────────────────────────────
  const loadSemestres = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const data = await listSemesters(token);
      const sorted = [...data].sort((a, b) =>
        a.year !== b.year ? b.year - a.year : b.code.localeCompare(a.code)
      );
      setSemestres(sorted);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar los semestres.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadSemestres();
  }, [loadSemestres]);

  // ── Modal form ─────────────────────────────────────────────────────────────
  const openCreate = () => {
    setEditingItem(null);
    setForm(EMPTY_FORM);
    setFormError(null);
    setIsFormOpen(true);
  };

  const openEdit = (semestre: SemesterResponse) => {
    setEditingItem(semestre);
    setForm({ year: semestre.year, code: semestre.code });
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

    const payload: SemesterRequest = {
      year: form.year,
      code: form.code.trim(),
    };

    try {
      if (editingItem) {
        await updateSemester(token, editingItem.id, payload);
        showToast('success', 'Semestre actualizado correctamente.');
      } else {
        await createSemester(token, payload);
        showToast('success', 'Semestre creado correctamente.');
      }
      closeForm();
      loadSemestres();
    } catch (e) {
      setFormError(e instanceof Error ? e.message : 'Error al guardar el semestre.');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Eliminar ───────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!token || !deletingItem) return;
    try {
      await deleteSemester(token, deletingItem.id);
      showToast('success', `Semestre ${deletingItem.year}-${deletingItem.code} eliminado.`);
      loadSemestres();
    } catch (e) {
      showToast('error', e instanceof Error ? e.message : 'Error al eliminar el semestre.');
    } finally {
      setDeletingItem(null);
    }
  };

  return {
    semestres,
    loading,
    error,
    isCoordinator,
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
