export type UserRole = 'ADMIN' | 'TEACHER' | 'STUDENT' | 'COORDINATOR';

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  active: boolean;
  // Solo presente si role === 'STUDENT'
  studentId?: string;
  cui?: string;
  paymentCode?: string;
  promotionName?: string;
}
