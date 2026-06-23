import { FileTextIcon } from 'lucide-react';
import { AdminLayout } from '../../../layouts/AdminLayout';
import { EmptyState } from '../../../components/EmptyState';
import { ReportFilterPanel } from './components/ReportFilterPanel';
import { ReportResultsTable } from './components/ReportResultsTable';
import { ReportExportBar } from './components/ReportExportBar';
import { useReportes } from './hooks/useReportes';

export function AdminReportes() {
  const {
    filtros,
    resultados,
    hasResults,
    isLoading,
    handleFiltroChange,
    handleGenerar,
    handleLimpiar,
  } = useReportes();

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Encabezado */}
        <div className="border-b-2 border-accent pb-2">
          <h1 className="text-3xl font-serif font-bold text-text">
            Reportes académicos
          </h1>
        </div>

        {/* Panel de filtros */}
        <ReportFilterPanel
          filtros={filtros}
          isLoading={isLoading}
          onChange={handleFiltroChange}
          onGenerar={handleGenerar}
          onLimpiar={handleLimpiar}
        />

        {/* Resultados */}
        {hasResults ? (
          <div className="space-y-4">
            <ReportExportBar resultados={resultados} />
            <ReportResultsTable resultados={resultados} />
          </div>
        ) : (
          <EmptyState
            icon={FileTextIcon}
            title="Selecciona los filtros y genera un reporte"
            subtitle="Los resultados aparecerán aquí"
          />
        )}
      </div>
    </AdminLayout>
  );
}
