import { Loader2Icon, ExternalLinkIcon, DownloadIcon, FileIcon } from 'lucide-react';
import { Modal } from './Modal';
import { useFilePreview } from '../hooks/useFilePreview';

interface FilePreviewModalProps {
  fileId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

const PURPOSE_LABELS: Record<string, string> = {
  'Silabo': 'Sílabo',
  'Voucher de pago': 'Voucher de pago',
  'Resolucion de matricula': 'Resolución de matrícula',
  'Reactualizacion': 'Documento de reactualización',
};

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function FilePreviewModal({ fileId, isOpen, onClose }: FilePreviewModalProps) {
  const { file, previewUrl, isPdf, isImage, loading, error, retry } = useFilePreview(fileId, isOpen);
  const title = file ? (PURPOSE_LABELS[file.purpose] ?? 'Vista previa') : 'Vista previa';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="xl">
      <div className="grid grid-cols-10 gap-6">
        {/* Preview — 70% */}
        <div className="col-span-7">
          <div className="rounded-lg border border-border overflow-hidden bg-surface-alt" style={{ height: '70vh' }}>
            {loading ? (
              <div className="w-full h-full flex items-center justify-center gap-2 text-text-muted" style={{ height: '70vh' }}>
                <Loader2Icon className="w-6 h-6 animate-spin" />
                <span className="text-sm">Cargando vista previa...</span>
              </div>
            ) : error ? (
              <div className="w-full h-full flex flex-col items-center justify-center gap-3" style={{ height: '70vh' }}>
                <p className="text-text-muted text-sm">No se pudo cargar el archivo</p>
                <button
                  onClick={retry}
                  className="px-4 py-2 text-sm border border-primary text-primary rounded-lg hover:bg-primary/5 transition-colors"
                >
                  Reintentar
                </button>
              </div>
            ) : previewUrl ? (
              isPdf ? (
                <iframe src={previewUrl} className="w-full" style={{ height: '70vh' }} title={title} />
              ) : isImage ? (
                <img src={previewUrl} alt={file?.originalName} className="w-full object-contain" style={{ maxHeight: '70vh' }} />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-text-muted" style={{ height: '70vh' }}>
                  <FileIcon className="w-12 h-12" />
                  <p className="text-sm">Vista previa no disponible para este tipo de archivo</p>
                  <p className="text-xs">Usa los botones para abrir o descargar</p>
                </div>
              )
            ) : null}
          </div>
        </div>

        {/* Metadatos + acciones — 30% */}
        <div className="col-span-3 space-y-5">
          {file && (
            <>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-text-muted mb-1">Nombre del archivo</p>
                  <p className="text-sm font-medium text-text break-all">{file.originalName}</p>
                </div>
                <div>
                  <p className="text-xs text-text-muted mb-1">Tipo</p>
                  <p className="text-sm font-medium text-text">{PURPOSE_LABELS[file.purpose] ?? file.purpose}</p>
                </div>
                <div>
                  <p className="text-xs text-text-muted mb-1">Tamaño</p>
                  <p className="text-sm font-medium text-text">{formatBytes(file.sizeBytes)}</p>
                </div>
                <div>
                  <p className="text-xs text-text-muted mb-1">Formato</p>
                  <p className="text-sm font-medium text-text">{file.contentType}</p>
                </div>
              </div>

              <div className="border-t border-border pt-4 space-y-3">
                <button
                  onClick={() => window.open(file.downloadUrl, '_blank')}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-primary text-primary rounded-lg hover:bg-primary/5 transition-colors text-sm"
                >
                  <ExternalLinkIcon className="w-4 h-4" />
                  Abrir en pestaña nueva
                </button>
                <a
                  href={file.downloadUrl}
                  download={file.originalName}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors text-sm"
                >
                  <DownloadIcon className="w-4 h-4" />
                  Descargar
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
}
