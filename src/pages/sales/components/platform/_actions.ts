import PlatformData, { PlatformTypes } from "@/app/models/PlatformData";
import { SaleWatchResource, WatchResource } from "@/types/resources/watch";

export interface PlatformDataModalProps {
    watch: SaleWatchResource | null;
    platform: PlatformTypes;
    isOpen: boolean;
    onClose: () => void;
    onNext?: () => void;
    onPrevious?: () => void;
}

export interface PlatformField {
    field: string;
    value: string;
    type: "input" | "select" | "textarea" | "number";
    options?: string[];
}


export const handleExportData = (watch, platformData, platform = 'catawiki') => {
    const csvContent = [
        "Field,Value",
        ...platformData.map((row) => `"${row.field}","${row.value}"`),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${watch.name}_${platform}_data.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
};


// Platform-specific data configurations
export const getPlatformData = (watch: WatchResource, platform: PlatformTypes): PlatformField[] => {
    const statusField = {
        field: "Status",
        value: watch.status,
        type: "select" as const,
        options: [
            "Draft",
            "Review",
            "Approved",
            "Platform Review",
            "Ready for listing",
            "Listed",
            "Reserved",
            "Sold",
            "Defect/Problem",
            "Standby",
        ],
    };
    const descriptionField = {
        field: "Description",
        value: watch.description || "",
        type: "textarea" as const,
    };

    switch (platform) {
        case PlatformData.CATAWIKI:
            return [
                statusField,
                descriptionField,
                {
                    field: "Catawiki - Your Reference Number (optional)",
                    value: watch.sku,
                    type: "input",
                },
                {
                    field: "Catawiki - Your Reference Colour (optional)",
                    value: "",
                    type: "input",
                },
                {
                    field: "Catawiki - Auction Type (333) (optional)",
                    value: "333",
                    type: "select",
                    options: ["333", "334", "335"],
                },
                {
                    field: "Catawiki - Object type (18127)",
                    value: "18127",
                    type: "select",
                    options: ["18127", "18128", "18129"],
                },
                {
                    field: "Catawiki - Language",
                    value: "English",
                    type: "select",
                    options: ["English", "Dutch", "German", "French"],
                },
                {
                    field: "Catawiki - Description",
                    value: watch.description || "",
                    type: "textarea",
                },
                {
                    field: "Catawiki - D: Brand",
                    value: watch.brand,
                    type: "input",
                },
                {
                    field: "Catawiki - D: Model (optional)",
                    value: "",
                    type: "input",
                },
                {
                    field: "Catawiki - D: Reference Number (optional)",
                    value: watch.sku,
                    type: "input",
                },
                {
                    field: "Catawiki - D: Shipped Insured",
                    value: "Yes",
                    type: "select",
                    options: ["Yes", "No"],
                },
                {
                    field: "Catawiki - D: Period",
                    value: "2020s",
                    type: "select",
                    options: [
                        "1950s",
                        "1960s",
                        "1970s",
                        "1980s",
                        "1990s",
                        "2000s",
                        "2010s",
                        "2020s",
                    ],
                },
                {
                    field: "Catawiki - D: Movement",
                    value: "Automatic",
                    type: "select",
                    options: ["Automatic", "Manual", "Quartz"],
                },
                {
                    field: "Catawiki - D: Case material",
                    value: "Stainless Steel",
                    type: "select",
                    options: [
                        "Stainless Steel",
                        "Gold",
                        "Rose Gold",
                        "Titanium",
                        "Ceramic",
                    ],
                },
                {
                    field: "Catawiki - D: Case diameter",
                    value: "40mm",
                    type: "input",
                },
                {
                    field: "Catawiki - D: Condition",
                    value: "Very Good",
                    type: "select",
                    options: ["New", "Very Good", "Good", "Fair", "Poor"],
                },
                {
                    field: "Catawiki - D: Gender",
                    value: "Men",
                    type: "select",
                    options: ["Men", "Women", "Unisex"],
                },
                {
                    field: "Catawiki - D: Band material",
                    value: "Stainless Steel",
                    type: "select",
                    options: [
                        "Stainless Steel",
                        "Leather",
                        "Rubber",
                        "Gold",
                        "Ceramic",
                    ],
                },
                {
                    field: "Catawiki - D: Band length (optional)",
                    value: "",
                    type: "input",
                },
                {
                    field: "Catawiki - D: Repainted dial",
                    value: "No",
                    type: "select",
                    options: ["Yes", "No"],
                },
                {
                    field: "Catawiki - D: Dial colour (optional)",
                    value: "Black",
                    type: "input",
                },
                {
                    field: "Catawiki - D: Original box included",
                    value: "Yes",
                    type: "select",
                    options: ["Yes", "No"],
                },
                {
                    field: "Catawiki - D: Original papers included",
                    value: "Yes",
                    type: "select",
                    options: ["Yes", "No"],
                },
                {
                    field: "Catawiki - D: Original warranty included",
                    value: "No",
                    type: "select",
                    options: ["Yes", "No"],
                },
                {
                    field: "Catawiki - D: Year (optional)",
                    value: "2020",
                    type: "input",
                },
                { field: "Catawiki - D: Weight", value: "150g", type: "input" },
                {
                    field: "Catawiki - D: Width lug/ watch band",
                    value: "20mm",
                    type: "input",
                },
                {
                    field: "Catawiki - D: In working order (optional)",
                    value: "Yes",
                    type: "select",
                    options: ["Yes", "No"],
                },
                {
                    field: "Catawiki - Public photo URL",
                    value: watch.images?.[0]?.url || "",
                    type: "input",
                },
                {
                    field: "Catawiki - Estimated lot value",
                    value: watch.current_cost
                        ? `€${Math.round(Number(watch.current_cost) * 1.2)}`
                        : "",
                    type: "input",
                },
                {
                    field: "Catawiki - Reserve price (optional)",
                    value: watch.current_cost
                        ? `€${Math.round(Number(watch.current_cost) * 0.9)}`
                        : "",
                    type: "input",
                },
                {
                    field: "Catawiki - Start bidding from (optional)",
                    value: watch.current_cost
                        ? `€${Math.round(Number(watch.current_cost) * 0.7)}`
                        : "",
                    type: "input",
                },
                {
                    field: "Catawiki - Pick up (optional)",
                    value: "No",
                    type: "select",
                    options: ["Yes", "No"],
                },
                {
                    field: "Catawiki - Combined shipping (optional)",
                    value: "Yes",
                    type: "select",
                    options: ["Yes", "No"],
                },
                {
                    field: "Catawiki - Shipping costs",
                    value: "€0",
                    type: "input",
                },
                {
                    field: "Catawiki - Shipping costs - Europe",
                    value: "€15",
                    type: "input",
                },
                {
                    field: "Catawiki - Shipping costs - Rest of World",
                    value: "€25",
                    type: "input",
                },
                {
                    field: "Catawiki - Country specific shipping price (optional)",
                    value: "",
                    type: "input",
                },
                {
                    field: "Catawiki - Shipping profile (optional)",
                    value: "",
                    type: "input",
                },
                {
                    field: "Catawiki - Message to Expert (optional)",
                    value: "",
                    type: "textarea",
                },
            ];
        case PlatformData.TRADERA:
            return [
                statusField,
                descriptionField,
                { field: "Name", value: watch.name, type: "input" },
                { field: "SKU", value: watch.sku, type: "input" },
                { field: "Brand", value: watch.brand, type: "input" },
                { field: "Location", value: watch.location, type: "input" },
                {
                    field: "Buy It Now Price",
                    value: watch.current_cost
                        ? `€${Math.round(Number(watch.current_cost) * 1.3)}`
                        : "",
                    type: "number",
                },
                {
                    field: "Starting Bid",
                    value: watch.current_cost
                        ? `€${Math.round(Number(watch.current_cost) * 0.8)}`
                        : "",
                    type: "number",
                },
                {
                    field: "Listing Duration",
                    value: "10 days",
                    type: "select",
                    options: ["3 days", "5 days", "7 days", "10 days"],
                },
                {
                    field: "Payment Methods",
                    value: "PayPal, Bank Transfer",
                    type: "input",
                },
                { field: "Shipping Cost", value: "€15", type: "number" },
                { field: "Listing Fee", value: "€2.50", type: "number" },
                { field: "Final Value Fee", value: "8%", type: "input" },
                { field: "Category ID", value: "1234567", type: "input" },
            ];
        case PlatformData.EBAY_AUCTION:
        case PlatformData.EBAY_FIXED:
            return [
                statusField,
                descriptionField,
                { field: "Name", value: watch.name, type: "input" },
                { field: "SKU", value: watch.sku, type: "input" },
                { field: "Brand", value: watch.brand, type: "input" },
                { field: "Location", value: watch.location, type: "input" },
                {
                    field: "Starting Price",
                    value: watch.current_cost
                        ? `€${Math.round(Number(watch.current_cost) * 0.75)}`
                        : "",
                    type: "number",
                },
                {
                    field: "Buy It Now Price",
                    value: watch.current_cost
                        ? `€${Math.round(Number(watch.current_cost) * 1.35)}`
                        : "",
                    type: "number",
                },
                {
                    field: "Listing Format",
                    value: "Auction with BIN",
                    type: "select",
                    options: ["Auction", "Buy It Now", "Auction with BIN"],
                },
                {
                    field: "Listing Duration",
                    value: "7 days",
                    type: "select",
                    options: ["1 day", "3 days", "5 days", "7 days", "10 days"],
                },
                {
                    field: "International Shipping",
                    value: "Worldwide",
                    type: "select",
                    options: ["None", "Europe", "Worldwide"],
                },
                {
                    field: "Handling Time",
                    value: "1 business day",
                    type: "select",
                    options: [
                        "Same day",
                        "1 business day",
                        "2 business days",
                        "3 business days",
                    ],
                },
                {
                    field: "Return Period",
                    value: "30 days",
                    type: "select",
                    options: ["No returns", "14 days", "30 days", "60 days"],
                },
                {
                    field: "Item Specifics Required",
                    value: "Yes",
                    type: "select",
                    options: ["Yes", "No"],
                },
                {
                    field: "Store Category",
                    value: "Luxury Timepieces",
                    type: "input",
                },
            ];
        case PlatformData.CHRONO24:
            return [
                statusField,
                descriptionField,
                { field: "Name", value: watch.name, type: "input" },
                { field: "SKU", value: watch.sku, type: "input" },
                { field: "Brand", value: watch.brand, type: "input" },
                { field: "Location", value: watch.location, type: "input" },
                {
                    field: "Asking Price",
                    value: watch.current_cost
                        ? `€${Math.round(Number(watch.current_cost) * 1.4)}`
                        : "",
                    type: "number",
                },
                { field: "Reference Number", value: watch.sku, type: "input" },
                { field: "Year of Production", value: "2020", type: "input" },
                {
                    field: "Case Material",
                    value: "Stainless Steel",
                    type: "select",
                    options: [
                        "Stainless Steel",
                        "Gold",
                        "Rose Gold",
                        "Titanium",
                        "Ceramic",
                    ],
                },
                {
                    field: "Bracelet Material",
                    value: "Stainless Steel",
                    type: "select",
                    options: [
                        "Stainless Steel",
                        "Leather",
                        "Rubber",
                        "Gold",
                        "Ceramic",
                    ],
                },
                {
                    field: "Dial Color",
                    value: "Black",
                    type: "select",
                    options: ["Black", "White", "Blue", "Silver", "Grey"],
                },
                {
                    field: "Movement",
                    value: "Automatic",
                    type: "select",
                    options: ["Automatic", "Manual", "Quartz"],
                },
                { field: "Case Diameter", value: "40mm", type: "input" },
                { field: "Water Resistance", value: "300m", type: "input" },
                {
                    field: "Warranty",
                    value: "2 years",
                    type: "select",
                    options: ["No warranty", "1 year", "2 years", "3 years"],
                },
                {
                    field: "Box & Papers",
                    value: "Yes",
                    type: "select",
                    options: ["Yes", "No", "Box only", "Papers only"],
                },
            ];
        default:
            {
                const baseData: PlatformField[] = [
                    statusField,
                    descriptionField,
                    { field: "Name", value: watch.name, type: "input" },
                    { field: "SKU", value: watch.sku, type: "input" },
                    { field: "Brand", value: watch.brand, type: "input" },
                    { field: "Location", value: watch.location, type: "input" },
                ];
                return baseData;
            }
    }
};