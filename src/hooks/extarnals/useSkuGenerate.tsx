import { sleep } from "@/app/utils";
import axios from "axios";
import { useCallback, useState } from "react";

interface UseSkuGenerateResult {
    sku: string;
    loading: boolean;
    error: string | null;
    setSku: (data: { brand: string; watch: string }) => void;
}

export function useSkuGenerate(): UseSkuGenerateResult {
    const [sku, setSkuValue] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const setSku = useCallback(async (data: { brand: string; watch: string }) => {
        const { brand, watch } = data;

        if (!brand || !watch) {
            setError("Brand and watch name are required");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await sleep(1000);
            const response = await axios.post(route('api.watches.generate-sku'), {
                brand_name: brand,
                watch_name: watch,
            });

            if (response.data?.sku) {
                setSkuValue(response.data.sku);
            } else {
                setError("Invalid response from server");
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            setError(err?.response?.data?.message || err.message || "Failed to generate SKU");
        } finally {
            setLoading(false);
        }
    }, []);

    return { sku, loading, setSku, error };
}
