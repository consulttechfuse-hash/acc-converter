import { describe, it, expect } from 'vitest';
import { convert, runInvariantTest } from './engine';

describe('GHD Math Engine', () => {
  const mockGoldUsd = 2400; // $2400 per oz
  const mockUsdToZar = 18.5; // 18.5 ZAR per USD

  it('should correctly convert Fiat to Token', () => {
    // 1 GHD = 2400 * 18.5 * 0.1033 = 4586.52 ZAR
    const result = convert(4586.52, 'fiatToToken', 'gold', mockGoldUsd, mockUsdToZar);
    expect(result.output).toBeCloseTo(1, 5); // Should be very close to 1 GHD
  });

  it('should correctly convert Token to Fiat', () => {
    const result = convert(1, 'tokenToFiat', 'gold', mockGoldUsd, mockUsdToZar);
    expect(result.output).toBeCloseTo(4586.52, 2);
  });

  it('should pass the Fiat Invariance Test', () => {
    const isInvariant = runInvariantTest(mockGoldUsd, mockUsdToZar);
    expect(isInvariant).toBe(true);
  });
});