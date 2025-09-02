export default function PlatformNotes({ platform }: { platform: string }) {
    return (
        <div className="mt-6 rounded-lg bg-slate-50 p-4">
            <h4 className="mb-2 font-medium text-slate-900">Platform-Specific Notes:</h4>
            <div className="text-sm text-slate-600">
                {(platform === "Catawiki" || platform === "Catawiki (Auction)") && (
                    <p>
                        • Catawiki specializes in luxury auctions. Ensure high-quality photos and
                        detailed condition reports. All fields marked with "D:" are required for
                        Catawiki's detailed specifications.
                    </p>
                )}
                {(platform === "Tradera" || platform === "Tradera (Auction)") && (
                    <p>
                        • Tradera is popular in Sweden. Consider local preferences and Swedish krona
                        pricing.
                    </p>
                )}
                {(platform === "eBay" || platform.includes("ebay")) && (
                    <p>
                        • eBay requires detailed item specifics. Ensure all technical details are
                        accurate.
                    </p>
                )}
                {(platform === "Chrono24" || platform === "Chrono24 (Fixed Price)") && (
                    <p>
                        • Chrono24 is watch-specific. Include all technical specifications and
                        authentication details.
                    </p>
                )}
                {![
                    "Catawiki",
                    "Catawiki (Auction)",
                    "Tradera",
                    "Tradera (Auction)",
                    "eBay",
                    "ebay (Fixed Price)",
                    "ebay (Auction)",
                    "Chrono24",
                    "Chrono24 (Fixed Price)",
                ].includes(platform) && (
                    <p>• General platform data. Customize fields based on platform requirements.</p>
                )}
            </div>
        </div>
    );
}
