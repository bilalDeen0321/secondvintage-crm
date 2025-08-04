export interface WatchImage {
    id: string;
    url: string;
    useForAI: boolean;
}

export interface Watch {
    id: string;
    name: string;
    sku: string;
    brand: string;
    acquisitionCost?: number;
    status:
        | "Draft"
        | "Review"
        | "Approved"
        | "Platform Review"
        | "Ready for listing"
        | "Listed"
        | "Reserved"
        | "Sold"
        | "Defect/Problem"
        | "Standby";
    location: string;
    batchGroup?: string;
    description?: string;
    notes?: string;
    aiInstructions?: string;
    images: WatchImage[];
    serial?: string;
    ref?: string;
    caseSize?: string;
    caliber?: string;
    timegrapher?: string;
}
