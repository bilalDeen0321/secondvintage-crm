import { currencies } from "./app/data";
import { Currency } from "./app/models/Currency";


console.log(Currency.init().exchange(100, 'DKK', currencies));