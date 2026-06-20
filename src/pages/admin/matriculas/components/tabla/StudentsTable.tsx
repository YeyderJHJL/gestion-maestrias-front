import { SearchIcon, UsersIcon, FilterIcon } from 'lucide-react';
import { StudentRow } from '../hooks/useMatriculas';
import { StudentResponse, StudentFilters } from '../../../../services/studentsApiService';

interface Props {
  rows: StudentRow[];
  loading: boolean;
  search: string;
  onSearchChange: (v: string) => void;
  filterStatus: StudentFilters['status'] | '';
  onFilterStatusChange: (v: StudentFilters['status'] | '') => void;
  filterYear: number | '';
  onFilterYearChange: (v: number | '') => void;
  promotionYears: number[];
  selectedStudentId: string | null;
  onSelect: (student: StudentResponse) => void;
}

function getInitials(firstName: string, lastName: string) {
  return `${firstName[0] ?? ''}${lastName[0] ?? ''}`.toUpperCase();
}

function enrollmentCount(row: StudentRow) {
  return row.enrollments.length;
}

const STATUS_LABEL: Record<string, string> = {
  Regular: 'Regular',
  Reactualizacion: 'Reactualización',
};

const STATUS_CLASS: Record<string, string> = {
  Regular: 'bg-green-100 text-green-700 border border-green-200',
  Reactualizacion: 'bg-amber-100 text-amber-700 border border-amber-200',
};

export function StudentsTable({
  rows,
  loading,
  search,
  onSearchChange,
  filterStatus,
  onFilterStatusChange,
  filterYear,
  onFilterYearChange,
  promotionYears,
  selectedStudentId,
  onSelect,
}: Props) {
  return (
    <div className="flex flex-col h-full">
      {/* ── Filtros ─────────────────────────────────────────────────────── */}
      <div className="p-4 border-b border-border space-y-3 shrink-0">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Buscar por nombre, email, CUI…"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-surface text-text"
          />
        </div>
        <div className="flex gap-2">
          <div className="flex items-center gap-1 text-text-muted shrink-0">
            <FilterIcon className="w-3.5 h-3.5" />
            <span className="text-xs">Filtrar:</span>
          </div>
          <select
            value={filterStatus}
            onChange={(e) => onFilterStatusChange(e.target.value as StudentFilters['status'] | '')}
            className="flex-1 text-xs px-2 py-1.5 border border-border rounded-lg bg-surface text-text focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Todos los estados</option>
            <option value="Regular">Regular</option>
            <option value="Reactualizacion">Reactualización</option>
          </select>
          <select
            value={filterYear}
            onChange={(e) => onFilterYearChange(e.target.value ? Number(e.target.value) : '')}
            className="flex-1 text-xs px-2 py-1.5 border border-border rounded-lg bg-surface text-text focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Todas las promociones</option>
            {promotionYears.map((y) => (
              <option key={y} value={y}>Promoción {y}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Contador ────────────────────────────────────────────────────── */}
      <div className="px-4 py-2 border-b border-border shrink-0">
        <p className="text-xs text-text-muted flex items-center gap-1">
          <UsersIcon className="w-3.5 h-3.5" />
          {rows.length} estudiante{rows.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* ── Lista ───────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-text-muted text-sm">
            Cargando estudiantes…
          </div>
        ) : rows.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-text-muted text-sm gap-2">
            <UsersIcon className="w-8 h-8 opacity-30" />
            <span>Sin resultados</span>
          </div>
        ) : (
          <ul>
            {rows.map(({ student, enrollments }) => {
              const isSelected = student.id === selectedStudentId;
              return (
                <li key={student.id}>
                  <button
                    onClick={() => onSelect(student)}
                    className={`w-full text-left px-4 py-3 border-b border-border transition-colors flex items-center gap-3 ${
                      isSelected
                        ? 'bg-primary/10 border-l-4 border-l-primary'
                        : 'hover:bg-surface-alt'
                    }`}
                  >
                    {/* Avatar */}
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                        isSelected
                          ? 'bg-primary text-white'
                          : 'bg-primary/15 text-primary'
                      }`}
                    >
                      {getInitials(student.firstName, student.lastName)}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text truncate">
                        {student.firstName} {student.lastName}
                      </p>
                      <p className="text-xs text-text-muted truncate">{student.email}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={`text-xs px-1.5 py-0.5 rounded-full ${
                            STATUS_CLASS[student.status] ?? 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {STATUS_LABEL[student.status] ?? student.status}
                        </span>
                        <span className="text-xs text-text-muted">
                          Prom. {student.yearPromotion}
                        </span>
                      </div>
                    </div>

                    {/* Conteo matrículas */}
                    <div className="shrink-0 text-right">
                      <span
                        className={`text-xs font-semibold px-1.5 py-0.5 rounded-full ${
                          enrollmentCount({ student, enrollments }) > 0
                            ? 'bg-primary/10 text-primary'
                            : 'bg-gray-100 text-gray-400'
                        }`}
                      >
                        {enrollmentCount({ student, enrollments })}
                      </span>
                      <p className="text-[10px] text-text-muted mt-0.5">mat.</p>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
