export const DEFAULT_CURRENCIES = [
  { id: 1, currency_name: 'US Dollar', currency_code: 'USD', currency_symbol: '$', is_default: true, is_active: true },
  { id: 2, currency_name: 'Indian Rupee', currency_code: 'INR', currency_symbol: '₹', is_default: false, is_active: true },
  { id: 3, currency_name: 'Euro', currency_code: 'EUR', currency_symbol: '€', is_default: false, is_active: true },
  { id: 4, currency_name: 'British Pound', currency_code: 'GBP', currency_symbol: '£', is_default: false, is_active: true },
  { id: 5, currency_name: 'UAE Dirham', currency_code: 'AED', currency_symbol: 'د.إ', is_default: false, is_active: true },
  { id: 6, currency_name: 'Saudi Riyal', currency_code: 'SAR', currency_symbol: '﷼', is_default: false, is_active: true },
  { id: 7, currency_name: 'Singapore Dollar', currency_code: 'SGD', currency_symbol: 'S$', is_default: false, is_active: true },
  { id: 8, currency_name: 'Canadian Dollar', currency_code: 'CAD', currency_symbol: 'C$', is_default: false, is_active: true },
  { id: 9, currency_name: 'Australian Dollar', currency_code: 'AUD', currency_symbol: 'A$', is_default: false, is_active: true },
];

export const getCurrencySymbol = (code, currencies = DEFAULT_CURRENCIES) => {
  if (!code) return '$';
  const match = currencies.find(c => c.currency_code?.toUpperCase() === code?.toUpperCase());
  return match ? match.currency_symbol : (code === 'INR' ? '₹' : code === 'EUR' ? '€' : code === 'GBP' ? '£' : code === 'AED' ? 'د.إ' : code === 'SAR' ? '﷼' : '$');
};

