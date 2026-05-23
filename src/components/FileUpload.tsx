import React, { useState, useRef } from 'react';
import {
  UploadIcon,
  FileIcon,
  CheckCircleIcon,
  XCircleIcon } from
'lucide-react';
import { motion } from 'framer-motion';
interface FileUploadProps {
  onFileSelect: (file: File) => void;
  acceptedFormats?: string;
  maxSizeMB?: number;
  label?: string;
}
export function FileUpload({
  onFileSelect,
  acceptedFormats = '.pdf,.jpg,.jpeg,.png',
  maxSizeMB = 5,
  label = 'Arrastra el archivo aquí o haz clic para seleccionar'
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<
    'idle' | 'uploading' | 'success' | 'error'>(
    'idle');
  const inputRef = useRef<HTMLInputElement>(null);
  const validateFile = (file: File): boolean => {
    const maxSize = maxSizeMB * 1024 * 1024;
    if (file.size > maxSize) {
      setError(`El archivo excede el tamaño máximo de ${maxSizeMB} MB`);
      return false;
    }
    return true;
  };
  const handleFile = (file: File) => {
    setError(null);
    if (validateFile(file)) {
      setFile(file);
      setUploadStatus('uploading');
      setTimeout(() => {
        setUploadStatus('success');
        onFileSelect(file);
      }, 1000);
    } else {
      setUploadStatus('error');
    }
  };
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFile(droppedFile);
    }
  };
  const handleClick = () => {
    inputRef.current?.click();
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFile(selectedFile);
    }
  };
  return (
    <div className="w-full">
      <motion.div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${isDragging ? 'border-primary bg-primary/5' : uploadStatus === 'success' ? 'border-success bg-success/5' : uploadStatus === 'error' ? 'border-accent bg-accent/5' : 'border-border hover:border-primary'}`}
        whileHover={{
          scale: 1.01
        }}
        whileTap={{
          scale: 0.99
        }}>
        
        <input
          ref={inputRef}
          type="file"
          accept={acceptedFormats}
          onChange={handleInputChange}
          className="hidden" />
        

        {uploadStatus === 'idle' &&
        <>
            <UploadIcon className="w-12 h-12 mx-auto mb-4 text-text-muted" />
            <p className="text-text font-medium mb-2">{label}</p>
            <p className="text-sm text-text-muted">
              {acceptedFormats.replace(/\./g, '').toUpperCase()} · Máx.{' '}
              {maxSizeMB} MB
            </p>
          </>
        }

        {uploadStatus === 'uploading' &&
        <>
            <div className="w-12 h-12 mx-auto mb-4 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-text font-medium">Subiendo archivo...</p>
          </>
        }

        {uploadStatus === 'success' && file &&
        <>
            <CheckCircleIcon className="w-12 h-12 mx-auto mb-4 text-success" />
            <div className="flex items-center justify-center gap-2 mb-2">
              <FileIcon className="w-5 h-5 text-text-muted" />
              <p className="text-text font-medium">{file.name}</p>
            </div>
            <p className="text-sm text-text-muted">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </>
        }

        {uploadStatus === 'error' &&
        <>
            <XCircleIcon className="w-12 h-12 mx-auto mb-4 text-accent" />
            <p className="text-accent font-medium mb-2">
              Error al subir archivo
            </p>
            {error && <p className="text-sm text-text-muted">{error}</p>}
          </>
        }
      </motion.div>
    </div>);

}