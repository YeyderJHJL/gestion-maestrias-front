import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import {
  StudentResponse,
  StudentFilters,
  listStudents,
} from '../../../../services/studentsApiService';
import {
  EnrollmentResponse,
  listEnrollments,
} from '../../../../services/enrollmentsApiService';

// ── Tipos ─────────────────────────────────────────────────────────────────────

export type Toast = {
  visible: boolean;
  variant: 'success' | 'error';
  message: string;
};

/** Fila enriquecida: estudiante + sus matrículas actuales */
export interface StudentRow {
  student: StudentResponse;
  enrollments: EnrollmentResponse[];
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useMatriculas() {
  const { user, token } = useAuth();
  const isCoordinator = user?.role === 'COORDINATOR';

  // ── Datos crudos ───────────────────────────────────────────────────────────
  const [students, setStudents] = useState<StudentResponse[]>([]);
  const [enrollments, setEnrollments] = useState<EnrollmentResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── Filtros locales ────────────────────────────────────────────────────────
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<StudentFilters['status'] | ''>('');
  const [filterYear, setFilterYear] = useState<number | ''>('');

  // ── Estudiante seleccionado (panel de detalle) ─────────────────────────────
  const [selectedStudent, setSelectedStudent] = useState<StudentResponse | null>(null);

  // ── Toast ──────────────────────────────────────────────────────────────────
  const [toast, setToast] = useState<Toast>({ visible: false, variant: 'success', message: '' });
  const showToast = (variant: Toast['variant'], message: string) =>
    setToast({ visible: true, variant, message });

  // ── Carga inicial ──────────────────────────────────────────────────────────
  const loadAll = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const [studentsData, enrollmentsData] = await Promise.all([
        listStudents(token),
        listEnrollments(token),
      ]);
      setStudents(studentsData);
      setEnrollments(enrollmentsData);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar los datos.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { loadAll(); }, [loadAll]);

  // ── Refresco selectivo de matrículas (tras crear/editar/eliminar) ──────────
  const refreshEnrollments = useCallback(async () => {
    if (!token) return;
    try {
      const data = await listEnrollments(token);
      setEnrollments(data);
    } catch (e) {
      console.error('Error refrescando matrículas:', e);
    }
  }, [token]);

  // ── Filas enriquecidas + filtros ───────────────────────────────────────────
  const rows = useMemo<StudentRow[]>(() => {
    const q = search.toLowerCase().trim();
    return students
      .filter((s) => {
        if (filterStatus && s.status !== filterStatus) return false;
        if (filterYear && s.yearPromotion !== filterYear) return false;
        if (q) {
          const full = `${s.firstName} ${s.lastName} ${s.email} ${s.cui} ${s.paymentCode}`.toLowerCase();
          if (!full.includes(q)) return false;
        }
        return true;
      })
      .map((s) => ({
        student: s,
        enrollments: enrollments.filter((e) => e.studentId === s.id),
      }));
  }, [students, enrollments, search, filterStatus, filterYear]);

  // ── Años de promoción únicos para el filtro ───────────────────────────────
  const promotionYears = useMemo(() => {
    const years = [...new Set(students.map((s) => s.yearPromotion))].sort((a, b) => b - a);
    return years;
  }, [students]);

  // ── Selección de estudiante ────────────────────────────────────────────────
  const selectStudent = (student: StudentResponse) => setSelectedStudent(student);
  const clearSelection = () => setSelectedStudent(null);

  /** Matrículas del estudiante actualmente seleccionado */
  const selectedEnrollments = useMemo(
    () => (selectedStudent ? enrollments.filter((e) => e.studentId === selectedStudent.id) : []),
    [selectedStudent, enrollments]
  );

  return {
    // permisos
    isCoordinator,
    // datos
    rows,
    loading,
    error,
    promotionYears,
    // filtros
    search, setSearch,
    filterStatus, setFilterStatus,
    filterYear, setFilterYear,
    // selección
    selectedStudent, selectStudent, clearSelection,
    selectedEnrollments,
    // acciones compartidas
    refreshEnrollments,
    showToast,
    toast, setToast,
  };
}
