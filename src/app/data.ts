import all_countries from '@/data/countries.json';
export const countries = all_countries.map(i => i.name);
export const batchGroups = ["B001", "B002", "B003", "B004"];

export const currencies = [
    { code: "EUR", name: "Euro", symbol: "€", rate: 1.0 },
    { code: "USD", name: "US Dollar", symbol: "$", rate: 1.1 },         // as you had before
    { code: "GBP", name: "British Pound", symbol: "£", rate: 0.85 },     // unchanged
    { code: "CHF", name: "Swiss Franc", symbol: "CHF", rate: 0.95 },
    { code: "JPY", name: "Japanese Yen", symbol: "¥", rate: 165 },
    { code: "CAD", name: "Canadian Dollar", symbol: "C$", rate: 1.45 },
    { code: "AUD", name: "Australian Dollar", symbol: "A$", rate: 1.65 },
    { code: "SEK", name: "Swedish Krona", symbol: "kr", rate: 11.5 },
    { code: "NOK", name: "Norwegian Krone", symbol: "kr", rate: 11.8 },
    { code: "DKK", name: "Danish Krone", symbol: "kr", rate: 7.4636 },    // updated
    { code: "CNY", name: "Chinese Yuan", symbol: "¥", rate: 7.85 },
    { code: "SGD", name: "Singapore Dollar", symbol: "S$", rate: 1.48 },
    { code: "HKD", name: "Hong Kong Dollar", symbol: "HK$", rate: 8.6 },
    { code: "VND", name: "Vietnamese Dong", symbol: "₫", rate: 30587 }    // updated
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
