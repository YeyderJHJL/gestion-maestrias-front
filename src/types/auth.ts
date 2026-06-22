export type UserRole = 'ADMIN' | 'TEACHER' | 'STUDENT' | 'COORDINATOR';

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  dni?: string;
  role: UserRole;
  active: boolean;
  // Presente si role === 'Estudiante'
  studentId?: string;
  cui?: string;
  paymentCode?: string;
  yearPromotion?: number;
  studentStatus?: 'Regular' | 'Reactualizacion';
  // Presente si role === 'Docente'
  teacherId?: string;
  teacherCategory?: string;
  teacherRegime?: string;
  academicDegree?: string;
  teacherType?: string;
  specialty?: string;
  university?: string;
  phone?: string;
}
