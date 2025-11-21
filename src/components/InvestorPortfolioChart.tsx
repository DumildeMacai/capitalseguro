
import { PieChart, Pie, BarChart, Bar, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts";

interface PortfolioData {
  name: string;
  value: number;
}

interface InvestorPortfolioChartProps {
  data: PortfolioData[];
  showBars?: boolean;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

const InvestorPortfolioChart = ({ data, showBars = false }: InvestorPortfolioChartProps) => {
  const totalValue = data.reduce((sum, item) => sum + item.value, 0);
  
  if (showBars) {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip
            formatter={(value) => [`Kz ${value.toLocaleString('pt-PT')}`, 'Valor']}
          />
          <Legend />
          <Bar dataKey="value" name="Valor Investido">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  }
  
  return (
    <div className="w-full h-64 relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value) => [`Kz ${value.toLocaleString('pt-PT')}`, 'Valor']}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center">
          <p className="text-sm font-medium text-muted-foreground">Total</p>
          <p className="text-xl font-bold">Kz {totalValue.toLocaleString('pt-PT')}</p>
        </div>
      </div>
    </div>
  );
};

export default InvestorPortfolioChart;
