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

        const user_rate = Number(currencies.find(c => c.code === currency).rate || 1);
        const from_rate = Number(currencies.find(c => c.code === 'EUR').rate || 1);

        // Convert TO EUR (since rates are "1 EUR = rate currency")
        const converted = (originalCost * from_rate / user_rate).toFixed(2);

        if (callback && converted !== previousValue) {
            callback(converted);
        }

        return converted;
    };


    /**
     * Currency code to symbol
     */
    toSymbol(currencies: CurrencyAttributes[], currency: string, price?: string | number) {
        const symbol = currencies.find(f => f.code === currency)?.symbol || currency;
        if (price) {
            return `${symbol + price}`;
        }
    }


    /**
     * Currency code to symbol
     */
    toName(currencies: CurrencyAttributes[], currency: string) {
        return currencies.find(f => f.code === currency)?.code || currency;
    }


}


