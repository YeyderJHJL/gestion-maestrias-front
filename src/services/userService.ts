import { apiFetch } from './api';
import { AuthUser, UserRole } from '../types/auth';

const ROLE_MAP: Record<string, UserRole> = {
  Administrador: 'Administrador',
  Docente: 'Docente',
  Estudiante: 'Estudiante',
  Coordinador: 'Coordinador',
};

function normalizeRole(raw: string): UserRole {
  return ROLE_MAP[raw] ?? (raw as UserRole);
}

interface StudentData {
  id: string;
  cui: string;
  paymentCode: string;
  yearPromotion: number;
  status?: 'Regular' | 'Reactualizacion';
}

interface TeacherData {
  id: string;
  category: string;
  regime: string;
  academicDegree: string;
  specialty: string;
  type: string;
  phone: string;
  university?: string;
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
      yearPromotion: user.student.yearPromotion,
      studentStatus: user.student.status,
    };
  }

  if (user.teacher) {
    return {
      ...base,
      teacherId: user.teacher.id,
      teacherCategory: user.teacher.category,
      teacherRegime: user.teacher.regime,
      academicDegree: user.teacher.academicDegree,
      teacherType: user.teacher.type,
      specialty: user.teacher.specialty,
      university: user.teacher.university,
      phone: user.teacher.phone,
    };
  }

  return base;
}
