import currencyCodes from 'currency-codes';
import lookup from 'country-code-lookup';

export interface Currency {
  code: string;
  name: string;
  symbol: string;
  countryCode?: string;
}

// Build the list dynamically
const fiatCurrencies = currencyCodes.data
  .filter(c => c.code.length === 3)
  .map(c => {
    const country = lookup.byIso(c.code.slice(0, 2));
    return {
      code: c.code,
      name: c.currency,
      symbol: c.code, // Fallback to code since 'symbol' isn't in the package
      countryCode: country?.iso2.toLowerCase(),
    };
  })
  .sort((a, b) => a.code.localeCompare(b.code));

export const CURRENCIES: Currency[] = [
  { code: 'GHD', name: 'Gold-Anchored Token', symbol: 'G' },
  { code: 'GHD_SILVER', name: 'Silver-Anchored Token', symbol: 'S' },
  ...fiatCurrencies,
];