import React from 'react';
import { AdminLayout } from '../../../layouts/AdminLayout';
import { ConfirmationModal } from '../../../components/ConfirmationModal';
import { Toast } from '../../../components/Toast';
import { PromocionesPanel } from './promociones/PromocionesPanel';
import { PromocionFormModal } from './promociones/PromocionFormModal';
import { usePromociones } from './promociones/usePromociones';
import { CursosTable } from './cursos/CursosTable';
import { CursoFormModal } from './cursos/CursoFormModal';
import { useCursos } from './cursos/useCursos';

export function AdminCursos() {
  const promocionesState = usePromociones();
  const cursosState = useCursos(promocionesState.selectedPromocion);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-serif font-bold text-text">Promociones y Cursos</h1>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-3">
            <PromocionesPanel
              promociones={promocionesState.promociones}
              selectedPromocion={promocionesState.selectedPromocion}
              loading={promocionesState.loading}
              error={promocionesState.error}
              isCoordinator={promocionesState.isCoordinator}
              onSelect={promocionesState.setSelectedPromocion}
              onCreate={promocionesState.openCreateModal}
              onEdit={promocionesState.openEditModal}
              onDelete={promocionesState.setDeletingItem}
            />
          </div>

          <div className="col-span-12 lg:col-span-9">
            <CursosTable
              cursos={cursosState.cursosFiltrados}
              selectedPromocion={promocionesState.selectedPromocion}
              loading={cursosState.loading}
              error={cursosState.error}
              searchTerm={cursosState.searchTerm}
              onSearchChange={cursosState.setSearchTerm}
              filterType={cursosState.filterType}
              onFilterTypeChange={cursosState.setFilterType}
              isCoordinator={cursosState.isCoordinator}
              onCreate={cursosState.openCreateModal}
              onEdit={cursosState.openEditModal}
              onDelete={cursosState.setDeletingItem}
            />
          </div>
        </div>
      </div>

      <PromocionFormModal
        isOpen={promocionesState.isModalOpen}
        onClose={promocionesState.closeModal}
        editingItem={promocionesState.editingItem}
        form={promocionesState.form}
        setForm={promocionesState.setForm}
        programs={promocionesState.programs}
        loadingPrograms={promocionesState.loadingPrograms}
        submitting={promocionesState.submitting}
        formError={promocionesState.formError}
        onSubmit={promocionesState.handleSubmit}
      />

      <CursoFormModal
        isOpen={cursosState.isModalOpen}
        onClose={cursosState.closeModal}
        editingItem={cursosState.editingItem}
        form={cursosState.form}
        setForm={cursosState.setForm}
        teachers={cursosState.teachers}
        loadingTeachers={cursosState.loadingTeachers}
        submitting={cursosState.submitting}
        formError={cursosState.formError}
        onSubmit={cursosState.handleSubmit}
      />

      <ConfirmationModal
        isOpen={promocionesState.deletingItem !== null}
        onClose={() => promocionesState.setDeletingItem(null)}
        onConfirm={promocionesState.handleDelete}
        title="Eliminar promoción"
        message={
          promocionesState.deletingItem
            ? `¿Estás seguro de que deseas eliminar la promoción ${promocionesState.deletingItem.name}? Esta acción no se puede deshacer.`
            : ''
        }
        confirmLabel="Eliminar"
        variant="danger"
      />

      <ConfirmationModal
        isOpen={cursosState.deletingItem !== null}
        onClose={() => cursosState.setDeletingItem(null)}
        onConfirm={cursosState.handleDelete}
        title="Eliminar curso"
        message={
          cursosState.deletingItem
            ? `¿Estás seguro de que deseas eliminar el curso ${cursosState.deletingItem.name}? Esta acción no se puede deshacer.`
            : ''
        }
        confirmLabel="Eliminar"
        variant="danger"
      />

      <Toast
        variant={promocionesState.toast.variant}
        message={promocionesState.toast.message}
        isVisible={promocionesState.toast.visible}
        onClose={() =>
          promocionesState.setToast((toast) => ({ ...toast, visible: false }))
        }
      />

      <Toast
        variant={cursosState.toast.variant}
        message={cursosState.toast.message}
        isVisible={cursosState.toast.visible}
        onClose={() => cursosState.setToast((toast) => ({ ...toast, visible: false }))}
      />
    </AdminLayout>
  );
}
