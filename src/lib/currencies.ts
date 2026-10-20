export interface Currency {
  code: string;
  name: string;
  symbol: string;
  countryCode?: string; // For the flag
}

export const CURRENCIES: Currency[] = [
  { code: 'GHD', name: 'Gold-Anchored Token', symbol: 'G' }, // No flag for token
  { code: 'GHD_SILVER', name: 'Silver-Anchored Token', symbol: 'S' },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R', countryCode: 'za' },
  { code: 'USD', name: 'US Dollar', symbol: '$', countryCode: 'us' },
  { code: 'EUR', name: 'Euro', symbol: '€', countryCode: 'eu' },
  { code: 'GBP', name: 'British Pound', symbol: '£', countryCode: 'gb' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', countryCode: 'au' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', countryCode: 'ca' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', countryCode: 'jp' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'Fr', countryCode: 'ch' },
  // You can add more from the ISO 3166 list here
];