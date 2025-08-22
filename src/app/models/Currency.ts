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
        const originalCost = typeof price === 'number' ? price : parseFloat(price);

        if (isNaN(originalCost)) {
            if (callback && previousValue !== '0.00') callback('0.00');
            return '0.00';
        }

        const match = currencies.find(c => c.code === currency);
        const rate = match?.rate ? Number(match.rate) : 1;

        // Convert TO EUR (since rates are "1 EUR = rate currency")
        const converted = (originalCost / rate).toFixed(2);

        if (callback && converted !== previousValue) {
            callback(converted);
        }

        return converted;
    };


}


