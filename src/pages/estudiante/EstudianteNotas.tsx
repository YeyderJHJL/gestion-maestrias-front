import React, { useState } from 'react';
import { DashboardLayout } from '../../components/DashboardLayout';
import { StatusBadge } from '../../components/StatusBadge';
import {
  ClipboardListIcon,
  FileTextIcon,
  ReceiptIcon,
  FolderIcon,
  InfoIcon } from
'lucide-react';
const sidebarLinks = [
{
  to: '/estudiante/matricula',
  icon: ClipboardListIcon,
  label: 'Mi Matrícula'
},
{
  to: '/estudiante/notas',
  icon: FileTextIcon,
  label: 'Mis Notas'
},
{
  to: '/estudiante/pagos',
  icon: ReceiptIcon,
  label: 'Pagos y Vouchers'
},
{
  to: '/estudiante/historial',
  icon: FolderIcon,
  label: 'Historial Académico'
}];

const mockGrades = [
{
  curso: 'Algoritmos Avanzados',
  tipo: 'Regular',
  docente: 'Dr. Carlos Mendoza',
  notaParciales: '17.0',
  notaFinal: 17,
  estado: 'aprobado'
},
{
  curso: 'Bases de Datos Distribuidas',
  tipo: 'Regular',
  docente: 'Dra. Ana Rodríguez',
  notaParciales: '16.5',
  notaFinal: null,
  estado: 'pendiente'
},
{
  curso: 'Inteligencia Artificial',
  tipo: 'Regular',
  docente: 'Dr. Luis Fernández',
  notaParciales: '—',
  notaFinal: null,
  estado: 'pendiente'
},
{
  curso: 'Tesis I',
  tipo: 'Tesis',
  docente: 'Dr. Jorge Ramírez',
  notaParciales: '18.0',
  notaFinal: 18,
  estado: 'aprobado'
}];

export function EstudianteNotas() {
  const [selectedPeriod, setSelectedPeriod] = useState('2024-I');
  const hasPendingGrades = mockGrades.some((g) => g.estado === 'pendiente');
  const allGradesRegistered = mockGrades.every((g) => g.notaFinal !== null);
  const promedio = allGradesRegistered ?
  (
  mockGrades.reduce((sum, g) => sum + (g.notaFinal || 0), 0) /
  mockGrades.length).
  toFixed(2) :
  null;
  return (
    <DashboardLayout
      userName="Juan Carlos Pérez"
      userRole="Estudiante de Maestría"
      sidebarLinks={sidebarLinks}>
      
      <div className="space-y-6">
        <h1 className="text-3xl font-serif font-bold text-text">Mis Notas</h1>

        {/* Period Selector */}
        <div className="bg-surface border border-border rounded-lg p-4">
          <label className="block text-sm font-medium text-text mb-2">
            Seleccionar periodo
          </label>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
            
            <option>2024-I</option>
            <option>2023-II</option>
            <option>2023-I</option>
          </select>
        </div>

        {/* Period Summary */}
        {allGradesRegistered &&
        <div className="bg-primary/10 border border-primary rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-sm mb-1">
                  Periodo: {selectedPeriod}
                </p>
                <p className="text-3xl font-bold text-text">
                  Promedio: {promedio}
                </p>
              </div>
            </div>
          </div>
        }

        {/* Grades Table */}
        <div className="bg-surface border border-border rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-surface-alt">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase">
                    Curso
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase">
                    Docente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase">
                    Nota parciales
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase">
                    Nota final
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {mockGrades.map((grade, index) =>
                <tr
                  key={index}
                  className={
                  index % 2 === 0 ? 'bg-surface' : 'bg-surface-alt'
                  }>
                  
                    <td className="px-6 py-4 text-sm text-text font-medium">
                      {grade.curso}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge
                      variant={grade.tipo === 'Regular' ? 'activo' : 'retiro'}>
                      
                        {grade.tipo}
                      </StatusBadge>
                    </td>
                    <td className="px-6 py-4 text-sm text-text-muted">
                      {grade.docente}
                    </td>
                    <td className="px-6 py-4 text-sm text-text">
                      {grade.notaParciales}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {grade.notaFinal ?
                    <span className="font-bold text-text text-base">
                          {grade.notaFinal}
                        </span> :

                    <span className="text-text-muted">—</span>
                    }
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge
                      variant={
                      grade.estado === 'aprobado' ?
                      'aprobado' :
                      grade.estado === 'desaprobado' ?
                      'desaprobado' :
                      'pendiente'
                      }>
                      
                        {grade.estado === 'aprobado' ?
                      'Aprobado' :
                      grade.estado === 'desaprobado' ?
                      'Desaprobado' :
                      'Pendiente'}
                      </StatusBadge>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Info Banner */}
        {hasPendingGrades &&
        <div className="bg-primary/10 border border-primary rounded-lg p-4 flex items-start gap-3">
            <InfoIcon className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <p className="text-sm text-text">
              Algunos cursos aún no tienen nota registrada. Si el curso ya
              finalizó, contacta a tu docente o Administración.
            </p>
          </div>
        }
      </div>
    </DashboardLayout>);

}