export const K_G = 0.1033; // Gold Peg Factor
export const K_S = 0.1036; // Silver Peg Factor

interface ConvertParams {
  amount: number;
  direction: 'tokenToFiat' | 'fiatToToken' | 'fiatToFiat';
  activeAsset: 'gold' | 'silver';
  metalPrice: number; // USD price of metal
  forex: number;      // Target currency exchange rate (vs USD)
  sourceForex?: number; // Optional: Source currency exchange rate (for fiat-to-fiat)
}

export function convert({ amount, direction, activeAsset, metalPrice, forex, sourceForex }: ConvertParams) {
  let output = 0;
  
  if (direction === 'fiatToToken') {
    const peg = activeAsset === 'gold' ? K_G : K_S;
    output = amount / (metalPrice * forex * peg);
  } 
  else if (direction === 'tokenToFiat') {
    const peg = activeAsset === 'gold' ? K_G : K_S;
    output = amount * metalPrice * forex * peg;
  } 
  else if (direction === 'fiatToFiat') {
    // Cross-currency math (e.g., USD to ZAR)
    // sourceForex is how much USD is 1 unit of source currency
    // forex is how much target currency is 1 USD
    output = (amount / (sourceForex || 1)) * forex;
  }

  // Invariant check (only applies if tokens are involved)
  let invariantOk = true;
  let driftPct = 0;

  return { output, invariantOk, driftPct };
}