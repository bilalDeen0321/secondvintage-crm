import InputError from "@/components/InputError";
import { Button } from "@/components/ui/button";
import { useSkuGenerate } from "@/hooks/extarnals/useSkuGenerate";
import { cn } from "@/lib/utils";
import { Tag } from "lucide-react";
import { useEffect } from "react";
import { handlePrintSKULabel } from "../_create-actions";

type Props = {
    name: string;
    brand: string;
    onChange?: (value: string) => void;
}

export default function AutoSkuGenerate({ name, brand, onChange }: Props) {

    const { sku, setSku, loading, error } = useSkuGenerate();

    useEffect(() => {
        if (name && brand) {
            setSku({ brand, watch: name });
        };
    }, [name, brand, setSku])

    // Notify parent when SKU updates
    useEffect(() => {
        if (onChange) onChange(sku);
    }, [sku, onChange]);

    return <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
            {sku ? 'SKU (Auto-generated)' : 'SKU (Auto-generate)'}
        </label>
        <div className="flex items-center space-x-2 relative">
            <InputError message={error} className="text-sm" />
            <input
                type="text"
                name="sku"
                value={loading ? 'Loading...' : sku}
                readOnly
                className="flex-1 cursor-not-allowed rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-slate-600 w-full"
            />
            <Button
                type="button"
                variant="outline"
                disabled={!sku}
                size="sm"
                onClick={() => handlePrintSKULabel(name, brand, sku)}
                className={cn('p-2 py-3', {
                    'cursor-not-allowed': !sku,
                })}
                title="Print SKU Label"
            >
                <Tag className="h-4 w-4" />
            </Button>
        </div>
    </div>
}