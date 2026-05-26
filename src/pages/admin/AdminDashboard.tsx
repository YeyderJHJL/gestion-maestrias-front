import React from 'react';
import { DashboardLayout } from '../../components/DashboardLayout';
import {
  LayoutDashboardIcon,
  UsersIcon,
  BookOpenIcon,
  ClipboardListIcon,
  ReceiptIcon,
  FileTextIcon } from
'lucide-react';
import { motion } from 'framer-motion';
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
}];

const stats = [
{
  label: 'Estudiantes activos',
  value: '48',
  icon: UsersIcon,
  color: 'text-primary'
},
{
  label: 'Cursos en periodo activo',
  value: '12',
  icon: BookOpenIcon,
  color: 'text-primary'
},
{
  label: 'Vouchers pendientes',
  value: '7',
  icon: ReceiptIcon,
  color: 'text-warning',
  badge: true
},
{
  label: 'Expedientes / Resoluciones',
  value: '23',
  icon: FileTextIcon,
  color: 'text-primary'
}];

const recentActivity = [
{
  tipo: 'Matrícula',
  descripcion: 'Juan Pérez matriculado en Algoritmos Avanzados',
  usuario: 'Admin Principal',
  fecha: '23/05/2026 14:30'
},
{
  tipo: 'Voucher',
  descripcion: 'Voucher validado para María González',
  usuario: 'Admin Principal',
  fecha: '23/05/2026 13:15'
},
{
  tipo: 'Nota',
  descripcion: 'Notas registradas en Bases de Datos',
  usuario: 'Dr. Carlos Mendoza',
  fecha: '23/05/2026 11:45'
},
{
  tipo: 'Usuario',
  descripcion: 'Nuevo docente externo registrado',
  usuario: 'Admin Principal',
  fecha: '23/05/2026 10:20'
},
{
  tipo: 'Curso',
  descripcion: 'Curso de Tópicos Avanzados creado',
  usuario: 'Admin Principal',
  fecha: '22/05/2026 16:00'
}];

export function AdminDashboard() {
  const currentHour = new Date().getHours();
  const greeting =
  currentHour < 12 ?
  'Buenos días' :
  currentHour < 19 ?
  'Buenas tardes' :
  'Buenas noches';
  const currentDate = new Date().toLocaleDateString('es-PE', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  return (
    <DashboardLayout
      userName="Admin Principal"
      userRole="Administrador"
      sidebarLinks={sidebarLinks}>
      
      <div className="space-y-8">
        {/* Greeting */}
        <motion.div
          initial={{
            opacity: 0,
            y: -20
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          className="space-y-1">
          
          <h1 className="text-3xl font-serif font-bold text-text">
            {greeting}, Admin Principal
          </h1>
          <p className="text-text-muted capitalize">{currentDate}</p>
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
                  <div
                    className={`p-3 rounded-lg ${stat.badge ? 'bg-warning/10' : 'bg-primary/10'}`}>
                    
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
                {stat.badge &&
                <div className="mt-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-warning text-white">
                      {stat.value} pendientes
                    </span>
                  </div>
                }
              </motion.div>);

          })}
        </div>

        {/* Recent Activity */}
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
              Actividad reciente
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-surface-alt">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">
                    Descripción
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">
                    Usuario
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">
                    Fecha y hora
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recentActivity.map((activity, index) =>
                <tr
                  key={index}
                  className={
                  index % 2 === 0 ? 'bg-surface' : 'bg-surface-alt'
                  }>
                  
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary text-white">
                        {activity.tipo}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-text">
                      {activity.descripcion}
                    </td>
                    <td className="px-6 py-4 text-sm text-text-muted">
                      {activity.usuario}
                    </td>
                    <td className="px-6 py-4 text-sm text-text-muted whitespace-nowrap">
                      {activity.fecha}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>);

}