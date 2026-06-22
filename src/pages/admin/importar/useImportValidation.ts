import type { ImportStudentRow, ImportTeacherRow } from '../../../services/importApiService';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateStudentRow(row: ImportStudentRow): string[] {
  const warns: string[] = [];
  if (!EMAIL_REGEX.test(row.email))
    warns.push(`Correo "${row.email}" no tiene formato válido`);
  if (/\D/.test(row.dni))
    warns.push(`DNI "${row.dni}" solo debe contener dígitos`);
  else if (row.dni.length !== 8)
    warns.push(`DNI "${row.dni}" debe tener 8 dígitos (tiene ${row.dni.length})`);
  if (/\D/.test(row.cui))
    warns.push(`CUI "${row.cui}" solo debe contener dígitos`);
  else if (row.cui.length < 6 || row.cui.length > 12)
    warns.push(`CUI "${row.cui}" debe tener entre 6 y 12 dígitos (tiene ${row.cui.length})`);
  return warns;
}

export function validateTeacherRow(row: ImportTeacherRow): string[] {
  const warns: string[] = [];
  if (!EMAIL_REGEX.test(row.email))
    warns.push(`Correo "${row.email}" no tiene formato válido`);
  if (row.dni && /\D/.test(row.dni))
    warns.push(`DNI "${row.dni}" solo debe contener dígitos`);
  else if (row.dni && row.dni.length !== 8)
    warns.push(`DNI "${row.dni}" debe tener 8 dígitos (tiene ${row.dni.length})`);
  if (row.type === 'Externo' && !row.university)
    warns.push('Docente externo sin universidad asignada');
  if (row.type === 'Interno' && !row.category)
    warns.push('Docente interno sin categoría asignada');
  return warns;
}
