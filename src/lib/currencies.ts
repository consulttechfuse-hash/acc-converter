export interface Currency {
  code: string;
  name: string;
  symbol: string;
}

export const CURRENCIES: Currency[] = [
  { code: 'GHD', name: 'Gold-Anchored Token', symbol: 'G' },
  { code: 'GHD_SILVER', name: 'Silver-Anchored Token', symbol: 'S' },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R' },
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  // Add more here later
];