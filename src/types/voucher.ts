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
  studentName: string;
  studentEmail: string;
  studentPaymentCode: string;
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
