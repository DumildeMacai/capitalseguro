export type Investment = {
  id: string
  title: string
  description: string
  category: string
  icon?: React.ReactNode
  returnRate: number
  minInvestment: number
  remaining: number
  totalFunding: number
  image: string
  featured?: boolean
  risk?: "Baixo" | "Médio" | "Alto"
  tipoJuros?: string
  tipo_renda?: string
}

export type UserInvestment = {
  id: string
  investmentId?: string
  title: string
  category: string
  icon?: React.ReactNode
  amountInvested: number
  currentValue: number
  returnRate: number
  startDate: string
  endDate: string
  status: string
  progress: number
}
