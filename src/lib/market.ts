import { useQuery } from '@tanstack/react-query';

// 1. Fetch Metals (Keep your existing API for this)
const fetchMetals = async () => {
  // Example placeholder: Replace with your actual metals fetch if different
  return { goldUsd: 4185.13, silverUsd: 60.32 }; 
};

// 2. Fetch Forex Rates (FIXED: No more inversion, returns raw API rates)
const fetchForex = async () => {
  try {
    const res = await fetch('https://api.frankfurter.app/latest?from=USD');
    const data = await res.json();
    
    // Frankfurter returns rates relative to USD (e.g., 1 USD = 1.52 AUD)
    // We store them exactly as they are, and the engine will handle the conversion.
    const rates: Record<string, number> = { ...data.rates, USD: 1 };
    
    return rates;
  } catch (error) {
    console.error("Failed to fetch forex", error);
    // Fallback if the API fails (approx rates)
    return { USD: 1, ZAR: 18.50, AUD: 1.52, EUR: 0.92, GBP: 0.79 }; 
  }
};

// 3. Fetch Crypto (Coinbase API)
const fetchCrypto = async () => {
  try {
    const res = await fetch('https://api.coinbase.com/v2/exchange-rates?currency=USD');
    const data = await res.json();
    
    const cryptos: Record<string, number> = {};
    // The list of top 20 coins we want to support
    const targets = ['BTC', 'ETH', 'XRP', 'SOL', 'ADA', 'DOGE', 'LTC', 'DOT', 'AVAX', 'MATIC', 'LINK', 'UNI', 'ATOM', 'XLM', 'BCH', 'ETC', 'FIL', 'TRX', 'EOS', 'SHIB'];
    
    targets.forEach(coin => {
      if (data.data.rates[coin]) {
        // Coinbase returns: 1 USD = 0.000023 BTC
        // We invert it to get: 1 BTC = 65000 USD (which is what the engine expects)
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
    staleTime: 15000, // Cache for 15 seconds
    refetchInterval: 15000, // Refresh in background every 15 seconds
  });
};