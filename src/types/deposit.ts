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
  receiptUrl?: string;
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

export interface Transaction {
  id: string;
  userId: string;
  type: 'deposit' | 'withdrawal' | 'investment' | 'return';
  amount: number;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  description: string;
  createdAt: string;
  approvedAt?: string;
  relatedDepositId?: string;
}
