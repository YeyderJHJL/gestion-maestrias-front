// Página de migración de datos con dos módulos independientes:
//   - Estudiantes: parsea el Excel y envía a POST /v1/students/import
//   - Docentes: parsea el Excel y envía a POST /v1/teachers/import
//
// Ambos flujos comparten el mismo componente ImportFlow de 4 pasos.
// El selector de tabs controla cuál está activo sin desmontar el otro,
// para que el usuario no pierda su estado si cambia de tab accidentalmente.

import React, { useState } from 'react';
import { FileSpreadsheetIcon } from 'lucide-react';
import { AdminLayout } from '../../../layouts/AdminLayout';
import { ImportFlow, ColumnDef } from './ImportFlow';
import { parseStudentsExcel } from '../../../utils/excelParser';
import { parseTeachersExcel } from '../../../utils/excelParser';
import { importStudents, importTeachers } from '../../../services/importApiService';
import type { ImportStudentRow, ImportTeacherRow } from '../../../services/importApiService';

type Tab = 'students' | 'teachers';

// --- Definición de columnas para estudiantes ---
// Usadas tanto en la tabla de preview como en la guía de formato
const STUDENT_COLUMNS: ColumnDef[] = [
  { key: 'firstName',   label: 'Nombres',         required: true  },
  { key: 'lastName',    label: 'Apellidos',        required: true  },
  { key: 'email',       label: 'Correo',           required: true  },
  { key: 'dni',         label: 'DNI',              required: false },
  { key: 'promotionId', label: 'ID Promoción',     required: true  },
  { key: 'cui',         label: 'CUI',              required: true  },
  { key: 'paymentCode', label: 'Código de pago',   required: true  },
  { key: 'phone',       label: 'Teléfono',         required: false },
];

// --- Definición de columnas para docentes ---
const TEACHER_COLUMNS: ColumnDef[] = [
  { key: 'firstName',     label: 'Nombres',          required: true  },
  { key: 'lastName',      label: 'Apellidos',         required: true  },
  { key: 'email',         label: 'Correo',            required: true  },
  { key: 'dni',           label: 'DNI',               required: false },
  { key: 'type',          label: 'Tipo (Interno/Externo)', required: true },
  { key: 'category',      label: 'Categoría',         required: false },
  { key: 'regime',        label: 'Régimen',           required: false },
  { key: 'academicDegree',label: 'Grado académico',   required: false },
  { key: 'specialty',     label: 'Especialidad',      required: false },
  { key: 'phone',         label: 'Teléfono',          required: false },
];

export function AdminImportar() {
  const [activeTab, setActiveTab] = useState<Tab>('students');

  return (
    <AdminLayout>
      <div className="space-y-6">

        {/* Encabezado de la página */}
        <div className="flex items-center justify-between border-b-2 border-accent pb-3">
          <div>
            <h1 className="text-3xl font-serif font-bold text-text">Migración de Datos</h1>
            <p className="text-sm text-text-muted mt-0.5">
              {activeTab === 'students'
                ? 'Importación masiva de estudiantes mediante archivo Excel'
                : 'Importación masiva de docentes mediante archivo Excel'}
            </p>
          </div>
          <FileSpreadsheetIcon className="w-10 h-10 text-primary opacity-80" />
        </div>

        {/* Selector de tabs */}
        <div className="flex border-b border-border">
          <button
            onClick={() => setActiveTab('students')}
            className={`px-6 py-3 text-sm font-semibold transition-colors border-b-2 -mb-px ${
              activeTab === 'students'
                ? 'border-primary text-primary'
                : 'border-transparent text-text-muted hover:text-text'
            }`}
          >
            Estudiantes
          </button>
          <button
            onClick={() => setActiveTab('teachers')}
            className={`px-6 py-3 text-sm font-semibold transition-colors border-b-2 -mb-px ${
              activeTab === 'teachers'
                ? 'border-primary text-primary'
                : 'border-transparent text-text-muted hover:text-text'
            }`}
          >
            Docentes
          </button>
        </div>

        {/* Módulo de importación de estudiantes */}
        <div className={activeTab === 'students' ? 'block' : 'hidden'}>
          <ImportFlow<ImportStudentRow>
            parseFile={parseStudentsExcel}
            submitRows={importStudents}
            columnDefs={STUDENT_COLUMNS}
            entityLabel="estudiantes"
          />
        </div>

        {/* Módulo de importación de docentes */}
        <div className={activeTab === 'teachers' ? 'block' : 'hidden'}>
          <ImportFlow<ImportTeacherRow>
            parseFile={parseTeachersExcel}
            submitRows={importTeachers}
            columnDefs={TEACHER_COLUMNS}
            entityLabel="docentes"
          />
        </div>

      </div>
    </AdminLayout>
  );
}
