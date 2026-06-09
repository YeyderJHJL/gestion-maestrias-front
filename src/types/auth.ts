export type UserRole = 'ADMIN' | 'TEACHER' | 'STUDENT' | 'COORDINATOR';

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  dni?: string;
  role: UserRole;
  active: boolean;
  // Presente si role === 'STUDENT'
  studentId?: string;
  cui?: string;
  paymentCode?: string;
  promotionName?: string;
  // Presente si role === 'TEACHER'
  teacherId?: string;
  teacherCategory?: string;
  teacherRegime?: string;
  academicDegree?: string;
  teacherType?: string;
  specialty?: string;
  phone?: string;
}
