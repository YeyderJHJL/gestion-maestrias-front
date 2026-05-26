import React, { useState } from 'react';
import { DocenteLayout } from '../../layouts/DocenteLayout';
import { StatusBadge } from '../../components/StatusBadge';
import { ChevronDownIcon } from 'lucide-react';

const mockHistorial = [
{
  year: 2024,
  periodo: '2024-I',
  cursos: [
  {
    id: 1,
    nombre: 'Algoritmos Avanzados',
    tipo: 'Regular',
    promocion: '2024-I',
    estudiantes: 25,
    notasCompletas: true
  },
  {
    id: 2,
    nombre: 'Bases de Datos Distribuidas',
    tipo: 'Regular',
    promocion: '2024-I',
    estudiantes: 25,
    notasCompletas: true
  }]

},
{
  year: 2023,
  periodo: '2023-II',
  cursos: [
  {
    id: 3,
    nombre: 'Algoritmos Avanzados',
    tipo: 'Regular',
    promocion: '2023-II',
    estudiantes: 28,
    notasCompletas: true
  },
  {
    id: 4,
    nombre: 'Estructuras de Datos',
    tipo: 'Regular',
    promocion: '2023-II',
    estudiantes: 30,
    notasCompletas: true
  },
  {
    id: 5,
    nombre: 'Tesis I',
    tipo: 'Tesis',
    promocion: '2023-II',
    estudiantes: 15,
    notasCompletas: true
  }]

},
{
  year: 2023,
  periodo: '2023-I',
  cursos: [
  {
    id: 6,
    nombre: 'Programación Avanzada',
    tipo: 'Regular',
    promocion: '2023-I',
    estudiantes: 32,
    notasCompletas: true
  },
  {
    id: 7,
    nombre: 'Bases de Datos',
    tipo: 'Regular',
    promocion: '2023-I',
    estudiantes: 30,
    notasCompletas: true
  }]

}];

export function DocenteHistorial() {
  const [expandedPeriodo, setExpandedPeriodo] = useState<string | null>(
    '2024-I'
  );
  const totalCursos = mockHistorial.reduce((sum, p) => sum + p.cursos.length, 0);
  const totalEstudiantes = mockHistorial.reduce(
    (sum, p) => sum + p.cursos.reduce((s, c) => s + c.estudiantes, 0),
    0
  );
  return (
    <DocenteLayout>
      
      <div className="space-y-6">
        <h1 className="text-3xl font-serif font-bold text-gray-900">
          Historial de Cursos
        </h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg border border-[#D5D2CC] shadow-sm p-6">
            <p className="text-sm text-gray-600 mb-1">
              Total de cursos dictados
            </p>
            <p className="text-3xl font-bold text-gray-900">{totalCursos}</p>
          </div>
          <div className="bg-white rounded-lg border border-[#D5D2CC] shadow-sm p-6">
            <p className="text-sm text-gray-600 mb-1">Total de estudiantes</p>
            <p className="text-3xl font-bold text-gray-900">
              {totalEstudiantes}
            </p>
          </div>
          <div className="bg-white rounded-lg border border-[#D5D2CC] shadow-sm p-6">
            <p className="text-sm text-gray-600 mb-1">Años de docencia</p>
            <p className="text-3xl font-bold text-gray-900">
              {new Set(mockHistorial.map((h) => h.year)).size}
            </p>
          </div>
        </div>

        {/* History by Period */}
        <div className="space-y-4">
          {mockHistorial.map((periodo) =>
          <div
            key={periodo.periodo}
            className="bg-white rounded-lg border border-[#D5D2CC] shadow-sm overflow-hidden">
            
              <button
              onClick={() =>
              setExpandedPeriodo(
                expandedPeriodo === periodo.periodo ?
                null :
                periodo.periodo
              )
              }
              className="w-full flex items-center justify-between px-6 py-4 bg-[#ECEAE6] hover:bg-gray-200 transition-colors">
              
                <div className="flex items-center gap-4">
                  <div>
                    <p className="font-serif font-bold text-gray-900 text-lg">
                      {periodo.periodo}
                    </p>
                    <p className="text-sm text-gray-600">
                      {periodo.year} · {periodo.cursos.length} cursos
                    </p>
                  </div>
                </div>
                <ChevronDownIcon
                className={`w-5 h-5 text-gray-600 transition-transform ${expandedPeriodo === periodo.periodo ? 'rotate-180' : ''}`} />
              
              </button>

              {expandedPeriodo === periodo.periodo &&
            <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-[#1A2F5A] text-white">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase">
                          Curso
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase">
                          Tipo
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase">
                          Promoción
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase">
                          Estudiantes
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase">
                          Estado
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#D5D2CC]">
                      {periodo.cursos.map((curso, index) =>
                  <tr
                    key={curso.id}
                    className={
                    index % 2 === 0 ? 'bg-white' : 'bg-[#ECEAE6]'
                    }>
                    
                          <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                            {curso.nombre}
                          </td>
                          <td className="px-6 py-4">
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
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {curso.promocion}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {curso.estudiantes}
                          </td>
                          <td className="px-6 py-4">
                            <StatusBadge variant="aprobado">
                              Notas completas
                            </StatusBadge>
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
      </div>
    </DocenteLayout>);

}