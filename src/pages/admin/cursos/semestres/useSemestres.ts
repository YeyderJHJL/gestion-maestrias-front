import { FormEvent, useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import { ApiError } from '../../../../services/api';
import {
  SemesterRequest,
  SemesterResponse,
  createSemester,
  deleteSemester,
  listSemesters,
  updateSemester,
} from '../../../../services/semestersApiService';

export type SemestreFormState = {
  year: number;
  code: string;
};

const EMPTY_SEMESTRE: SemestreFormState = {
  year: new Date().getFullYear(),
  code: '',
};

export function useSemestres() {
  const { user, token } = useAuth();
  const isCoordinator = user?.role === 'Coordinador';

  const [semestres, setSemestres] = useState<SemesterResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SemesterResponse | null>(null);
  const [form, setForm] = useState<SemestreFormState>(EMPTY_SEMESTRE);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [deletingItem, setDeletingItem] = useState<SemesterResponse | null>(null);

  const [toast, setToast] = useState<{
    visible: boolean;
    variant: 'success' | 'error';
    message: string;
  }>({ visible: false, variant: 'success', message: '' });

  const showToast = (variant: 'success' | 'error', message: string) =>
    setToast({ visible: true, variant, message });

  const loadSemestres = useCallback(() => {
    if (!token) return;
    setLoading(true);
    setError(null);
    listSemesters(token)
      .then((data) => {
        // Ordenar por año descendente y código descendente
        const sorted = data.sort((a, b) => {
          if (a.year !== b.year) return b.year - a.year;
          return b.code.localeCompare(a.code);
        });
        setSemestres(sorted);
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => {
    loadSemestres();
  }, [loadSemestres]);

  const openCreateModal = () => {
    setEditingItem(null);
    setForm(EMPTY_SEMESTRE);
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (semestre: SemesterResponse) => {
    setEditingItem(semestre);
    setForm({
      year: semestre.year,
      code: semestre.code,
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!token) return;

    if (form.year < 2001) {
      setFormError('El año debe ser mayor o igual a 2001.');
      return;
    }
    
    if (!form.code.trim()) {
      setFormError('El código es obligatorio.');
      return;
    }

    setSubmitting(true);
    setFormError(null);
    try {
      const payload: SemesterRequest = {
        year: form.year,
        code: form.code.trim(),
      };

      if (editingItem) {
        await updateSemester(token, editingItem.id, payload);
        showToast('success', 'Semestre actualizado correctamente.');
      } else {
        await createSemester(token, payload);
        showToast('success', 'Semestre creado correctamente.');
      }
      closeModal();
      loadSemestres();
    } catch (e) {
      setFormError(e instanceof ApiError ? e.message : 'Error al guardar el semestre.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!token || !deletingItem) return;
    try {
      await deleteSemester(token, deletingItem.id);
      showToast('success', `Semestre ${deletingItem.year}-${deletingItem.code} eliminado.`);
      loadSemestres();
    } catch (e) {
      showToast('error', e instanceof ApiError ? e.message : 'Error al eliminar el semestre.');
    } finally {
      setDeletingItem(null);
    }
  };

  return {
    semestres,
    loading,
    error,
    isCoordinator,
    isModalOpen,
    editingItem,
    form,
    setForm,
    submitting,
    formError,
    openCreateModal,
    openEditModal,
    closeModal,
    handleSubmit,
    deletingItem,
    setDeletingItem,
    handleDelete,
    toast,
    setToast,
  };
}
