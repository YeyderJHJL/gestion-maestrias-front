import { apiFetch, ApiResponse } from './api';

export interface PaymentResponse {
  id: string;
  paymentNumber: number;
  concept: string;
  amount: number;
  paymentDate: string | null;
  latestVoucherStateCode: string | null;
  createdAt: string;
  updatedAt: string;
}


export async function listMyPayments(token: string): Promise<PaymentResponse[]> {
  const res = await apiFetch<ApiResponse<PaymentResponse[]>>('/v1/payments/my', token);
  return res.data;
}

export async function listPaymentsByStudent(token: string, studentId: string): Promise<PaymentResponse[]> {
  const res = await apiFetch<ApiResponse<PaymentResponse[]>>(`/v1/payments/student/${studentId}`, token);
  return res.data;
}
