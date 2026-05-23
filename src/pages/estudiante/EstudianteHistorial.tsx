import React, { useState } from 'react';
import { DashboardLayout } from '../../components/DashboardLayout';
import { StatusBadge } from '../../components/StatusBadge';
import {
  ClipboardListIcon,
  FileTextIcon,
  ReceiptIcon,
  FolderIcon,
  LogOutIcon,
  ChevronDownIcon,
  DownloadIcon } from
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
},
{
  to: '/login',
  icon: LogOutIcon,
  label: 'Cerrar sesión',
  dividerAfter: true
}];

const mockHistory = [
{
  periodo: '2024-I',
  year: 2024,
  creditos: 18,
  cursos: [
  {
    nombre: 'Algoritmos Avanzados',
    tipo: 'Regular',
    notaFinal: 17,
    estado: 'aprobado',
    creditos: 4
  },
  {
    nombre: 'Bases de Datos Distribuidas',
    tipo: 'Regular',
    notaFinal: 16,
    estado: 'aprobado',
    creditos: 4
  },
  {
    nombre: 'Inteligencia Artificial',
    tipo: 'Regular',
    notaFinal: 18,
    estado: 'aprobado',
    creditos: 4
  },
  {
    nombre: 'Tesis I',
    tipo: 'Tesis',
    notaFinal: 18,
    estado: 'aprobado',
    creditos: 6
  }]

},
{
  periodo: '2023-II',
  year: 2023,
  creditos: 16,
  cursos: [
  {
    nombre: 'Arquitectura de Software',
    tipo: 'Regular',
    notaFinal: 15,
    estado: 'aprobado',
    creditos: 4
  },
  {
    nombre: 'Redes Avanzadas',
    tipo: 'Regular',
    notaFinal: 16,
    estado: 'aprobado',
    creditos: 4
  },
  {
    nombre: 'Seguridad Informática',
    tipo: 'Regular',
    notaFinal: 17,
    estado: 'aprobado',
    creditos: 4
  },
  {
    nombre: 'Metodología de Investigación',
    tipo: 'Regular',
    notaFinal: 18,
    estado: 'aprobado',
    creditos: 4
  }]

}];

export function EstudianteHistorial() {
  const [expandedPeriod, setExpandedPeriod] = useState<string | null>('2024-I');
  const totalCreditos = mockHistory.reduce((sum, p) => sum + p.creditos, 0);
  const totalCreditosPlan = 48;
  const progressPercentage = totalCreditos / totalCreditosPlan * 100;
  const periodosCompletados = mockHistory.length;
  return (
    <DashboardLayout
      userName="Juan Carlos Pérez"
      userRole="Estudiante de Maestría"
      sidebarLinks={sidebarLinks}>
      
      <div className="space-y-6">
        <h1 className="text-3xl font-serif font-bold text-text">
          Historial Académico
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - History by Period */}
          <div className="lg:col-span-2 space-y-4">
            {mockHistory.map((period) =>
            <div
              key={period.periodo}
              className="bg-surface border border-border rounded-lg overflow-hidden shadow-sm">
              
                <button
                onClick={() =>
                setExpandedPeriod(
                  expandedPeriod === period.periodo ? null : period.periodo
                )
                }
                className="w-full flex items-center justify-between px-6 py-4 bg-surface-alt hover:bg-surface transition-colors">
                
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="font-serif font-bold text-text text-lg">
                        {period.periodo}
                      </p>
                      <p className="text-sm text-text-muted">
                        {period.year} · {period.creditos} créditos
                      </p>
                    </div>
                  </div>
                  <ChevronDownIcon
                  className={`w-5 h-5 text-text-muted transition-transform ${expandedPeriod === period.periodo ? 'rotate-180' : ''}`} />
                
                </button>

                {expandedPeriod === period.periodo &&
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
                            Nota final
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase">
                            Estado
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase">
                            Créditos
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {period.cursos.map((curso, index) =>
                    <tr
                      key={index}
                      className={`${curso.estado === 'aprobado' ? 'bg-success/5' : 'bg-accent/5'}`}>
                      
                            <td className="px-6 py-4 text-sm text-text font-medium">
                              {curso.nombre}
                            </td>
                            <td className="px-6 py-4">
                              <StatusBadge
                          variant={
                          curso.tipo === 'Regular' ? 'activo' : 'retiro'
                          }>
                          
                                {curso.tipo}
                              </StatusBadge>
                            </td>
                            <td className="px-6 py-4 text-sm font-bold text-text">
                              {curso.notaFinal}
                            </td>
                            <td className="px-6 py-4">
                              <StatusBadge
                          variant={
                          curso.estado === 'aprobado' ?
                          'aprobado' :
                          'desaprobado'
                          }>
                          
                                {curso.estado === 'aprobado' ?
                          'Aprobado' :
                          'Desaprobado'}
                              </StatusBadge>
                            </td>
                            <td className="px-6 py-4 text-sm text-text">
                              {curso.creditos}
                            </td>
                          </tr>
                    )}
                      </tbody>
                    </table>
                  </div>
              }
              </div>
            )}
          </div>

          {/* Right Sidebar - Academic Summary */}
          <div className="space-y-6">
            <div className="bg-surface border border-border rounded-lg p-6 shadow-sm sticky top-24">
              <div className="border-b-2 border-accent pb-2 mb-6">
                <h2 className="text-lg font-serif font-bold text-text">
                  Resumen académico
                </h2>
              </div>

              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-text-muted">Créditos acumulados</span>
                    <span className="font-bold text-text">
                      {totalCreditos} / {totalCreditosPlan}
                    </span>
                  </div>
                  <div className="w-full bg-surface-alt rounded-full h-3">
                    <div
                      className="bg-primary h-3 rounded-full transition-all"
                      style={{
                        width: `${progressPercentage}%`
                      }} />
                    
                  </div>
                  <p className="text-xs text-text-muted mt-1">
                    {progressPercentage.toFixed(0)}% del plan de estudios
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-text-muted text-sm">
                      Periodos completados
                    </span>
                    <span className="font-semibold text-text">
                      {periodosCompletados}
                    </span>
                  </div>
                  <div className="pt-3 border-t border-border">
                    <StatusBadge variant="activo">Al día</StatusBadge>
                  </div>
                </div>
              </div>
            </div>

            {/* Download Button */}
            <button className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors font-semibold shadow-sm">
              <DownloadIcon className="w-5 h-5" />
              Descargar récord académico en PDF
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>);

}