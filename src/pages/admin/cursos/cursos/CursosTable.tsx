import {
  BookOpenIcon,
  EditIcon,
  Loader2Icon,
  PlusIcon,
  SearchIcon,
  XIcon,
} from 'lucide-react';
import { EmptyState } from '../../../../components/EmptyState';
import { StatusBadge } from '../../../../components/StatusBadge';
import { CourseResponse, CourseType } from '../../../../services/coursesApiService';
import { PromotionResponse } from '../../../../services/promotionsApiService';

const TYPE_BADGE_VARIANT: Record<CourseType, 'activo' | 'retiro' | 'observado'> = {
  Regular: 'activo',
  Tesis: 'retiro',
  Topicos: 'observado',
};

const TYPE_LABELS: Record<CourseType, string> = {
  Regular: 'Regular',
  Tesis: 'Tesis',
  Topicos: 'Tópicos',
};

interface Props {
  cursos: CourseResponse[];
  selectedPromocion: PromotionResponse | null;
  loading: boolean;
  error: string | null;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterType: CourseType | '';
  onFilterTypeChange: (value: CourseType | '') => void;
  isCoordinator: boolean;
  onCreate: () => void;
  onEdit: (curso: CourseResponse) => void;
  onDelete: (curso: CourseResponse) => void;
}

export function CursosTable({
  cursos,
  selectedPromocion,
  loading,
  error,
  searchTerm,
  onSearchChange,
  filterType,
  onFilterTypeChange,
  isCoordinator,
  onCreate,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div className="bg-surface border border-border rounded-lg p-6 space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-2xl font-serif font-bold text-text truncate">
            {selectedPromocion?.name ?? 'Selecciona una promoción'}
          </h2>
          {selectedPromocion && (
            <p className="text-sm text-text-muted">
              {selectedPromocion.programName} · {selectedPromocion.period} ·{' '}
              {selectedPromocion.year}
            </p>
          )}
        </div>

        {!isCoordinator && selectedPromocion && (
          <button
            onClick={onCreate}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors"
          >
            <PlusIcon className="w-5 h-5" />
            Agregar curso
          </button>
        )}
      </div>

      <div className="flex gap-4">
        <div className="flex-1 relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
          <input
            type="text"
            placeholder="Buscar por nombre o código..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => onFilterTypeChange(e.target.value as CourseType | '')}
          className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">Todos</option>
          <option value="Regular">Regular</option>
          <option value="Tesis">Tesis</option>
          <option value="Topicos">Tópicos</option>
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 gap-3 text-text-muted">
          <Loader2Icon className="w-6 h-6 animate-spin" />
          <span>Cargando cursos...</span>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center py-16">
          <p className="text-accent">{error}</p>
        </div>
      ) : !selectedPromocion ? (
        <EmptyState
          icon={BookOpenIcon}
          title="Selecciona una promoción"
          subtitle="Los cursos se mostrarán según la promoción elegida."
        />
      ) : cursos.length === 0 ? (
        <EmptyState
          icon={BookOpenIcon}
          title="No hay cursos"
          subtitle={
            searchTerm || filterType
              ? 'Intenta ajustar los filtros de búsqueda.'
              : 'Agrega el primer curso para esta promoción.'
          }
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface-alt">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase">
                  Código
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase">
                  Nombre
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase">
                  Tipo
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase">
                  Fecha inicio
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase">
                  Fecha fin
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase">
                  Sílabus
                </th>
                {!isCoordinator && (
                  <th className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase">
                    Acciones
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {cursos.map((curso, index) => (
                <tr
                  key={curso.id}
                  className={index % 2 === 0 ? 'bg-surface' : 'bg-surface-alt'}
                >
                  <td className="px-4 py-3 text-sm text-text-muted">{curso.code}</td>
                  <td className="px-4 py-3 text-sm text-text font-medium">{curso.name}</td>
                  <td className="px-4 py-3">
                    <StatusBadge variant={TYPE_BADGE_VARIANT[curso.type]}>
                      {TYPE_LABELS[curso.type]}
                    </StatusBadge>
                  </td>
                  <td className="px-4 py-3 text-sm text-text-muted">{curso.startDate}</td>
                  <td className="px-4 py-3 text-sm text-text-muted">{curso.endDate}</td>
                  <td className="px-4 py-3 text-sm">
                    {curso.syllabusUrl ? (
                      <a
                        href={curso.syllabusUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary hover:text-primary-light transition-colors"
                      >
                        Ver enlace
                      </a>
                    ) : (
                      <span className="text-text-muted">Sin enlace</span>
                    )}
                  </td>
                  {!isCoordinator && (
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => onEdit(curso)}
                          className="p-1 text-primary hover:text-primary-light transition-colors"
                          title="Editar curso"
                        >
                          <EditIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDelete(curso)}
                          className="p-1 text-accent hover:text-accent-light transition-colors"
                          title="Eliminar curso"
                        >
                          <XIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
