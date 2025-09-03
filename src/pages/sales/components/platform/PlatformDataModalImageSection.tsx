import { PlatformDataModalProps } from "./_actions";

interface PlatformDataModalImageSectionProps {
    selectedImageIndex: number;
    setSelectedImageIndex: React.Dispatch<React.SetStateAction<number>>;
    watch: PlatformDataModalProps["watch"];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    watchImages: any;
}

export function PlatformDataModalImageSection({
    selectedImageIndex,
    setSelectedImageIndex,
    watch,
    watchImages,
}: PlatformDataModalImageSectionProps) {
    return (
        <div className="mt-6 border-b pb-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Images Section */}
                <div className="space-y-4 lg:col-span-1">
                    {/* Main Image - Made larger and square */}
                    <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
                        <img
                            src={watchImages[selectedImageIndex]?.url}
                            alt={`${watch.name} - Main view`}
                            className="h-full w-full object-cover"
                        />
                    </div>

                    {/* Thumbnail Grid - Below main image */}
                    <div className="grid grid-cols-6 gap-2">
                        {watchImages.map((image, index) => (
                            <button
                                key={image.id}
                                onClick={() => setSelectedImageIndex(index)}
                                className={`aspect-square overflow-hidden rounded-md border-2 bg-gray-100 transition-colors ${selectedImageIndex === index ? "border-blue-500" : "border-transparent hover:border-gray-300"}`}
                            >
                                <img
                                    src={image.url}
                                    alt={`${watch.name} - View ${index + 1}`}
                                    className="h-full w-full object-cover"
                                />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Basic Info Section - Now 2 columns with specified layout */}
                <div className="lg:col-span-2">
                    <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
                        {/* Column 1 */}
                        <div>
                            <span className="text-slate-500">Name:</span>
                            <div className="font-medium text-slate-900">
                                {watch.name}
                            </div>
                        </div>
                        <div>
                            <span className="text-slate-500">Serial:</span>
                            <div className="font-medium text-slate-900">
                                {watch.serial_number || "N/A"}
                            </div>
                        </div>

                        <div>
                            <span className="text-slate-500">SKU:</span>
                            <div className="font-medium text-slate-900">
                                {watch.sku}
                            </div>
                        </div>
                        <div>
                            <span className="text-slate-500">Ref:</span>
                            <div className="font-medium text-slate-900">
                                {watch.reference || "N/A"}
                            </div>
                        </div>

                        <div>
                            <span className="text-slate-500">Brand:</span>
                            <div className="font-medium text-slate-900">
                                {watch.brand}
                            </div>
                        </div>
                        <div>
                            <span className="text-slate-500">Case Size:</span>
                            <div className="font-medium text-slate-900">
                                {watch.case_size || "N/A"}
                            </div>
                        </div>

                        <div>
                            <span className="text-slate-500">Location:</span>
                            <div className="font-medium text-slate-900">
                                {watch.location || "N/A"}
                            </div>
                        </div>
                        <div>
                            <span className="text-slate-500">Caliber:</span>
                            <div className="font-medium text-slate-900">
                                {watch.caliber || "N/A"}
                            </div>
                        </div>

                        {watch.batch && (
                            <div>
                                <span className="text-slate-500">Batch:</span>
                                <div className="font-medium text-slate-900">
                                    {watch.batch}
                                </div>
                            </div>
                        )}
                        <div>
                            <span className="text-slate-500">Timegrapher:</span>
                            <div className="font-medium text-slate-900">
                                {watch.timegrapher || "N/A"}
                            </div>
                        </div>

                        {watch.current_cost && (
                            <div>
                                <span className="text-slate-500">Cost:</span>
                                <div className="font-medium text-slate-900">
                                    €{watch.current_cost.toLocaleString()}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
