import { apiFetch } from './api';

export interface StoredFileSummaryResponse {
  id: string;
  originalName: string;
  contentType: string;
  sizeBytes: number;
  createdAt: string;
}

export interface StoredFileResponse extends StoredFileSummaryResponse {
  uploadedById: string;
  downloadUrl: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string | null;
}

export async function uploadFile(token: string, file: File, purpose: 'vouchers' | 'syllabus' | 'resolutions' | 'reactualizations' = 'vouchers'): Promise<StoredFileResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await apiFetch<ApiResponse<StoredFileResponse>>(`/v1/files/${purpose}`, token, {
    method: 'POST',
    body: formData,
  });
  return res.data;
}

export async function getFile(token: string, id: string): Promise<StoredFileResponse> {
  const res = await apiFetch<ApiResponse<StoredFileResponse>>(`/v1/files/${id}`, token);
  return res.data;
}

export async function deleteFile(token: string, id: string): Promise<void> {
  await apiFetch<void>(`/v1/files/${id}`, token, {
    method: 'DELETE',
  });
}
