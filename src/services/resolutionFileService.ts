import { ApiError } from './api';
import { StoredFileSummary } from './filesApiService';

const BASE_URL = import.meta.env.VITE_API_URL ?? '/api';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string | null;
}

async function apiFetchMultipart<T>(
  path: string,
  token: string,
  body: FormData
): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body,
  });

  if (!response.ok) {
    if (response.status === 401) {
      window.dispatchEvent(new CustomEvent('session-expired'));
    }
    const json = await response.json().catch(() => ({}));
    throw new ApiError(response.status, json.message ?? `Error ${response.status}`);
  }

  return response.json() as Promise<T>;
}

/**
 * POST /v1/files/resolutions
 * Sube una resolución de matrícula y devuelve su metadata.
 */
export async function uploadResolution(
  token: string,
  file: File
): Promise<StoredFileSummary> {
  const form = new FormData();
  form.append('file', file);
  const res = await apiFetchMultipart<ApiResponse<StoredFileSummary>>(
    '/v1/files/resolutions',
    token,
    form
  );
  return res.data;
}
