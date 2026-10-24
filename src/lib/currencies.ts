export interface Currency {
  code: string;
  name: string;
  symbol: string;
  countryCode?: string;
  type: 'fiat' | 'crypto' | 'acc';
}

export const CURRENCIES: Currency[] = [
  // --- FIAT CURRENCIES ---
  { code: 'USD', name: 'US Dollar', symbol: '$', countryCode: 'us', type: 'fiat' },
  { code: 'EUR', name: 'Euro', symbol: '€', countryCode: 'eu', type: 'fiat' },
  { code: 'GBP', name: 'British Pound', symbol: '£', countryCode: 'gb', type: 'fiat' },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R', countryCode: 'za', type: 'fiat' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', countryCode: 'au', type: 'fiat' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', countryCode: 'ca', type: 'fiat' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', countryCode: 'ch', type: 'fiat' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', countryCode: 'cn', type: 'fiat' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', countryCode: 'jp', type: 'fiat' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', countryCode: 'in', type: 'fiat' },
  { code: 'NGN', name: 'Nigerian Naira', symbol: '₦', countryCode: 'ng', type: 'fiat' },
  { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh', countryCode: 'ke', type: 'fiat' },
  { code: 'GHS', name: 'Ghanaian Cedi', symbol: '₵', countryCode: 'gh', type: 'fiat' },

  // --- ACC TOKENS ---
  { code: 'ACC', name: 'ACC Gold', symbol: 'ACC', type: 'acc' },
  { code: 'ACC_SILVER', name: 'ACC Silver', symbol: 'ACC', type: 'acc' },

  // --- CRYPTO (Top 20 for Luno/VALR compatibility) ---
  { code: 'BTC', name: 'Bitcoin', symbol: '₿', type: 'crypto' },
  { code: 'ETH', name: 'Ethereum', symbol: 'Ξ', type: 'crypto' },
  { code: 'XRP', name: 'Ripple', symbol: 'XRP', type: 'crypto' },
  { code: 'SOL', name: 'Solana', symbol: 'SOL', type: 'crypto' },
  { code: 'ADA', name: 'Cardano', symbol: 'ADA', type: 'crypto' },
  { code: 'DOGE', name: 'Dogecoin', symbol: 'Ð', type: 'crypto' },
  { code: 'LTC', name: 'Litecoin', symbol: 'Ł', type: 'crypto' },
  { code: 'DOT', name: 'Polkadot', symbol: 'DOT', type: 'crypto' },
  { code: 'AVAX', name: 'Avalanche', symbol: 'AVAX', type: 'crypto' },
  { code: 'MATIC', name: 'Polygon', symbol: 'MATIC', type: 'crypto' },
  { code: 'LINK', name: 'Chainlink', symbol: 'LINK', type: 'crypto' },
  { code: 'UNI', name: 'Uniswap', symbol: 'UNI', type: 'crypto' },
  { code: 'ATOM', name: 'Cosmos', symbol: 'ATOM', type: 'crypto' },
  { code: 'XLM', name: 'Stellar', symbol: 'XLM', type: 'crypto' },
  { code: 'BCH', name: 'Bitcoin Cash', symbol: 'BCH', type: 'crypto' },
  { code: 'ETC', name: 'Ethereum Classic', symbol: 'ETC', type: 'crypto' },
  { code: 'FIL', name: 'Filecoin', symbol: 'FIL', type: 'crypto' },
  { code: 'TRX', name: 'TRON', symbol: 'TRX', type: 'crypto' },
  { code: 'EOS', name: 'EOS', symbol: 'EOS', type: 'crypto' },
  { code: 'SHIB', name: 'Shiba Inu', symbol: 'SHIB', type: 'crypto' }
];