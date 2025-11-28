export interface Deposit {
  id: string;
  userId: string;
  amount: number;
  paymentMethod: 'bank_transfer' | 'multicaixa';
  bankDetails?: {
    bankName: string;
    iban: string;
  };
  multicaixaNumber?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  approvedAt?: string;
  approvedBy?: string;
  rejectionReason?: string;
}

export interface DepositRequest {
  amount: number;
  paymentMethod: 'bank_transfer' | 'multicaixa';
  bankDetails?: {
    bankName: string;
    iban: string;
  };
  multicaixaNumber?: string;
}
