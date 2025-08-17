// Currency.ts

import Model from "./Model";

export interface CurrencyAttributes {
    name: string;
    code: string;
    symbol: string;
    rate: number; // decimal with up to 6 places
}

export class Currency extends Model {

    /**
     * Currency exchange helper
     */
    exchange = (
        price: string | number,
        currency: string = 'DKK',
        currencies: CurrencyAttributes[],
        callback?: (value: string) => void,
        previousValue?: string
    ): string => {
        // Convert input safely to number
        const originalCost = typeof price === 'number' ? price : parseFloat(price);

        // Fallback if invalid number
        if (isNaN(originalCost)) {
            if (callback && previousValue !== '0.00') callback('0.00');
            return '0.00';
        }

        // Find matching currency rate (safe lookup)
        const match = currencies.find(c => c.code === currency);

        // Decide conversion method (scalable: can handle inverted rates later)
        const rate = match?.rate ? Number(match.rate) : 1;
        const converted = (originalCost * rate).toFixed(2);

        // Fire callback only when value changed
        if (callback && converted !== previousValue) {
            callback(converted);
        }

        // Return converted string always
        return converted;
    };


}


