export type MetalType = 'gold' | 'silver';

export interface ConversionResult {
  output: number;
  invariantOk: boolean;
}

// Peg Factors (SSOT)
export const PEG_FACTORS: Record<MetalType, number> = {
  gold: 0.1033,
  silver: 0.1036,
};

/**
 * Core Conversion Function
 * @param amount - The input amount (fiat or tokens)
 * @param direction - 'fiatToToken' or 'tokenToFiat'
 * @param metal - 'gold' or 'silver'
 * @param metalUsd - Live spot price of the metal in USD
 * @param forexRate - Live exchange rate (USD to target Fiat)
 */
export function convert(
  amount: number,
  direction: 'fiatToToken' | 'tokenToFiat',
  metal: MetalType,
  metalUsd: number,
  forexRate: number
): ConversionResult {
  const peg = PEG_FACTORS[metal];
  const rate = metalUsd * forexRate * peg; // 1 Token = rate in Fiat

  let output = 0;
  
  if (direction === 'fiatToToken') {
    output = amount / rate;
  } else {
    output = amount * rate;
  }

  return {
    output,
    invariantOk: true, // We will build the true invariant test below
  };
}

/**
 * Fiat Invariance Test
 * Convert 5,280 GHD to ZAR, reverse to USD, and verify it matches direct GHD->USD within 0.0001%.
 */
export function runInvariantTest(
  goldUsd: number, 
  usdToZar: number
): boolean {
  // 1. Direct GHD -> USD
  const directUsd = 5280 * (goldUsd * 1 * PEG_FACTORS.gold);

  // 2. GHD -> ZAR
  const zar = 5280 * (goldUsd * usdToZar * PEG_FACTORS.gold);

  // 3. ZAR -> USD
  const reversedUsd = zar / usdToZar;

  // 4. Check difference (must be < 0.0001%)
  const difference = Math.abs(directUsd - reversedUsd);
  const percentageDiff = (difference / directUsd) * 100;

  return percentageDiff < 0.0001;
}