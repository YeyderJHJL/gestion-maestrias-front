import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import { StudentResponse, listStudents } from '../../../../services/studentsApiService';
import { EnrollmentResponse, listEnrollments } from '../../../../services/enrollmentsApiService';

export type Toast = { visible: boolean; variant: 'success' | 'error'; message: string };

export function useMatriculas() {
  const { user, token } = useAuth();
  const isCoordinator = user?.role === 'COORDINATOR';

  const [students, setStudents]       = useState<StudentResponse[]>([]);
  const [enrollments, setEnrollments] = useState<EnrollmentResponse[]>([]);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState<string | null>(null);

  // búsqueda
  const [searchTerm, setSearchTerm]           = useState('');
  const [searchInput, setSearchInput]         = useState('');
  const [selectedStudent, setSelectedStudent] = useState<StudentResponse | null>(null);

  const [toast, setToast] = useState<Toast>({ visible: false, variant: 'success', message: '' });
  const showToast = (variant: Toast['variant'], message: string) =>
    setToast({ visible: true, variant, message });

  // ── Carga inicial ──────────────────────────────────────────────────────────
  const loadAll = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const [s, e] = await Promise.all([listStudents(token), listEnrollments(token)]);
      setStudents(s);
      setEnrollments(e);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar los datos.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { loadAll(); }, [loadAll]);

  const refreshEnrollments = useCallback(async () => {
    if (!token) return;
    try {
      const data = await listEnrollments(token);
      setEnrollments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar matrículas.');
    }
  }, [token]);

  // ── Filtro de estudiantes por búsqueda ────────────────────────────────────
  const filteredStudents = useMemo(() => {
    if (!searchTerm.trim()) return students;
    const q = searchTerm.toLowerCase();
    return students.filter((s) => {
      const full = `${s.firstName} ${s.lastName} ${s.email} ${s.cui} ${s.paymentCode}`.toLowerCase();
      return full.includes(q);
    });
  }, [students, searchTerm]);

  const handleSearch = () => {
    setSearchTerm(searchInput);
    setSelectedStudent(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  const selectStudent = (student: StudentResponse) => setSelectedStudent(student);
  const clearSearch   = () => { setSearchInput(''); setSearchTerm(''); setSelectedStudent(null); };

  const selectedEnrollments = useMemo(
    () => (selectedStudent ? enrollments.filter((e) => e.studentId === selectedStudent.id) : []),
    [selectedStudent, enrollments]
  );

  return {
    allEnrollments: enrollments,
    isCoordinator,
    loading, error,
    searchInput, setSearchInput, handleSearch, handleKeyDown, clearSearch,
    searchTerm,
    filteredStudents,
    selectedStudent, selectStudent,
    selectedEnrollments,
    refreshEnrollments,
    showToast, toast, setToast,
  };
}
