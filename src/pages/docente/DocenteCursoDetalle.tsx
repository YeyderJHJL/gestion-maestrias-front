import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { DocenteLayout } from '../../layouts/DocenteLayout';
import { StatusBadge } from '../../components/StatusBadge';
import { FileUpload } from '../../components/FileUpload';
import { Modal } from '../../components/Modal';
import {
  AlertTriangleIcon,
  FileTextIcon,
  LockIcon,
  EditIcon,
  ChevronDownIcon } from
'lucide-react';

const mockStudents = [
{
  id: 1,
  nombre: 'Juan Pérez',
  codigo: '2024001',
  dni: '72345678',
  estado: 'matriculado',
  parcial1: 16,
  parcial2: 18,
  parcial3: 17,
  notaFinal: 17
},
{
  id: 2,
  nombre: 'María González',
  codigo: '2024002',
  dni: '73456789',
  estado: 'matriculado',
  parcial1: 18,
  parcial2: 19,
  parcial3: 18,
  notaFinal: 18
},
{
  id: 3,
  nombre: 'Carlos Mendoza',
  codigo: '2024003',
  dni: '74567890',
  estado: 'matriculado',
  parcial1: 14,
  parcial2: 15,
  parcial3: 16,
  notaFinal: 15
}];

const mockAuditHistory = [
{
  estudiante: 'Juan Pérez',
  notaAnterior: 16,
  notaNueva: 17,
  motivo: 'Corrección de error en suma de puntos',
  modificadoPor: 'Dr. Carlos Mendoza',
  fecha: '20/05/2026 14:30'
}];

export function DocenteCursoDetalle() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<
    'silabo' | 'estudiantes' | 'notas'>(
    'silabo');
  const [notasTab, setNotasTab] = useState<'parciales' | 'final'>('parciales');
  const [silaboUploaded, setSilaboUploaded] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showAuditHistory, setShowAuditHistory] = useState(false);
  const tabs = [
  {
    key: 'silabo' as const,
    label: 'Sílabo'
  },
  {
    key: 'estudiantes' as const,
    label: 'Estudiantes'
  },
  {
    key: 'notas' as const,
    label: 'Notas'
  }];

  return (
    <DocenteLayout>
      
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="text-sm text-text-muted">
          <span className="hover:text-primary cursor-pointer">Mis Cursos</span>
          <span className="mx-2">›</span>
          <span className="text-text">Algoritmos Avanzados</span>
        </div>

        {/* Course Header */}
        <div className="bg-primary text-white rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-serif font-bold">
                  Algoritmos Avanzados
                </h1>
                <StatusBadge variant="activo">Regular</StatusBadge>
              </div>
              <p className="text-white/90">
                Promoción 2024-I · Primer semestre 2024
              </p>
              <p className="text-white/80 text-sm">
                15/03/2024 - 12/04/2024 · 4 semanas · Dr. Carlos Mendoza
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-surface border border-border rounded-lg overflow-hidden">
          <div className="border-b border-border">
            <div className="flex">
              {tabs.map((tab) =>
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-6 py-3 font-medium transition-colors relative ${activeTab === tab.key ? 'text-accent border-b-2 border-accent' : 'text-text-muted hover:text-text'}`}>
                
                  {tab.label}
                </button>
              )}
            </div>
          </div>

          <div className="p-6">
            {/* Sílabo Tab */}
            {activeTab === 'silabo' &&
            <div className="space-y-6">
                {!silaboUploaded ?
              <>
                    <div className="bg-accent/10 border border-accent rounded-lg p-4 flex items-start gap-3">
                      <AlertTriangleIcon className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                      <p className="text-text">
                        Debes subir el sílabo antes de iniciar el curso. Es
                        obligatorio.
                      </p>
                    </div>
                    <FileUpload
                  onFileSelect={(file) => {
                    console.log(file);
                    setSilaboUploaded(true);
                  }}
                  acceptedFormats=".pdf"
                  maxSizeMB={10}
                  label="Arrastra el sílabo aquí o haz clic para seleccionar" />
                
                  </> :

              <div className="space-y-4">
                    <div className="bg-surface-alt border border-border rounded-lg p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileTextIcon className="w-8 h-8 text-accent" />
                        <div>
                          <p className="font-medium text-text">
                            Silabo_Algoritmos_Avanzados_2024I.pdf
                          </p>
                          <p className="text-sm text-text-muted">
                            Subido el 10/03/2024 · Subido por: Dr. Carlos
                            Mendoza
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary/5 transition-colors">
                          Ver sílabo
                        </button>
                        <button className="text-text-muted hover:text-text transition-colors text-sm">
                          Reemplazar
                        </button>
                      </div>
                    </div>
                  </div>
              }
              </div>
            }

            {/* Estudiantes Tab */}
            {activeTab === 'estudiantes' &&
            <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-surface-alt">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase">
                        Nombre
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase">
                        Código
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase">
                        DNI
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase">
                        Estado de matrícula
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {mockStudents.map((student, index) =>
                  <tr
                    key={student.id}
                    className={
                    index % 2 === 0 ? 'bg-surface' : 'bg-surface-alt'
                    }>
                    
                        <td className="px-6 py-4 text-sm text-text font-medium">
                          {student.nombre}
                        </td>
                        <td className="px-6 py-4 text-sm text-text-muted">
                          {student.codigo}
                        </td>
                        <td className="px-6 py-4 text-sm text-text-muted">
                          {student.dni}
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge variant="matriculado">
                            Matriculado
                          </StatusBadge>
                        </td>
                      </tr>
                  )}
                  </tbody>
                </table>
              </div>
            }

            {/* Notas Tab */}
            {activeTab === 'notas' &&
            <div className="space-y-6">
                {/* Sub-tabs */}
                <div className="flex gap-4 border-b border-border">
                  <button
                  onClick={() => setNotasTab('parciales')}
                  className={`pb-2 px-2 font-medium transition-colors ${notasTab === 'parciales' ? 'text-accent border-b-2 border-accent' : 'text-text-muted hover:text-text'}`}>
                  
                    Notas parciales
                  </button>
                  <button
                  onClick={() => setNotasTab('final')}
                  className={`pb-2 px-2 font-medium transition-colors ${notasTab === 'final' ? 'text-accent border-b-2 border-accent' : 'text-text-muted hover:text-text'}`}>
                  
                    Nota final
                  </button>
                </div>

                {notasTab === 'parciales' &&
              <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-surface-alt">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase">
                            Estudiante
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase">
                            Parcial 1
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase">
                            Parcial 2
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase">
                            Parcial 3
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase">
                            Promedio
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {mockStudents.map((student, index) => {
                      const promedio = (
                      (student.parcial1 +
                      student.parcial2 +
                      student.parcial3) /
                      3).
                      toFixed(1);
                      return (
                        <tr
                          key={student.id}
                          className={
                          index % 2 === 0 ?
                          'bg-surface' :
                          'bg-surface-alt'
                          }>
                          
                              <td className="px-6 py-4 text-sm text-text font-medium">
                                {student.nombre}
                              </td>
                              <td className="px-6 py-4">
                                <input
                              type="number"
                              min="0"
                              max="20"
                              defaultValue={student.parcial1}
                              className="w-20 px-3 py-1 border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary" />
                            
                              </td>
                              <td className="px-6 py-4">
                                <input
                              type="number"
                              min="0"
                              max="20"
                              defaultValue={student.parcial2}
                              className="w-20 px-3 py-1 border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary" />
                            
                              </td>
                              <td className="px-6 py-4">
                                <input
                              type="number"
                              min="0"
                              max="20"
                              defaultValue={student.parcial3}
                              className="w-20 px-3 py-1 border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary" />
                            
                              </td>
                              <td className="px-6 py-4">
                                <span className="inline-flex items-center px-3 py-1 bg-surface-alt rounded font-semibold text-text">
                                  {promedio}
                                </span>
                              </td>
                            </tr>);

                    })}
                      </tbody>
                    </table>
                  </div>
              }

                {notasTab === 'final' &&
              <>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-surface-alt">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase">
                              Estudiante
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase">
                              Prom. parciales
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase">
                              Nota final
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase">
                              Estado
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase">
                              Acciones
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {mockStudents.map((student, index) => {
                        const promedio = (
                        (student.parcial1 +
                        student.parcial2 +
                        student.parcial3) /
                        3).
                        toFixed(1);
                        const aprobado = student.notaFinal >= 11;
                        return (
                          <tr
                            key={student.id}
                            className={
                            index % 2 === 0 ?
                            'bg-surface' :
                            'bg-surface-alt'
                            }>
                            
                                <td className="px-6 py-4 text-sm text-text font-medium">
                                  {student.nombre}
                                </td>
                                <td className="px-6 py-4 text-sm text-text-muted">
                                  {promedio}
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-2">
                                    <LockIcon className="w-4 h-4 text-text-muted" />
                                    <span className="font-semibold text-text">
                                      {student.notaFinal}
                                    </span>
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <StatusBadge
                                variant={
                                aprobado ? 'aprobado' : 'desaprobado'
                                }>
                                
                                    {aprobado ? 'Aprobado' : 'Desaprobado'}
                                  </StatusBadge>
                                </td>
                                <td className="px-6 py-4">
                                  <button
                                onClick={() => setIsEditModalOpen(true)}
                                className="flex items-center gap-1 text-sm text-primary hover:text-primary-light transition-colors">
                                
                                    <EditIcon className="w-4 h-4" />
                                    Editar
                                  </button>
                                </td>
                              </tr>);

                      })}
                        </tbody>
                      </table>
                    </div>

                    {/* Audit History */}
                    <div className="border border-border rounded-lg overflow-hidden">
                      <button
                    onClick={() => setShowAuditHistory(!showAuditHistory)}
                    className="w-full flex items-center justify-between px-6 py-3 bg-surface-alt hover:bg-surface transition-colors">
                    
                        <span className="font-medium text-text">
                          Historial de modificaciones
                        </span>
                        <ChevronDownIcon
                      className={`w-5 h-5 text-text-muted transition-transform ${showAuditHistory ? 'rotate-180' : ''}`} />
                    
                      </button>

                      {showAuditHistory &&
                  <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead className="bg-surface-alt">
                              <tr>
                                <th className="px-4 py-2 text-left text-xs font-semibold text-text-muted uppercase">
                                  Estudiante
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-semibold text-text-muted uppercase">
                                  Nota anterior
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-semibold text-text-muted uppercase">
                                  Nota nueva
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-semibold text-text-muted uppercase">
                                  Motivo
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-semibold text-text-muted uppercase">
                                  Modificado por
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-semibold text-text-muted uppercase">
                                  Fecha y hora
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                              {mockAuditHistory.length === 0 ?
                        <tr>
                                  <td
                            colSpan={6}
                            className="px-4 py-8 text-center text-text-muted">
                            
                                    Sin modificaciones registradas para este
                                    curso
                                  </td>
                                </tr> :

                        mockAuditHistory.map((entry, index) =>
                        <tr
                          key={index}
                          className={
                          index % 2 === 0 ?
                          'bg-surface' :
                          'bg-surface-alt'
                          }>
                          
                                    <td className="px-4 py-3 text-text">
                                      {entry.estudiante}
                                    </td>
                                    <td className="px-4 py-3 text-text-muted">
                                      {entry.notaAnterior}
                                    </td>
                                    <td className="px-4 py-3 text-text font-semibold">
                                      {entry.notaNueva}
                                    </td>
                                    <td className="px-4 py-3 text-text-muted">
                                      {entry.motivo}
                                    </td>
                                    <td className="px-4 py-3 text-text-muted">
                                      {entry.modificadoPor}
                                    </td>
                                    <td className="px-4 py-3 text-text-muted font-mono text-xs">
                                      {entry.fecha}
                                    </td>
                                  </tr>
                        )
                        }
                            </tbody>
                          </table>
                        </div>
                  }
                    </div>

                    {/* Bottom Action Bar */}
                    <div className="sticky bottom-0 bg-surface border-t border-border p-4 flex items-center justify-between">
                      <p className="text-sm text-text-muted">
                        3 de 3 estudiantes con nota final registrada
                      </p>
                      <button className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors">
                        Marcar curso como Notas completas
                      </button>
                    </div>
                  </>
              }
              </div>
            }
          </div>
        </div>
      </div>

      {/* Edit Grade Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Modificar nota"
        size="sm"
        accentBorder>
        
        <form className="space-y-6">
          <div className="space-y-4">
            <div className="bg-surface-alt rounded-lg p-4">
              <p className="text-sm text-text-muted mb-1">Nota actual</p>
              <p className="text-2xl font-bold text-text">17</p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-text">
                Nueva nota <span className="text-accent">*</span>
              </label>
              <input
                type="number"
                min="0"
                max="20"
                step="0.1"
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
              
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-text">
                Motivo de la modificación <span className="text-accent">*</span>
              </label>
              <textarea
                rows={4}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Describe el motivo del cambio..." />
              
            </div>

            <div className="bg-warning/10 border border-warning rounded-lg p-4">
              <div className="flex items-start gap-2">
                <AlertTriangleIcon className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                <p className="text-sm text-text">
                  Esta modificación quedará registrada en el historial de
                  auditoría con tu usuario y la fecha actual.
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t border-border">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="px-6 py-2 border border-primary text-primary rounded-lg hover:bg-primary/5 transition-colors">
              
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors">
              
              Guardar modificación
            </button>
          </div>
        </form>
      </Modal>
    </DocenteLayout>);

}