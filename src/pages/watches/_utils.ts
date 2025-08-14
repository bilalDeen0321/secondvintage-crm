import { exchangeRates } from "@/app/data";
import Status from "@/app/models/Status";
import { WatchResource } from "@/types/resources/watch";
import { router } from "@inertiajs/react";
import axios from "axios";
import { toast } from "react-toastify";

/**
 * Watch Escape callback with routing
 */
export const watchEscapeCallback = () => router.visit(route("watches.index"));


/**
 * Watch init data
 */
export const watchInitData = (watch?: WatchResource | null) => ({
    name: watch?.name || "",
    sku: watch?.sku || "",
    brand: watch?.brand || "",
    status: watch?.status || Status.DRAFT,
    serial_number: watch?.serial_number || "",
    reference: watch?.reference || "",
    case_size: watch?.case_size || "",
    caliber: watch?.caliber || "",
    timegrapher: watch?.timegrapher || "",
    original_cost: watch?.original_cost || "",
    current_cost: watch?.current_cost || "",
    ai_instructions: watch?.ai_instructions || "",
    location: watch?.location || "",
    batch: "",
    description: watch?.description || "",
    currency: watch?.currency || "DKK",
    notes: watch?.notes || "",
    images: watch?.images || ([] as WatchResource["images"]),
    ai_thread_id: ''
});



/**
 * Currency exchange rates
 */
/**
 * Currency exchange rates
 */
export const currencyExchange = (
    price: string | number,
    currency: string = 'DDK',
    callback?: (value: string) => void,
    previousValue?: string
): string => {
    // Convert input to number safely
    const originalCost = typeof price === 'number' ? price : parseFloat(price);

    // Determine converted cost (fallback to 0.00 for invalid price)
    const rate = Number(exchangeRates[currency]) || 1;
    const convertedCost = !isNaN(originalCost) ? (originalCost * rate).toFixed(2) : '0.00';

    // Call callback if provided and value changed
    if (callback && price && convertedCost !== previousValue) {
        callback(convertedCost);
    }

    // Always return converted cost as string
    return convertedCost;
};



// Server SKU fetcher
export const getServerSku = async (name: string, brand: string): Promise<string> => {
    if (!name || !brand) return '';

    try {
        const res = await axios.post(route('api.watches.generate-sku'), {
            watch_name: name,
            brand_name: brand,
        });

        return res.data?.sku ?? '';
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            toast.error(error.response?.data?.message || 'Failed to generate SKU from server.');
        } else if (error instanceof Error) {
            toast.error(error.message);
        } else {
            toast.error('An unknown error occurred.');
        }

        return '';
    }
};
