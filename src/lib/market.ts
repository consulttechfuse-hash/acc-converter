import { useQuery } from '@tanstack/react-query';

const fetchMarketData = async () => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  return {
    goldUsd: 2415.50,
    silverUsd: 28.45,
    usdToZar: 18.72,
    usdToEur: 0.92,
    lastUpdated: new Date().toISOString(),
    // Mock data for the line chart
    historyData: [
      { date: 'Mon', price: 2400 },
      { date: 'Tue', price: 2420 },
      { date: 'Wed', price: 2415 },
      { date: 'Thu', price: 2430 },
      { date: 'Fri', price: 2415.50 },
    ]
  };
};

export function useMarketData() {
  return useQuery({
    queryKey: ['marketData'],
    queryFn: fetchMarketData,
    refetchInterval: 15000, 
    staleTime: 10000, 
  });
}