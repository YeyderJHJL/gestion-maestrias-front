import React, { useCallback, useEffect, useState } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { Modal } from '../../components/Modal';
import { ConfirmationModal } from '../../components/ConfirmationModal';
import { StatusBadge } from '../../components/StatusBadge';
import { EmptyState } from '../../components/EmptyState';
import { Toast } from '../../components/Toast';
import {
  SearchIcon,
  PlusIcon,
  EditIcon,
  XIcon,
  UsersIcon,
  Loader2Icon,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types/auth';
import { User, UserRequest, listUsers, createUser, updateUser, deleteUser } from '../../services/usersApiService';
import { Promotion, listPromotions } from '../../services/studentsApiService';
import { TeacherType, TeacherCategory, AcademicDegree } from '../../services/teachersApiService';
import { ApiError } from '../../services/api';

const ROLE_LABELS: Record<string, string> = {
  ADMIN: 'Administrador',
  TEACHER: 'Docente',
  STUDENT: 'Estudiante',
  COORDINATOR: 'Coordinador',
};

const EMPTY_BASE: UserRequest = {
  firstName: '',
  lastName: '',
  email: '',
  dni: '',
  role: 'ADMIN',
  active: true,
};

const EMPTY_STUDENT = {
  promotionId: '' as number | '',
  cui: '',
  paymentCode: '',
  phone: '',
};

const EMPTY_TEACHER = {
  type: 'Interno' as TeacherType,
  category: '' as TeacherCategory | '',
  regime: '',
  academicDegree: '' as AcademicDegree | '',
  specialty: '',
  phone: '',
};


export function AdminUsuarios() {
  const { user: authUser, token } = useAuth();
  const isCoordinator = authUser?.role === 'COORDINATOR';

  // Lista de usuarios
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');

  // Modal eliminar usuario
  const [deletingUser, setDeletingUser] = useState<User | null>(null);

  // Modal crear / editar usuario
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form, setForm] = useState<UserRequest>(EMPTY_BASE);
  const [studentForm, setStudentForm] = useState(EMPTY_STUDENT);
  const [teacherForm, setTeacherForm] = useState(EMPTY_TEACHER);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loadingPromotions, setLoadingPromotions] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Toast
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
    listUsers(token)
      .then(setUsers)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // Carga promociones cuando el rol es STUDENT y el modal está abierto
  useEffect(() => {
    if (!token || form.role !== 'STUDENT' || !isUserModalOpen) return;
    setLoadingPromotions(true);
    listPromotions(token)
      .then(setPromotions)
      .catch(() => setPromotions([]))
      .finally(() => setLoadingPromotions(false));
  }, [token, form.role, isUserModalOpen]);

  const handleDelete = async () => {
    if (!token || !deletingUser) return;
    try {
      await deleteUser(token, deletingUser.id);
      setUsers((prev) => prev.filter((u) => u.id !== deletingUser.id));
      showToast('success', `Usuario ${deletingUser.firstName} ${deletingUser.lastName} eliminado.`);
    } catch (e) {
      showToast('error', e instanceof ApiError ? e.message : 'Error al eliminar el usuario.');
    } finally {
      setDeletingUser(null);
    }
  };

  const openCreateModal = () => {
    setEditingUser(null);
    setForm(EMPTY_BASE);
    setStudentForm(EMPTY_STUDENT);
    setTeacherForm(EMPTY_TEACHER);
    setFormError(null);
    setIsUserModalOpen(true);
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setForm({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      dni: user.dni ?? '',
      role: user.role,
      active: user.active,
    });
    setFormError(null);
    setIsUserModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setSubmitting(true);
    setFormError(null);
    try {
      const payload: UserRequest = { ...form, dni: form.dni?.trim() || undefined };
      if (editingUser) {
        await updateUser(token, editingUser.id, payload);
        showToast('success', 'Usuario actualizado correctamente.');
      } else {
        await createUser(token, payload);
        showToast('success', 'Usuario creado correctamente.');
      }
      setIsUserModalOpen(false);
      setEditingUser(null);
      loadUsers();
    } catch (e) {
      setFormError(e instanceof ApiError ? e.message : 'Error al guardar el usuario.');
    } finally {
      setSubmitting(false);
    }
  };

  // Excluir al usuario actual de la lista y aplicar filtros
  const filteredUsers = users
    .filter((u) => u.id !== authUser?.id)
    .filter((u) => {
      const fullName = `${u.firstName} ${u.lastName}`.toLowerCase();
      const matchesSearch =
        !searchTerm ||
        fullName.includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = !filterRole || u.role === filterRole;
      return matchesSearch && matchesRole;
    });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-serif font-bold text-text">Gestión de Usuarios</h1>
          {!isCoordinator && (
            <button
              onClick={openCreateModal}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors"
            >
              <PlusIcon className="w-5 h-5" />
              Nuevo Usuario
            </button>
          )}
        </div>

        {/* Filtros */}
        <div className="bg-surface border border-border rounded-lg p-4 flex gap-4">
          <div className="flex-1 relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
            <input
              type="text"
              placeholder="Buscar por nombre o correo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Todos</option>
            <option value="ADMIN">Administrador</option>
            <option value="COORDINATOR">Coordinador</option>
            <option value="TEACHER">Docente</option>
            <option value="STUDENT">Estudiante</option>
          </select>
        </div>

        {/* Tabla */}
        <div className="bg-surface border border-border rounded-lg shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16 gap-3 text-text-muted">
              <Loader2Icon className="w-6 h-6 animate-spin" />
              <span>Cargando usuarios...</span>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-16">
              <p className="text-accent">{error}</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <EmptyState
              icon={UsersIcon}
              title="No se encontraron usuarios"
              subtitle={
                searchTerm || filterRole
                  ? 'Intenta ajustar los filtros de búsqueda.'
                  : undefined
              }
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-surface-alt">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase">
                      Nombre completo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase">
                      Correo institucional
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase">
                      Rol
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase">
                      Estado
                    </th>
                    {!isCoordinator && (
                      <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase">
                        Acciones
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredUsers.map((user, index) => (
                    <tr
                      key={user.id}
                      className={index % 2 === 0 ? 'bg-surface' : 'bg-surface-alt'}
                    >
                      <td className="px-6 py-4 text-sm text-text font-medium">
                        {user.firstName} {user.lastName}
                      </td>
                      <td className="px-6 py-4 text-sm text-text-muted">{user.email}</td>
                      <td className="px-6 py-4 text-sm text-text">
                        {ROLE_LABELS[user.role] ?? user.role}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge variant={user.active ? 'activo' : 'inactivo'}>
                          {user.active ? 'Activo' : 'Inactivo'}
                        </StatusBadge>
                      </td>
                      {!isCoordinator && (
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => openEditModal(user)}
                              className="p-1 text-primary hover:text-primary-light transition-colors"
                            >
                              <EditIcon className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => setDeletingUser(user)}
                              className="p-1 text-accent hover:text-accent-light transition-colors"
                            >
                              <XIcon className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal: Nuevo Usuario */}
      <Modal
        isOpen={isUserModalOpen}
        onClose={() => { setIsUserModalOpen(false); setEditingUser(null); }}
        title={editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
        size="lg"
        accentBorder
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Datos personales */}
          <div>
            <h3 className="font-semibold text-text mb-4">Datos personales</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-text">Nombres *</label>
                <input
                  type="text"
                  required
                  maxLength={100}
                  value={form.firstName}
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-text">Apellidos *</label>
                <input
                  type="text"
                  required
                  maxLength={100}
                  value={form.lastName}
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="col-span-2 space-y-2">
                <label className="block text-sm font-medium text-text">
                  Correo institucional *
                </label>
                <input
                  type="email"
                  required
                  maxLength={255}
                  placeholder="@unsa.edu.pe"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-text">DNI</label>
                <input
                  type="text"
                  maxLength={20}
                  value={form.dni ?? ''}
                  onChange={(e) => setForm({ ...form, dni: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-text">Rol *</label>
                <select
                  required
                  value={form.role}
                  onChange={(e) =>
                    setForm({ ...form, role: e.target.value as UserRole })
                  }
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="ADMIN">Administrador</option>
                  <option value="COORDINATOR">Coordinador</option>
                  <option value="TEACHER">Docente</option>
                  <option value="STUDENT">Estudiante</option>
                </select>
              </div>
              <div className="col-span-2 space-y-2">
                <label className="block text-sm font-medium text-text">Estado</label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="active"
                      checked={form.active}
                      onChange={() => setForm({ ...form, active: true })}
                      className="text-primary focus:ring-primary"
                    />
                    <span className="text-sm text-text">Activo</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="active"
                      checked={!form.active}
                      onChange={() => setForm({ ...form, active: false })}
                      className="text-primary focus:ring-primary"
                    />
                    <span className="text-sm text-text">Inactivo</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Datos del estudiante — solo en modo crear */}
          {!editingUser && form.role === 'STUDENT' && (
            <div className="border-t border-border pt-6">
              <h3 className="font-semibold text-text mb-4">Datos del estudiante</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-2">
                  <label className="block text-sm font-medium text-text">Promoción *</label>
                  {loadingPromotions ? (
                    <div className="flex items-center gap-2 text-text-muted text-sm py-2">
                      <Loader2Icon className="w-4 h-4 animate-spin" />
                      Cargando promociones...
                    </div>
                  ) : (
                    <select
                      value={studentForm.promotionId}
                      onChange={(e) =>
                        setStudentForm({
                          ...studentForm,
                          promotionId: Number(e.target.value),
                        })
                      }
                      disabled
                      className="w-full px-4 py-2 border border-border rounded-lg bg-surface-alt text-text-muted cursor-not-allowed"
                    >
                      <option value="">Selecciona una promoción</option>
                      {promotions.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} — {p.programName}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-text">CUI *</label>
                  <input
                    type="text"
                    maxLength={20}
                    value={studentForm.cui}
                    disabled
                    onChange={(e) =>
                      setStudentForm({ ...studentForm, cui: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-border rounded-lg bg-surface-alt text-text-muted cursor-not-allowed"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-text">Código de pago *</label>
                  <input
                    type="text"
                    maxLength={100}
                    value={studentForm.paymentCode}
                    disabled
                    onChange={(e) =>
                      setStudentForm({ ...studentForm, paymentCode: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-border rounded-lg bg-surface-alt text-text-muted cursor-not-allowed"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-text">Teléfono</label>
                  <input
                    type="tel"
                    maxLength={20}
                    value={studentForm.phone}
                    disabled
                    onChange={(e) =>
                      setStudentForm({ ...studentForm, phone: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-border rounded-lg bg-surface-alt text-text-muted cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Datos del docente — solo en modo crear */}
          {!editingUser && form.role === 'TEACHER' && (
            <div className="border-t border-border pt-6">
              <h3 className="font-semibold text-text mb-4">Datos del docente</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-2">
                  <label className="block text-sm font-medium text-text">Tipo *</label>
                  <div className="flex gap-4">
                    {(['Interno', 'Externo'] as TeacherType[]).map((t) => (
                      <label key={t} className="flex items-center gap-2 cursor-not-allowed opacity-50">
                        <input
                          type="radio"
                          name="teacherType"
                          checked={teacherForm.type === t}
                          disabled
                          readOnly
                          className="text-primary"
                        />
                        <span className="text-sm text-text">
                          {t === 'Interno' ? 'Interno UNSA' : 'Externo'}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
                {[
                  { label: 'Categoría', key: 'category' },
                  { label: 'Grado académico', key: 'academicDegree' },
                  { label: 'Régimen', key: 'regime' },
                  { label: 'Especialidad', key: 'specialty' },
                  { label: 'Teléfono', key: 'phone' },
                ].map(({ label, key }) => (
                  <div key={key} className="space-y-2">
                    <label className="block text-sm font-medium text-text">{label}</label>
                    <input
                      type="text"
                      disabled
                      className="w-full px-4 py-2 border border-border rounded-lg bg-surface-alt text-text-muted cursor-not-allowed"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <p className="text-sm text-text-muted italic">
            El correo debe pertenecer a una cuenta Google para que el usuario pueda iniciar sesión.
          </p>

          {formError && (
            <p className="text-sm text-accent bg-accent/10 border border-accent/30 rounded-lg px-4 py-2">
              {formError}
            </p>
          )}

          <div className="flex gap-3 justify-end pt-4 border-t border-border">
            <button
              type="button"
              onClick={() => setIsUserModalOpen(false)}
              className="px-6 py-2 border border-primary text-primary rounded-lg hover:bg-primary/5 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting && <Loader2Icon className="w-4 h-4 animate-spin" />}
              {editingUser ? 'Guardar cambios' : 'Guardar usuario'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmationModal
        isOpen={deletingUser !== null}
        onClose={() => setDeletingUser(null)}
        onConfirm={handleDelete}
        title="Eliminar usuario"
        message={
          deletingUser
            ? `¿Estás seguro de que deseas eliminar a ${deletingUser.firstName} ${deletingUser.lastName}? Esta acción no se puede deshacer.`
            : ''
        }
        confirmLabel="Eliminar"
        variant="danger"
      />

      <Toast
        variant={toast.variant}
        message={toast.message}
        isVisible={toast.visible}
        onClose={() => setToast((t) => ({ ...t, visible: false }))}
      />
    </AdminLayout>
  );
}
