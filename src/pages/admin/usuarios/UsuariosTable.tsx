// Componente de tabla de usuarios con barra de filtros.
// Recibe la lista ya filtrada desde el hook y delega las acciones
// de edición y eliminación al componente padre.

import { useEffect, useRef, useState } from 'react';
import { SearchIcon, EditIcon, Trash2Icon, UsersIcon, Loader2Icon, EyeIcon } from 'lucide-react';
import { StatusBadge } from '../../../components/StatusBadge';
import { EmptyState } from '../../../components/EmptyState';
import { FilePreviewModal } from '../../../components/FilePreviewModal';
import { User } from '../../../services/usersApiService';

// Variante visual del badge según el rol
const ROLE_LABELS: Record<string, string> = {
  ADMIN: 'Administrador',
  COORDINATOR: 'Coordinador',
  TEACHER: 'Docente',
  STUDENT: 'Estudiante',
};

const STUDENT_STATUS_LABELS: Record<string, string> = {
  Regular: 'Regular',
  Reactualizacion: 'Reactualización',
};

const ROLE_BADGE_VARIANT: Record<string, 'activo' | 'en-curso' | 'validado' | 'matriculado'> = {
  ADMIN: 'activo',
  COORDINATOR: 'en-curso',
  TEACHER: 'validado',
  STUDENT: 'matriculado',
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
  // Paginación
  filteredCount: number;
  page: number;
  onPageChange: (page: number) => void;
  pageSize: number;
  onPageSizeChange: (size: number) => void;
  totalPages: number;
  // Oculta las acciones cuando el usuario es coordinador
  isCoordinator: boolean;
  // Callbacks para abrir los modales correspondientes
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  // Selección múltiple (solo visible en pestañas Estudiantes/Docentes)
  showBulkSelection: boolean;
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  isAllFilteredSelected: boolean;
  isPartiallySelected: boolean;
  onToggleSelectAll: () => void;
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
  filteredCount,
  page,
  onPageChange,
  pageSize,
  onPageSizeChange,
  totalPages,
  isCoordinator,
  onEdit,
  onDelete,
  showBulkSelection,
  selectedIds,
  onToggleSelect,
  isAllFilteredSelected,
  isPartiallySelected,
  onToggleSelectAll,
}: Props) {
  const [previewFileId, setPreviewFileId] = useState<string | null>(null);
  const selectAllRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = isPartiallySelected;
    }
  }, [isPartiallySelected]);

  return (
    <>
      {/* Barra de búsqueda y filtros */}
      <div className="bg-surface border border-border rounded-lg p-3 md:p-4 flex flex-col md:flex-row gap-3 md:gap-4">
        <div className="flex-1 relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
          <input
            type="text"
            placeholder={
              filterRole === 'STUDENT'
                ? 'Buscar por nombre, correo, DNI o CUI...'
                : 'Buscar por nombre, correo o DNI...'
            }
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        {filterRole === 'TEACHER' && (
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
        {filterRole === 'STUDENT' && (
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
          <option value="ADMIN">Administrador</option>
          <option value="COORDINATOR">Coordinador</option>
          <option value="TEACHER">Docente</option>
          <option value="STUDENT">Estudiante</option>
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
                  {showBulkSelection && (
                    <th className="px-6 py-3 text-left">
                      <input
                        ref={selectAllRef}
                        type="checkbox"
                        checked={isAllFilteredSelected}
                        onChange={onToggleSelectAll}
                        aria-label="Seleccionar todos los usuarios filtrados"
                        className="w-4 h-4"
                      />
                    </th>
                  )}
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
                  {filterRole === 'TEACHER' ? (
                    <>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase">Tipo</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase">Categoría</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase">Grado académico</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase">Universidad</th>
                    </>
                  ) : filterRole === 'STUDENT' ? (
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
                    {showBulkSelection && (
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedIds.has(user.id)}
                          onChange={() => onToggleSelect(user.id)}
                          aria-label={`Seleccionar ${user.firstName} ${user.lastName}`}
                          className="w-4 h-4"
                        />
                      </td>
                    )}
                    <td className="px-6 py-4 text-sm text-text font-medium">
                      {user.firstName} {user.lastName}
                    </td>
                    <td className="px-6 py-4 text-sm text-text-muted">{user.email}</td>
                    <td className="px-6 py-4 text-sm text-text-muted">{user.dni ?? '—'}</td>
                    <td className="px-6 py-4">
                      <StatusBadge variant={ROLE_BADGE_VARIANT[user.role] ?? 'activo'}>
                        {ROLE_LABELS[user.role] ?? user.role}
                      </StatusBadge>
                    </td>
                    {filterRole === 'TEACHER' ? (
                      <>
                        <td className="px-6 py-4 text-sm text-text-muted">{user.teacher?.type ?? '—'}</td>
                        <td className="px-6 py-4 text-sm text-text-muted">{user.teacher?.category ?? '—'}</td>
                        <td className="px-6 py-4 text-sm text-text-muted">{user.teacher?.academicDegree ?? '—'}</td>
                        <td className="px-6 py-4 text-sm text-text-muted">{user.teacher?.university ?? '—'}</td>
                      </>
                    ) : filterRole === 'STUDENT' ? (
                      <>
                        <td className="px-6 py-4 text-sm text-text-muted">{user.student?.cui ?? '—'}</td>
                        <td className="px-6 py-4 text-sm text-text-muted">{user.student?.yearPromotion ?? '—'}</td>
                        <td className="px-6 py-4 text-sm text-text-muted">
                          <span className="flex items-center gap-1.5">
                            {STUDENT_STATUS_LABELS[user.student?.status ?? ''] ?? '—'}
                            {user.student?.status === 'Reactualizacion' && user.student?.reactualizationFile && (
                              <button
                                onClick={() => setPreviewFileId(user.student!.reactualizationFile!.id)}
                                className="text-primary hover:text-primary-light transition-colors"
                                title="Ver documento de reactualización"
                              >
                                <EyeIcon className="w-4 h-4" />
                              </button>
                            )}
                          </span>
                        </td>
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
                            <Trash2Icon className="w-5 h-5" />
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

        {/* Paginación */}
        {!loading && !error && filteredCount > 0 && (
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 px-4 md:px-6 py-3 border-t border-border">
            <div className="flex items-center gap-2 text-sm text-text-muted">
              <span>Mostrar</span>
              <select
                value={pageSize}
                onChange={(e) => onPageSizeChange(Number(e.target.value))}
                className="px-2 py-1 border border-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value={10}>10</option>
                <option value={15}>15</option>
                <option value={25}>25</option>
              </select>
              <span>de {filteredCount} usuarios</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                disabled={page === 0}
                onClick={() => onPageChange(page - 1)}
                className="px-3 py-1 text-sm border border-border rounded hover:bg-surface-alt transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              <span className="px-3 py-1 text-sm text-text-muted">
                {page + 1} / {totalPages}
              </span>
              <button
                disabled={page >= totalPages - 1}
                onClick={() => onPageChange(page + 1)}
                className="px-3 py-1 text-sm border border-border rounded hover:bg-surface-alt transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>

      <FilePreviewModal
        fileId={previewFileId}
        isOpen={previewFileId !== null}
        onClose={() => setPreviewFileId(null)}
      />
    </>
  );
}
