import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import {
  AssignmentResponse,
  AssignmentKey,
  AssignmentRequest,
  listAssignments,
  createAssignment,
  updateAssignment,
  deleteAssignment,
} from '../../../../services/assignmentsApiService';
import { TeacherResponse, listTeachers } from '../../../../services/teachersApiService';
import { CourseResponse, listCourses } from '../../../../services/coursesApiService';
import { uploadSyllabus, getFileUrl, StoredFileResponse } from '../../../../services/filesApiService';

// ── Estado del formulario ─────────────────────────────────────────────────────

export type AsignacionFormState = {
  courseId: string;
  teacherId: string;
  assignmentDate: string;
  /** Archivo seleccionado localmente, pendiente de subir */
  syllabusFile: File | null;
};

const EMPTY_FORM: AsignacionFormState = {
  courseId: '',
  teacherId: '',
  assignmentDate: new Date().toISOString().split('T')[0],
  syllabusFile: null,
};

type Toast = { visible: boolean; variant: 'success' | 'error'; message: string };

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useAsignaciones() {
  const { user, token } = useAuth();
  // UserRole usa valores en mayúsculas: 'ADMIN' | 'TEACHER' | 'STUDENT' | 'COORDINATOR'
  const isCoordinator = user?.role === 'COORDINATOR';

  const [assignments, setAssignments] = useState<AssignmentResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [teachers, setTeachers] = useState<TeacherResponse[]>([]);
  const [courses, setCourses] = useState<CourseResponse[]>([]);
  const [loadingDeps, setLoadingDeps] = useState(false);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AssignmentResponse | null>(null);
  const [targetSemesterId, setTargetSemesterId] = useState<number | null>(null);
  const [form, setForm] = useState<AsignacionFormState>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  /** URL firmada del sílabo ya existente (solo en modo edición) */
  const [existingSyllabus, setExistingSyllabus] = useState<StoredFileResponse | null>(null);
  const [loadingSyllabus, setLoadingSyllabus] = useState(false);

  const [deletingItem, setDeletingItem] = useState<AssignmentResponse | null>(null);

  const [toast, setToast] = useState<Toast>({ visible: false, variant: 'success', message: '' });
  const showToast = (variant: Toast['variant'], message: string) =>
    setToast({ visible: true, variant, message });

  // ── Carga lista ────────────────────────────────────────────────────────────
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

  useEffect(() => { loadAssignments(); }, [loadAssignments]);

  // ── Dependencias del form ──────────────────────────────────────────────────
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
    } catch {
      showToast('error', 'Error al cargar docentes y cursos.');
    } finally {
      setLoadingDeps(false);
    }
  }, [token]);

  useEffect(() => { if (isFormOpen) loadDeps(); }, [isFormOpen, loadDeps]);

  // ── Sílabo existente ───────────────────────────────────────────────────────
  const loadExistingSyllabus = useCallback(async (fileId: string) => {
    if (!token) return;
    setLoadingSyllabus(true);
    try {
      const file = await getFileUrl(token, fileId);
      setExistingSyllabus(file);
    } catch {
      setExistingSyllabus(null);
      showToast('error', 'Error al cargar el sílabo. Intenta de nuevo.');
    } finally {
      setLoadingSyllabus(false);
    }
  }, [token]);

  // ── Abrir modal ────────────────────────────────────────────────────────────
  const openCreate = (semesterId: number) => {
    setEditingItem(null);
    setTargetSemesterId(semesterId);
    setForm(EMPTY_FORM);
    setFormError(null);
    setExistingSyllabus(null);
    setIsFormOpen(true);
  };

  const openEdit = (assignment: AssignmentResponse) => {
    setEditingItem(assignment);
    setTargetSemesterId(assignment.semesterId);
    setForm({
      courseId: assignment.courseId,
      teacherId: assignment.teacherId,
      assignmentDate: assignment.assignmentDate,
      syllabusFile: null,
    });
    setFormError(null);
    setExistingSyllabus(null);
    if (assignment.syllabusFile?.id) {
      loadExistingSyllabus(assignment.syllabusFile.id);
    }
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingItem(null);
    setTargetSemesterId(null);
    setFormError(null);
    setExistingSyllabus(null);
  };

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || targetSemesterId === null) return;
    setSubmitting(true);
    setFormError(null);
    try {
      let syllabusFileId: string | undefined;
      if (form.syllabusFile) {
        const uploaded = await uploadSyllabus(token, form.syllabusFile);
        syllabusFileId = uploaded.id;
      }

      const payload: AssignmentRequest = {
        courseId: form.courseId,
        teacherId: form.teacherId,
        semesterId: targetSemesterId,
        assignmentDate: form.assignmentDate,
        ...(syllabusFileId ? { syllabusFileId } : {}),
      };

      if (editingItem) {
        const originalKey: AssignmentKey = {
          courseId: editingItem.courseId,
          teacherId: editingItem.teacherId,
          semesterId: editingItem.semesterId,
        };

        // El backend no permite cambiar courseId/teacherId/semesterId vía PUT
        // porque forman la clave primaria compuesta. Si alguno cambió, la única
        // solución es DELETE del registro original + POST del nuevo.
        const keyChanged =
          form.courseId !== editingItem.courseId ||
          form.teacherId !== editingItem.teacherId;

        if (keyChanged) {
          await deleteAssignment(token, originalKey);
          await createAssignment(token, payload);
        } else {
          // Solo cambió fecha o sílabo → PUT normal
          await updateAssignment(token, originalKey, payload);
        }
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
    assignments, loading, error, isCoordinator,
    teachers, courses, loadingDeps,
    isFormOpen, editingItem, form, setForm, submitting, formError,
    openCreate, openEdit, closeForm, handleSubmit,
    existingSyllabus, loadingSyllabus,
    deletingItem, setDeletingItem, handleDelete,
    toast, setToast,
  };
}
