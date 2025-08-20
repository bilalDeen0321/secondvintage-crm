import { getServerSku } from "@/pages/watches/_utils";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

// Example React hook using debounce
export const useServerSku = (name: string, brand: string, oldSku?: string | null) => {
    const [sku, setSku] = useState('');
    const [debouncedName] = useDebounce(name, 500); // 500ms debounce
    const [debouncedBrand] = useDebounce(brand, 500);

    useEffect(() => {
        let mounted = true;

        if (!debouncedName || !debouncedBrand) {
            setSku('');
            return;
        }

        getServerSku(debouncedName, debouncedBrand, oldSku).then((result) => {
            if (mounted) setSku(result);
        });

        return () => {
            mounted = false; // cancel setState if unmounted
        };
    }, [debouncedName, debouncedBrand, oldSku]);

    return sku;
};