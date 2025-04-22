
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';

interface ChartProps {
  data?: any[];
  className?: string;
}

// Generate sample investment growth data
const generateGrowthData = (initialAmount: number, years: number) => {
  const annualReturnRate = 0.5; // 50% annual return
  const data = [];
  
  for (let i = 0; i <= years; i++) {
    data.push({
      year: `Year ${i}`,
      principal: initialAmount,
      value: initialAmount * Math.pow(1 + annualReturnRate, i),
    });
  }
  
  return data;
};

const Chart = ({ data = generateGrowthData(10000, 5), className = "" }: ChartProps) => {
  return (
    <div className={`w-full h-80 ${className}`}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#8884" opacity={0.5} />
          <XAxis 
            dataKey="year" 
            tickLine={false}
            axisLine={false}
            stroke="#8884"
          />
          <YAxis 
            tickFormatter={(value) => `$${value.toLocaleString()}`} 
            tickLine={false}
            axisLine={false}
            stroke="#8884"
          />
          <Tooltip 
            formatter={(value: number) => [`$${value.toLocaleString()}`, undefined]}
            contentStyle={{
              background: 'rgba(255, 255, 255, 0.8)',
              border: '1px solid #f0f0f0',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Legend />
          <Area 
            type="monotone" 
            dataKey="principal" 
            stackId="1"
            stroke="#8884d8" 
            fill="#8884d8"
            fillOpacity={0.2}
            name="Initial Investment"
          />
          <Area 
            type="monotone" 
            dataKey="value" 
            stackId="2" 
            stroke="#82ca9d" 
            fill="#82ca9d" 
            fillOpacity={0.8}
            name="Total Value"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;
