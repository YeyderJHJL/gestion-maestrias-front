import React from 'react';
import { EstudianteLayout } from '../../layouts/EstudianteLayout';
import { StatusBadge } from '../../components/StatusBadge';
import {
  CalendarIcon,
  UserIcon,
  FileIcon } from
'lucide-react';
import { motion } from 'framer-motion';

const enrolledCourses = [
{
  nombre: 'Algoritmos Avanzados',
  tipo: 'Regular',
  creditos: 4,
  docente: 'Dr. Carlos Mendoza',
  fechaInicio: '15/03/2024',
  fechaFin: '12/04/2024',
  silaboDisponible: true
},
{
  nombre: 'Bases de Datos Distribuidas',
  tipo: 'Regular',
  creditos: 4,
  docente: 'Dra. Ana Rodríguez',
  fechaInicio: '22/03/2024',
  fechaFin: '19/04/2024',
  silaboDisponible: true
},
{
  nombre: 'Inteligencia Artificial',
  tipo: 'Regular',
  creditos: 4,
  docente: 'Dr. Luis Fernández',
  fechaInicio: '29/03/2024',
  fechaFin: '26/04/2024',
  silaboDisponible: false
},
{
  nombre: 'Tesis I',
  tipo: 'Tesis',
  creditos: 6,
  docente: 'Dr. Jorge Ramírez',
  fechaInicio: '05/04/2024',
  fechaFin: '10/05/2024',
  silaboDisponible: true
}];

export function EstudianteMatricula() {
  return (
    <EstudianteLayout>
      
      <div className="space-y-6">
        <h1 className="text-3xl font-serif font-bold text-text">
          Mi Matrícula
        </h1>

        {/* Status Banner */}
        <motion.div
          initial={{
            opacity: 0,
            y: -10
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          className="bg-primary/10 border border-primary rounded-lg p-4 flex items-center gap-3">
          
          <div className="w-10 h-10 rounded-full bg-success flex items-center justify-center flex-shrink-0">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7" />
              
            </svg>
          </div>
          <div>
            <p className="font-semibold text-text">Estado: Matriculado</p>
            <p className="text-sm text-text-muted">
              Tu matrícula está activa para el periodo 2024-I
            </p>
          </div>
        </motion.div>

        {/* Period Header */}
        <div className="bg-surface border border-border rounded-lg p-6">
          <h2 className="text-xl font-serif font-bold text-text mb-2">
            Periodo activo: 2024-I
          </h2>
          <p className="text-text-muted">Primer semestre 2024</p>
        </div>

        {/* Course Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {enrolledCourses.map((course, index) =>
          <motion.div
            key={index}
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
            className="bg-surface border border-border rounded-lg p-6 hover:shadow-md transition-shadow">
            
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <h3 className="font-serif font-bold text-text text-lg">
                    {course.nombre}
                  </h3>
                  <StatusBadge
                  variant={course.tipo === 'Regular' ? 'activo' : 'retiro'}>
                  
                    {course.tipo}
                  </StatusBadge>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-text-muted">
                    <UserIcon className="w-4 h-4" />
                    <span>{course.docente}</span>
                  </div>
                  <div className="flex items-center gap-2 text-text-muted">
                    <CalendarIcon className="w-4 h-4" />
                    <span>
                      {course.fechaInicio} - {course.fechaFin}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-text-muted">
                    <AwardIcon className="w-4 h-4" />
                    <span>{course.creditos} créditos</span>
                  </div>
                </div>

                {course.silaboDisponible &&
              <button className="flex items-center gap-2 text-accent hover:text-accent-light transition-colors font-medium text-sm">
                    <FileIcon className="w-4 h-4" />
                    Ver sílabo
                  </button>
              }
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </EstudianteLayout>);

}
function AwardIcon({ className }: {className?: string;}) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor">
      
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      
    </svg>);

}