import React, { useState } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { Modal } from '../../components/Modal';
import { StatusBadge } from '../../components/StatusBadge';
import {
  SearchIcon,
  PlusIcon,
  EditIcon,
  XIcon } from
'lucide-react';

const mockUsers = [
{
  id: 1,
  nombre: 'Juan Carlos Pérez López',
  correo: 'jperez@unsa.edu.pe',
  rol: 'Estudiante',
  tipo: 'Interno UNSA',
  estado: 'activo'
},
{
  id: 2,
  nombre: 'María González Quispe',
  correo: 'mgonzalez@unsa.edu.pe',
  rol: 'Estudiante',
  tipo: 'Interno UNSA',
  estado: 'activo'
},
{
  id: 3,
  nombre: 'Dr. Carlos Mendoza Silva',
  correo: 'cmendoza@unsa.edu.pe',
  rol: 'Docente',
  tipo: 'Interno UNSA',
  estado: 'activo'
},
{
  id: 4,
  nombre: 'Dra. Ana Rodríguez Flores',
  correo: 'arodriguez@unsa.edu.pe',
  rol: 'Docente',
  tipo: 'Externo',
  estado: 'activo'
},
{
  id: 5,
  nombre: 'Admin Principal',
  correo: 'admin@unsa.edu.pe',
  rol: 'Administrador',
  tipo: 'Interno UNSA',
  estado: 'activo'
}];

import { useAuth } from '../../context/AuthContext';

export function AdminUsuarios() {
  const { user: authUser } = useAuth();
  const isCoordinator = authUser?.role === 'COORDINATOR';

  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('Todos');
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);
  const [teacherType, setTeacherType] = useState<'interno' | 'externo'>(
    'interno'
  );
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-serif font-bold text-text">
            Gestión de Usuarios
          </h1>
          {!isCoordinator && (
            <div className="flex gap-3">
              <button
                onClick={() => setIsStudentModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors"
              >
                <PlusIcon className="w-5 h-5" />
                Nuevo Estudiante
              </button>
              <button
                onClick={() => setIsTeacherModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors"
              >
                <PlusIcon className="w-5 h-5" />
                Nuevo Docente
              </button>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="bg-surface border border-border rounded-lg p-4 flex gap-4">
          <div className="flex-1 relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
            <input
              type="text"
              placeholder="Buscar por nombre o correo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
            
          </div>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
            
            <option>Todos</option>
            <option>Administrador</option>
            <option>Docente</option>
            <option>Estudiante</option>
          </select>
        </div>

        {/* Users Table */}
        <div className="bg-surface border border-border rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-surface-alt">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase">
                    Nombre completo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase">
                    Correo institucional
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase">
                    Rol
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase">
                    Estado
                  </th>
                  {!isCoordinator && (
                    <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase">
                      Acciones
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {mockUsers.map((user, index) =>
                <tr
                  key={user.id}
                  className={
                  index % 2 === 0 ? 'bg-surface' : 'bg-surface-alt'
                  }>
                  
                    <td className="px-6 py-4 text-sm text-text font-medium">
                      {user.nombre}
                    </td>
                    <td className="px-6 py-4 text-sm text-text-muted">
                      {user.correo}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge variant="activo">{user.rol}</StatusBadge>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge
                      variant={user.tipo === 'Externo' ? 'externo' : 'activo'}>
                      
                        {user.tipo}
                      </StatusBadge>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge
                      variant={
                      user.estado === 'activo' ? 'activo' : 'inactivo'
                      }>
                      
                        {user.estado === 'activo' ? 'Activo' : 'Inactivo'}
                      </StatusBadge>
                    </td>
                    {!isCoordinator && (
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button className="p-1 text-primary hover:text-primary-light transition-colors">
                            <EditIcon className="w-5 h-5" />
                          </button>
                          <button className="p-1 text-accent hover:text-accent-light transition-colors">
                            <XIcon className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Student Modal */}
      <Modal
        isOpen={isStudentModalOpen}
        onClose={() => setIsStudentModalOpen(false)}
        title="Registrar Estudiante"
        size="lg"
        accentBorder>
        
        <form className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text">
                Nombres
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
              
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text">
                Apellidos
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
              
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text">
                Código de estudiante
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
              
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text">DNI</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
              
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text">CUI</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
              
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text">
                Correo institucional
              </label>
              <input
                type="email"
                placeholder="@unsa.edu.pe"
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
              
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text">
                Teléfono
              </label>
              <input
                type="tel"
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
              
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text">
                Programa
              </label>
              <select className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                <option>Maestría en Informática</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text">
                Promoción
              </label>
              <select className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                <option>2024-I</option>
                <option>2024-II</option>
                <option>2025-I</option>
              </select>
            </div>
            <div className="space-y-2">
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

          <p className="text-sm text-text-muted italic">
            El correo institucional será usado para el acceso mediante Google.
            Debe existir en la OTI.
          </p>

          <div className="flex gap-3 justify-end pt-4 border-t border-border">
            <button
              type="button"
              onClick={() => setIsStudentModalOpen(false)}
              className="px-6 py-2 border border-primary text-primary rounded-lg hover:bg-primary/5 transition-colors">
              
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors">
              
              Guardar estudiante
            </button>
          </div>
        </form>
      </Modal>

      {/* Teacher Modal */}
      <Modal
        isOpen={isTeacherModalOpen}
        onClose={() => setIsTeacherModalOpen(false)}
        title="Registrar Docente"
        size="lg"
        accentBorder>
        
        <form className="space-y-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-text">Datos personales</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-text">
                  Nombres
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-text">
                  Apellidos
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-text">
                  DNI
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-text">
                  Celular
                </label>
                <input
                  type="tel"
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                
              </div>
              <div className="col-span-2 space-y-2">
                <label className="block text-sm font-medium text-text">
                  Correo institucional
                </label>
                <input
                  type="email"
                  placeholder="@unsa.edu.pe"
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-text">Datos académicos</h3>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text">
                Tipo
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="tipo"
                    value="interno"
                    checked={teacherType === 'interno'}
                    onChange={() => setTeacherType('interno')}
                    className="text-primary focus:ring-primary" />
                  
                  <span className="text-sm text-text">Interno UNSA</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="tipo"
                    value="externo"
                    checked={teacherType === 'externo'}
                    onChange={() => setTeacherType('externo')}
                    className="text-primary focus:ring-primary" />
                  
                  <span className="text-sm text-text">Externo</span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-text">
                  Categoría
                </label>
                <select className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                  <option>Principal</option>
                  <option>Asociado</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-text">
                  Régimen
                </label>
                <select className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                  <option>Dedicación exclusiva</option>
                  <option>Tiempo completo</option>
                  <option>Tiempo parcial</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-text">
                  Grado académico
                </label>
                <select className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                  <option>Magíster</option>
                  <option>Doctor</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-text">
                  Especialidad
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                
              </div>
            </div>
          </div>

          {teacherType === 'externo' &&
          <div className="bg-accent/10 border border-accent rounded-lg p-4 space-y-3">
              <p className="text-sm text-text">
                El correo institucional de docentes externos es generado
                manualmente por la OTI. El trámite puede demorar hasta una
                semana.
              </p>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-text">
                  Correo institucional asignado
                </label>
                <input
                type="email"
                placeholder="Ingresar cuando OTI confirme"
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
              
              </div>
            </div>
          }

          <div className="flex gap-3 justify-end pt-4 border-t border-border">
            <button
              type="button"
              onClick={() => setIsTeacherModalOpen(false)}
              className="px-6 py-2 border border-primary text-primary rounded-lg hover:bg-primary/5 transition-colors">
              
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors">
              
              Guardar docente
            </button>
          </div>
        </form>
      </Modal>
    </AdminLayout>);

}