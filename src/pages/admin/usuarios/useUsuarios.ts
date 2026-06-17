// Hook centralizado para la gestión de usuarios.
// Encapsula todo el estado, los filtros y las operaciones CRUD
// para que el componente de página solo se ocupe de renderizar.

import { FormEvent, useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { UserRole } from '../../../types/auth';
import {
  User,
  UserRequest,
  UserCreateRequest,
  UserUpdateRequest,
  listUsers,
  createUser,
  updateUser,
  deleteUser,
  getUserById,
} from '../../../services/usersApiService';
import {
  TeacherType,
  TeacherCategory,
  AcademicDegree,
  TeacherResponse,
  listTeachers,
} from '../../../services/teachersApiService';
import { StudentResponse, listStudents } from '../../../services/studentsApiService';
import { ApiError } from '../../../services/api';

// --- Tipos del estado de los subformularios ---

export type StudentFormState = {
  yearPromotion: number | '';
  cui: string;
  paymentCode: string;
  phone: string;
  status: string;
};

export type TeacherFormState = {
  type: TeacherType;
  category: TeacherCategory | '';
  regime: string;
  academicDegree: AcademicDegree | '';
  department: string;
  university: string;
  phone: string;
};

// --- Valores iniciales vacíos ---

const EMPTY_BASE: UserRequest = {
  firstName: '',
  lastName: '',
  email: '',
  dni: '',
  role: 'ADMIN',
  active: true,
};

const EMPTY_STUDENT: StudentFormState = {
  yearPromotion: '',
  cui: '',
  paymentCode: '',
  phone: '',
  status: '',
};

const EMPTY_TEACHER: TeacherFormState = {
  type: 'Interno',
  category: '',
  regime: '',
  academicDegree: '',
  department: '',
  university: '',
  phone: '',
};

// --- Cache localStorage por filtro ---

const CACHE_KEYS: Record<string, string> = {
  '':       'sga_users_all',
  TEACHER:  'sga_users_teachers',
  STUDENT:  'sga_users_students',
};

function getCached(key: string): User[] | null {
  try { return JSON.parse(localStorage.getItem(key) ?? 'null'); } catch { return null; }
}

function clearAllCaches() {
  Object.values(CACHE_KEYS).forEach((k) => localStorage.removeItem(k));
}

// --- Mappers especializado → User ---

function mapStudentsToUsers(students: StudentResponse[]): User[] {
  return students.map((s) => ({
    id: s.userId,
    email: s.email,
    firstName: s.firstName,
    lastName: s.lastName,
    role: 'STUDENT' as const,
    active: true,
    createdAt: s.createdAt,
    updatedAt: s.updatedAt,
    student: {
      yearPromotion: s.yearPromotion,
      status: s.status,
      cui: s.cui,
      paymentCode: s.paymentCode,
      phone: s.phone,
    },
  }));
}

function mapTeachersToUsers(teachers: TeacherResponse[]): User[] {
  return teachers.map((t) => ({
    id: t.userId,
    email: t.email,
    firstName: t.firstName,
    lastName: t.lastName,
    role: 'TEACHER' as const,
    active: true,
    createdAt: t.createdAt,
    updatedAt: t.updatedAt,
    teacher: {
      type: t.type,
      category: t.category,
      regime: t.regime,
      academicDegree: t.academicDegree,
      specialty: t.specialty,
      phone: t.phone,
      university: t.university,
    },
  }));
}

export function useUsuarios() {
  const { user: authUser, token } = useAuth();

  // El coordinador solo puede ver, no crear ni editar ni eliminar
  const isCoordinator = authUser?.role === 'COORDINATOR';

  // --- Estado de la lista de usuarios ---
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- Filtros de búsqueda y rol ---
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [teacherTypeFilter, setTeacherTypeFilter] = useState('');
  const [studentStatusFilter, setStudentStatusFilter] = useState('');

  // Resetear filtros contextuales al cambiar de rol
  useEffect(() => {
    setTeacherTypeFilter('');
    setStudentStatusFilter('');
    setSearchTerm('');
  }, [filterRole]);

  // --- Estado del modal de creación y edición ---
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form, setForm] = useState<UserRequest>(EMPTY_BASE);
  const [studentForm, setStudentForm] = useState<StudentFormState>(EMPTY_STUDENT);
  const [teacherForm, setTeacherForm] = useState<TeacherFormState>(EMPTY_TEACHER);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // --- Estado del modal de eliminación ---
  const [deletingUser, setDeletingUser] = useState<User | null>(null);

  // --- Estado del toast de notificación ---
  const [toast, setToast] = useState<{
    visible: boolean;
    variant: 'success' | 'error';
    message: string;
  }>({ visible: false, variant: 'success', message: '' });

  const showToast = (variant: 'success' | 'error', message: string) =>
    setToast({ visible: true, variant, message });

  // Obtiene la lista según el filtro activo; muestra caché inmediato si existe
  const loadUsers = useCallback(() => {
    if (!token) return;
    setError(null);

    const cacheKey = CACHE_KEYS[filterRole] ?? 'sga_users_all';
    const cached = getCached(cacheKey);
    if (cached) {
      setUsers(cached);
      setLoading(false);
    } else {
      setLoading(true);
    }

    let req: Promise<User[]>;
    if (filterRole === 'STUDENT') {
      req = listStudents(token).then(mapStudentsToUsers);
    } else if (filterRole === 'TEACHER') {
      req = listTeachers(token).then(mapTeachersToUsers);
    } else {
      req = listUsers(token);
    }

    req
      .then((data) => {
        setUsers(data);
        localStorage.setItem(cacheKey, JSON.stringify(data));
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [token, filterRole]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // Abre el modal en modo creación con los campos en blanco
  const openCreateModal = () => {
    setEditingUser(null);
    setForm(EMPTY_BASE);
    setStudentForm(EMPTY_STUDENT);
    setTeacherForm(EMPTY_TEACHER);
    setFormError(null);
    setIsUserModalOpen(true);
  };

  // Abre el modal en modo edición; hace GET /users/{id} para obtener dni y active reales
  const openEditModal = async (user: User) => {
    if (!token) return;
    try {
      const fullUser = await getUserById(token, user.id);
      setEditingUser(fullUser);
      setForm({
        firstName: fullUser.firstName,
        lastName: fullUser.lastName,
        email: fullUser.email,
        dni: fullUser.dni ?? '',
        role: fullUser.role as UserRole,
        active: fullUser.active,
      });
      if (fullUser.teacher) {
        setTeacherForm({
          type: fullUser.teacher.type as TeacherType,
          category: (fullUser.teacher.category as TeacherCategory | '') ?? '',
          regime: fullUser.teacher.regime ?? '',
          academicDegree: (fullUser.teacher.academicDegree as AcademicDegree | '') ?? '',
          department: fullUser.teacher.specialty ?? '',
          university: fullUser.teacher.university ?? '',
          phone: fullUser.teacher.phone ?? '',
        });
      } else {
        setTeacherForm(EMPTY_TEACHER);
      }
      if (fullUser.student) {
        setStudentForm({
          yearPromotion: fullUser.student.yearPromotion ?? '',
          cui: fullUser.student.cui ?? '',
          paymentCode: fullUser.student.paymentCode ?? '',
          phone: fullUser.student.phone ?? '',
          status: fullUser.student.status ?? '',
        });
      } else {
        setStudentForm(EMPTY_STUDENT);
      }
      setFormError(null);
      setIsUserModalOpen(true);
    } catch {
      showToast('error', 'No se pudieron cargar los datos del usuario.');
    }
  };

  // Cierra el modal y limpia el usuario en edición
  const closeModal = () => {
    setIsUserModalOpen(false);
    setEditingUser(null);
  };

  // Envía el formulario: crea un nuevo usuario o actualiza el existente
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setSubmitting(true);
    setFormError(null);
    try {
      if (editingUser) {
        const updatePayload: UserUpdateRequest = {
          ...form,
          dni: form.dni?.trim() || undefined,
        };
        if (form.role === 'TEACHER') {
          updatePayload.teacher = {
            type: teacherForm.type,
            category: teacherForm.category || undefined,
            regime: teacherForm.regime.trim() || undefined,
            academicDegree: teacherForm.academicDegree || undefined,
            specialty: teacherForm.department.trim() || undefined,
            phone: teacherForm.phone.trim() || undefined,
            university:
              teacherForm.type === 'Interno'
                ? 'Universidad Nacional de San Agustín'
                : teacherForm.university.trim() || undefined,
          };
        }
        if (form.role === 'STUDENT') {
          updatePayload.student = {
            yearPromotion:
              studentForm.yearPromotion !== '' ? (studentForm.yearPromotion as number) : undefined,
            cui: studentForm.cui || undefined,
            paymentCode: studentForm.paymentCode || undefined,
            phone: studentForm.phone.trim() || undefined,
            status: studentForm.status || undefined,
          };
        }
        await updateUser(token, editingUser.id, updatePayload);
        showToast('success', 'Usuario actualizado correctamente.');
      } else {
        const createPayload: UserCreateRequest = {
          ...form,
          dni: form.dni?.trim() || undefined,
        };
        if (form.role === 'TEACHER') {
          createPayload.teacher = {
            type: teacherForm.type,
            category: teacherForm.category || undefined,
            regime: teacherForm.regime.trim() || undefined,
            academicDegree: teacherForm.academicDegree || undefined,
            specialty: teacherForm.department.trim() || undefined,
            phone: teacherForm.phone.trim() || undefined,
            university:
              teacherForm.type === 'Interno'
                ? 'Universidad Nacional de San Agustín'
                : teacherForm.university.trim() || undefined,
          };
        }
        if (form.role === 'STUDENT' && studentForm.yearPromotion !== '') {
          createPayload.student = {
            yearPromotion: studentForm.yearPromotion as number,
            cui: studentForm.cui,
            paymentCode: studentForm.paymentCode,
            phone: studentForm.phone.trim() || undefined,
          };
        }
        await createUser(token, createPayload);
        showToast('success', 'Usuario creado correctamente.');
      }
      clearAllCaches();
      closeModal();
      loadUsers();
    } catch (e) {
      setFormError(e instanceof ApiError ? e.message : 'Error al guardar el usuario.');
    } finally {
      setSubmitting(false);
    }
  };

  // Elimina el usuario seleccionado; actualiza el estado optimistamente e invalida los caches
  const handleDelete = async () => {
    if (!token || !deletingUser) return;
    try {
      await deleteUser(token, deletingUser.id);
      setUsers((prev) => prev.filter((u) => u.id !== deletingUser.id));
      clearAllCaches();
      showToast(
        'success',
        `Usuario ${deletingUser.firstName} ${deletingUser.lastName} eliminado.`
      );
    } catch (e) {
      showToast('error', e instanceof ApiError ? e.message : 'Error al eliminar el usuario.');
    } finally {
      setDeletingUser(null);
    }
  };

  // Excluye al usuario en sesión y aplica los filtros de búsqueda y rol
  const filteredUsers = users
    .filter((u) => u.id !== authUser?.id)
    .filter((u) => {
      const term = searchTerm.toLowerCase();
      const fullName = `${u.firstName} ${u.lastName}`.toLowerCase();
      const matchesSearch =
        !searchTerm ||
        fullName.includes(term) ||
        u.email.toLowerCase().includes(term) ||
        (u.dni ?? '').toLowerCase().includes(term) ||
        (filterRole === 'STUDENT' && (u.student?.cui ?? '').toLowerCase().includes(term));
      const matchesRole = !filterRole || u.role === filterRole;
      const matchesTeacherType = !teacherTypeFilter || u.teacher?.type === teacherTypeFilter;
      const matchesStudentStatus = !studentStatusFilter || u.student?.status === studentStatusFilter;
      return matchesSearch && matchesRole && matchesTeacherType && matchesStudentStatus;
    });

  return {
    // Lista y estados de carga
    filteredUsers,
    loading,
    error,
    // Filtros
    searchTerm,
    setSearchTerm,
    filterRole,
    setFilterRole,
    teacherTypeFilter,
    setTeacherTypeFilter,
    studentStatusFilter,
    setStudentStatusFilter,
    // Permisos del usuario en sesión
    isCoordinator,
    // Modal crear / editar
    isUserModalOpen,
    editingUser,
    form,
    setForm,
    studentForm,
    setStudentForm,
    teacherForm,
    setTeacherForm,
    submitting,
    formError,
    openCreateModal,
    openEditModal,
    closeModal,
    handleSubmit,
    // Modal eliminar
    deletingUser,
    setDeletingUser,
    handleDelete,
    // Notificación
    toast,
    setToast,
  };
}
