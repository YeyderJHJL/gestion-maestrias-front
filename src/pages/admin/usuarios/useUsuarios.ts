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
  listUsers,
  createUser,
  updateUser,
  deleteUser,
} from '../../../services/usersApiService';
import { TeacherType, TeacherCategory, AcademicDegree } from '../../../services/teachersApiService';
import { ApiError } from '../../../services/api';

// --- Tipos del estado de los subformularios ---

export type StudentFormState = {
  yearPromotion: number | '';
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

  // Obtiene la lista de usuarios desde el servidor
  const loadUsers = useCallback(() => {
    if (!token) return;
    setLoading(true);
    listUsers(token)
      .then(setUsers)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [token]);

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

  // Abre el modal en modo edición y precarga los datos del usuario seleccionado
  const openEditModal = (user: User) => {
    setEditingUser(user);
    setForm({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      dni: user.dni ?? '',
      role: user.role as UserRole,
      active: user.active,
    });
    setFormError(null);
    setIsUserModalOpen(true);
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
        const updatePayload: UserRequest = {
          ...form,
          dni: form.dni?.trim() || undefined,
        };
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
      closeModal();
      loadUsers();
    } catch (e) {
      setFormError(e instanceof ApiError ? e.message : 'Error al guardar el usuario.');
    } finally {
      setSubmitting(false);
    }
  };

  // Elimina el usuario seleccionado y lo retira de la lista sin recargar
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
        (u.dni ?? '').toLowerCase().includes(term);
      const matchesRole = !filterRole || u.role === filterRole;
      return matchesSearch && matchesRole;
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
