import { FormEvent, useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { UserRole } from '../../../types/auth';
import {
  UserResponse,
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
  yearPromotion: number;
  status: 'Regular' | 'Reactualizacion';
  cui: string;
  paymentCode: string;
  phone: string;
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

const EMPTY_BASE: UserCreateRequest = {
  firstName: '',
  lastName: '',
  email: '',
  dni: '',
  role: 'ADMIN',
  active: true,
};

const EMPTY_STUDENT: StudentFormState = {
  yearPromotion: new Date().getFullYear(),
  status: 'Regular',
  cui: '',
  paymentCode: '',
  phone: '',
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

// --- Mappers especializado → UserResponse ---

function mapStudentsToUsers(students: StudentResponse[]): UserResponse[] {
  return students.map((s) => ({
    id: s.userId,
    email: s.email,
    firstName: s.firstName,
    lastName: s.lastName,
    dni: s.dni,
    role: 'STUDENT' as UserRole,
    active: true,
    createdAt: s.createdAt,
    updatedAt: s.updatedAt,
    student: {
      id: s.id,
      yearPromotion: s.yearPromotion,
      status: s.status,
      cui: s.cui,
      paymentCode: s.paymentCode,
      phone: s.phone,
      createdAt: s.createdAt,
      updatedAt: s.updatedAt,
    },
  }));
}

function mapTeachersToUsers(teachers: TeacherResponse[]): UserResponse[] {
  return teachers.map((t) => ({
    id: t.userId,
    email: t.email,
    firstName: t.firstName,
    lastName: t.lastName,
    dni: t.dni,
    role: 'TEACHER' as UserRole,
    active: true,
    createdAt: t.createdAt,
    updatedAt: t.updatedAt,
    teacher: {
      id: t.id,
      type: t.type as TeacherType,
      category: t.category as TeacherCategory | undefined,
      regime: t.regime,
      academicDegree: t.academicDegree as AcademicDegree | undefined,
      specialty: t.specialty,
      phone: t.phone,
      university: t.university,
      createdAt: t.createdAt,
      updatedAt: t.updatedAt,
    },
  }));
}

export function useUsuarios() {
  const { user: authUser, token } = useAuth();

  // El coordinador solo puede ver, no crear ni editar ni eliminar
  const isCoordinator = authUser?.role === 'COORDINATOR';

  // --- Estado de la lista de usuarios ---
  const [users, setUsers] = useState<UserResponse[]>([]);
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
  const [editingUser, setEditingUser] = useState<UserResponse | null>(null);
  const [form, setForm] = useState<UserCreateRequest>(EMPTY_BASE);
  const [studentForm, setStudentForm] = useState<StudentFormState>(EMPTY_STUDENT);
  const [teacherForm, setTeacherForm] = useState<TeacherFormState>(EMPTY_TEACHER);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // --- Estado del modal de eliminación ---
  const [deletingUser, setDeletingUser] = useState<UserResponse | null>(null);

  // --- Estado del toast de notificación ---
  const [toast, setToast] = useState<{
    visible: boolean;
    variant: 'success' | 'error';
    message: string;
  }>({ visible: false, variant: 'success', message: '' });

  const showToast = (variant: 'success' | 'error', message: string) =>
    setToast({ visible: true, variant, message });

  const loadUsers = useCallback(() => {
    if (!token) return;
    setLoading(true);
    setError(null);

    const req =
      filterRole === 'STUDENT' ? listStudents(token).then(mapStudentsToUsers) :
      filterRole === 'TEACHER' ? listTeachers(token).then(mapTeachersToUsers) :
      listUsers(token);

    req
      .then(setUsers)
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

  // Abre el modal en modo edición.
  // Para usuarios de la vista general (GET /users) hace GET /users/{id} para obtener
  // dni y active reales. Los datos de teacher/student se toman del objeto en lista,
  // que cuando se filtra por rol viene completo desde GET /teachers o GET /students.
  const openEditModal = async (user: UserResponse) => {
    if (!token) return;
    try {
      // Obtener datos base actualizados (incluye dni y active que la lista puede omitir)
      const fullUser = await getUserById(token, user.id);

      // Combinar: datos base del GET /users/{id} + perfiles del objeto en lista
      const merged: UserResponse = {
        ...fullUser,
        teacher: user.teacher ?? fullUser.teacher,
        student: user.student ?? fullUser.student,
      };

      setEditingUser(merged);
      setForm({
        firstName: merged.firstName,
        lastName: merged.lastName,
        email: merged.email,
        dni: merged.dni ?? '',
        role: merged.role as UserRole,
        active: merged.active,
      });

      if (merged.teacher) {
        setTeacherForm({
          type: merged.teacher.type as TeacherType,
          category: (merged.teacher.category as TeacherCategory | '') ?? '',
          regime: merged.teacher.regime ?? '',
          academicDegree: (merged.teacher.academicDegree as AcademicDegree | '') ?? '',
          department: merged.teacher.specialty ?? '',
          university: merged.teacher.university ?? '',
          phone: merged.teacher.phone ?? '',
        });
      } else {
        setTeacherForm(EMPTY_TEACHER);
      }

      if (merged.student) {
        setStudentForm({
          yearPromotion: merged.student.yearPromotion ?? new Date().getFullYear(),
          status: (merged.student.status as StudentFormState['status']) ?? 'Regular',
          cui: merged.student.cui ?? '',
          paymentCode: merged.student.paymentCode ?? '',
          phone: merged.student.phone ?? '',
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
      // 1. Validar el base form
      if (!form.firstName.trim() || !form.lastName.trim() || !form.email.trim()) {
        throw new Error('Nombres, apellidos y correo son obligatorios.');
      }
      if (!editingUser && !form.role) {
        throw new Error('El rol es obligatorio para un nuevo usuario.');
      }

      // 2. Armar payload de creación o edición
      const basePayload: UserRequest = {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        dni: form.dni?.trim() || undefined,
        role: form.role,
        active: form.active ?? true,
      };

      if (editingUser) {
        const updatePayload: UserUpdateRequest = { ...basePayload };

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
        } else if (form.role === 'STUDENT') {
          updatePayload.student = {
            yearPromotion: studentForm.yearPromotion,
            status: studentForm.status,
            cui: studentForm.cui.trim() || undefined,
            paymentCode: studentForm.paymentCode.trim() || undefined,
            phone: studentForm.phone.trim() || undefined,
          };
        }

        await updateUser(token, editingUser.id, updatePayload);
        showToast('success', 'Usuario actualizado correctamente.');
      } else {
        const createPayload: UserCreateRequest = { ...basePayload };
        if (form.role === 'STUDENT') {
          createPayload.student = {
            yearPromotion: studentForm.yearPromotion,
            status: studentForm.status,
            cui: studentForm.cui,
            paymentCode: studentForm.paymentCode,
            phone: studentForm.phone || undefined,
          };
        } else if (form.role === 'TEACHER') {
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
        await createUser(token, createPayload);
        showToast('success', 'Usuario creado correctamente.');
      }

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

  // --- Paginación ---
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

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

  const totalPages = Math.ceil(filteredUsers.length / pageSize);
  const paginatedUsers = filteredUsers.slice(page * pageSize, (page + 1) * pageSize);

  // Resetear a página 0 cuando cambian filtros o pageSize
  useEffect(() => { setPage(0); }, [searchTerm, filterRole, teacherTypeFilter, studentStatusFilter, pageSize]);

  return {
    // Lista y estados de carga
    paginatedUsers,
    filteredCount: filteredUsers.length,
    page,
    setPage,
    pageSize,
    setPageSize,
    totalPages,
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
