/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce"; // 💡 Suggests using a debouncing library

interface SkuData {
    brand: string;
    watch: string;
}

interface UseSkuGenerateResult {
    sku: string;
    loading: boolean;
    error: string | null;
}

export function useSkuGenerate(data: SkuData | null): UseSkuGenerateResult {
    const [sku, setSkuValue] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Debounce the data to prevent rapid API calls
    const [debouncedData] = useDebounce(data, 200);

    useEffect(() => {
        // Only fetch if debouncedData is valid
        if (!debouncedData?.brand || !debouncedData?.watch) {
            setSkuValue(""); // Reset SKU if data is incomplete
            setLoading(false);
            return;
        }

        const generateSku = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.post(route('api.watches.generate-sku'), {
                    brand_name: debouncedData.brand,
                    watch_name: debouncedData.watch,
                });

                if (response.data?.sku) {
                    setSkuValue(response.data.sku);
                } else {
                    setError("Invalid response from server");
                    setSkuValue(""); // Clear SKU on error
                }
            } catch (err: any) {
                setError(err?.response?.data?.message || err.message || "Failed to generate SKU");
                setSkuValue(""); // Clear SKU on error
            } finally {
                setLoading(false);
            }
        };

        generateSku();
    }, [debouncedData]); // Trigger effect only when debouncedData changes

    return { sku, loading, error };
}