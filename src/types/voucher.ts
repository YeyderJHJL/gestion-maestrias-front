import { StoredFileSummaryResponse } from '../services/filesApiService';

export type VoucherStateCode = 'UPLOADED' | 'VALIDATED' | 'OBSERVED' | 'REJECTED';

export interface VoucherPaymentResponse {
  paymentId: string;
  paymentNumber: number;
  paymentConcept: string | null;
  paymentAmount: number | null;
  paymentDate: string | null;
}

export interface VoucherResponse {
  id: string;
  declaredAmount: number;
  payments: VoucherPaymentResponse[];
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentPaymentCode: string;
  studentDni: string | null;
  studentCui: string;
  stateId: number;
  stateCode: VoucherStateCode;
  stateName: string;
  file: StoredFileSummaryResponse;
  observation?: string;
  operationNumber: string;
  createdAt: string;
  updatedAt: string;
}

export interface VoucherPaymentRequest {
  paymentId: string;
}

export interface VoucherCreateRequest {
  declaredAmount: number;
  payments: VoucherPaymentRequest[];
  stateId: number;
  fileId: string;
  observation?: string;
  operationNumber: string;
}

export type VoucherUpdateRequest = VoucherCreateRequest;

/** Resumen legible del/los pago(s) que cubre un voucher: concepto único o "N cuotas (N°x, N°y)". */
export function voucherConceptSummary(voucher: VoucherResponse): string {
  if (voucher.payments.length === 1) {
    return voucher.payments[0].paymentConcept ?? '—';
  }
  const numbers = voucher.payments.map((p) => p.paymentNumber).join(', N°');
  return `${voucher.payments.length} cuotas (N°${numbers})`;
}
