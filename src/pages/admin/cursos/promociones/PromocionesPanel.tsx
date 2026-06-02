import React from 'react';
import {
  EditIcon,
  GraduationCapIcon,
  Loader2Icon,
  PlusIcon,
  XIcon,
} from 'lucide-react';
import { EmptyState } from '../../../../components/EmptyState';
import { PromotionResponse } from '../../../../services/promotionsApiService';

interface Props {
  promociones: PromotionResponse[];
  selectedPromocion: PromotionResponse | null;
  loading: boolean;
  error: string | null;
  isCoordinator: boolean;
  onSelect: (promocion: PromotionResponse) => void;
  onCreate: () => void;
  onEdit: (promocion: PromotionResponse) => void;
  onDelete: (promocion: PromotionResponse) => void;
}

export function PromocionesPanel({
  promociones,
  selectedPromocion,
  loading,
  error,
  isCoordinator,
  onSelect,
  onCreate,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div className="bg-surface-alt rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-serif font-bold text-text">Promociones</h2>
        {!isCoordinator && (
          <button
            onClick={onCreate}
            className="p-1 text-primary hover:text-primary-light transition-colors"
            title="Nueva promoción"
          >
            <PlusIcon className="w-5 h-5" />
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-10 gap-2 text-sm text-text-muted">
          <Loader2Icon className="w-5 h-5 animate-spin" />
          Cargando promociones...
        </div>
      ) : error ? (
        <p className="py-10 text-sm text-center text-accent">{error}</p>
      ) : promociones.length === 0 ? (
        <EmptyState
          icon={GraduationCapIcon}
          title="No hay promociones"
          subtitle="Crea una promoción para asociar cursos."
        />
      ) : (
        <div className="space-y-2">
          {promociones.map((promocion) => {
            const isSelected = selectedPromocion?.id === promocion.id;

            return (
              <div
                key={promocion.id}
                className={`rounded-lg transition-all ${
                  isSelected
                    ? 'bg-surface border-l-4 border-accent shadow-sm'
                    : 'bg-surface-alt hover:bg-surface'
                }`}
              >
                <button
                  onClick={() => onSelect(promocion)}
                  className="w-full text-left p-3"
                >
                  <div className="space-y-1">
                    <p className="font-semibold text-text">{promocion.name}</p>
                    <p className="text-xs text-text-muted">{promocion.programName}</p>
                    <p className="text-xs text-text-muted">
                      {promocion.period} · {promocion.year}
                    </p>
                  </div>
                </button>

                {!isCoordinator && (
                  <div className="flex gap-2 px-3 pb-3">
                    <button
                      onClick={() => onEdit(promocion)}
                      className="p-1 text-primary hover:text-primary-light transition-colors"
                      title="Editar promoción"
                    >
                      <EditIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(promocion)}
                      className="p-1 text-accent hover:text-accent-light transition-colors"
                      title="Eliminar promoción"
                    >
                      <XIcon className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
