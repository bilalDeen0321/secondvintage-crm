interface CurrencyDisplayProps {
    euroAmount: number;
}

const CurrencyDisplay = ({ euroAmount }: CurrencyDisplayProps) => {
    // Exchange rate for Vietnamese dong
    const exchangeRate = 26500;
    const vndAmount = euroAmount * exchangeRate;

    return (
        <div>
            <div className="font-bold text-slate-900">
                ₫{vndAmount.toLocaleString("vi-VN")}
            </div>
            <div className="text-xs text-slate-600">
                €{euroAmount.toLocaleString()}
            </div>
        </div>
    );
};

export default CurrencyDisplay;
