export type VoucherStateCode = 'PENDING' | 'VALIDATED' | 'OBSERVED' | 'REJECTED';

export interface VoucherResponse {
  id: string;
  studentName: string;
  studentPaymentCode: string;
  concept: string;
  declaredAmount: number;
  fileUrl: string;
  stateCode: VoucherStateCode;
  observation?: string;
  uploadedAt: string;
}

export interface VoucherReviewRequest {
  action: 'VALIDATE' | 'OBSERVE' | 'REJECT';
  observation?: string;
}
