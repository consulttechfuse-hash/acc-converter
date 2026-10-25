import { useQuery } from '@tanstack/react-query';

// 1. Fetch Metals (Keep your existing API for this)
const fetchMetals = async () => {
  // Example placeholder:
  return { goldUsd: 4185.13, silverUsd: 60.32 }; 
};

// 2. Fetch Forex Rates (UPDATED to fetch ALL currencies)
const fetchForex = async () => {
  try {
    const res = await fetch('https://api.frankfurter.app/latest?from=USD');
    const data = await res.json();
    
    // Frankfurter returns rates relative to USD (e.g., 1 USD = 1.5 AUD)
    // Our engine expects to know "How many USD is 1 AUD?"
    // So we invert the rates and ensure USD is 1.
    
    const rates: Record<string, number> = { USD: 1 }; // Base
    
    Object.entries(data.rates).forEach(([currency, rate]) => {
      // Invert: 1 / 1.50 = 0.666 (1 AUD = $0.66 USD)
      rates[currency] = 1 / Number(rate); 
    });
    
    return rates;
  } catch (error) {
    console.error("Failed to fetch forex", error);
    // Fallback if API fails
    return { USD: 1, ZAR: 0.06, AUD: 0.66 }; 
  }
};

// 3. Fetch Crypto (Keep this exactly as we built it)
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

// 4. The Master Hook
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
    staleTime: 15000, // Refresh every 15 seconds
    refetchInterval: 15000,
  });
};