import { describe, it, expect } from 'vitest';
import { convert } from './engine';

describe('Calculation Engine', () => {
  const mockMarket = {
    goldUsd: 4185.13,
    silverUsd: 60.32,
    forexRates: { USD: 1, ZAR: 16.5150 },
    cryptoRates: { BTC: 65000 }
  };

  it('converts Fiat to Token correctly (ZAR to ACC Gold)', () => {
    const result = convert({
      amount: 1000,
      sendType: 'fiat',
      receiveType: 'acc',
      activeAsset: 'gold',
      sendCurrency: 'ZAR',
      receiveCurrency: 'ACC',
      market: mockMarket
    });
    expect(result.output).toBeCloseTo(0.1399, 3);
  });

  it('converts Token to Fiat correctly (ACC Gold to ZAR)', () => {
    const result = convert({
      amount: 1,
      sendType: 'acc',
      receiveType: 'fiat',
      activeAsset: 'gold',
      sendCurrency: 'ACC',
      receiveCurrency: 'ZAR',
      market: mockMarket
    });
    expect(result.output).toBeCloseTo(7143.53, 1);
  });

  it('converts Crypto to Fiat correctly (BTC to ZAR)', () => {
    const result = convert({
      amount: 1,
      sendType: 'crypto',
      receiveType: 'fiat',
      activeAsset: 'gold',
      sendCurrency: 'BTC',
      receiveCurrency: 'ZAR',
      market: mockMarket
    });
    // 1 BTC = $65,000 * 16.5150 = 1,073,475 ZAR
    expect(result.output).toBeCloseTo(1073475, 0);
  });
});