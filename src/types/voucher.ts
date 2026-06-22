import { StoredFileSummaryResponse } from '../services/filesApiService';

export type VoucherStateCode = 'UPLOADED' | 'VALIDATED' | 'OBSERVED' | 'REJECTED';

export interface VoucherResponse {
  id: string;
  paymentId: string;
  paymentNumber: number;
  paymentConcept: string | null;
  paymentAmount: number | null;
  paymentDate: string | null;
  studentName: string;
  studentEmail: string;
  studentPaymentCode: string;
  stateId: number;
  stateCode: VoucherStateCode;
  stateName: string;
  file: StoredFileSummaryResponse;
  observation?: string;
  createdAt: string;
  updatedAt: string;
}

export interface VoucherCreateRequest {
  paymentId: string;
  stateId: number;
  fileId: string;
  observation?: string;
}

export interface VoucherUpdateRequest {
  paymentId: string;
  stateId: number;
  fileId: string;
  observation?: string;
}
