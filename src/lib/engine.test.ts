import { describe, it, expect } from 'vitest';
import { convert } from './engine';

describe('Calculation Engine', () => {
  const mockGoldUsd = 4185.13;
  const mockUsdToZar = 16.5150;

  it('converts Fiat to Token correctly (ZAR to ACC Gold)', () => {
    // 1. Test Fiat -> Token using the new object syntax
    const result = convert({
      amount: 1000,
      direction: 'fiatToToken',
      activeAsset: 'gold',
      metalPrice: mockGoldUsd,
      forex: mockUsdToZar,
    });
    
    // 1000 ZAR / (4185.13 * 16.5150 * 0.1033) = ~0.1399 ACC
    expect(result.output).toBeCloseTo(0.1399, 3);
  });

  it('converts Token to Fiat correctly (ACC Gold to ZAR)', () => {
    // 2. Test Token -> Fiat
    const result = convert({
      amount: 1,
      direction: 'tokenToFiat',
      activeAsset: 'gold',
      metalPrice: mockGoldUsd,
      forex: mockUsdToZar,
    });
    
    // 1 ACC * 4185.13 * 16.5150 * 0.1033 = ~7143.53 ZAR
    expect(result.output).toBeCloseTo(7143.53, 1);
  });

  it('converts Fiat to Fiat correctly (USD to ZAR)', () => {
    // 3. Test the new Fiat -> Fiat logic
    const result = convert({
      amount: 1,
      direction: 'fiatToFiat',
      activeAsset: 'gold',
      metalPrice: mockGoldUsd,
      forex: mockUsdToZar,       // Target (ZAR)
      sourceForex: 1,            // Source (USD)
    });
    
    // 1 USD * 16.5150 = 16.5150 ZAR
    expect(result.output).toBeCloseTo(16.5150, 2);
  });
});