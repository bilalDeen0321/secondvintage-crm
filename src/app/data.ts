import all_countries from '@/data/countries.json';
export const countries = all_countries.map(i => i.name);
export const currencies = [
    { code: "EUR", name: "Euro", symbol: "€" },
    { code: "USD", name: "US Dollar", symbol: "$" },
    { code: "GBP", name: "British Pound", symbol: "£" },
    { code: "CHF", name: "Swiss Franc", symbol: "CHF" },
    { code: "JPY", name: "Japanese Yen", symbol: "¥" },
    { code: "CAD", name: "Canadian Dollar", symbol: "C$" },
    { code: "AUD", name: "Australian Dollar", symbol: "A$" },
    { code: "SEK", name: "Swedish Krona", symbol: "kr" },
    { code: "NOK", name: "Norwegian Krone", symbol: "kr" },
    { code: "DKK", name: "Danish Krone", symbol: "kr" },
    { code: "CNY", name: "Chinese Yuan", symbol: "¥" },
    { code: "SGD", name: "Singapore Dollar", symbol: "S$" },
    { code: "HKD", name: "Hong Kong Dollar", symbol: "HK$" },
    { code: "VND", name: "Vietnamese Dong", symbol: "₫" },
];
export const currencies_with_lebel = [
    { id: 'USD', name: 'United States Dollar' },
    { id: 'EUR', name: 'Euro' },
    { id: 'VND', name: 'Vietnamese Dong' },
    { id: 'JPY', name: 'Japanese Yen' },
    { id: 'GBP', name: 'British Pound' },
    { id: 'CAD', name: 'Canadian Dollar' },
    { id: 'AUD', name: 'Australian Dollar' },
    { id: 'DKK', name: 'Danish Krone' }
];



export const brands = [
    "Rolex",
    "Omega",
    "TAG Heuer",
    "Breitling",
    "Patek Philippe",
    "Audemars Piguet",
    "Cartier",
    "IWC",
    "Panerai",
    "Tudor",
    "Seiko",
];

export const exchangeRates: Record<string, number> = {
    EUR: 1.0,
    USD: 1.1,
    GBP: 0.85,
    CHF: 0.95,
    JPY: 165.0,
    CAD: 1.45,
    AUD: 1.65,
    SEK: 11.5,
    NOK: 11.8,
    DKK: 7.45,
    CNY: 7.85,
    SGD: 1.48,
    HKD: 8.6,
    VND: 26850.0,
};