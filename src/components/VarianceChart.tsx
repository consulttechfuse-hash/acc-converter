import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface VarianceChartProps {
  data: { date: string; price: number }[];
  silverHistoryData: { date: string; price: number }[];
  timeframe: '1W' | '1M';
  setTimeframe: (tf: '1W' | '1M') => void;
}

export function VarianceChart({ data, silverHistoryData, timeframe, setTimeframe }: VarianceChartProps) {
  const [metal, setMetal] = useState<'gold' | 'silver'>('gold');

  const activeData = metal === 'gold' ? data : silverHistoryData;
  const chartData = timeframe === '1W' ? activeData.slice(-7) : activeData;
  
  const chartColor = metal === 'gold' ? '#D4AF37' : '#E5E4E2';
  const chartTitle = metal === 'gold' ? 'Gold Variance' : 'Silver Variance';

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-white">{chartTitle}</h3>
        
        <div className="flex gap-2">
          {/* Metal Toggle */}
          <div className="flex bg-page-bg rounded-lg p-1 border border-elevated-bg">
            <button
              onClick={() => setMetal('gold')}
              className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${metal === 'gold' ? 'bg-elevated-bg text-ghd-gold' : 'text-gray-400 hover:text-white'}`}
            >
              Gold
            </button>
            <button
              onClick={() => setMetal('silver')}
              className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${metal === 'silver' ? 'bg-elevated-bg text-white' : 'text-gray-400 hover:text-white'}`}
            >
              Silver
            </button>
          </div>

          {/* Timeframe Toggle */}
          <div className="flex bg-page-bg rounded-lg p-1 border border-elevated-bg">
            <button
              onClick={() => setTimeframe('1W')}
              className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${timeframe === '1W' ? 'bg-elevated-bg text-white' : 'text-gray-400 hover:text-white'}`}
            >
              1W
            </button>
            <button
              onClick={() => setTimeframe('1M')}
              className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${timeframe === '1M' ? 'bg-elevated-bg text-white' : 'text-gray-400 hover:text-white'}`}
            >
              1M
            </button>
          </div>
        </div>
      </div>

      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ left: 10, right: 10, top: 10, bottom: 0 }}>
            <XAxis 
              dataKey="date" 
              stroke="#666" 
              fontSize={11} 
              tickLine={false} 
              axisLine={false}
              minTickGap={20}
            />
            <YAxis 
              stroke="#666" 
              fontSize={11} 
              tickLine={false} 
              axisLine={false} 
              domain={['dataMin - (dataMax - dataMin) * 0.1', 'dataMax + (dataMax - dataMin) * 0.1']}
              tickFormatter={(value) => `$${value.toFixed(0)}`}
              width={45}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#222222', borderColor: '#2D2D2D', color: '#fff', borderRadius: '8px' }}
              itemStyle={{ color: chartColor }}
              formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']}
            />
            <Line 
              type="monotone" 
              dataKey="price" 
              stroke={chartColor} 
              strokeWidth={2} 
              dot={false}
              activeDot={{ r: 6, fill: chartColor }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}