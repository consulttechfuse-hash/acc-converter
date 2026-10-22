export interface Currency {
  code: string;
  name: string;
  symbol: string;
  countryCode?: string;
  type: 'fiat' | 'crypto';
}

export const CURRENCIES: Currency[] = [
  // --- MAJOR FIAT CURRENCIES ---
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
  { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$', countryCode: 'nz', type: 'fiat' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', countryCode: 'sg', type: 'fiat' },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$', countryCode: 'hk', type: 'fiat' },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr', countryCode: 'se', type: 'fiat' },
  { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr', countryCode: 'no', type: 'fiat' },
  { code: 'DKK', name: 'Danish Krone', symbol: 'kr', countryCode: 'dk', type: 'fiat' },
  { code: 'PLN', name: 'Polish Zloty', symbol: 'zł', countryCode: 'pl', type: 'fiat' },
  { code: 'CZK', name: 'Czech Koruna', symbol: 'Kč', countryCode: 'cz', type: 'fiat' },
  { code: 'HUF', name: 'Hungarian Forint', symbol: 'Ft', countryCode: 'hu', type: 'fiat' },
  { code: 'RON', name: 'Romanian Leu', symbol: 'lei', countryCode: 'ro', type: 'fiat' },
  { code: 'BGN', name: 'Bulgarian Lev', symbol: 'лв', countryCode: 'bg', type: 'fiat' },
  { code: 'TRY', name: 'Turkish Lira', symbol: '₺', countryCode: 'tr', type: 'fiat' },
  { code: 'RUB', name: 'Russian Ruble', symbol: '₽', countryCode: 'ru', type: 'fiat' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', countryCode: 'br', type: 'fiat' },
  { code: 'MXN', name: 'Mexican Peso', symbol: '$', countryCode: 'mx', type: 'fiat' },
  { code: 'ARS', name: 'Argentine Peso', symbol: '$', countryCode: 'ar', type: 'fiat' },
  { code: 'CLP', name: 'Chilean Peso', symbol: '$', countryCode: 'cl', type: 'fiat' },
  { code: 'COP', name: 'Colombian Peso', symbol: '$', countryCode: 'co', type: 'fiat' },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩', countryCode: 'kr', type: 'fiat' },
  { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp', countryCode: 'id', type: 'fiat' },
  { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM', countryCode: 'my', type: 'fiat' },
  { code: 'PHP', name: 'Philippine Peso', symbol: '₱', countryCode: 'ph', type: 'fiat' },
  { code: 'THB', name: 'Thai Baht', symbol: '฿', countryCode: 'th', type: 'fiat' },
  { code: 'VND', name: 'Vietnamese Dong', symbol: '₫', countryCode: 'vn', type: 'fiat' },
  { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', countryCode: 'ae', type: 'fiat' },
  { code: 'SAR', name: 'Saudi Riyal', symbol: 'ر.س', countryCode: 'sa', type: 'fiat' },
  { code: 'ILS', name: 'Israeli Shekel', symbol: '₪', countryCode: 'il', type: 'fiat' },
  { code: 'EGP', name: 'Egyptian Pound', symbol: 'E£', countryCode: 'eg', type: 'fiat' },
  { code: 'NGN', name: 'Nigerian Naira', symbol: '₦', countryCode: 'ng', type: 'fiat' },
  { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh', countryCode: 'ke', type: 'fiat' },
  { code: 'GHS', name: 'Ghanaian Cedi', symbol: '₵', countryCode: 'gh', type: 'fiat' },

  // --- CRYPTO TOKENS ---
  { code: 'ACC', name: 'All Currency Converter (Gold)', symbol: 'ACC', type: 'crypto' },
  { code: 'ACC_SILVER', name: 'All Currency Converter (Silver)', symbol: 'ACC', type: 'crypto' },
];