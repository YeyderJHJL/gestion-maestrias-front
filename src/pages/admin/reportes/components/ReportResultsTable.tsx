import { StatusBadge } from '../../../../components/StatusBadge';
import type { ResultadosReporte } from '../hooks/useReportes';

interface ReportResultsTableProps {
  resultados: ResultadosReporte;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function rowClass(i: number) {
  return i % 2 === 0 ? 'bg-surface' : 'bg-surface-alt';
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide">
      {children}
    </th>
  );
}

function Td({
  children,
  muted = false,
}: {
  children: React.ReactNode;
  muted?: boolean;
}) {
  return (
    <td className={`px-6 py-4 text-sm ${muted ? 'text-text-muted' : 'text-text'}`}>
      {children}
    </td>
  );
}

function resolveEstado(stateCode: string): 'aprobado' | 'desaprobado' | 'pendiente' | 'matriculado' | 'en-revision' | 'validado' | 'rechazado' {
  const map: Record<string, ReturnType<typeof resolveEstado>> = {
    APPROVED: 'aprobado',
    PASSED: 'aprobado',
    FAILED: 'desaprobado',
    PENDING: 'pendiente',
    ENROLLED: 'matriculado',
    IN_REVIEW: 'en-revision',
    VALIDATED: 'validado',
    REJECTED: 'rechazado',
  };
  return map[stateCode] ?? 'pendiente';
}

function formatMonto(monto: number) {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
  }).format(monto);
}

function formatFecha(fecha: string | null) {
  if (!fecha) return <span className="text-text-muted italic">Sin fecha</span>;
  return new Date(fecha).toLocaleDateString('es-PE');
}

// ── Tabla vacía ───────────────────────────────────────────────────────────────

function TablaVacia({ mensaje }: { mensaje: string }) {
  return (
    <p className="text-center text-text-muted py-8 text-sm">{mensaje}</p>
  );
}

// ── Sub-tablas por tipo ───────────────────────────────────────────────────────

function TablaAlumnosPorPromocion({ filas }: { filas: ResultadosReporte & { tipo: 'alumnos-por-promocion' } extends infer R ? R extends { filas: infer F } ? F : never : never }) {
  if (!filas.length) return <TablaVacia mensaje="No hay alumnos registrados para esta promoción." />;
  return (
    <table className="w-full">
      <thead className="bg-primary text-white">
        <tr><Th>Nombre</Th><Th>Email</Th><Th>DNI</Th><Th>CUI</Th><Th>Código pago</Th><Th>Estado</Th></tr>
      </thead>
      <tbody className="divide-y divide-border">
        {filas.map((f, i) => (
          <tr key={f.id} className={rowClass(i)}>
            <Td>{f.nombre}</Td>
            <Td muted>{f.email}</Td>
            <Td muted>{f.dni ?? '—'}</Td>
            <Td muted>{f.cui}</Td>
            <Td muted>{f.codigoPago}</Td>
            <Td>
              {f.estado ? (
                <StatusBadge variant={f.estado === 'Reactualizacion' ? 'reactualizacion' : 'activo'}>
                  {f.estado}
                </StatusBadge>
              ) : '—'}
            </Td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function TablaCursosPorDocente({ filas }: { filas: any[] }) {
  if (!filas.length) return <TablaVacia mensaje="Este docente no tiene cursos asignados." />;
  return (
    <table className="w-full">
      <thead className="bg-primary text-white">
        <tr><Th>Código</Th><Th>Nombre del curso</Th><Th>Semestre</Th></tr>
      </thead>
      <tbody className="divide-y divide-border">
        {filas.map((f, i) => (
          <tr key={f.courseId} className={rowClass(i)}>
            <Td muted>{f.codigo}</Td>
            <Td>{f.nombre}</Td>
            <Td muted>{f.semestre}</Td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function TablaEstudiantesPorCurso({ filas }: { filas: any[] }) {
  if (!filas.length) return <TablaVacia mensaje="No hay estudiantes matriculados en este curso." />;
  return (
    <table className="w-full">
      <thead className="bg-primary text-white">
        <tr><Th>Nombre</Th><Th>Email</Th><Th>Fecha matrícula</Th><Th>Estado</Th></tr>
      </thead>
      <tbody className="divide-y divide-border">
        {filas.map((f, i) => (
          <tr key={f.studentId} className={rowClass(i)}>
            <Td>{f.nombre}</Td>
            <Td muted>{f.email}</Td>
            <Td muted>{formatFecha(f.fechaMatricula)}</Td>
            <Td>
              <StatusBadge variant={resolveEstado(f.estadoMatricula.toUpperCase())}>
                {f.estadoMatricula}
              </StatusBadge>
            </Td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function TablaNotasPorEstudiante({ filas }: { filas: any[] }) {
  if (!filas.length) return <TablaVacia mensaje="Este estudiante no tiene notas registradas." />;
  return (
    <table className="w-full">
      <thead className="bg-primary text-white">
        <tr><Th>Código</Th><Th>Curso</Th><Th>Nota</Th><Th>Estado</Th></tr>
      </thead>
      <tbody className="divide-y divide-border">
        {filas.map((f, i) => (
          <tr key={f.gradeId} className={rowClass(i)}>
            <Td muted>{f.codigoCurso}</Td>
            <Td>{f.curso}</Td>
            <Td>
              <span className="font-bold text-base">{f.nota}</span>
              <span className="text-text-muted text-xs"> / 20</span>
            </Td>
            <Td>
              <StatusBadge variant={resolveEstado(f.estado.toUpperCase())}>
                {f.estado}
              </StatusBadge>
            </Td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function TablaPagosPorEstudiante({ filas }: { filas: any[] }) {
  if (!filas.length) return <TablaVacia mensaje="No se encontraron pagos para el estudiante buscado." />;
  return (
    <table className="w-full">
      <thead className="bg-primary text-white">
        <tr><Th>Estudiante</Th><Th>Código pago</Th><Th>Concepto</Th><Th>Monto</Th><Th>Fecha pago</Th><Th>Estado</Th></tr>
      </thead>
      <tbody className="divide-y divide-border">
        {filas.map((f, i) => (
          <tr key={f.voucherId} className={rowClass(i)}>
            <Td>{f.estudiante}</Td>
            <Td muted>{f.codigoPago}</Td>
            <Td muted>{f.concepto}</Td>
            <Td><span className="font-semibold">{formatMonto(f.monto)}</span></Td>
            <Td muted>{formatFecha(f.fechaPago)}</Td>
            <Td>
              <StatusBadge variant={resolveEstado(f.estado.toUpperCase())}>
                {f.estado}
              </StatusBadge>
            </Td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function TablaPagosPendientesValidados({ filas }: { filas: any[] }) {
  if (!filas.length) return <TablaVacia mensaje="No hay pagos para el estado seleccionado." />;
  return (
    <table className="w-full">
      <thead className="bg-primary text-white">
        <tr><Th>Estudiante</Th><Th>Concepto</Th><Th>Monto</Th><Th>Fecha pago</Th><Th>Estado</Th><Th>Observación</Th></tr>
      </thead>
      <tbody className="divide-y divide-border">
        {filas.map((f, i) => (
          <tr key={f.voucherId} className={rowClass(i)}>
            <Td>{f.estudiante}</Td>
            <Td muted>{f.concepto}</Td>
            <Td><span className="font-semibold">{formatMonto(f.monto)}</span></Td>
            <Td muted>{formatFecha(f.fechaPago)}</Td>
            <Td>
              <StatusBadge variant={resolveEstado(f.estado.toUpperCase())}>
                {f.estado}
              </StatusBadge>
            </Td>
            <Td muted>{f.observacion ?? '—'}</Td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// ── Componente principal ──────────────────────────────────────────────────────

export function ReportResultsTable({ resultados }: ReportResultsTableProps) {
  if (!resultados) return null;

  return (
    <div className="bg-surface border border-border rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        {resultados.tipo === 'alumnos-por-promocion' && (
          <TablaAlumnosPorPromocion filas={resultados.filas} />
        )}
        {resultados.tipo === 'cursos-por-docente' && (
          <TablaCursosPorDocente filas={resultados.filas} />
        )}
        {resultados.tipo === 'estudiantes-por-curso' && (
          <TablaEstudiantesPorCurso filas={resultados.filas} />
        )}
        {resultados.tipo === 'notas-por-estudiante' && (
          <TablaNotasPorEstudiante filas={resultados.filas} />
        )}
        {resultados.tipo === 'pagos-por-estudiante' && (
          <TablaPagosPorEstudiante filas={resultados.filas} />
        )}
        {resultados.tipo === 'pagos-pendientes-validados' && (
          <TablaPagosPendientesValidados filas={resultados.filas} />
        )}
      </div>
    </div>
  );
}
