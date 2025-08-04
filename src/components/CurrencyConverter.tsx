import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";

interface CurrencyConverterProps {
    euroValue: string;
    onEuroChange: (value: string) => void;
}

const CurrencyConverter = ({
    euroValue,
    onEuroChange,
}: CurrencyConverterProps) => {
    const [selectedCurrency, setSelectedCurrency] = useState("USD");
    const [otherValue, setOtherValue] = useState("");

    // Simple exchange rates (in a real app, these would come from an API)
    const exchangeRates: Record<string, number> = {
        USD: 1.1,
        GBP: 0.85,
        SEK: 11.5,
        NOK: 11.8,
        DKK: 7.45,
        CHF: 0.95,
        JPY: 165.0,
    };

    useEffect(() => {
        if (euroValue && !isNaN(parseFloat(euroValue))) {
            const converted =
                parseFloat(euroValue) * exchangeRates[selectedCurrency];
            setOtherValue(converted.toFixed(2));
        } else {
            setOtherValue("");
        }
    }, [euroValue, selectedCurrency]);

    const handleOtherValueChange = (value: string) => {
        setOtherValue(value);
        if (value && !isNaN(parseFloat(value))) {
            const euroEquivalent =
                parseFloat(value) / exchangeRates[selectedCurrency];
            onEuroChange(euroEquivalent.toFixed(2));
        } else {
            onEuroChange("");
        }
    };

    return (
        <div className="space-y-4">
            <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                    Acquisition Cost (€)
                </label>
                <Input
                    type="number"
                    value={euroValue}
                    onChange={(e) => onEuroChange(e.target.value)}
                    step="0.01"
                    placeholder="0.00"
                    className="h-10"
                />
            </div>

            <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                    Currency
                </label>
                <Select
                    value={selectedCurrency}
                    onValueChange={setSelectedCurrency}
                >
                    <SelectTrigger className="h-10">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="GBP">GBP</SelectItem>
                        <SelectItem value="SEK">SEK</SelectItem>
                        <SelectItem value="NOK">NOK</SelectItem>
                        <SelectItem value="DKK">DKK</SelectItem>
                        <SelectItem value="CHF">CHF</SelectItem>
                        <SelectItem value="JPY">JPY</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                    Amount ({selectedCurrency})
                </label>
                <Input
                    type="number"
                    value={otherValue}
                    onChange={(e) => handleOtherValueChange(e.target.value)}
                    step="0.01"
                    placeholder="0.00"
                    className="h-10"
                />
            </div>
        </div>
    );
};

export default CurrencyConverter;
