import { ApiError } from './api';

const BASE_URL = import.meta.env.VITE_API_URL ?? '/api';

// ── Tipos ─────────────────────────────────────────────────────────────────────

export interface StoredFileSummary {
  id: string;
  originalName: string;
  contentType: string;
  purpose: 'Silabo' | 'Voucher de pago' | 'Resolucion de matricula' | 'Reactualizacion';
  sizeBytes: number;
  createdAt: string;
}

export interface StoredFileResponse extends StoredFileSummary {
  uploadedById: string;
  /** URL prefirmada con expiración — úsala para abrir/descargar el archivo */
  downloadUrl: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string | null;
}

// ── Helper multipart (no usa Content-Type: application/json) ──────────────────

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

// ── Endpoints ─────────────────────────────────────────────────────────────────

/**
 * POST /v1/files/syllabus
 * Sube un sílabo y devuelve su metadata + ID para usar en AssignmentRequest.
 */
export async function uploadSyllabus(
  token: string,
  file: File
): Promise<StoredFileSummary> {
  const form = new FormData();
  form.append('file', file);
  const res = await apiFetchMultipart<ApiResponse<StoredFileSummary>>(
    '/v1/files/syllabus',
    token,
    form
  );
  return res.data;
}

/**
 * GET /v1/files/{id}
 * Devuelve metadata + URL prefirmada temporal para descargar/visualizar.
 */
export async function getFileUrl(
  token: string,
  fileId: string
): Promise<StoredFileResponse> {
  const response = await fetch(`${BASE_URL}/v1/files/${fileId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    const json = await response.json().catch(() => ({}));
    throw new ApiError(response.status, json.message ?? `Error ${response.status}`);
  }

  const res: ApiResponse<StoredFileResponse> = await response.json();
  return res.data;
}
