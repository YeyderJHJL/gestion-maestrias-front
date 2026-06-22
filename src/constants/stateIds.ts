// IDs de la tabla `states` del backend (seeded en DatabaseSeeder).
// Deben coincidir con el orden de seedState() en el backend.
// Si el backend cambia el seed, actualizar estos valores.

export const VOUCHER_STATE = {
  UPLOADED:  1,
  VALIDATED: 2,
  OBSERVED:  3,
  REJECTED:  4,
} as const;

export const ENROLLMENT_STATE = {
  ENROLLED:  5,
  WITHDRAWN: 6,
  CANCELLED: 7,
} as const;

export const GRADE_STATE = {
  REGISTERED: 8,
  MODIFIED:   9,
  CANCELLED:  10,
} as const;
