
import { currencies } from "@/app/data";
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
  const rate = Number(currencies.map(c => c.rate)[currency]) || 1;
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



/**
 * Handle printing of SKU label in a new window.
 *
 * @param name  - Watch name (optional, fallback: "Watch")
 * @param brand - Watch brand (optional)
 * @param sku   - SKU string (required)
 */
export const printWatchSku = (name: string, brand: string, sku: string): void => {
  // Prevent printing if SKU is missing
  if (!sku) {
    alert("No SKU available to print");
    return;
  }

  // Open a popup print window
  const printWindow = window.open("", "_blank", "width=400,height=300");

  if (printWindow) {
    // Sanitize inputs to avoid injecting unwanted HTML
    const safeName = name ? name.replace(/</g, "&lt;").replace(/>/g, "&gt;") : "Watch";
    const safeBrand = brand ? brand.replace(/</g, "&lt;").replace(/>/g, "&gt;") : "";

    // Build and write the printable document
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>SKU Label - ${sku}</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                margin: 20px; 
                text-align: center;
                background: white;
              }
              .label {
                border: 2px solid #000;
                padding: 20px;
                margin: 20px auto;
                width: 300px;
                background: white;
              }
              .sku {
                font-size: 24px;
                font-weight: bold;
                margin: 10px 0;
              }
              .watch-name {
                font-size: 16px;
                margin: 10px 0;
              }
              @media print {
                body { margin: 0; }
                .no-print { display: none; }
              }
            </style>
          </head>
          <body>
            <div class="label">
              <div class="sku">${sku}</div>
              <div class="watch-name">${safeName}</div>
              <div>${safeBrand}</div>
            </div>
            <div class="no-print">
              <button onclick="window.print()">Print</button>
              <button onclick="window.close()">Close</button>
            </div>
          </body>
        </html>
      `);

    // Close document stream to apply styles/scripts
    printWindow.document.close();
  }
};
