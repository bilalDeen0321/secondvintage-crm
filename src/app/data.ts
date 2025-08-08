import all_countries from '@/data/countries.json';
export const countries = all_countries.map(i => i.name);
export const currencies = ["USD", "EUR", "VND", "JPY", "GBP", "CAD", "AUD", 'DKK'];
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

