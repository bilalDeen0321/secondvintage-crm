export const getRoleColor = (role: string) => {
    switch (role) {
        case "admin":
            return "bg-purple-100 text-purple-800";
        case "manager":
            return "bg-blue-100 text-blue-800";
        case "viewer":
            return "bg-gray-100 text-gray-800";
        case "agent":
            return "bg-green-100 text-green-800";
        case "seller":
            return "bg-orange-100 text-orange-800";
        default:
            return "bg-gray-100 text-gray-800";
    }
};

export const getStatusColor = (status: string) => {
    switch (status) {
        case "active":
            return "bg-green-100 text-green-800";
        case "inactive":
            return "bg-red-100 text-red-800";
        default:
            return "bg-gray-100 text-gray-800";
    }
};

/**
 * Generate a unique SKU based on brand, model, and existing SKUs
 */
export function generateSKU(brand: string, model: string, existingSKUs = []) {
    if (!brand || !model) return "";

    // BrandCode: first 3 letters
    const brandCode = brand.slice(0, 3).toUpperCase();

    // ModelCode: first letter of up to 3 words (excluding numbers), padded if needed
    const modelCode = model
        .split(" ")
        .filter((w) => isNaN(w as unknown as number))
        .slice(0, 3)
        .map((w) => w[0]?.toUpperCase() || "X")
        .join("")
        .padEnd(3, "X");

    const base = `${brandCode}-${modelCode}`;

    // Serial: start from 0001 and find next available
    let serial = 1;
    let sku = `${base}-${serial.toString().padStart(4, "0")}`;

    while (existingSKUs.includes(sku)) {
        serial++;
        sku = `${base}-${serial.toString().padStart(4, "0")}`;
    }

    return sku;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounce<F extends (...args: any[]) => void>(func: F, wait: number = 300) {
    let timeoutId: ReturnType<typeof setTimeout> | null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return function (this: any, ...args: Parameters<F>) {
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, wait);
    };
}
