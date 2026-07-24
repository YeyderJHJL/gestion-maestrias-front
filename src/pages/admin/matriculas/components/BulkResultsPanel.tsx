import { CheckCircle2Icon, AlertTriangleIcon, UserCheckIcon } from 'lucide-react';
import { StatusBadge } from '../../../../components/StatusBadge';
import { EnrollmentBulkResponse, EnrollmentBulkRowResult } from '../../../../services/enrollmentsApiService';
import { StudentResponse } from '../../../../services/studentsApiService';

interface Props {
  result: EnrollmentBulkResponse;
  students: StudentResponse[];
  onBack: () => void;
}

function studentName(studentId: string, students: StudentResponse[]): string {
  const s = students.find((st) => st.id === studentId);
  return s ? `${s.firstName} ${s.lastName}` : 'Desconocido';
}

function studentEmail(studentId: string, students: StudentResponse[]): string {
  const s = students.find((st) => st.id === studentId);
  return s?.email ?? '—';
}

export function BulkResultsPanel({ result, students, onBack }: Props) {
  const enrolled: EnrollmentBulkRowResult[] = [];
  const rejected: EnrollmentBulkRowResult[] = [];
  result.results.forEach((r) => {
    if (r.status === 'ENROLLED') enrolled.push(r);
    else rejected.push(r);
  });

  return (
    <div className="space-y-6">
      {/* Tarjetas de resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-surface border border-border rounded-lg p-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-text-muted font-semibold uppercase">
              Total procesados
            </p>
            <p className="text-2xl font-bold text-text mt-1">{result.totalRows}</p>
          </div>
          <div className="p-2.5 bg-primary/10 rounded-lg text-primary">
            <UserCheckIcon className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-surface border border-success/20 rounded-lg p-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-success font-semibold uppercase">
              Matriculados
            </p>
            <p className="text-2xl font-bold text-success mt-1">{result.enrolled}</p>
          </div>
          <div className="p-2.5 bg-success/15 rounded-lg text-success">
            <CheckCircle2Icon className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-surface border border-accent/20 rounded-lg p-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-accent font-semibold uppercase">
              Rechazados
            </p>
            <p className="text-2xl font-bold text-accent mt-1">{result.rejected}</p>
          </div>
          <div className="p-2.5 bg-accent/15 rounded-lg text-accent">
            <AlertTriangleIcon className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Detalle: exitosos y rechazados */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Exitosos */}
        <div className="bg-surface border border-border rounded-lg p-5 space-y-4">
          <div className="flex items-center gap-2 text-success font-semibold">
            <CheckCircle2Icon className="w-4 h-4" />
            <h3>{result.enrolled} alumno(s) matriculado(s)</h3>
          </div>
          {enrolled.length === 0 ? (
            <p className="text-sm text-text-muted text-center py-6">
              Ningún alumno fue matriculado.
            </p>
          ) : (
            <div className="divide-y divide-border border border-border rounded-lg overflow-hidden max-h-64 overflow-y-auto">
              {enrolled.map((row, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center p-3 text-sm hover:bg-surface-alt transition-colors"
                >
                  <div>
                    <p className="font-semibold text-text">
                      {studentName(row.studentId, students)}
                    </p>
                    <p className="text-xs text-text-muted">
                      {studentEmail(row.studentId, students)}
                    </p>
                  </div>
                  <StatusBadge variant="activo">Matriculado</StatusBadge>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Rechazados */}
        <div className="bg-surface border border-border rounded-lg p-5 space-y-4">
          <div className="flex items-center gap-2 text-accent font-semibold">
            <AlertTriangleIcon className="w-4 h-4" />
            <h3>{result.rejected} alumno(s) rechazado(s)</h3>
          </div>
          {rejected.length === 0 ? (
            <div className="text-center py-8 text-text-muted text-sm">
              Sin rechazos — todos fueron matriculados correctamente.
            </div>
          ) : (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {rejected.map((row, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 bg-accent/5 border border-accent/20 rounded-lg"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-text">
                      {studentName(row.studentId, students)}
                    </p>
                    {row.observations && row.observations.length > 0 ? (
                      <ul className="mt-1 space-y-0.5">
                        {row.observations.map((obs, i) => (
                          <li key={i} className="text-xs text-text-muted flex items-start gap-1">
                            <span className="text-accent mt-0.5">•</span>
                            {obs}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs text-text-muted mt-1">Motivo no especificado</p>
                    )}
                  </div>
                  <span className="px-2 py-0.5 rounded bg-accent/15 text-accent text-xs font-semibold shrink-0">
                    Rechazado
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Botón volver */}
      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors font-semibold text-sm"
        >
          Nueva matrícula masiva
        </button>
      </div>
    </div>
  );
}