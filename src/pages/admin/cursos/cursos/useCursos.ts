import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import { ApiError } from '../../../../services/api';
import {
  CourseRequest,
  CourseResponse,
  CourseType,
  createCourse,
  deleteCourse,
  listCourses,
  updateCourse,
} from '../../../../services/coursesApiService';
import { PromotionResponse } from '../../../../services/promotionsApiService';
import { TeacherResponse, listTeachers } from '../../../../services/teachersApiService';

export type CursoFormState = {
  code: string;
  name: string;
  type: CourseType;
  startDate: string;
  endDate: string;
  observations: string;
  syllabusUrl: string;
  teacherId: string;
};

const EMPTY_CURSO: CursoFormState = {
  code: '',
  name: '',
  type: 'Regular',
  startDate: '',
  endDate: '',
  observations: '',
  syllabusUrl: '',
  teacherId: '',
};

export function useCursos(selectedPromocion: PromotionResponse | null) {
  const { user, token } = useAuth();
  const isCoordinator = user?.role === 'COORDINATOR';

  const [cursos, setCursos] = useState<CourseResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<CourseType | ''>('');

  const [teachers, setTeachers] = useState<TeacherResponse[]>([]);
  const [loadingTeachers, setLoadingTeachers] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CourseResponse | null>(null);
  const [form, setForm] = useState<CursoFormState>(EMPTY_CURSO);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [deletingItem, setDeletingItem] = useState<CourseResponse | null>(null);

  const [toast, setToast] = useState<{
    visible: boolean;
    variant: 'success' | 'error';
    message: string;
  }>({ visible: false, variant: 'success', message: '' });

  const showToast = (variant: 'success' | 'error', message: string) =>
    setToast({ visible: true, variant, message });

  const loadCursos = useCallback(() => {
    if (!token) return;
    setLoading(true);
    setError(null);
    listCourses(token)
      .then(setCursos)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [token]);

  const loadTeachers = useCallback(() => {
    if (!token) return;
    setLoadingTeachers(true);
    listTeachers(token)
      .then(setTeachers)
      .catch(() => setTeachers([]))
      .finally(() => setLoadingTeachers(false));
  }, [token]);

  useEffect(() => {
    loadCursos();
  }, [loadCursos]);

  useEffect(() => {
    if (!isModalOpen) return;
    loadTeachers();
  }, [isModalOpen, loadTeachers]);

  const openCreateModal = () => {
    setEditingItem(null);
    setForm(EMPTY_CURSO);
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (curso: CourseResponse) => {
    setEditingItem(curso);
    setForm({
      code: curso.code,
      name: curso.name,
      type: curso.type,
      startDate: curso.startDate,
      endDate: curso.endDate,
      observations: curso.observations ?? '',
      syllabusUrl: curso.syllabusUrl ?? '',
      teacherId: '',
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const buildPayload = (): CourseRequest | null => {
    if (!selectedPromocion) return null;

    return {
      programId: selectedPromocion.programId,
      promotionId: selectedPromocion.id,
      code: form.code.trim(),
      name: form.name.trim(),
      type: form.type,
      startDate: form.startDate,
      endDate: form.endDate,
      observations: form.observations.trim(),
      syllabusUrl: form.syllabusUrl.trim(),
    };
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!token) return;

    const payload = buildPayload();
    if (!payload) {
      setFormError('Selecciona una promoción antes de guardar el curso.');
      return;
    }

    setSubmitting(true);
    setFormError(null);
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
      closeModal();
    } catch (e) {
      setFormError(e instanceof ApiError ? e.message : 'Error al guardar el curso.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!token || !deletingItem) return;
    try {
      await deleteCourse(token, deletingItem.id);
      setCursos((prev) => prev.filter((c) => c.id !== deletingItem.id));
      showToast('success', `Curso ${deletingItem.name} eliminado.`);
    } catch (e) {
      showToast('error', e instanceof ApiError ? e.message : 'Error al eliminar el curso.');
    } finally {
      setDeletingItem(null);
    }
  };

  const cursosFiltrados = useMemo(
    () =>
      cursos
        .filter((c) => c.promotionId === selectedPromocion?.id)
        .filter((c) => {
          const matchesSearch =
            !searchTerm ||
            c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.code.toLowerCase().includes(searchTerm.toLowerCase());
          const matchesType = !filterType || c.type === filterType;
          return matchesSearch && matchesType;
        }),
    [cursos, selectedPromocion?.id, searchTerm, filterType]
  );

  return {
    cursos,
    cursosFiltrados,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    filterType,
    setFilterType,
    isCoordinator,
    teachers,
    loadingTeachers,
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
