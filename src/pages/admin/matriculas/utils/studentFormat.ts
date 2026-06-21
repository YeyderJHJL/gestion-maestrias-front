// Helpers de presentación para el módulo de matrículas/estudiantes.

/** Formatea una fecha ISO (YYYY-MM-DD) a texto legible en español. Ej: "20 jun. 2026" */
export function formatDate(dateStr: string) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('es-PE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

/** Obtiene las iniciales de un estudiante a partir de nombre y apellido. Ej: "JC" */
export function getInitials(firstName: string, lastName: string) {
  return `${firstName[0] ?? ''}${lastName[0] ?? ''}`.toUpperCase();
}

/** Mapea el estado del estudiante a la variante visual de StatusBadge */
export const STUDENT_STATUS_VARIANT = {
  Regular: 'matriculado',
  Reactualizacion: 'reactualizacion',
} as const satisfies Record<string, 'matriculado' | 'reactualizacion'>;

/** Traduce el estado interno del estudiante a una etiqueta legible */
export function studentStatusLabel(status: string) {
  return status === 'Reactualizacion' ? 'Reactualización' : status;
}
