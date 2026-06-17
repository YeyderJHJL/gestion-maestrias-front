import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import { ApiError } from '../../../../services/api';
import {
  CourseRequest,
  CourseResponse,
  createCourse,
  deleteCourse,
  listCourses,
  updateCourse,
} from '../../../../services/coursesApiService';
import { uploadFile } from '../../../../services/filesApiService';

export type CursoFormState = {
  code: string;
  name: string;
  startDate: string;
  endDate: string;
  observations: string;
  syllabusFile: File | null;
  syllabusFileId: string;
};

const EMPTY_CURSO: CursoFormState = {
  code: '',
  name: '',
  startDate: '',
  endDate: '',
  observations: '',
  syllabusFile: null,
  syllabusFileId: '',
};

export function useCursos() {
  const { user, token } = useAuth();
  const isCoordinator = user?.role === 'COORDINATOR';

  const [cursos, setCursos] = useState<CourseResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');

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

  useEffect(() => {
    loadCursos();
  }, [loadCursos]);

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
      startDate: curso.startDate,
      endDate: curso.endDate,
      observations: curso.observations ?? '',
      syllabusFile: null,
      syllabusFileId: curso.syllabusFile?.id ?? '',
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

    setSubmitting(true);
    setFormError(null);
    try {
      let finalFileId = form.syllabusFileId || undefined;
      
      if (form.syllabusFile) {
        const uploaded = await uploadFile(token, form.syllabusFile);
        finalFileId = uploaded.id;
      }

      const payload: CourseRequest = {
        code: form.code.trim(),
        name: form.name.trim(),
        startDate: form.startDate,
        endDate: form.endDate,
        observations: form.observations.trim(),
        syllabusFileId: finalFileId,
      };

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
      cursos.filter((c) => {
        const matchesSearch =
          !searchTerm ||
          c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.code.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
      }),
    [cursos, searchTerm]
  );

  return {
    cursos,
    cursosFiltrados,
    loading,
    error,
    searchTerm,
    setSearchTerm,
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
