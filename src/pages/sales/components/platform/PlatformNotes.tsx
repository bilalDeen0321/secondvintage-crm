import PlatformData, { PlatformTypes } from "@/app/models/PlatformData";

export default function PlatformNotes({ platform }: { platform: string }) {
    return (
        <div className="mt-6 rounded-lg bg-slate-50 p-4">
            <h4 className="mb-2 font-medium text-slate-900">Platform-Specific Notes:</h4>
            <div className="text-sm text-slate-600">
                {(platform === PlatformData.CATAWIKI || platform === "Catawiki (Auction)") && <p>• Catawiki specializes in luxury auctions. Ensure high-quality photos and detailed condition reports. All fields marked with "D:" are required for Catawiki's detailed specifications.</p>}
                {platform === PlatformData.TRADERA && <p>• Tradera is popular in Sweden. Consider local preferences and Swedish krona pricing.</p>}
                {platform?.includes("ebay") && <p>• eBay requires detailed item specifics. Ensure all technical details are accurate.</p>}
                {platform?.includes("chrono24") && <p>• Chrono24 is watch-specific. Include all technical specifications and authentication details.</p>}
                {!PlatformData.allPlatforms().includes(platform as PlatformTypes) && <p>• General platform data. Customize fields based on platform requirements.</p>}
            </div>
        </div>
    );
}
