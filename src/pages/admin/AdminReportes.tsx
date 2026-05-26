import React, { useState } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { EmptyState } from '../../components/EmptyState';
import {
  FileTextIcon,
  DownloadIcon,
  FileSpreadsheetIcon } from 'lucide-react';

const mockResults = [
{
  estudiante: 'Juan Pérez',
  codigo: '2024001',
  curso: 'Algoritmos Avanzados',
  nota: 16,
  estado: 'Aprobado'
},
{
  estudiante: 'María González',
  codigo: '2024002',
  curso: 'Algoritmos Avanzados',
  nota: 18,
  estado: 'Aprobado'
},
{
  estudiante: 'Carlos Mendoza',
  codigo: '2024003',
  curso: 'Algoritmos Avanzados',
  nota: 14,
  estado: 'Aprobado'
}];

export function AdminReportes() {
  const [hasResults, setHasResults] = useState(false);
  const handleGenerate = () => {
    setHasResults(true);
  };
  return (
    <AdminLayout>
      
      <div className="space-y-6">
        <div className="border-b-2 border-accent pb-2">
          <h1 className="text-3xl font-serif font-bold text-text">
            Reportes académicos
          </h1>
        </div>

        {/* Filter Panel */}
        <div className="bg-surface border border-border rounded-lg p-6 space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text">
                Tipo de reporte
              </label>
              <select className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                <option>Notas</option>
                <option>Matrículas</option>
                <option>Pagos</option>
                <option>Egresados</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text">
                Periodo
              </label>
              <select className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                <option>2024-I</option>
                <option>2024-II</option>
                <option>2023-II</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text">
                Programa
              </label>
              <select className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                <option>Maestría en Informática</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text">
                Estado (opcional)
              </label>
              <select className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                <option>Todos</option>
                <option>Aprobado</option>
                <option>Desaprobado</option>
                <option>Pendiente</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text">
                Estudiante (opcional)
              </label>
              <input
                type="text"
                placeholder="Buscar por nombre o código"
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
              
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text">
                Curso (opcional)
              </label>
              <select className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                <option>Todos</option>
                <option>Algoritmos Avanzados</option>
                <option>Bases de Datos Distribuidas</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            className="w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors font-semibold">
            
            Generar reporte
          </button>
        </div>

        {/* Results */}
        {hasResults ?
        <div className="space-y-4">
            {/* Export Bar */}
            <div className="flex gap-3 justify-end">
              <button className="flex items-center gap-2 px-4 py-2 bg-success text-white rounded-lg hover:bg-success/90 transition-colors">
                <FileSpreadsheetIcon className="w-5 h-5" />
                Descargar Excel
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary/5 transition-colors">
                <DownloadIcon className="w-5 h-5" />
                Descargar PDF
              </button>
            </div>

            {/* Results Table */}
            <div className="bg-surface border border-border rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-primary text-white">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase">
                        Estudiante
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase">
                        Código
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase">
                        Curso
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase">
                        Nota
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase">
                        Estado
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {mockResults.map((result, index) =>
                  <tr
                    key={index}
                    className={
                    index % 2 === 0 ? 'bg-surface' : 'bg-surface-alt'
                    }>
                    
                        <td className="px-6 py-4 text-sm text-text font-medium">
                          {result.estudiante}
                        </td>
                        <td className="px-6 py-4 text-sm text-text-muted">
                          {result.codigo}
                        </td>
                        <td className="px-6 py-4 text-sm text-text">
                          {result.curso}
                        </td>
                        <td className="px-6 py-4 text-sm text-text font-semibold">
                          {result.nota}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-success text-white">
                            {result.estado}
                          </span>
                        </td>
                      </tr>
                  )}
                  </tbody>
                </table>
              </div>
            </div>
          </div> :

        <EmptyState
          icon={FileTextIcon}
          title="Selecciona los filtros y genera un reporte"
          subtitle="Los resultados aparecerán aquí" />

        }
      </div>
    </AdminLayout>);

}