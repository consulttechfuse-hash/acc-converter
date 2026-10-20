import { useQuery } from '@tanstack/react-query';

const fetchMarketData = async () => {
  // 1. Fetch Forex
  const forexRes = await fetch('https://open.er-api.com/v6/latest/USD');
  const forexData = await forexRes.json();
  
  // 2. Fetch Live Spot Prices
  let goldUsd = 2415.50; 
  let silverUsd = 28.45; 
  try {
    const metalRes = await fetch('https://xaus.com/api/v1/spot');
    if (metalRes.ok) {
      const metalData = await metalRes.json();
      goldUsd = metalData.spot_usd_oz || goldUsd;
      silverUsd = metalData.silver_usd_oz || silverUsd;
    }
  } catch (e) {
    console.warn("Using fallback metal prices", e);
  }

  // 3. Fetch Historical Data for Chart (Last 30 days)
  let historyData = [];
  let silverHistoryData = [];
  try {
    const historyRes = await fetch('https://xaus.com/api/v1/history');
    if (historyRes.ok) {
      const historicalData = await historyRes.json();
      
      // Map the API response to our chart format { date, price }
      // Assuming the API returns an array of objects with date and gold/silver prices
      historyData = historicalData.map((item: any) => ({
        date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        price: item.gold_usd
      })).slice(-30); // Keep last 30 days

      silverHistoryData = historicalData.map((item: any) => ({
        date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        price: item.silver_usd
      })).slice(-30);

    } else {
      throw new Error("History API failed");
    }
  } catch (e) {
    console.warn("Using fallback historical data", e);
    // Fallback: Generate 30 days of mock data if API fails
    const today = new Date();
    let currentGold = goldUsd - 30;
    let currentSilver = silverUsd - 0.5;
    
    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      currentGold = currentGold + (Math.random() - 0.48) * 15;
      currentSilver = currentSilver + (Math.random() - 0.48) * 0.4;
      
      if (i === 0) {
        currentGold = goldUsd;
        currentSilver = silverUsd;
      }
      
      historyData.push({ date: dateStr, price: Number(currentGold.toFixed(2)) });
      silverHistoryData.push({ date: dateStr, price: Number(currentSilver.toFixed(2)) });
    }
  }

  return {
    goldUsd,
    silverUsd,
    forexRates: forexData.rates, 
    lastUpdated: new Date().toISOString(),
    historyData,
    silverHistoryData,
  };
};

export function useMarketData() {
  return useQuery({
    queryKey: ['marketData'],
    queryFn: fetchMarketData,
    refetchInterval: 60000, 
    staleTime: 30000, 
  });
}