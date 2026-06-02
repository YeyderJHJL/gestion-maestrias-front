// Parser de archivos Excel para importación masiva.
// Lee el archivo en el navegador, extrae las filas de la primera hoja
// y las mapea a los tipos que espera el backend.
// Lanza errores descriptivos si faltan columnas requeridas.

import * as XLSX from 'xlsx';
import { ImportStudentRow, ImportTeacherRow } from '../services/importApiService';

// --- Utilidades internas ---

// Lee el archivo Excel y devuelve las filas como objetos planos
async function readExcelRows(file: File): Promise<Record<string, unknown>[]> {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: 'array' });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];

  if (!sheet) {
    throw new Error('El archivo no contiene hojas de datos.');
  }

  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
    defval: '',       // celdas vacías quedan como string vacío (no undefined)
    raw: false,       // todos los valores como string para validar antes de convertir
  });

  if (rows.length === 0) {
    throw new Error('El archivo está vacío o no tiene filas de datos.');
  }

  return rows;
}

// Extrae un string requerido de una fila, lanza error si está vacío
function requireString(row: Record<string, unknown>, key: string, rowIndex: number): string {
  const value = String(row[key] ?? '').trim();
  if (!value) {
    throw new Error(`Fila ${rowIndex + 2}: la columna "${key}" es obligatoria y está vacía.`);
  }
  return value;
}

// Extrae un string opcional, devuelve undefined si está vacío
function optionalString(row: Record<string, unknown>, key: string): string | undefined {
  const value = String(row[key] ?? '').trim();
  return value || undefined;
}

// --- Parsers públicos ---

// Parsea un Excel de estudiantes y devuelve el array listo para enviar al backend.
// Columnas requeridas: firstName, lastName, email, promotionId, cui, paymentCode
// Columnas opcionales: dni, phone
export async function parseStudentsExcel(file: File): Promise<ImportStudentRow[]> {
  const rows = await readExcelRows(file);

  return rows.map((row, i) => {
    const promotionRaw = String(row['promotionId'] ?? '').trim();
    const promotionId = Number(promotionRaw);

    if (!promotionRaw) {
      throw new Error(`Fila ${i + 2}: la columna "promotionId" es obligatoria y está vacía.`);
    }
    if (isNaN(promotionId) || promotionId <= 0) {
      throw new Error(`Fila ${i + 2}: "promotionId" debe ser un número entero positivo (valor recibido: "${promotionRaw}").`);
    }

    return {
      firstName:   requireString(row, 'firstName', i),
      lastName:    requireString(row, 'lastName', i),
      email:       requireString(row, 'email', i),
      promotionId,
      cui:         requireString(row, 'cui', i),
      paymentCode: requireString(row, 'paymentCode', i),
      dni:         optionalString(row, 'dni'),
      phone:       optionalString(row, 'phone'),
    };
  });
}

// Parsea un Excel de docentes y devuelve el array listo para enviar al backend.
// Columnas requeridas: firstName, lastName, email, type (Interno | Externo)
// Columnas opcionales: dni, category, regime, academicDegree, specialty, phone
export async function parseTeachersExcel(file: File): Promise<ImportTeacherRow[]> {
  const VALID_TYPES = ['Interno', 'Externo'] as const;
  const VALID_CATEGORIES = ['Principal', 'Asociado', 'Auxiliar'] as const;
  const VALID_DEGREES = ['Magister', 'Doctor'] as const;

  const rows = await readExcelRows(file);

  return rows.map((row, i) => {
    const type = requireString(row, 'type', i);

    if (!VALID_TYPES.includes(type as (typeof VALID_TYPES)[number])) {
      throw new Error(
        `Fila ${i + 2}: "type" debe ser "Interno" o "Externo" (valor recibido: "${type}").`
      );
    }

    const category = optionalString(row, 'category');
    if (category && !VALID_CATEGORIES.includes(category as (typeof VALID_CATEGORIES)[number])) {
      throw new Error(
        `Fila ${i + 2}: "category" debe ser Principal, Asociado o Auxiliar (valor: "${category}").`
      );
    }

    const academicDegree = optionalString(row, 'academicDegree');
    if (academicDegree && !VALID_DEGREES.includes(academicDegree as (typeof VALID_DEGREES)[number])) {
      throw new Error(
        `Fila ${i + 2}: "academicDegree" debe ser "Magister" o "Doctor" (valor: "${academicDegree}").`
      );
    }

    return {
      firstName:     requireString(row, 'firstName', i),
      lastName:      requireString(row, 'lastName', i),
      email:         requireString(row, 'email', i),
      type:          type as 'Interno' | 'Externo',
      dni:           optionalString(row, 'dni'),
      category:      category as ImportTeacherRow['category'],
      regime:        optionalString(row, 'regime'),
      academicDegree: academicDegree as ImportTeacherRow['academicDegree'],
      specialty:     optionalString(row, 'specialty'),
      phone:         optionalString(row, 'phone'),
    };
  });
}
