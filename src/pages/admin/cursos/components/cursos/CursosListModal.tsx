import { PlusIcon, EditIcon, Trash2Icon, SearchIcon, Loader2Icon, BookOpenIcon } from 'lucide-react';
import { Modal } from '../../../../../components/Modal';
import { CourseResponse } from '../../../../../services/coursesApiService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  cursos: CourseResponse[];
  loading: boolean;
  error: string | null;
  onAdd: () => void;
  onEdit: (curso: CourseResponse) => void;
  onDelete: (curso: CourseResponse) => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '—';
  const [year, month, day] = dateStr.split('-');
  if (!year || !month || !day) return dateStr;
  return `${day}/${month}/${year}`;
}

export function CursosListModal({
  isOpen,
  onClose,
  cursos,
  loading,
  error,
  onAdd,
  onEdit,
  onDelete,
  searchTerm,
  onSearchChange,
}: Props) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Lista de Cursos"
      size="xl"
      accentBorder
    >
      <div className="space-y-4">
        {/* Toolbar */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Search: ícono dentro del borde, sin posicionamiento absoluto */}
          <div className="flex flex-1 min-w-[180px] items-center gap-2 border border-border rounded-lg px-3 py-2 bg-surface focus-within:ring-2 focus-within:ring-primary">
            <SearchIcon className="w-4 h-4 text-text-muted shrink-0" />
            <input
              type="text"
              placeholder="Buscar por nombre o código..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="flex-1 text-sm bg-transparent outline-none text-text placeholder:text-text-muted"
            />
          </div>
          <button
            onClick={onAdd}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors text-sm whitespace-nowrap"
          >
            <PlusIcon className="w-4 h-4" />
            Nuevo curso
          </button>
        </div>

        {/* Tabla con scroll horizontal para que las columnas de acciones no se corten */}
        <div className="rounded-lg border border-border overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-16 text-text-muted gap-2">
              <Loader2Icon className="w-5 h-5 animate-spin" />
              <span className="text-sm">Cargando cursos...</span>
            </div>
          ) : error ? (
            <div className="py-12 text-center text-sm text-accent">{error}</div>
          ) : cursos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-text-muted">
              <BookOpenIcon className="w-10 h-10 opacity-30" />
              <p className="text-sm">
                {searchTerm
                  ? 'Sin resultados para esa búsqueda.'
                  : 'No hay cursos registrados aún.'}
              </p>
            </div>
          ) : (
            <table className="w-full text-sm min-w-[640px]">
              <thead>
                <tr className="bg-surface-alt text-text-muted text-xs uppercase tracking-wide border-b border-border">
                  <th className="px-4 py-3 text-left font-semibold w-[200px]">Código</th>
                  <th className="px-4 py-3 text-left font-semibold">Nombre</th>
                  <th className="px-4 py-3 text-left font-semibold w-[110px]">Inicio</th>
                  <th className="px-4 py-3 text-left font-semibold w-[110px]">Fin</th>
                  <th className="px-4 py-3 text-right font-semibold w-[90px]">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {cursos.map((curso) => (
                  <tr
                    key={curso.id}
                    className="bg-surface hover:bg-surface-alt transition-colors"
                  >
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs font-semibold tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full break-all">
                        {curso.code}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium text-text" title={curso.name}>
                      {curso.name}
                    </td>
                    <td className="px-4 py-3 text-text-muted tabular-nums whitespace-nowrap">
                      {formatDate(curso.startDate)}
                    </td>
                    <td className="px-4 py-3 text-text-muted tabular-nums whitespace-nowrap">
                      {formatDate(curso.endDate)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onEdit(curso)}
                          className="p-1.5 rounded-lg text-text-muted hover:bg-primary/10 hover:text-primary transition-colors"
                          title="Editar curso"
                        >
                          <EditIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDelete(curso)}
                          className="p-1.5 rounded-lg text-text-muted hover:bg-accent/10 hover:text-accent transition-colors"
                          title="Eliminar curso"
                        >
                          <Trash2Icon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Conteo */}
        {!loading && !error && cursos.length > 0 && (
          <p className="text-xs text-text-muted text-right">
            {cursos.length} {cursos.length === 1 ? 'curso' : 'cursos'}
          </p>
        )}
      </div>
    </Modal>
  );
}
