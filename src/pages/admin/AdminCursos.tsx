import React, { useState } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { Modal } from '../../components/Modal';
import { StatusBadge } from '../../components/StatusBadge';
import { PlusIcon, EditIcon } from 'lucide-react';

const mockPromociones = [
{
  id: 1,
  nombre: '2024-I',
  year: 2024,
  periodo: 'Primer semestre',
  estado: 'activo'
},
{
  id: 2,
  nombre: '2024-II',
  year: 2024,
  periodo: 'Segundo semestre',
  estado: 'activo'
},
{
  id: 3,
  nombre: '2023-II',
  year: 2023,
  periodo: 'Segundo semestre',
  estado: 'cerrado'
}];

const mockCursos = [
{
  id: 1,
  nombre: 'Algoritmos Avanzados',
  codigo: 'INF-501',
  tipo: 'Regular',
  creditos: 4,
  fechaInicio: '2024-03-15',
  fechaFin: '2024-04-12',
  semanas: 4,
  docente: 'Dr. Carlos Mendoza',
  estado: 'activo'
},
{
  id: 2,
  nombre: 'Bases de Datos Distribuidas',
  codigo: 'INF-502',
  tipo: 'Regular',
  creditos: 4,
  fechaInicio: '2024-03-22',
  fechaFin: '2024-04-19',
  semanas: 4,
  docente: 'Dra. Ana Rodríguez',
  estado: 'activo'
},
{
  id: 3,
  nombre: 'Tesis I',
  codigo: 'INF-601',
  tipo: 'Tesis',
  creditos: 6,
  fechaInicio: '2024-04-05',
  fechaFin: '2024-05-10',
  semanas: 5,
  docente: 'Dr. Luis Fernández',
  estado: 'activo'
}];

export function AdminCursos() {
  const [selectedPromocion, setSelectedPromocion] = useState(mockPromociones[0]);
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [courseType, setCourseType] = useState('Regular');
  return (
    <AdminLayout>
      
      <div className="space-y-6">
        <h1 className="text-3xl font-serif font-bold text-text">
          Promociones y Cursos
        </h1>

        <div className="grid grid-cols-12 gap-6">
          {/* Left Panel - Promociones */}
          <div className="col-span-3 bg-surface-alt rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-serif font-bold text-text">Promociones</h2>
              <button className="p-1 text-primary hover:text-primary-light transition-colors">
                <PlusIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              {mockPromociones.map((promocion) =>
              <button
                key={promocion.id}
                onClick={() => setSelectedPromocion(promocion)}
                className={`w-full text-left p-3 rounded-lg transition-all ${selectedPromocion.id === promocion.id ? 'bg-surface border-l-4 border-accent shadow-sm' : 'bg-surface-alt hover:bg-surface'}`}>
                
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <p className="font-semibold text-text">
                        {promocion.nombre}
                      </p>
                      <p className="text-xs text-text-muted">
                        {promocion.periodo}
                      </p>
                      <p className="text-xs text-text-muted">
                        {promocion.year}
                      </p>
                    </div>
                    <StatusBadge
                    variant={
                    promocion.estado === 'activo' ? 'activo' : 'inactivo'
                    }>
                    
                      {promocion.estado === 'activo' ? 'Activo' : 'Cerrado'}
                    </StatusBadge>
                  </div>
                </button>
              )}
            </div>
          </div>

          {/* Right Panel - Cursos */}
          <div className="col-span-9 space-y-4">
            <div className="bg-surface border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <h2 className="text-2xl font-serif font-bold text-text">
                    {selectedPromocion.nombre}
                  </h2>
                  <span className="text-text-muted">
                    {selectedPromocion.periodo}
                  </span>
                  <StatusBadge
                    variant={
                    selectedPromocion.estado === 'activo' ?
                    'activo' :
                    'inactivo'
                    }>
                    
                    {selectedPromocion.estado === 'activo' ?
                    'Activo' :
                    'Cerrado'}
                  </StatusBadge>
                </div>
                <button className="p-2 text-primary hover:text-primary-light transition-colors">
                  <EditIcon className="w-5 h-5" />
                </button>
              </div>

              <div className="flex justify-end mb-4">
                <button
                  onClick={() => setIsCourseModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors">
                  
                  <PlusIcon className="w-5 h-5" />
                  Agregar curso
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-surface-alt">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase">
                        Nombre
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase">
                        Tipo
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase">
                        Créditos
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase">
                        Fecha inicio
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase">
                        Fecha fin
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase">
                        Semanas
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase">
                        Docente
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase">
                        Estado
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {mockCursos.map((curso, index) =>
                    <tr
                      key={curso.id}
                      className={
                      index % 2 === 0 ? 'bg-surface' : 'bg-surface-alt'
                      }>
                      
                        <td className="px-4 py-3 text-sm text-text font-medium">
                          {curso.nombre}
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge
                          variant={
                          curso.tipo === 'Regular' ?
                          'activo' :
                          curso.tipo === 'Tesis' ?
                          'retiro' :
                          'observado'
                          }>
                          
                            {curso.tipo}
                          </StatusBadge>
                        </td>
                        <td className="px-4 py-3 text-sm text-text">
                          {curso.creditos}
                        </td>
                        <td className="px-4 py-3 text-sm text-text-muted">
                          {curso.fechaInicio}
                        </td>
                        <td className="px-4 py-3 text-sm text-text-muted">
                          {curso.fechaFin}
                        </td>
                        <td className="px-4 py-3 text-sm text-text">
                          {curso.semanas}
                        </td>
                        <td className="px-4 py-3 text-sm text-text-muted">
                          {curso.docente}
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge variant="activo">Activo</StatusBadge>
                        </td>
                        <td className="px-4 py-3">
                          <button className="p-1 text-primary hover:text-primary-light transition-colors">
                            <EditIcon className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Modal */}
      <Modal
        isOpen={isCourseModalOpen}
        onClose={() => setIsCourseModalOpen(false)}
        title="Agregar Curso"
        size="lg"
        accentBorder>
        
        <form className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text">
                Nombre del curso
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
              
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text">
                Código
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
              
            </div>
            <div className="col-span-2 space-y-2">
              <label className="block text-sm font-medium text-text">
                Tipo
              </label>
              <select
                value={courseType}
                onChange={(e) => setCourseType(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                
                <option>Regular</option>
                <option>Tesis</option>
                <option>Tópicos</option>
              </select>
              <p className="text-sm text-text-muted italic">
                Regular: 4 sábados · Tesis y Tópicos: 5 sábados
              </p>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text">
                Créditos
              </label>
              <input
                type="number"
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
              
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text">
                Ciclo
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
              
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text">
                Fecha de inicio
              </label>
              <input
                type="date"
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
              
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text">
                Fecha de fin
              </label>
              <input
                type="date"
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
              
            </div>
            <div className="col-span-2 space-y-2">
              <label className="block text-sm font-medium text-text">
                Observaciones de fechas
              </label>
              <textarea
                placeholder="Registrar cambios o ajustes de fechas aquí"
                rows={3}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
              
            </div>
            <div className="col-span-2 space-y-2">
              <label className="block text-sm font-medium text-text">
                Docente responsable
              </label>
              <select className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                <option>Dr. Carlos Mendoza (Interno UNSA)</option>
                <option>Dra. Ana Rodríguez (Externo)</option>
                <option>Dr. Luis Fernández (Interno UNSA)</option>
              </select>
            </div>
            <div className="col-span-2 space-y-2">
              <label className="block text-sm font-medium text-text">
                Estado
              </label>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="estado"
                    value="activo"
                    defaultChecked
                    className="text-primary focus:ring-primary" />
                  
                  <span className="text-sm text-text">Activo</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="estado"
                    value="inactivo"
                    className="text-primary focus:ring-primary" />
                  
                  <span className="text-sm text-text">Inactivo</span>
                </label>
              </div>
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t border-border">
            <button
              type="button"
              onClick={() => setIsCourseModalOpen(false)}
              className="px-6 py-2 border border-primary text-primary rounded-lg hover:bg-primary/5 transition-colors">
              
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors">
              
              Guardar curso
            </button>
          </div>
        </form>
      </Modal>
    </AdminLayout>);

}