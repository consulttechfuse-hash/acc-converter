import { useQuery } from '@tanstack/react-query';

// 1. Fetch LIVE Metals (Gold & Silver) from a free, keyless API
const fetchMetals = async () => {
  try {
    // Using xaus.com for live spot prices (no API key required)
    const res = await fetch('https://xaus.com/api/v1/spot');
    const data = await res.json();
    
    // The API returns an array of metals. We find Gold (XAU) and Silver (XAG)
    const gold = data.find((m: any) => m.symbol === 'XAU');
    const silver = data.find((m: any) => m.symbol === 'XAG');

    return { 
      goldUsd: gold ? gold.price : 4185.13, // Fallback if API fails
      silverUsd: silver ? silver.price : 60.32 
    }; 
  } catch (error) {
    console.error("Failed to fetch metals, using fallback", error);
    return { goldUsd: 4185.13, silverUsd: 60.32 }; 
  }
};

// 2. Fetch Forex Rates (Frankfurter API)
const fetchForex = async () => {
  try {
    const res = await fetch('https://api.frankfurter.app/latest?from=USD');
    const data = await res.json();
    
    // We store them exactly as they are, and the engine will handle the conversion.
    const rates: Record<string, number> = { ...data.rates, USD: 1 };
    
    return rates;
  } catch (error) {
    console.error("Failed to fetch forex", error);
    // Fallback if the API fails (approx rates)
    return { USD: 1, ZAR: 16.47, AUD: 1.52, EUR: 0.92, GBP: 0.79 }; 
  }
};

// 3. Fetch Crypto (Coinbase API)
const fetchCrypto = async () => {
  try {
    const res = await fetch('https://api.coinbase.com/v2/exchange-rates?currency=USD');
    const data = await res.json();
    
    const cryptos: Record<string, number> = {};
    const targets = ['BTC', 'ETH', 'XRP', 'SOL', 'ADA', 'DOGE', 'LTC', 'DOT', 'AVAX', 'MATIC', 'LINK', 'UNI', 'ATOM', 'XLM', 'BCH', 'ETC', 'FIL', 'TRX', 'EOS', 'SHIB'];
    
    targets.forEach(coin => {
      if (data.data.rates[coin]) {
        cryptos[coin] = 1 / Number(data.data.rates[coin]);
      }
    });
    return cryptos;
  } catch (e) {
    console.error("Failed to fetch crypto", e);
    return {};
  }
};

// 4. The Master Hook (TanStack Query)
export const useMarketData = () => {
  return useQuery({
    queryKey: ['market'],
    queryFn: async () => {
      const [metals, forex, crypto] = await Promise.all([
        fetchMetals(),
        fetchForex(),
        fetchCrypto()
      ]);
      
      return { 
        goldUsd: metals.goldUsd, 
        silverUsd: metals.silverUsd, 
        forexRates: forex, 
        cryptoRates: crypto 
      };
    },
    staleTime: 15000, 
    refetchInterval: 15000, 
  });
};