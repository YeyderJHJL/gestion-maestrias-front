import { apiFetch } from './api';
import { AuthUser, UserRole } from '../types/auth';

const ROLE_MAP: Record<string, UserRole> = {
  ADMIN: 'ADMIN', Administrador: 'ADMIN',
  TEACHER: 'TEACHER', Docente: 'TEACHER',
  STUDENT: 'STUDENT', Estudiante: 'STUDENT',
  COORDINATOR: 'COORDINATOR', Coordinador: 'COORDINATOR',
};

function normalizeRole(raw: string): UserRole {
  return ROLE_MAP[raw] ?? (raw as UserRole);
}

interface UserResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  active: boolean;
}

interface StudentResponse {
  id: string;
  cui: string;
  paymentCode: string;
  promotionName: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string | null;
}

export async function getMe(token: string): Promise<UserResponse> {
  const res = await apiFetch<ApiResponse<UserResponse>>('/v1/users/me', token);
  return res.data;
}

export async function getStudentProfile(token: string): Promise<StudentResponse> {
  const res = await apiFetch<ApiResponse<StudentResponse>>('/v1/students/me', token);
  return res.data;
}

export async function buildAuthUser(token: string): Promise<AuthUser> {
  const user = await getMe(token);
  const base: AuthUser = {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: normalizeRole(user.role),
    active: user.active,
  };

  if (user.role === 'STUDENT') {
    const student = await getStudentProfile(token);
    return {
      ...base,
      studentId: student.id,
      cui: student.cui,
      paymentCode: student.paymentCode,
      promotionName: student.promotionName,
    };
  }

  return base;
}
