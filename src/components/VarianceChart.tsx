import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface VarianceChartProps {
  data: { date: string; price: number }[];
}

export function VarianceChart({ data }: VarianceChartProps) {
  return (
    <div className="h-48 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis 
            dataKey="date" 
            stroke="#666" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
          />
          <YAxis 
            stroke="#666" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
            domain={['dataMin - 10', 'dataMax + 10']}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#222222', borderColor: '#2D2D2D', color: '#fff' }}
            itemStyle={{ color: '#D4AF37' }}
          />
          <Line 
            type="monotone" 
            dataKey="price" 
            stroke="#D4AF37" 
            strokeWidth={2} 
            dot={{ fill: '#D4AF37', strokeWidth: 2 }} 
            activeDot={{ r: 6, fill: '#D4AF37' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}