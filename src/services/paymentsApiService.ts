import { apiFetch } from './api';

export interface PaymentResponse {
  id: string;
  paymentNumber: number;
  paymentDate: string | null;
  latestVoucherStateCode: string | null;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string | null;
}

export async function listMyPayments(token: string): Promise<PaymentResponse[]> {
  const res = await apiFetch<ApiResponse<PaymentResponse[]>>('/v1/payments/my', token);
  return res.data;
}
