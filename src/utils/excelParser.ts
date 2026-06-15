// Parser de archivos Excel para importación masiva.
// Lee el archivo en el navegador, extrae las filas de la primera hoja
// y las mapea a los tipos que espera el backend.
//
// Acepta encabezados en inglés O en español (con o sin tildes, mayúsculas/minúsculas).
// Ejemplo: "firstName", "Nombres" y "NOMBRES" son equivalentes.

import * as XLSX from 'xlsx';
import { ImportStudentRow, ImportTeacherRow } from '../services/importApiService';

// --- Normalización de encabezados ---

// Convierte un string a minúsculas sin tildes ni espacios para comparar
function normalize(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // quita tildes
    .replace(/\s+/g, '');            // quita espacios
}

// Mapa de alias para estudiantes: clave normalizada → nombre canónico
const STUDENT_ALIASES: Record<string, string> = {
  // firstName
  firstname: 'firstName', nombres: 'firstName', nombre: 'firstName',
  // lastName
  lastname: 'lastName', apellidos: 'lastName', apellido: 'lastName',
  // email
  email: 'email', correo: 'email', correoelectronico: 'email',
  correoinstitucional: 'email',
  // dni
  dni: 'dni',
  // cui
  cui: 'cui',
  // paymentCode
  paymentcode: 'paymentCode', codigodepago: 'paymentCode',
  codigopago: 'paymentCode', codpago: 'paymentCode',
  // phone
  phone: 'phone', telefono: 'phone', celular: 'phone',
};

// Mapa de alias para docentes
const TEACHER_ALIASES: Record<string, string> = {
  // firstName
  firstname: 'firstName', nombres: 'firstName', nombre: 'firstName',
  // lastName
  lastname: 'lastName', apellidos: 'lastName', apellido: 'lastName',
  // email
  email: 'email', correo: 'email', correoelectronico: 'email',
  correoinstitucional: 'email',
  // dni
  dni: 'dni',
  // type
  type: 'type', tipo: 'type',
  // category
  category: 'category', categoria: 'category',
  // regime
  regime: 'regime', regimen: 'regime',
  // academicDegree
  academicdegree: 'academicDegree', gradoacademico: 'academicDegree',
  grado: 'academicDegree',
  // specialty
  specialty: 'specialty', especialidad: 'specialty',
  // phone
  phone: 'phone', telefono: 'phone', celular: 'phone',
};

// Renombra las claves de cada fila usando el mapa de aliases proporcionado.
// Las claves que no tienen alias pasan tal cual (no se pierden datos).
function normalizeRowKeys(
  rows: Record<string, unknown>[],
  aliases: Record<string, string>
): Record<string, unknown>[] {
  return rows.map((row) => {
    const normalized: Record<string, unknown> = {};
    for (const [rawKey, value] of Object.entries(row)) {
      const canonical = aliases[normalize(rawKey)] ?? rawKey;
      normalized[canonical] = value;
    }
    return normalized;
  });
}

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
    defval: '',   // celdas vacías → string vacío (no undefined)
    raw: false,   // todos los valores como string para validar antes de convertir
  });

  if (rows.length === 0) {
    throw new Error('El archivo está vacío o no tiene filas de datos.');
  }

  return rows;
}

// Extrae un string requerido; lanza error con número de fila si está vacío
function requireString(row: Record<string, unknown>, key: string, rowIndex: number): string {
  const value = String(row[key] ?? '').trim();
  if (!value) {
    throw new Error(`Fila ${rowIndex + 2}: la columna "${key}" es obligatoria y está vacía.`);
  }
  return value;
}

// Extrae un string opcional; devuelve undefined si está vacío
function optionalString(row: Record<string, unknown>, key: string): string | undefined {
  const value = String(row[key] ?? '').trim();
  return value || undefined;
}

// --- Parsers públicos ---

// Parsea un Excel de estudiantes.
// Acepta encabezados en inglés o español (ej: "firstName" = "Nombres").
// Requeridos: firstName, lastName, email, cui, paymentCode
// Opcionales: dni, phone
export async function parseStudentsExcel(file: File): Promise<ImportStudentRow[]> {
  const rawRows = await readExcelRows(file);
  const rows = normalizeRowKeys(rawRows, STUDENT_ALIASES);

  return rows.map((row, i) => {
    return {
      firstName:   requireString(row, 'firstName', i),
      lastName:    requireString(row, 'lastName', i),
      email:       requireString(row, 'email', i),
      cui:         requireString(row, 'cui', i),
      paymentCode: requireString(row, 'paymentCode', i),
      dni:         optionalString(row, 'dni'),
      phone:       optionalString(row, 'phone'),
    };
  });
}

// Parsea un Excel de docentes.
// Acepta encabezados en inglés o español (ej: "type" = "Tipo").
// Requeridos: firstName, lastName, email, type (Interno | Externo)
// Opcionales: dni, category, regime, academicDegree, specialty, phone
export async function parseTeachersExcel(file: File): Promise<ImportTeacherRow[]> {
  const VALID_TYPES     = ['Interno', 'Externo'] as const;
  const VALID_CATEGORIES = ['Principal', 'Asociado', 'Auxiliar'] as const;
  const VALID_DEGREES   = ['Magister', 'Doctor'] as const;

  const rawRows = await readExcelRows(file);
  const rows = normalizeRowKeys(rawRows, TEACHER_ALIASES);

  return rows.map((row, i) => {
    const type = requireString(row, 'type', i);
    if (!VALID_TYPES.includes(type as (typeof VALID_TYPES)[number])) {
      throw new Error(
        `Fila ${i + 2}: "type" debe ser "Interno" o "Externo" (valor: "${type}").`
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
      firstName:      requireString(row, 'firstName', i),
      lastName:       requireString(row, 'lastName', i),
      email:          requireString(row, 'email', i),
      type:           type as 'Interno' | 'Externo',
      dni:            optionalString(row, 'dni'),
      category:       category as ImportTeacherRow['category'],
      regime:         optionalString(row, 'regime'),
      academicDegree: academicDegree as ImportTeacherRow['academicDegree'],
      specialty:      optionalString(row, 'specialty'),
      phone:          optionalString(row, 'phone'),
    };
  });
}
