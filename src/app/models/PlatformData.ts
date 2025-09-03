export default class PlatformData {
    // Status constants
    static readonly STATUS_REVIEW = 'review';
    static readonly STATUS_DEFAULT = 'default';
    static readonly STATUS_APPROVED = 'approved';
    static readonly STATUS_LOADING = 'loading';
    static readonly STATUS_FAILED = 'failed';
    static readonly STATUS_SUCCESS = 'success';

    // Platform name constants
    static readonly CATAWIKI = 'catawiki';
    static readonly TRADERA = 'tradera';
    static readonly EBAY_FIXED = 'ebay_fixed';
    static readonly EBAY_AUCTION = 'ebay_auction';
    static readonly CHRONO24 = 'chrono24';
    static readonly WEBSHOP = 'bebshop';


    /**
     * All supported platforms.
     */
    static allPlatforms(): string[] {
        return [
            this.CATAWIKI,
            this.TRADERA,
            this.EBAY_FIXED,
            this.EBAY_AUCTION,
            this.CHRONO24,
            this.WEBSHOP,
        ];
    }

    /**
     * Platforms array to map labels
     */
    static toLabel(platformName: string): string {
        const labels: Record<string, string> = {
            [this.CATAWIKI]: 'Catawiki (Auction)',
            [this.TRADERA]: 'Tradera (Auction)',
            [this.EBAY_FIXED]: 'eBay (Fixed Price)',
            [this.EBAY_AUCTION]: 'eBay (Auction)',
            [this.CHRONO24]: 'Chrono24 (Fixed Price)',
            [this.WEBSHOP]: 'Webshop (Fixed Price)',
        };

        return labels[platformName] ?? platformName;
    }

    static toDatabase(key: string): string {

        const platforms: Record<string, string> = {
            "Catawiki (Auction)": this.CATAWIKI,
            "Tradera (Auction)": this.TRADERA,
            "eBay (Fixed Price)": this.EBAY_FIXED,
            "eBay (Auction)": this.EBAY_AUCTION,
            "Chrono24 (Fixed Price)": this.CHRONO24,
            "Webshop (Fixed Price)": this.WEBSHOP,
        };

        return platforms[key] ?? key; // return null if not found
    }
}