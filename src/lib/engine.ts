// The exact Anchor Weights derived from the live GHD Calculator
export const K_G = 0.1000; // Gold Anchor (Exactly 1/10th of an ounce)
export const K_S = 0.1033; // Silver Anchor

interface ConvertParams {
  amount: number;
  sendType: 'fiat' | 'crypto' | 'acc';
  receiveType: 'fiat' | 'crypto' | 'acc';
  activeAsset: 'gold' | 'silver';
  sendCurrency: string;
  receiveCurrency: string;
  market: {
    goldUsd: number;
    silverUsd: number;
    forexRates: Record<string, number>;
    cryptoRates: Record<string, number>;
  };
}

export function convert(params: ConvertParams) {
  const { amount, sendType, receiveType, activeAsset, sendCurrency, receiveCurrency, market } = params;
  
  // 1. Get the USD value of 1 unit of the source asset
  const getUsdValue = (type: string, code: string) => {
    if (type === 'fiat') {
      const rate = market.forexRates[code];
      if (!rate) return 0; // Prevents 1:1 ghost conversions
      return 1 / rate;
    }
    
    if (type === 'crypto') {
      return market.cryptoRates[code] || 0;
    }
    
    if (type === 'acc') {
      const isSilver = code === 'ACC_SILVER' || activeAsset === 'silver';
      const peg = isSilver ? K_S : K_G;
      const metal = isSilver ? market.silverUsd : market.goldUsd;
      return metal * peg;
    }
    
    return 0;
  };

  const sourceUsdValue = getUsdValue(sendType, sendCurrency);
  const targetUsdValue = getUsdValue(receiveType, receiveCurrency);

  // If we couldn't find the rate for either currency, return 0
  if (sourceUsdValue === 0 || targetUsdValue === 0) {
    return { output: 0 };
  }

  // 2. Convert to USD
  const amountInUsd = amount * sourceUsdValue;

  // 3. Convert from USD to target
  const finalOutput = amountInUsd / targetUsdValue;

  return { output: finalOutput };
}