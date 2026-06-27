import { useCallback, useEffect, useState } from 'react';
import { getFileUrl, StoredFileResponse } from '../services/filesApiService';
import { useAuth } from '../context/AuthContext';

export function useFilePreview(fileId: string | null, active: boolean = true) {
  const { token } = useAuth();
  const [file, setFile] = useState<StoredFileResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const load = useCallback(() => {
    if (!fileId || !token) return;
    setLoading(true);
    setError(false);
    getFileUrl(token, fileId)
      .then(setFile)
      .catch(() => { setFile(null); setError(true); })
      .finally(() => setLoading(false));
  }, [fileId, token]);

  useEffect(() => {
    if (!active || !fileId) {
      setFile(null);
      setError(false);
      return;
    }
    load();
  }, [active, fileId, load]);

  const previewUrl = file?.downloadUrl ?? null;
  const isPdf = file?.contentType?.includes('pdf') ?? false;
  const isImage = file?.contentType?.startsWith('image/') ?? false;

  return { file, previewUrl, isPdf, isImage, loading, error, retry: load };
}
