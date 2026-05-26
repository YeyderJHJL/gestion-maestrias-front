import React from 'react';
import { Link } from 'react-router-dom';
import { DocenteLayout } from '../../layouts/DocenteLayout';
import { StatusBadge } from '../../components/StatusBadge';
import {
  BookOpenIcon,
  CalendarIcon,
  AlertTriangleIcon } from
'lucide-react';
import { motion } from 'framer-motion';

const mockCourses = [
{
  id: 1,
  nombre: 'Algoritmos Avanzados',
  tipo: 'Regular',
  promocion: '2024-I',
  fechaInicio: '15/03/2024',
  fechaFin: '12/04/2024',
  notasRegistradas: 18,
  totalEstudiantes: 25,
  estado: 'en-curso',
  silaboSubido: true
},
{
  id: 2,
  nombre: 'Bases de Datos Distribuidas',
  tipo: 'Regular',
  promocion: '2024-I',
  fechaInicio: '22/03/2024',
  fechaFin: '19/04/2024',
  notasRegistradas: 25,
  totalEstudiantes: 25,
  estado: 'completo',
  silaboSubido: true
},
{
  id: 3,
  nombre: 'Tópicos Avanzados en IA',
  tipo: 'Tópicos',
  promocion: '2024-I',
  fechaInicio: '05/04/2024',
  fechaFin: '10/05/2024',
  notasRegistradas: 0,
  totalEstudiantes: 20,
  estado: 'pendiente',
  silaboSubido: false
}];

export function DocenteDashboard() {
  return (
    <DocenteLayout>
      
      <div className="space-y-6">
        <div className="bg-primary text-white rounded-lg p-6">
          <h1 className="text-2xl font-serif font-bold">
            Periodo activo: 2024-I
          </h1>
          <p className="text-white/90 mt-1">Primer semestre 2024</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockCourses.map((course, index) => {
            const progress =
            course.notasRegistradas / course.totalEstudiantes * 100;
            const typeColor =
            course.tipo === 'Regular' ?
            'primary' :
            course.tipo === 'Tesis' ?
            'accent' :
            'warning';
            return (
              <motion.div
                key={course.id}
                initial={{
                  opacity: 0,
                  y: 20
                }}
                animate={{
                  opacity: 1,
                  y: 0
                }}
                transition={{
                  delay: index * 0.1
                }}
                className="bg-surface border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                
                <div className={`h-2 bg-${typeColor}`} />

                <div className="p-6 space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <h3 className="font-serif font-bold text-text text-lg">
                        {course.nombre}
                      </h3>
                      <StatusBadge
                        variant={
                        course.tipo === 'Regular' ?
                        'activo' :
                        course.tipo === 'Tesis' ?
                        'retiro' :
                        'observado'
                        }>
                        
                        {course.tipo}
                      </StatusBadge>
                    </div>
                    <p className="text-sm text-text-muted">
                      Promoción {course.promocion}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-text-muted">
                    <CalendarIcon className="w-4 h-4" />
                    <span>
                      {course.fechaInicio} - {course.fechaFin}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-text-muted">Notas registradas</span>
                      <span className="font-semibold text-text">
                        {course.notasRegistradas} / {course.totalEstudiantes}
                      </span>
                    </div>
                    <div className="w-full bg-surface-alt rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{
                          width: `${progress}%`
                        }} />
                      
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <StatusBadge
                      variant={
                      course.estado === 'completo' ?
                      'aprobado' :
                      course.estado === 'en-curso' ?
                      'en-curso' :
                      'pendiente'
                      }>
                      
                      {course.estado === 'completo' ?
                      'Completo' :
                      course.estado === 'en-curso' ?
                      'En curso' :
                      'Pendiente'}
                    </StatusBadge>

                    {!course.silaboSubido &&
                    <div className="flex items-center gap-1 text-xs text-accent">
                        <AlertTriangleIcon className="w-4 h-4" />
                        <span className="font-semibold">Sílabo pendiente</span>
                      </div>
                    }
                  </div>

                  <Link
                    to={`/docente/cursos/${course.id}`}
                    className="block text-center text-accent hover:text-accent-light font-medium text-sm transition-colors">
                    
                    Ver curso →
                  </Link>
                </div>
              </motion.div>);

          })}
        </div>

        {mockCourses.length === 0 &&
        <div className="bg-surface border border-border rounded-lg p-12 text-center">
            <BookOpenIcon className="w-16 h-16 text-text-muted mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-text mb-2">
              No tienes cursos asignados en el periodo activo
            </h3>
            <p className="text-text-muted">
              Contacta a Administración si crees que hay un error
            </p>
          </div>
        }
      </div>
    </DocenteLayout>);

}