import { useState } from 'react';
import { AlertTriangleIcon, FileTextIcon } from 'lucide-react';
import { FileUpload } from '../../../../components/FileUpload';
import { Modal } from '../../../../components/Modal';

interface SyllabusTabProps {
  hasSyllabus: boolean;
  syllabusFileName?: string;
  syllabusUploadDate?: string;
  uploading: boolean;
  onUpload: (file: File) => void;
  onView: () => void;
}

export function SyllabusTab({
  hasSyllabus,
  syllabusFileName,
  uploading,
  onUpload,
  onView,
}: SyllabusTabProps) {
  const [isReplaceModalOpen, setIsReplaceModalOpen] = useState(false);

  if (uploading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!hasSyllabus) {
    return (
      <div className="space-y-6">
        <div className="bg-accent/10 border border-accent rounded-lg p-4 flex items-start gap-3">
          <AlertTriangleIcon className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
          <p className="text-text">
            Debes subir el sílabo antes de iniciar el curso. Es obligatorio.
          </p>
        </div>
        <FileUpload
          onFileSelect={onUpload}
          acceptedFormats=".pdf"
          maxSizeMB={10}
          label="Arrastra el sílabo aquí o haz clic para seleccionar"
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-surface-alt border border-border rounded-lg p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileTextIcon className="w-8 h-8 text-accent" />
          <div>
            <p className="font-medium text-text">{syllabusFileName}</p>
            <p className="text-sm text-text-muted">Sílabo del curso</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsReplaceModalOpen(true)}
            className="px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary/5 transition-colors"
          >
            Actualizar sílabo
          </button>
          <button
            onClick={onView}
            className="px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary/5 transition-colors"
          >
            Ver sílabo
          </button>
        </div>
      </div>

      <Modal
        isOpen={isReplaceModalOpen}
        onClose={() => setIsReplaceModalOpen(false)}
        title="Actualizar Sílabo"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-text-muted">
            Sube el nuevo archivo del sílabo. Esto reemplazará el sílabo actual ({syllabusFileName}).
          </p>
          <FileUpload
            onFileSelect={(file) => {
              onUpload(file);
              setIsReplaceModalOpen(false);
            }}
            acceptedFormats=".pdf"
            maxSizeMB={10}
            label="Arrastra el nuevo sílabo aquí o haz clic para seleccionar"
          />
        </div>
      </Modal>
    </div>
  );
}
