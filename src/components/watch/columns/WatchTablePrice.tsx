import { Currency, CurrencyAttributes } from "@/app/models/Currency";
import { WatchResource } from "@/types/resources/watch";
import { usePage } from "@inertiajs/react";

type ServerProps = {
    currencies: CurrencyAttributes[];
};

export default function WatchTablePrice({ watch }: { watch: WatchResource }) {
    //server props
    const { currencies = [] } = usePage().props as unknown as ServerProps;

    return <div className="text-sm text-slate-900">
        {watch.original_cost ? (
            <div className="text-left">
                {watch.current_cost ? (
                    <>
                        <div className="font-medium">
                            €{watch?.current_cost?.toLocaleString()}
                        </div>
                        <div className="text-xs text-slate-500">
                            {Currency.init().toSymbol(
                                currencies,
                                watch.currency,
                                watch.original_cost,
                            )}
                        </div>
                    </>
                ) : (
                    "-"
                )}
            </div>
        ) : (
            "-"
        )}
    </div>
}
