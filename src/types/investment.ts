import { ReactNode } from "react";

export interface Investment {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: ReactNode;
  returnRate: number;
  minInvestment: number;
  remaining: number;
  totalFunding: number;
  image: string;
  featured: boolean;
  risk: "Baixo" | "Médio" | "Alto";
}

export interface UserInvestment {
  id: string;
  investmentId: string;
  title: string;
  category: string;
  icon: ReactNode;
  amountInvested: number;
  currentValue: number;
  returnRate: number;
  startDate: string;
  endDate: string;
  status: "Ativo" | "Aguardando" | "Concluído";
  progress: number;
}
