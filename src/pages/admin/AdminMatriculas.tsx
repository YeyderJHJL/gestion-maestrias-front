import React, { useState } from 'react';
import { DashboardLayout } from '../../components/DashboardLayout';
import { Modal } from '../../components/Modal';
import { StatusBadge } from '../../components/StatusBadge';
import { FileUpload } from '../../components/FileUpload';
import {
  LayoutDashboardIcon,
  UsersIcon,
  BookOpenIcon,
  ClipboardListIcon,
  ReceiptIcon,
  FileTextIcon,
  LogOutIcon,
  SearchIcon,
  XIcon } from
'lucide-react';
const sidebarLinks = [
{
  to: '/admin/dashboard',
  icon: LayoutDashboardIcon,
  label: 'Dashboard'
},
{
  to: '/admin/usuarios',
  icon: UsersIcon,
  label: 'Usuarios'
},
{
  to: '/admin/cursos',
  icon: BookOpenIcon,
  label: 'Promociones y Cursos'
},
{
  to: '/admin/matriculas',
  icon: ClipboardListIcon,
  label: 'Matrículas'
},
{
  to: '/admin/vouchers',
  icon: ReceiptIcon,
  label: 'Vouchers'
},
{
  to: '/admin/reportes',
  icon: FileTextIcon,
  label: 'Reportes'
},
{
  to: '/login',
  icon: LogOutIcon,
  label: 'Cerrar sesión',
  dividerAfter: true
}];

const mockStudent = {
  nombre: 'Juan Carlos Pérez López',
  codigo: '2024001',
  dni: '72345678',
  programa: 'Maestría en Informática',
  promocion: '2024-I',
  estadoMatricula: 'matriculado'
};
const availableCourses = [
{
  id: 1,
  nombre: 'Algoritmos Avanzados',
  tipo: 'Regular',
  creditos: 4
},
{
  id: 2,
  nombre: 'Bases de Datos Distribuidas',
  tipo: 'Regular',
  creditos: 4
},
{
  id: 3,
  nombre: 'Inteligencia Artificial',
  tipo: 'Regular',
  creditos: 4
},
{
  id: 4,
  nombre: 'Tesis I',
  tipo: 'Tesis',
  creditos: 6
}];

export function AdminMatriculas() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showStudent, setShowStudent] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('matriculado');
  const [enrolledCourses, setEnrolledCourses] = useState<number[]>([1, 2]);
  const handleSearch = () => {
    setShowStudent(true);
  };
  const toggleCourse = (courseId: number) => {
    setEnrolledCourses((prev) =>
    prev.includes(courseId) ?
    prev.filter((id) => id !== courseId) :
    [...prev, courseId]
    );
  };
  return (
    <DashboardLayout
      userName="Admin Principal"
      userRole="Administrador"
      sidebarLinks={sidebarLinks}>
      
      <div className="space-y-6">
        <h1 className="text-3xl font-serif font-bold text-text">
          Gestión de Matrículas
        </h1>

        {/* Search */}
        <div className="bg-surface border border-border rounded-lg p-4">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
              <input
                type="text"
                placeholder="Buscar estudiante por nombre, código o DNI..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
              
            </div>
            <button
              onClick={handleSearch}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors">
              
              Buscar
            </button>
          </div>
        </div>

        {showStudent &&
        <div className="space-y-6">
            {/* Student Card */}
            <div className="bg-surface border-l-4 border-primary rounded-lg p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-xl font-bold">
                    {mockStudent.nombre.
                  split(' ').
                  map((n) => n[0]).
                  join('').
                  slice(0, 2)}
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-xl font-serif font-bold text-text">
                      {mockStudent.nombre}
                    </h2>
                    <div className="flex gap-4 text-sm text-text-muted">
                      <span>Código: {mockStudent.codigo}</span>
                      <span>DNI: {mockStudent.dni}</span>
                    </div>
                    <div className="flex gap-2 text-sm">
                      <span className="text-text-muted">
                        {mockStudent.programa}
                      </span>
                      <span className="text-text-muted">·</span>
                      <span className="text-text-muted">
                        Promoción {mockStudent.promocion}
                      </span>
                    </div>
                    <div className="pt-2">
                      <StatusBadge variant="matriculado">
                        Matriculado
                      </StatusBadge>
                    </div>
                  </div>
                </div>
                <button
                onClick={() => setIsStatusModalOpen(true)}
                className="px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary/5 transition-colors text-sm">
                
                  Actualizar estado
                </button>
              </div>
            </div>

            {/* Enrollment */}
            <div className="grid grid-cols-2 gap-6">
              {/* Available Courses */}
              <div className="bg-surface border border-border rounded-lg p-6">
                <h3 className="font-serif font-bold text-text mb-4">
                  Cursos disponibles — periodo activo
                </h3>
                <div className="space-y-3">
                  {availableCourses.map((course) =>
                <label
                  key={course.id}
                  className="flex items-start gap-3 p-3 border border-border rounded-lg hover:bg-surface-alt cursor-pointer transition-colors">
                  
                      <input
                    type="checkbox"
                    checked={enrolledCourses.includes(course.id)}
                    onChange={() => toggleCourse(course.id)}
                    className="mt-1 text-primary focus:ring-primary" />
                  
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-text">
                            {course.nombre}
                          </span>
                          <StatusBadge
                        variant={
                        course.tipo === 'Regular' ? 'activo' : 'retiro'
                        }>
                        
                            {course.tipo}
                          </StatusBadge>
                        </div>
                        <p className="text-sm text-text-muted">
                          {course.creditos} créditos
                        </p>
                      </div>
                    </label>
                )}
                </div>
              </div>

              {/* Enrolled Courses */}
              <div className="bg-surface border border-border rounded-lg p-6">
                <h3 className="font-serif font-bold text-text mb-4">
                  Cursos matriculados
                </h3>
                <div className="space-y-3">
                  {enrolledCourses.length === 0 ?
                <p className="text-text-muted text-center py-8">
                      No hay cursos matriculados
                    </p> :

                enrolledCourses.map((courseId) => {
                  const course = availableCourses.find(
                    (c) => c.id === courseId
                  );
                  if (!course) return null;
                  return (
                    <div
                      key={course.id}
                      className="flex items-start justify-between p-3 border border-border rounded-lg">
                      
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-text">
                                {course.nombre}
                              </span>
                              <StatusBadge
                            variant={
                            course.tipo === 'Regular' ?
                            'activo' :
                            'retiro'
                            }>
                            
                                {course.tipo}
                              </StatusBadge>
                            </div>
                            <p className="text-sm text-text-muted">
                              {course.creditos} créditos
                            </p>
                          </div>
                          <button
                        onClick={() => toggleCourse(course.id)}
                        className="text-accent hover:text-accent-light transition-colors">
                        
                            <XIcon className="w-5 h-5" />
                          </button>
                        </div>);

                })
                }
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-end">
              <button className="px-6 py-2 border border-primary text-primary rounded-lg hover:bg-primary/5 transition-colors">
                Cancelar
              </button>
              <button className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors">
                Guardar matrícula
              </button>
            </div>
          </div>
        }
      </div>

      {/* Status Update Modal */}
      <Modal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        title="Actualizar estado de matrícula"
        size="md"
        accentBorder>
        
        <form className="space-y-6">
          <div className="space-y-3">
            <label className="flex items-center gap-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-surface-alt transition-colors">
              <input
                type="radio"
                name="status"
                value="matriculado"
                checked={selectedStatus === 'matriculado'}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="text-primary focus:ring-primary" />
              
              <span className="text-text font-medium">Matriculado</span>
            </label>
            <label className="flex items-center gap-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-surface-alt transition-colors">
              <input
                type="radio"
                name="status"
                value="retiro"
                checked={selectedStatus === 'retiro'}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="text-primary focus:ring-primary" />
              
              <span className="text-text font-medium">Retiro de matrícula</span>
            </label>
            <label className="flex items-center gap-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-surface-alt transition-colors">
              <input
                type="radio"
                name="status"
                value="reactualizacion"
                checked={selectedStatus === 'reactualizacion'}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="text-primary focus:ring-primary" />
              
              <span className="text-text font-medium">Reactualización</span>
            </label>
          </div>

          {selectedStatus === 'retiro' &&
          <div className="space-y-4">
              <div className="bg-accent/10 border border-accent rounded-lg p-4">
                <p className="text-sm text-text">
                  Se debe adjuntar la resolución de retiro (se solicita a fin de
                  año al área académica)
                </p>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-text">
                  Fecha de retiro
                </label>
                <input
                type="date"
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
              
              </div>
              <FileUpload
              onFileSelect={(file) => console.log(file)}
              acceptedFormats=".pdf"
              label="Adjuntar resolución de retiro (PDF)" />
            
              <div className="space-y-2">
                <label className="block text-sm font-medium text-text">
                  Observaciones
                </label>
                <textarea
                rows={3}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
              
              </div>
            </div>
          }

          {selectedStatus === 'reactualizacion' &&
          <div className="space-y-4">
              <div className="bg-primary/10 border border-primary rounded-lg p-4">
                <p className="text-sm text-text">
                  Permite reincorporar a un estudiante rezagado a una promoción
                  activa (máx. 2 años de antigüedad)
                </p>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-text">
                  Asignar a promoción
                </label>
                <select className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                  <option>2024-I</option>
                  <option>2024-II</option>
                  <option>2023-II</option>
                </select>
              </div>
              <FileUpload
              onFileSelect={(file) => console.log(file)}
              acceptedFormats=".pdf"
              label="Adjuntar resolución de reactualización (PDF)" />
            
              <div className="space-y-2">
                <label className="block text-sm font-medium text-text">
                  Observaciones
                </label>
                <textarea
                rows={3}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
              
              </div>
            </div>
          }

          <div className="flex gap-3 justify-end pt-4 border-t border-border">
            <button
              type="button"
              onClick={() => setIsStatusModalOpen(false)}
              className="px-6 py-2 border border-primary text-primary rounded-lg hover:bg-primary/5 transition-colors">
              
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors">
              
              Confirmar cambio de estado
            </button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>);

}