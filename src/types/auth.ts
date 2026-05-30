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
  teacherCode?: string;
  specialty?: string;
  phone?: string;
  hireDate?: string;
  teacherStatus?: string;
}
