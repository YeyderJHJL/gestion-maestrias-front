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

interface StudentData {
  id: string;
  cui: string;
  paymentCode: string;
  promotionName: string;
}

interface TeacherData {
  id: string;
  code: string;
  specialty: string;
  phone: string;
  hireDate: string;
  status: string;
}

interface UserResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  dni?: string;
  role: string;
  active: boolean;
  student?: StudentData;
  teacher?: TeacherData;
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

export async function buildAuthUser(token: string): Promise<AuthUser> {
  const user = await getMe(token);
  const base: AuthUser = {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    dni: user.dni,
    role: normalizeRole(user.role),
    active: user.active,
  };

  if (user.student) {
    return {
      ...base,
      studentId: user.student.id,
      cui: user.student.cui,
      paymentCode: user.student.paymentCode,
      promotionName: user.student.promotionName,
    };
  }

  if (user.teacher) {
    return {
      ...base,
      teacherId: user.teacher.id,
      teacherCode: user.teacher.code,
      specialty: user.teacher.specialty,
      phone: user.teacher.phone,
      hireDate: user.teacher.hireDate,
      teacherStatus: user.teacher.status,
    };
  }

  return base;
}
