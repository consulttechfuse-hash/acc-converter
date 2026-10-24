import { useQuery } from '@tanstack/react-query';

// Fetch Gold & Silver in USD (Keep your existing API here)
const fetchMetals = async () => {
  // Replace with your existing metals API call
  return { goldUsd: 4185.13, silverUsd: 60.32 }; 
};

// Fetch Forex rates (Keep your existing API here)
const fetchForex = async () => {
  // Replace with your existing forex API call
  return { ZAR: 16.5150, EUR: 0.92, USD: 1, GBP: 0.79, /* ... */ }; 
};

// NEW: Fetch Crypto prices in USD
const fetchCrypto = async () => {
  try {
    const res = await fetch('https://api.coinbase.com/v2/exchange-rates?currency=USD');
    const data = await res.json();
    // Coinbase returns rates like { BTC: 0.000023, ETH: 0.0004 }
    // We need to invert this to get USD price per coin (e.g., 1 BTC = $60,000)
    const cryptos: Record<string, number> = {};
    const targets = ['BTC', 'ETH', 'XRP', 'SOL', 'ADA', 'DOGE', 'LTC', 'DOT', 'AVAX', 'MATIC', 'LINK', 'UNI', 'ATOM', 'XLM', 'BCH', 'ETC', 'FIL', 'TRX', 'EOS', 'SHIB'];
    
    targets.forEach(coin => {
      if (data.data.rates[coin]) {
        cryptos[coin] = 1 / Number(data.data.rates[coin]);
      }
    });
    return cryptos; // Returns { BTC: 65000, ETH: 3500, ... }
  } catch (e) {
    console.error("Failed to fetch crypto", e);
    return {};
  }
};

export const useMarketData = () => {
  return useQuery({
    queryKey: ['market'],
    queryFn: async () => {
      const [metals, forex, crypto] = await Promise.all([
        fetchMetals(),
        fetchForex(),
        fetchCrypto()
      ]);
      return { ...metals, forexRates: forex, cryptoRates: crypto };
    },
    staleTime: 15000,
    refetchInterval: 15000,
  });
};