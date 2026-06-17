import { apiFetch } from './api';
import { VoucherResponse, VoucherCreateRequest, VoucherUpdateRequest } from '../types/voucher';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string | null;
}

export async function listVouchers(token: string): Promise<VoucherResponse[]> {
  const res = await apiFetch<ApiResponse<VoucherResponse[]>>('/v1/vouchers', token);
  return res.data;
}

export async function getVoucherById(token: string, id: string): Promise<VoucherResponse> {
  const res = await apiFetch<ApiResponse<VoucherResponse>>(`/v1/vouchers/${id}`, token);
  return res.data;
}

export async function createVoucher(token: string, request: VoucherCreateRequest): Promise<VoucherResponse> {
  const res = await apiFetch<ApiResponse<VoucherResponse>>('/v1/vouchers', token, {
    method: 'POST',
    body: JSON.stringify(request),
  });
  return res.data;
}

export async function updateVoucher(token: string, id: string, request: VoucherUpdateRequest): Promise<VoucherResponse> {
  const res = await apiFetch<ApiResponse<VoucherResponse>>(`/v1/vouchers/${id}`, token, {
    method: 'PUT',
    body: JSON.stringify(request),
  });
  return res.data;
}

export async function listMyVouchers(token: string): Promise<VoucherResponse[]> {
  const res = await apiFetch<ApiResponse<VoucherResponse[]>>('/v1/vouchers/my', token);
  return res.data;
}

export async function deleteVoucher(token: string, id: string): Promise<void> {
  await apiFetch<ApiResponse<void>>(`/v1/vouchers/${id}`, token, {
    method: 'DELETE',
  });
}
