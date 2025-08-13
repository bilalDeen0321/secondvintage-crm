import InputError from "@/components/InputError";
import { Button } from "@/components/ui/button";
import { useSkuGenerate } from "@/hooks/extarnals/useSkuGenerate";
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
            SKU (Auto {loading ? 'generating..' : 'generated'})
        </label>
        <div className="flex items-center space-x-2">
            <InputError message={error} className="text-sm" />
            <input
                type="text"
                name="sku"
                value={sku}
                readOnly
                className="flex-1 cursor-not-allowed rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-slate-600"
            />
            <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handlePrintSKULabel(name, brand, sku)}
                className="p-2"
                title="Print SKU Label"
            >
                <Tag className="h-4 w-4" />
            </Button>
        </div>
    </div>
}