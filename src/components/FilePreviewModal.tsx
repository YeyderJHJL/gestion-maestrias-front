import { useEffect, useState } from 'react';
import { Loader2Icon, ExternalLinkIcon, DownloadIcon, FileIcon, SmartphoneIcon } from 'lucide-react';
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

async function downloadBlob(url: string, filename: string) {
  const res = await fetch(url);
  const blob = await res.blob();
  const blobUrl = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = blobUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(blobUrl);
}

export function FilePreviewModal({ fileId, isOpen, onClose }: FilePreviewModalProps) {
  const { file, previewUrl, isPdf, isImage, loading, error, retry } = useFilePreview(fileId, isOpen);
  const title = file ? (PURPOSE_LABELS[file.purpose] ?? 'Vista previa') : 'Vista previa';

  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="full">
      <div className={`flex gap-5 ${isMobile && isPdf ? 'flex-col' : 'flex-col md:flex-row'}`}>
        {!(isMobile && isPdf) && (
          <div className="flex-1 min-w-0">
            <div className="rounded-lg border border-border overflow-hidden bg-surface-alt" style={{ height: 'calc(90vh - 8rem)' }}>
              {loading ? (
                <div className="w-full h-full flex items-center justify-center gap-2 text-text-muted">
                  <Loader2Icon className="w-6 h-6 animate-spin" />
                  <span className="text-sm">Cargando vista previa...</span>
                </div>
              ) : error ? (
                <div className="w-full h-full flex flex-col items-center justify-center gap-3">
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
                  <iframe src={`${previewUrl}#navpanes=0`} className="w-full h-full" title={title} />
                ) : isImage ? (
                  <img src={previewUrl} alt={file?.originalName} className="w-full h-full object-contain" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-text-muted">
                    <FileIcon className="w-12 h-12" />
                    <p className="text-sm">Vista previa no disponible para este tipo de archivo</p>
                    <p className="text-xs">Usa los botones para abrir o descargar</p>
                  </div>
                )
              ) : null}
            </div>
          </div>
        )}

        <div className={`flex-shrink-0 overflow-y-auto ${isMobile && isPdf ? 'w-full' : 'w-full md:w-56'}`}>
          {isMobile && isPdf && !loading && !error && previewUrl && (
            <div className="flex flex-col items-center gap-2 py-6 px-4 rounded-lg border border-border bg-surface-alt mb-5 text-center">
              <SmartphoneIcon className="w-8 h-8 text-primary/50" />
              <p className="text-sm font-medium text-text">Vista previa no disponible en móvil</p>
              <p className="text-xs text-text-muted">Usa los botones de abajo para abrir o descargar el archivo</p>
            </div>
          )}
          <div className="space-y-5">
          {file && (
            <>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-text-muted mb-1">Nombre del archivo</p>
                  <p className="text-sm font-medium text-text truncate" title={file.originalName}>{file.originalName}</p>
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
                <button
                  onClick={() => downloadBlob(file.downloadUrl, file.originalName)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors text-sm"
                >
                  <DownloadIcon className="w-4 h-4" />
                  Descargar
                </button>
              </div>
            </>
          )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
