import React from 'react';
import { EstudianteLayout } from '../../layouts/EstudianteLayout';
import { StatusBadge } from '../../components/StatusBadge';
import {
  ClipboardListIcon,
  ReceiptIcon,
  AlertTriangleIcon,
  AwardIcon } from
'lucide-react';
import { motion } from 'framer-motion';

const stats = [
{
  label: 'Cursos matriculados',
  value: '4',
  icon: ClipboardListIcon,
  color: 'text-primary'
},
{
  label: 'Notas pendientes',
  value: '2',
  icon: AlertTriangleIcon,
  color: 'text-warning'
},
{
  label: 'Vouchers observados',
  value: '0',
  icon: ReceiptIcon,
  color: 'text-text-muted'
},
{
  label: 'Créditos acumulados',
  value: '24',
  icon: AwardIcon,
  color: 'text-primary'
}];

const currentCourses = [
{
  nombre: 'Algoritmos Avanzados',
  docente: 'Dr. Carlos Mendoza',
  tipo: 'Regular',
  notaFinal: 17,
  estado: 'aprobado'
},
{
  nombre: 'Bases de Datos Distribuidas',
  docente: 'Dra. Ana Rodríguez',
  tipo: 'Regular',
  notaFinal: null,
  estado: 'pendiente'
},
{
  nombre: 'Inteligencia Artificial',
  docente: 'Dr. Luis Fernández',
  tipo: 'Regular',
  notaFinal: null,
  estado: 'pendiente'
},
{
  nombre: 'Tesis I',
  docente: 'Dr. Jorge Ramírez',
  tipo: 'Tesis',
  notaFinal: 18,
  estado: 'aprobado'
}];

export function EstudianteDashboard() {
  return (
    <EstudianteLayout>
      
      <div className="space-y-8">
        {/* Welcome Banner */}
        <motion.div
          initial={{
            opacity: 0,
            y: -20
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          className="bg-primary text-white rounded-lg p-6">
          
          <h1 className="text-3xl font-serif font-bold">
            Bienvenido/a, Juan Carlos
          </h1>
          <p className="text-white/90 mt-1">
            Periodo activo: 2024-I · Primer semestre 2024
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
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
                className="bg-surface border border-border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-text-muted text-sm font-medium">
                      {stat.label}
                    </p>
                    <p className="text-3xl font-bold text-text">{stat.value}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </motion.div>);

          })}
        </div>

        {/* Current Courses */}
        <motion.div
          initial={{
            opacity: 0,
            y: 20
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          transition={{
            delay: 0.4
          }}
          className="bg-surface border border-border rounded-lg shadow-sm overflow-hidden">
          
          <div className="px-6 py-4 border-b border-border">
            <h2 className="text-xl font-serif font-bold text-text">
              Cursos actuales
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-surface-alt">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase">
                    Curso
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase">
                    Docente
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
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {currentCourses.map((course, index) =>
                <tr
                  key={index}
                  className={
                  index % 2 === 0 ? 'bg-surface' : 'bg-surface-alt'
                  }>
                  
                    <td className="px-6 py-4 text-sm text-text font-medium">
                      {course.nombre}
                    </td>
                    <td className="px-6 py-4 text-sm text-text-muted">
                      {course.docente}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge
                      variant={
                      course.tipo === 'Regular' ? 'activo' : 'retiro'
                      }>
                      
                        {course.tipo}
                      </StatusBadge>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {course.notaFinal ?
                    <span className="font-semibold text-text">
                          {course.notaFinal}
                        </span> :

                    <span className="text-text-muted">—</span>
                    }
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge
                      variant={
                      course.estado === 'aprobado' ?
                      'aprobado' :
                      course.estado === 'desaprobado' ?
                      'desaprobado' :
                      'pendiente'
                      }>
                      
                        {course.estado === 'aprobado' ?
                      'Aprobado' :
                      course.estado === 'desaprobado' ?
                      'Desaprobado' :
                      'Pendiente'}
                      </StatusBadge>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </EstudianteLayout>);

}