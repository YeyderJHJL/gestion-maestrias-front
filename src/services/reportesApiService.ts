import { apiFetch } from './api';
import type { StudentResponse } from './studentsApiService';
import type { EnrollmentResponse } from './enrollmentsApiService';
import type { AssignmentResponse } from './assignmentsApiService';
import type {
  FilaAlumnoPorPromocion,
  FilaCursoPorDocente,
  FilaEstudiantePorCurso,
  FilaNotaPorEstudiante,
  FilaPagoPorEstudiante,
  FilaPagoPendienteValidado,
} from '../pages/admin/reportes/types/reportes.types';
 
// ── Tipos locales (schemas del back no exportados en los servicios actuales) ──
 
interface GradeResponse {
  id: string;
  enrollmentId: string;
  studentId: string;
  studentEmail: string;
  courseId: string;
  courseCode: string;
  courseName: string;
  stateId: number;
  stateCode: string;
  stateName: string;
  value: number;
  createdAt: string;
  updatedAt: string;
}
 
interface VoucherResponse {
  id: string;
  paymentId: string;
  paymentNumber: number;
  paymentConcept: string;
  paymentAmount: number;
  paymentDate: string | null;
  studentName: string;
  studentEmail: string;
  studentPaymentCode: string;
  stateId: number;
  stateCode: string;
  stateName: string;
  observation?: string;
  createdAt: string;
  updatedAt: string;
}
 
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string | null;
}
 
// ── Helpers de mapeo ──────────────────────────────────────────────────────────
 
function mapStudent(s: StudentResponse): FilaAlumnoPorPromocion {
  return {
    id: s.id,
    nombre: `${s.firstName} ${s.lastName}`,
    email: s.email,
    dni: s.dni,
    cui: s.cui,
    codigoPago: s.paymentCode,
    estado: s.status,
    promocion: s.yearPromotion,
  };
}
 
function mapAssignmentToCurso(a: AssignmentResponse): FilaCursoPorDocente {
  return {
    courseId: a.courseId,
    codigo: a.courseCode,
    nombre: a.courseName,
    semestre: `${a.semesterYear} - ${a.semesterCode}`,
  };
}
 
function mapEnrollmentToEstudiante(e: EnrollmentResponse): FilaEstudiantePorCurso {
  return {
    studentId: e.studentId,
    nombre: e.studentName,
    email: e.studentEmail,
    estadoMatricula: e.stateName,
    fechaMatricula: e.enrollmentDate,
  };
}
 
function mapGrade(g: GradeResponse): FilaNotaPorEstudiante {
  return {
    gradeId: g.id,
    curso: g.courseName,
    codigoCurso: g.courseCode,
    nota: g.value,
    estado: g.stateName,
  };
}
 
function mapVoucherToPago(v: VoucherResponse): FilaPagoPorEstudiante {
  return {
    voucherId: v.id,
    estudiante: v.studentName,
    email: v.studentEmail,
    codigoPago: v.studentPaymentCode,
    concepto: v.paymentConcept,
    monto: v.paymentAmount,
    fechaPago: v.paymentDate,
    estado: v.stateName,
  };
}
 
function mapVoucherToPendiente(v: VoucherResponse): FilaPagoPendienteValidado {
  return {
    voucherId: v.id,
    estudiante: v.studentName,
    email: v.studentEmail,
    concepto: v.paymentConcept,
    monto: v.paymentAmount,
    fechaPago: v.paymentDate,
    estado: v.stateName,
    observacion: v.observation,
  };
}
 
// ── Funciones de reporte ──────────────────────────────────────────────────────
 
/** Reporte 1: Alumnos por promoción — GET /v1/students/promotions/{year} */
export async function getAlumnosPorPromocion(
  token: string,
  year: number
): Promise<FilaAlumnoPorPromocion[]> {
  const res = await apiFetch<ApiResponse<StudentResponse[]>>(
    `/v1/students/promotions/${year}`,
    token
  );
  return res.data.map(mapStudent);
}
 
/** Reporte 2: Cursos por docente — GET /v1/assignments/teachers/{teacherId} */
export async function getCursosPorDocente(
  token: string,
  teacherId: string
): Promise<FilaCursoPorDocente[]> {
  const res = await apiFetch<ApiResponse<AssignmentResponse[]>>(
    `/v1/assignments/teachers/${teacherId}`,
    token
  );
  return res.data.map(mapAssignmentToCurso);
}
 
/** Reporte 3: Estudiantes por curso — GET /v1/courses/{id}/students */
export async function getEstudiantesPorCurso(
  token: string,
  courseId: string
): Promise<FilaEstudiantePorCurso[]> {
  const res = await apiFetch<ApiResponse<EnrollmentResponse[]>>(
    `/v1/courses/${courseId}/students`,
    token
  );
  return res.data.map(mapEnrollmentToEstudiante);
}
 
/** Reporte 4: Notas por estudiante — GET /v1/grades (filtrado cliente) */
export async function getNotasPorEstudiante(
  token: string,
  studentId: string
): Promise<FilaNotaPorEstudiante[]> {
  // TODO: si el back expone GET /v1/grades?studentId=..., usar ese filtro.
  const res = await apiFetch<ApiResponse<GradeResponse[]>>('/v1/grades', token);
  return res.data
    .filter((g) => g.studentId === studentId)
    .map(mapGrade);
}
 
/** Reporte 5: Pagos por estudiante — GET /v1/vouchers (filtrado cliente por nombre) */
export async function getPagosPorEstudiante(
  token: string,
  studentNameSearch: string
): Promise<FilaPagoPorEstudiante[]> {
  // TODO: cuando el back exponga GET /v1/payments?studentId=... (admin), migrar.
  const res = await apiFetch<ApiResponse<VoucherResponse[]>>('/v1/vouchers', token);
  const search = studentNameSearch.toLowerCase().trim();
  const filtered = search
    ? res.data.filter(
        (v) =>
          v.studentName.toLowerCase().includes(search) ||
          v.studentEmail.toLowerCase().includes(search) ||
          v.studentPaymentCode.toLowerCase().includes(search)
      )
    : res.data;
  return filtered.map(mapVoucherToPago);
}
 
/** Reporte 6: Pagos pendientes / validados — GET /v1/vouchers (filtrado cliente por estado) */
export async function getPagosPendientesValidados(
  token: string,
  estado: 'PENDING' | 'VALIDATED' | 'TODOS'
): Promise<FilaPagoPendienteValidado[]> {
  const res = await apiFetch<ApiResponse<VoucherResponse[]>>('/v1/vouchers', token);
  const filtered =
    estado === 'TODOS'
      ? res.data
      : res.data.filter((v) => v.stateCode === estado);
  return filtered.map(mapVoucherToPendiente);
}