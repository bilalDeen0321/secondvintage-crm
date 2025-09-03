import PlatformData from "@/app/models/PlatformData";

// Helper function to determine if a platform should be greyed out
export const isDisablePlatform = (platform: string) => {
    return [
        PlatformData.EBAY_FIXED,
        PlatformData.EBAY_AUCTION,
        PlatformData.CHRONO24,
        PlatformData.WEBSHOP,
    ].includes(platform);
};