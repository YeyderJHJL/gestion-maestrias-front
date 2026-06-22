// Página de gestión de usuarios.
// Actúa como orquestador: obtiene el estado del hook y
// distribuye los datos a cada componente hijo.

import { PlusIcon } from 'lucide-react';
import { AdminLayout } from '../../../layouts/AdminLayout';
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
    // Notificación
    toast,
    setToast,
  } = useUsuarios();

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Encabezado con título y botón de nuevo usuario */}
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
