import { FormEvent, useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import { ApiError } from '../../../../services/api';
import {
  PromotionRequest,
  PromotionResponse,
  createPromotion,
  deletePromotion,
  listPromotions,
  updatePromotion,
} from '../../../../services/promotionsApiService';
import { ProgramResponse, listPrograms } from '../../../../services/programsApiService';

export type PromocionFormState = {
  programId: number | '';
  name: string;
  period: string;
  year: number | '';
};

const EMPTY_PROMOCION: PromocionFormState = {
  programId: '',
  name: '',
  period: '',
  year: new Date().getFullYear(),
};

export function usePromociones() {
  const { user, token } = useAuth();
  const isCoordinator = user?.role === 'COORDINATOR';

  const [promociones, setPromociones] = useState<PromotionResponse[]>([]);
  const [selectedPromocion, setSelectedPromocion] = useState<PromotionResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [programs, setPrograms] = useState<ProgramResponse[]>([]);
  const [loadingPrograms, setLoadingPrograms] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PromotionResponse | null>(null);
  const [form, setForm] = useState<PromocionFormState>(EMPTY_PROMOCION);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [deletingItem, setDeletingItem] = useState<PromotionResponse | null>(null);

  const [toast, setToast] = useState<{
    visible: boolean;
    variant: 'success' | 'error';
    message: string;
  }>({ visible: false, variant: 'success', message: '' });

  const showToast = (variant: 'success' | 'error', message: string) =>
    setToast({ visible: true, variant, message });

  const loadPromociones = useCallback(() => {
    if (!token) return;
    setLoading(true);
    setError(null);
    listPromotions(token)
      .then((data) => {
        setPromociones(data);
        setSelectedPromocion((current) => {
          if (current && data.some((p) => p.id === current.id)) {
            return data.find((p) => p.id === current.id) ?? current;
          }
          return data[0] ?? null;
        });
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [token]);

  const loadPrograms = useCallback(() => {
    if (!token) return;
    setLoadingPrograms(true);
    listPrograms(token)
      .then(setPrograms)
      .catch(() => setPrograms([]))
      .finally(() => setLoadingPrograms(false));
  }, [token]);

  useEffect(() => {
    loadPromociones();
  }, [loadPromociones]);

  useEffect(() => {
    if (!isModalOpen) return;
    loadPrograms();
  }, [isModalOpen, loadPrograms]);

  const openCreateModal = () => {
    setEditingItem(null);
    setForm(EMPTY_PROMOCION);
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (promocion: PromotionResponse) => {
    setEditingItem(promocion);
    setForm({
      programId: promocion.programId,
      name: promocion.name,
      period: promocion.period,
      year: promocion.year,
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
    if (form.programId === '' || form.year === '') {
      setFormError('Selecciona un programa e ingresa el año.');
      return;
    }

    setSubmitting(true);
    setFormError(null);
    try {
      const payload: PromotionRequest = {
        programId: form.programId,
        name: form.name.trim(),
        period: form.period.trim(),
        year: form.year,
      };

      if (editingItem) {
        const updated = await updatePromotion(token, editingItem.id, payload);
        setPromociones((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
        setSelectedPromocion((current) => (current?.id === updated.id ? updated : current));
        showToast('success', 'Promoción actualizada correctamente.');
      } else {
        const created = await createPromotion(token, payload);
        setPromociones((prev) => [created, ...prev]);
        setSelectedPromocion(created);
        showToast('success', 'Promoción creada correctamente.');
      }
      closeModal();
    } catch (e) {
      setFormError(e instanceof ApiError ? e.message : 'Error al guardar la promoción.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!token || !deletingItem) return;
    try {
      await deletePromotion(token, deletingItem.id);
      setPromociones((prev) => {
        const next = prev.filter((p) => p.id !== deletingItem.id);
        setSelectedPromocion((current) =>
          current?.id === deletingItem.id ? next[0] ?? null : current
        );
        return next;
      });
      showToast('success', `Promoción ${deletingItem.name} eliminada.`);
    } catch (e) {
      showToast('error', e instanceof ApiError ? e.message : 'Error al eliminar la promoción.');
    } finally {
      setDeletingItem(null);
    }
  };

  return {
    promociones,
    selectedPromocion,
    setSelectedPromocion,
    loading,
    error,
    isCoordinator,
    programs,
    loadingPrograms,
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
