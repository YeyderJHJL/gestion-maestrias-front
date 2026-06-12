import { apiFetch } from './api';

export interface PromotionResponse {
  id: number;
  programId: number;
  programName: string;
  name: string;
  period: string;
  year: number;
  createdAt: string;
  updatedAt: string;
}

export interface PromotionRequest {
  programId: number;
  name: string;
  period: string;
  year: number;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string | null;
}

export async function listPromotions(token: string): Promise<PromotionResponse[]> {
  const res = await apiFetch<ApiResponse<PromotionResponse[]>>('/v1/promotions', token);
  return res.data;
}

export async function createPromotion(
  token: string,
  request: PromotionRequest
): Promise<PromotionResponse> {
  const res = await apiFetch<ApiResponse<PromotionResponse>>('/v1/promotions', token, {
    method: 'POST',
    body: JSON.stringify(request),
  });
  return res.data;
}

export async function updatePromotion(
  token: string,
  id: number,
  request: PromotionRequest
): Promise<PromotionResponse> {
  const res = await apiFetch<ApiResponse<PromotionResponse>>(`/v1/promotions/${id}`, token, {
    method: 'PUT',
    body: JSON.stringify(request),
  });
  return res.data;
}

export async function deletePromotion(token: string, id: number): Promise<void> {
  await apiFetch<ApiResponse<void>>(`/v1/promotions/${id}`, token, {
    method: 'DELETE',
  });
}
