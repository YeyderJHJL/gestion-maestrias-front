import { apiFetch } from './api';

// ─────────────────────────────────────────────────────────────────────────────
// TIPOS COMPARTIDOS
// ─────────────────────────────────────────────────────────────────────────────
export type ActivityType = 'voucher' | 'silabo' | 'nota';

export interface ActivityItem {
  type: ActivityType;
  description: string;
  actor: string;
  timestamp: string; // ISO-8601
  href?: string;
  fileId?: string;
}

export interface DashboardStats {
  enrolledStudents: number;
  activeCourses: number;
  pendingVouchers: number;
}

export interface DashboardSummary {
  enrolledStudents: number;
  activeCourses: number;
  pendingVouchers: number;
  recentActivity: ActivityItem[];
}

// ─────────────────────────────────────────────────────────────────────────────
// OPCIÓN B — Endpoint único GET /v1/dashboard/summary (requiere back)
//
// Propuesta de respuesta del back:
// {
//   "success": true,
//   "data": {
//     "enrolledStudents": 48,
//     "activeCourses": 12,
//     "pendingVouchers": 7,
//     "recentActivity": [
//       { "type": "voucher"|"silabo"|"nota", "description": "...", "actor": "...", "timestamp": "ISO" }
//     ]
//   }
// }
//
// SQL orientativo en el back:
//   SELECT
//     (SELECT COUNT(*) FROM users WHERE role='STUDENT' AND active=true)          AS enrolledStudents,
//     (SELECT COUNT(*) FROM courses WHERE start_date<=NOW() AND end_date>=NOW()) AS activeCourses,
//     (SELECT COUNT(*) FROM vouchers WHERE state='PENDING')                      AS pendingVouchers
//   + UNION de últimas 8 actividades (vouchers, courses.syllabus_url, grades)
//
// Índices necesarios: users(role,active), courses(start_date,end_date),
//                     vouchers(state), vouchers(uploaded_at), courses(syllabus_url,updated_at)
// ─────────────────────────────────────────────────────────────────────────────
// interface ApiResponse<T> { success: boolean; data: T; message: string | null }
//
// export async function getDashboardSummary(token: string): Promise<DashboardSummary> {
//   const res = await apiFetch<ApiResponse<DashboardSummary>>('/v1/dashboard/summary', token);
//   return res.data;
// }

// eslint-disable-next-line @typescript-eslint/no-unused-vars
void apiFetch; // evita error de import no utilizado mientras el endpoint esté pendiente
