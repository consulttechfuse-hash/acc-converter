export const K_G = 0.1033;
export const K_S = 0.1036;

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
  
  const goldUsd = market.goldUsd;
  
  const getUsdValue = (type: string, code: string) => {
    if (type === 'fiat') return 1 / (market.forexRates[code] || 1);
    if (type === 'crypto') return market.cryptoRates[code] || 0;
    if (type === 'acc') {
      const peg = (code === 'ACC_SILVER' || activeAsset === 'silver') ? K_S : K_G;
      const metal = (code === 'ACC_SILVER' || activeAsset === 'silver') ? market.silverUsd : goldUsd;
      return metal * peg;
    }
    return 0;
  };

  const sourceUsdValue = getUsdValue(sendType, sendCurrency);
  const targetUsdValue = getUsdValue(receiveType, receiveCurrency);

  if (sourceUsdValue === 0 || targetUsdValue === 0) return { output: 0 };

  const amountInUsd = amount * sourceUsdValue;
  const finalOutput = amountInUsd / targetUsdValue;

  return { output: finalOutput };
}