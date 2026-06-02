import { apiFetch } from './api';

export interface ProgramResponse {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProgramRequest {
  name: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string | null;
}

export async function listPrograms(token: string): Promise<ProgramResponse[]> {
  const res = await apiFetch<ApiResponse<ProgramResponse[]>>('/v1/programs', token);
  return res.data;
}

export async function createProgram(
  token: string,
  request: ProgramRequest
): Promise<ProgramResponse> {
  const res = await apiFetch<ApiResponse<ProgramResponse>>('/v1/programs', token, {
    method: 'POST',
    body: JSON.stringify(request),
  });
  return res.data;
}

export async function updateProgram(
  token: string,
  id: number,
  request: ProgramRequest
): Promise<ProgramResponse> {
  const res = await apiFetch<ApiResponse<ProgramResponse>>(`/v1/programs/${id}`, token, {
    method: 'PUT',
    body: JSON.stringify(request),
  });
  return res.data;
}

export async function deleteProgram(token: string, id: number): Promise<void> {
  await apiFetch<ApiResponse<void>>(`/v1/programs/${id}`, token, {
    method: 'DELETE',
  });
}
