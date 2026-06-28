import { ApiError, ApiResponse } from './api';

const BASE_URL = import.meta.env.VITE_API_URL ?? '/api';

// ── Tipos ─────────────────────────────────────────────────────────────────────

/** Metadata de archivo sin URL de descarga (embebido en otros recursos) */
export interface StoredFileSummary {
  id: string;
  originalName: string;
  contentType: string;
  purpose: 'Silabo' | 'Voucher de pago' | 'Resolucion de matricula' | 'Reactualizacion';
  sizeBytes: number;
  createdAt: string;
}

/** @alias para compatibilidad con imports que usan StoredFileSummaryResponse */
export type StoredFileSummaryResponse = StoredFileSummary;

/** Metadata completa + URL prefirmada temporal para descarga */
export interface StoredFileResponse extends StoredFileSummary {
  uploadedById: string;
  /** URL prefirmada con expiración — úsala para abrir/descargar el archivo */
  downloadUrl: string;
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

/**
 * POST /v1/files/vouchers
 * Sube un voucher de pago y devuelve su metadata.
 */
export async function uploadVoucher(
  token: string,
  file: File
): Promise<StoredFileSummary> {
  const form = new FormData();
  form.append('file', file);
  const res = await apiFetchMultipart<ApiResponse<StoredFileSummary>>(
    '/v1/files/vouchers',
    token,
    form
  );
  return res.data;
}

/**
 * POST /v1/files/reactualizations
 * Sube un archivo de reactualización y devuelve su metadata.
 */
export async function uploadReactualization(
  token: string,
  file: File
): Promise<StoredFileSummary> {
  const form = new FormData();
  form.append('file', file);
  const res = await apiFetchMultipart<ApiResponse<StoredFileSummary>>(
    '/v1/files/reactualizations',
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

/**
 * DELETE /v1/files/{id}
 * Elimina un archivo almacenado.
 */
export async function deleteFile(token: string, id: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/v1/files/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    const json = await response.json().catch(() => ({}));
    throw new ApiError(response.status, json.message ?? `Error ${response.status}`);
  }
}
