// Página de gestión de usuarios.
// Actúa como orquestador: obtiene el estado del hook y
// distribuye los datos a cada componente hijo.

import { PlusIcon, Trash2Icon } from 'lucide-react';
import { AdminLayout } from '../../../layouts/AdminLayout';
import { PageHeader } from '../../../components/PageHeader';
import { ConfirmationModal } from '../../../components/ConfirmationModal';
import { Toast } from '../../../components/Toast';
import { useUsuarios } from './useUsuarios';
import { UsuariosTable } from './UsuariosTable';
import { UsuarioFormModal } from './UsuarioFormModal';

export function AdminUsuarios() {
  const {
    // Lista y paginación
    paginatedUsers,
    filteredCount,
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
    // Permisos
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
    // Selección múltiple y eliminación masiva
    selectedIds,
    showBulkSelection,
    isAllFilteredSelected,
    isPartiallySelected,
    toggleSelect,
    toggleSelectAll,
    isBulkDeleteConfirmOpen,
    setIsBulkDeleteConfirmOpen,
    handleBulkDelete,
    // Notificación
    toast,
    setToast,
  } = useUsuarios();

  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader
          title="Gestión de Usuarios"
          actions={!isCoordinator ? (
            <button
              onClick={openCreateModal}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors"
            >
              <PlusIcon className="w-5 h-5" />
              Nuevo Usuario
            </button>
          ) : undefined}
        />

        {/* Barra de acción masiva: solo con selección activa en Estudiantes/Docentes */}
        {showBulkSelection && selectedIds.size > 0 && (
          <div className="flex items-center justify-between gap-3 bg-surface border border-border rounded-lg px-4 py-3">
            <span className="text-sm text-text-muted">{selectedIds.size} seleccionado(s)</span>
            <button
              onClick={() => setIsBulkDeleteConfirmOpen(true)}
              className="flex items-center gap-2 px-4 py-2 text-accent hover:text-accent-light transition-colors text-sm font-medium"
            >
              <Trash2Icon className="w-4 h-4" />
              Eliminar seleccionados
            </button>
          </div>
        )}

        {/* Tabla con barra de búsqueda y filtros */}
        <UsuariosTable
          users={paginatedUsers}
          loading={loading}
          error={error}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filterRole={filterRole}
          onFilterRoleChange={setFilterRole}
          teacherTypeFilter={teacherTypeFilter}
          onTeacherTypeFilterChange={setTeacherTypeFilter}
          studentStatusFilter={studentStatusFilter}
          onStudentStatusFilterChange={setStudentStatusFilter}
          filteredCount={filteredCount}
          page={page}
          onPageChange={setPage}
          pageSize={pageSize}
          onPageSizeChange={setPageSize}
          totalPages={totalPages}
          isCoordinator={isCoordinator}
          onEdit={openEditModal}
          onDelete={setDeletingUser}
          showBulkSelection={showBulkSelection}
          selectedIds={selectedIds}
          onToggleSelect={toggleSelect}
          isAllFilteredSelected={isAllFilteredSelected}
          isPartiallySelected={isPartiallySelected}
          onToggleSelectAll={toggleSelectAll}
        />
      </div>

      <UsuarioFormModal
        isOpen={isUserModalOpen}
        onClose={closeModal}
        editingUser={editingUser}
        form={form}
        setForm={setForm}
        studentForm={studentForm}
        setStudentForm={setStudentForm}
        teacherForm={teacherForm}
        setTeacherForm={setTeacherForm}
        submitting={submitting}
        formError={formError}
        onSubmit={handleSubmit}
      />

      {/* Modal de confirmación antes de eliminar */}
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

      {/* Modal de confirmación antes de eliminar en bloque */}
      <ConfirmationModal
        isOpen={isBulkDeleteConfirmOpen}
        onClose={() => setIsBulkDeleteConfirmOpen(false)}
        onConfirm={handleBulkDelete}
        title="Eliminar usuarios"
        message={`¿Estás seguro de que deseas eliminar ${selectedIds.size} ${
          filterRole === 'STUDENT' ? 'estudiante(s)' : 'docente(s)'
        }? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        variant="danger"
      />

      {/* Notificación de éxito o error */}
      <Toast
        variant={toast.variant}
        message={toast.message}
        isVisible={toast.visible}
        onClose={() => setToast((t) => ({ ...t, visible: false }))}
      />
    </AdminLayout>
  );
}
