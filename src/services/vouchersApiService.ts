import { apiFetch } from './api';
import { VoucherResponse, VoucherReviewRequest, VoucherStateCode } from '../types/voucher';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string | null;
}

export async function listVouchers(
  token: string,
  stateCode?: VoucherStateCode
): Promise<VoucherResponse[]> {
  const query = stateCode ? `?state=${stateCode}` : '';
  const res = await apiFetch<ApiResponse<VoucherResponse[]>>(`/v1/vouchers${query}`, token);
  return res.data;
}

export async function reviewVoucher(
  token: string,
  id: string,
  request: VoucherReviewRequest
): Promise<VoucherResponse> {
  const res = await apiFetch<ApiResponse<VoucherResponse>>(`/v1/vouchers/${id}/review`, token, {
    method: 'PATCH',
    body: JSON.stringify(request),
  });
  return res.data;
}
