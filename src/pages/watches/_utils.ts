
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
  description: watch?.description || "Experience the perfect marriage of precision engineering and modern design with this Casio Oceanus chronograph. Known for its advanced technology and elegant form, the Oceanus line embodies Casio's pursuit of both reliability and aesthetics, offering a distinctive timepiece that's as functional as it is stylish.\n\nBrand: Casio\nModel: Oceanus\nReference Number: Unspecified\nSerial Number: Unspecified\nMovement: Quartz Chronograph (Tough Movement)\nDial: Multi-tone mother-of-pearl with dark subdials, applied indices, and luminescent hands, date window at 4:30, tachymeter bezel, and multicolor Oceanus logo at 12 o’clock\nCase Size: Approx. 43mm (excluding the crown)\nCase Material: Stainless steel (with black tachymeter bezel)\nProduction Year: Unspecified\nCondition: Running and keeping time within vintage tolerances\n\nDial and Hands\nThe dial presents a unique iridescent mother-of-pearl background complemented by dark chronograph subdials. Polished applied indices and luminescent baton hands ensure exceptional legibility, while the subtle date aperture at 4:30 adds everyday practicality. The multicolor Oceanus logo and well-executed text complete the sophisticated aesthetic.\n\nCase and Crystal\nThe robust stainless steel case is highlighted by a polished black tachymeter bezel, delivering sporty appeal. The integrated bracelet connects seamlessly, while the overall finish showcases Casio Oceanus’s attention to detail. The crystal is clear and free of noticeable blemishes, ensuring the dial’s artistry remains the focal point.\n\nMovement\nPowered by Casio’s reliable quartz “Tough Movement” chronograph, this watch delivers precise timekeeping and resilient performance. All chronograph functions and date display operate correctly.\n\nStrap\nFitted with the original stainless steel integrated bracelet, featuring a deployant clasp for secure and comfortable wear.\n\nCondition\nThis Casio Oceanus presents in excellent condition, with only minimal signs of handling on the case and bracelet. The dial and hands are clean, and the crystal is pristine. The watch is running and keeping time within vintage tolerances.\n\nDimensions\nCase diameter: Approx. 43mm (excluding the crown)\nLug-to-lug: Unspecified\nBracelet width: Tapers from case to clasp\n\nRemarks\nA standout example from the Oceanus range, this Casio blends cutting-edge technology with sophisticated design. Its versatile look and dependable movement are sure to appeal to enthusiasts of both high-tech and elegant timepieces.\n\nHistory\nIntroduced as a flagship line, Casio Oceanus watches are renowned for combining advanced quartz movements with refined construction and modern style. The Oceanus has become a favorite for collectors seeking innovation and elegance in a single, wearable package.",
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
