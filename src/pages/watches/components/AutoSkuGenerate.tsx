import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Tag } from "lucide-react";
import { useState } from "react";
import { handlePrintSKULabel } from "../_create-actions";

type Props = {
    value?: string,
    name: string;
    brand: string;
    onChange?: (value: string) => void;
}

export default function AutoSkuGenerate({ value, name, brand, onChange }: Props) {
    const [loading, setLoading] = useState(false);
    return (
        <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
                {value ? 'SKU (Auto-generated)' : 'SKU (Auto-generate)'}
            </label>
            <div className="relative">
                <div className="flex items-center space-x-2">
                    <input
                        type="text"
                        name="sku"
                        value={loading ? 'Loading...' : value}
                        readOnly
                        className="flex-1 cursor-not-allowed rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-slate-600 w-full"
                    />
                    <Button
                        type="button"
                        variant="outline"
                        disabled={!value}
                        size="sm"
                        onClick={() => handlePrintSKULabel(name, brand, value)}
                        className={cn('p-2 py-3', { 'cursor-not-allowed': !value })}
                        title="Print SKU Label"
                    >
                        <Tag className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
