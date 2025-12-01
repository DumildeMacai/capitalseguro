import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { calculateReturn } from "@/utils/interestCalculations"

interface Investment {
  id: string
  name: string
  type: string
  value: number
  dateISO: string
  status: string
  return: number
  tipoJuros: string
  tipoRenda: string
}

interface ReturnsEvolutionChartProps {
  investments: Investment[]
}

const ReturnsEvolutionChart = ({ investments }: ReturnsEvolutionChartProps) => {
  // Gera dados para 0-365 dias
  const chartData = Array.from({ length: 366 }, (_, i) => {
    const day = i
    const dayLabel = day === 0 ? "Hoje" : `Dia ${day}`
    
    let totalReturn = 0
    
    investments.forEach((inv) => {
      const investmentDate = new Date(inv.dateISO)
      const dataPoint = new Date(investmentDate)
      dataPoint.setDate(dataPoint.getDate() + day)
      
      // Calcula retorno para este dia
      const annualReturn = inv.return || 50
      const interestType = inv.tipoJuros || "simples"
      
      const dailyReturn = calculateReturn(
        inv.value,
        annualReturn,
        day,
        interestType as "simples" | "composto"
      )
      
      totalReturn += dailyReturn
    })
    
    return {
      day: dayLabel,
      retorno: Math.round(totalReturn),
    }
  }).filter((_, i) => i % 30 === 0) // Mostrar a cada 30 dias para não ficar muito denso

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={chartData}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip
          formatter={(value) => [`Kz ${(value as number).toLocaleString('pt-PT')}`, 'Retorno Acumulado']}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="retorno"
          stroke="#00C49F"
          name="Retorno Acumulado"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

export default ReturnsEvolutionChart
