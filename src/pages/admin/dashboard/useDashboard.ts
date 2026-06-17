import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { ActivityItem, DashboardStats } from '../../../services/dashboardApiService';

// ─────────────────────────────────────────────────────────────────────────────
// MOCKS ESTÁTICOS — reemplazar por llamada real al descomentar una opción abajo
// ─────────────────────────────────────────────────────────────────────────────
const MOCK_STATS: DashboardStats = {
  enrolledStudents: 48,
  activeCourses: 12,
  pendingVouchers: 7,
};

const MOCK_ACTIVITY: ActivityItem[] = [
  { type: 'voucher', description: 'Voucher de matrícula subido',       actor: 'Ana Torres',      timestamp: '2025-06-09T10:30:00Z' },
  { type: 'silabo',  description: 'Sílabo actualizado — Estadística',  actor: 'Dr. Ramos',       timestamp: '2025-06-09T09:15:00Z' },
  { type: 'nota',    description: 'Notas registradas — Módulo III',    actor: 'Mg. Flores',      timestamp: '2025-06-08T16:45:00Z' },
  { type: 'voucher', description: 'Voucher de pensión subido',         actor: 'Carlos Quispe',   timestamp: '2025-06-08T14:20:00Z' },
  { type: 'silabo',  description: 'Sílabo subido — Gestión Pública',   actor: 'Dr. Villanueva',  timestamp: '2025-06-07T11:00:00Z' },
];

// ─────────────────────────────────────────────────────────────────────────────
// OPCIÓN A — Endpoints existentes, sin cambio en back (descomentar para activar)
// 3 llamadas paralelas: listUsers + listCourses + listVouchers
// Over-fetching: trae arrays completos para derivar conteos en el front
// ─────────────────────────────────────────────────────────────────────────────
// import { listUsers } from '../../../services/usersApiService';
// import { listCourses } from '../../../services/coursesApiService';
// import { listVouchers } from '../../../services/vouchersApiService';
//
// async function loadOptionA(token: string): Promise<{ stats: DashboardStats; activity: ActivityItem[] }> {
//   const [usersRes, coursesRes, vouchersRes] = await Promise.allSettled([
//     listUsers(token),
//     listCourses(token),
//     listVouchers(token),
//   ]);
//   const users    = usersRes.status    === 'fulfilled' ? usersRes.value    : [];
//   const courses  = coursesRes.status  === 'fulfilled' ? coursesRes.value  : [];
//   const vouchers = vouchersRes.status === 'fulfilled' ? vouchersRes.value : [];
//   const today = new Date().toISOString();
//   const stats: DashboardStats = {
//     enrolledStudents: users.filter(u => u.role === 'STUDENT' && u.active).length,
//     activeCourses:    courses.filter(c => c.startDate <= today && today <= c.endDate).length,
//     pendingVouchers:  vouchers.filter(v => v.stateCode === 'PENDING').length,
//   };
//   const voucherItems: ActivityItem[] = vouchers.map(v => ({
//     type: 'voucher' as const,
//     description: `Voucher ${v.concept}`,
//     actor: v.studentName,
//     timestamp: v.uploadedAt,
//   }));
//   const silaboItems: ActivityItem[] = courses
//     .filter(c => c.syllabusUrl)
//     .map(c => ({
//       type: 'silabo' as const,
//       description: `Sílabo de ${c.name}`,
//       actor: c.programName,
//       timestamp: c.updatedAt,
//     }));
//   // Notas: pendiente de endpoint GET /v1/grades/recent → agregar aquí
//   const activity = [...voucherItems, ...silaboItems]
//     .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
//     .slice(0, 8);
//   return { stats, activity };
// }

// ─────────────────────────────────────────────────────────────────────────────
// OPCIÓN B — Endpoint único GET /v1/dashboard/summary (recomendada, requiere back)
// ─────────────────────────────────────────────────────────────────────────────
// import { getDashboardSummary } from '../../../services/dashboardApiService';
//
// async function loadOptionB(token: string): Promise<{ stats: DashboardStats; activity: ActivityItem[] }> {
//   const summary = await getDashboardSummary(token);
//   return {
//     stats: {
//       enrolledStudents: summary.enrolledStudents,
//       activeCourses:    summary.activeCourses,
//       pendingVouchers:  summary.pendingVouchers,
//     },
//     activity: summary.recentActivity,
//   };
// }

// ─────────────────────────────────────────────────────────────────────────────
// ESTRATEGIA DE ACTUALIZACIÓN (aplicable a cualquier opción)
//
// OPCIÓN U1 — Visibility-based (recomendada, 0 background calls)
//   Recarga cuando el admin vuelve al tab desde otra ventana/app.
//   useEffect(() => {
//     load();
//     const onVisible = () => { if (document.visibilityState === 'visible') load(); };
//     document.addEventListener('visibilitychange', onVisible);
//     return () => document.removeEventListener('visibilitychange', onVisible);
//   }, [load]);
//
// OPCIÓN U2 — SSE push (back emite evento cuando docente/estudiante sube algo)
//   const BASE_URL = import.meta.env.VITE_API_URL ?? '/api';
//   const es = new EventSource(`${BASE_URL}/v1/dashboard/events?token=${token}`);
//   es.onmessage = () => load();
//   return () => es.close();
//   Requiere: back implemente SSE + emitir evento en cada acción relevante
//
// OPCIÓN U3 — Polling ciego cada N segundos → descartada
// ─────────────────────────────────────────────────────────────────────────────

export function useDashboard() {
  const { token } = useAuth();
  const [stats]    = useState<DashboardStats>(MOCK_STATS);
  const [activity] = useState<ActivityItem[]>(MOCK_ACTIVITY);

  // TODO: reemplazar useState por load() real (Opción A o B)
  //       y añadir estrategia de actualización (U1 o U2)
  const reload = useCallback(() => {
    void token; // se usará cuando se conecte la API
  }, [token]);

  useEffect(() => { reload(); }, [reload]);

  return {
    stats,
    activity,
    loading: false,
    error: null as string | null,
    reload,
  };
}
