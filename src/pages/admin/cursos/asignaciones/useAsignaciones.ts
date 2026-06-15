import { FormEvent, useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import { ApiError } from '../../../../services/api';
import {
  AssignmentRequest,
  AssignmentResponse,
  createAssignment,
  deleteAssignment,
  listAssignments,
  updateAssignment,
} from '../../../../services/assignmentsApiService';
import { TeacherResponse, listTeachers } from '../../../../services/teachersApiService';
import { CourseResponse, listCourses } from '../../../../services/coursesApiService';

export type AssignmentFormState = {
  courseId: string;
  teacherId: string;
  assignmentDate: string;
};

const EMPTY_ASSIGNMENT: AssignmentFormState = {
  courseId: '',
  teacherId: '',
  assignmentDate: new Date().toISOString().split('T')[0],
};

export function useAsignaciones() {
  const { user, token } = useAuth();
  const isCoordinator = user?.role === 'Coordinador';

  const [assignments, setAssignments] = useState<AssignmentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [teachers, setTeachers] = useState<TeacherResponse[]>([]);
  const [courses, setCourses] = useState<CourseResponse[]>([]);
  const [loadingDependencies, setLoadingDependencies] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AssignmentResponse | null>(null);
  const [targetSemesterId, setTargetSemesterId] = useState<number | null>(null);
  const [form, setForm] = useState<AssignmentFormState>(EMPTY_ASSIGNMENT);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [deletingItem, setDeletingItem] = useState<AssignmentResponse | null>(null);

  const [toast, setToast] = useState<{
    visible: boolean;
    variant: 'success' | 'error';
    message: string;
  }>({ visible: false, variant: 'success', message: '' });

  const showToast = (variant: 'success' | 'error', message: string) =>
    setToast({ visible: true, variant, message });

  const loadAssignments = useCallback(() => {
    if (!token) return;
    setLoading(true);
    setError(null);
    listAssignments(token)
      .then(setAssignments)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [token]);

  const loadDependencies = useCallback(async () => {
    if (!token) return;
    setLoadingDependencies(true);
    try {
      const [tData, cData] = await Promise.all([
        listTeachers(token),
        listCourses(token),
      ]);
      setTeachers(tData);
      setCourses(cData);
    } catch (e) {
      console.error('Error loading dependencies', e);
    } finally {
      setLoadingDependencies(false);
    }
  }, [token]);

  useEffect(() => {
    loadAssignments();
  }, [loadAssignments]);

  useEffect(() => {
    if (isModalOpen) {
      loadDependencies();
    }
  }, [isModalOpen, loadDependencies]);

  const openCreateModal = (semesterId: number) => {
    setEditingItem(null);
    setTargetSemesterId(semesterId);
    setForm(EMPTY_ASSIGNMENT);
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (assignment: AssignmentResponse) => {
    setEditingItem(assignment);
    setTargetSemesterId(assignment.semesterId);
    setForm({
      courseId: assignment.courseId,
      teacherId: assignment.teacherId,
      assignmentDate: assignment.assignmentDate,
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setTargetSemesterId(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!token || targetSemesterId === null) return;

    if (!form.courseId || !form.teacherId) {
      setFormError('Debe seleccionar un curso y un docente.');
      return;
    }

    setSubmitting(true);
    setFormError(null);
    try {
      const payload: AssignmentRequest = {
        courseId: form.courseId,
        teacherId: form.teacherId,
        semesterId: targetSemesterId,
        assignmentDate: form.assignmentDate,
      };

      if (editingItem) {
        await updateAssignment(token, editingItem.courseId, editingItem.teacherId, editingItem.semesterId, payload);
        showToast('success', 'Asignación actualizada correctamente.');
      } else {
        await createAssignment(token, payload);
        showToast('success', 'Asignación creada correctamente.');
      }
      closeModal();
      loadAssignments();
    } catch (e) {
      setFormError(e instanceof ApiError ? e.message : 'Error al guardar la asignación.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!token || !deletingItem) return;
    try {
      await deleteAssignment(token, deletingItem.courseId, deletingItem.teacherId, deletingItem.semesterId);
      showToast('success', 'Asignación eliminada.');
      loadAssignments();
    } catch (e) {
      showToast('error', e instanceof ApiError ? e.message : 'Error al eliminar la asignación.');
    } finally {
      setDeletingItem(null);
    }
  };

  return {
    assignments,
    loading,
    error,
    isCoordinator,
    teachers,
    courses,
    loadingDependencies,
    isModalOpen,
    editingItem,
    targetSemesterId,
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
