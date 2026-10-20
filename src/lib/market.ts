import { useQuery } from '@tanstack/react-query';

const fetchMarketData = async () => {
  // 1. Fetch Forex Rates (Free, no key required)
  const forexRes = await fetch('https://open.er-api.com/v6/latest/USD');
  const forexData = await forexRes.json();
  
  // 2. Fetch Metals (Using a free public fallback. 
  // To use a real key later, swap this URL with your GoldAPI/MetalpriceAPI endpoint)
  let goldUsd = 2415.50; // Fallback
  let silverUsd = 28.45; // Fallback
  try {
    // This free endpoint provides current spot prices without a key
    const metalRes = await fetch('https://api.metalpriceapi.com/v1/latest?api_key=demo&base=USD&currencies=XAU,XAG');
    const metalData = await metalRes.json();
    if (metalData && metalData.rates) {
      // MetalpriceAPI returns 1/XAU for the rate, so we invert it to get USD per oz
      goldUsd = 1 / metalData.rates.XAU;
      silverUsd = 1 / metalData.rates.XAG;
    }
  } catch (e) {
    console.warn("Using fallback metal prices", e);
  }

  return {
    goldUsd,
    silverUsd,
    usdToZar: forexData.rates.ZAR || 18.72,
    usdToEur: forexData.rates.EUR || 0.92,
    lastUpdated: new Date().toISOString(),
    // Mock data for the line chart (We can wire this to a real historical API later)
    historyData: [
      { date: 'Mon', price: goldUsd - 15 },
      { date: 'Tue', price: goldUsd + 5 },
      { date: 'Wed', price: goldUsd - 2 },
      { date: 'Thu', price: goldUsd + 12 },
      { date: 'Fri', price: goldUsd },
    ]
  };
};

export function useMarketData() {
  return useQuery({
    queryKey: ['marketData'],
    queryFn: fetchMarketData,
    // Keep refetching every 60 seconds for live updates
    refetchInterval: 60000, 
    staleTime: 30000, 
  });
}