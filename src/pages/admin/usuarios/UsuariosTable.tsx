// Componente de tabla de usuarios con barra de filtros.
// Recibe la lista ya filtrada desde el hook y delega las acciones
// de edición y eliminación al componente padre.

import { SearchIcon, EditIcon, XIcon, UsersIcon, Loader2Icon } from 'lucide-react';
import { StatusBadge } from '../../../components/StatusBadge';
import { EmptyState } from '../../../components/EmptyState';
import { User } from '../../../services/usersApiService';

// Variante visual del badge según el rol
const ROLE_BADGE_VARIANT: Record<string, 'activo' | 'en-curso' | 'validado' | 'matriculado'> = {
  Administrador: 'activo',
  Coordinador: 'en-curso',
  Docente: 'validado',
  Estudiante: 'matriculado',
};

interface Props {
  // Lista de usuarios ya filtrada por el hook
  users: User[];
  loading: boolean;
  error: string | null;
  // Control de los filtros
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterRole: string;
  onFilterRoleChange: (value: string) => void;
  teacherTypeFilter: string;
  onTeacherTypeFilterChange: (value: string) => void;
  studentStatusFilter: string;
  onStudentStatusFilterChange: (value: string) => void;
  // Oculta las acciones cuando el usuario es coordinador
  isCoordinator: boolean;
  // Callbacks para abrir los modales correspondientes
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

export function UsuariosTable({
  users,
  loading,
  error,
  searchTerm,
  onSearchChange,
  filterRole,
  onFilterRoleChange,
  teacherTypeFilter,
  onTeacherTypeFilterChange,
  studentStatusFilter,
  onStudentStatusFilterChange,
  isCoordinator,
  onEdit,
  onDelete,
}: Props) {
  return (
    <>
      {/* Barra de búsqueda y filtros */}
      <div className="bg-surface border border-border rounded-lg p-4 flex gap-4">
        <div className="flex-1 relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
          <input
            type="text"
            placeholder={
              filterRole === 'Estudiante'
                ? 'Buscar por nombre, correo, DNI o CUI...'
                : 'Buscar por nombre, correo o DNI...'
            }
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        {filterRole === 'Docente' && (
          <select
            value={teacherTypeFilter}
            onChange={(e) => onTeacherTypeFilterChange(e.target.value)}
            className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Todos los tipos</option>
            <option value="Interno">Interno</option>
            <option value="Externo">Externo</option>
          </select>
        )}
        {filterRole === 'Estudiante' && (
          <select
            value={studentStatusFilter}
            onChange={(e) => onStudentStatusFilterChange(e.target.value)}
            className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Todos los estados</option>
            <option value="Regular">Regular</option>
            <option value="Reactualizacion">Reactualización</option>
          </select>
        )}
        <select
          value={filterRole}
          onChange={(e) => onFilterRoleChange(e.target.value)}
          className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">Todos</option>
          <option value="Administrador">Administrador</option>
          <option value="Coordinador">Coordinador</option>
          <option value="Docente">Docente</option>
          <option value="Estudiante">Estudiante</option>
        </select>
      </div>

      {/* Contenedor de la tabla con estados de carga, error y vacío */}
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
        ) : users.length === 0 ? (
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
                    DNI
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase">
                    Rol
                  </th>
                  {filterRole === 'Docente' ? (
                    <>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase">Tipo</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase">Categoría</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase">Grado académico</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase">Universidad</th>
                    </>
                  ) : filterRole === 'Estudiante' ? (
                    <>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase">CUI</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase">Año promoción</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase">Estado académico</th>
                    </>
                  ) : null}
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
                {users.map((user, index) => (
                  <tr
                    key={user.id}
                    className={index % 2 === 0 ? 'bg-surface' : 'bg-surface-alt'}
                  >
                    <td className="px-6 py-4 text-sm text-text font-medium">
                      {user.firstName} {user.lastName}
                    </td>
                    <td className="px-6 py-4 text-sm text-text-muted">{user.email}</td>
                    <td className="px-6 py-4 text-sm text-text-muted">{user.dni ?? '—'}</td>
                    <td className="px-6 py-4">
                      <StatusBadge variant={ROLE_BADGE_VARIANT[user.role] ?? 'activo'}>
                        {user.role}
                      </StatusBadge>
                    </td>
                    {filterRole === 'Docente' ? (
                      <>
                        <td className="px-6 py-4 text-sm text-text-muted">{user.teacher?.type ?? '—'}</td>
                        <td className="px-6 py-4 text-sm text-text-muted">{user.teacher?.category ?? '—'}</td>
                        <td className="px-6 py-4 text-sm text-text-muted">{user.teacher?.academicDegree ?? '—'}</td>
                        <td className="px-6 py-4 text-sm text-text-muted">{user.teacher?.university ?? '—'}</td>
                      </>
                    ) : filterRole === 'Estudiante' ? (
                      <>
                        <td className="px-6 py-4 text-sm text-text-muted">{user.student?.cui ?? '—'}</td>
                        <td className="px-6 py-4 text-sm text-text-muted">{user.student?.yearPromotion ?? '—'}</td>
                        <td className="px-6 py-4 text-sm text-text-muted">{user.student?.status ?? '—'}</td>
                      </>
                    ) : null}
                    <td className="px-6 py-4">
                      <StatusBadge variant={user.active ? 'activo' : 'inactivo'}>
                        {user.active ? 'Activo' : 'Inactivo'}
                      </StatusBadge>
                    </td>
                    {!isCoordinator && (
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => onEdit(user)}
                            className="p-1 text-primary hover:text-primary-light transition-colors"
                            title="Editar usuario"
                          >
                            <EditIcon className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => onDelete(user)}
                            className="p-1 text-accent hover:text-accent-light transition-colors"
                            title="Eliminar usuario"
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
    </>
  );
}
