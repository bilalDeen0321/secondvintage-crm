import BatchSelector from "@/components/BatchSelector";
import BrandSelector from "@/components/BrandSelector";
import LocationSelector from "@/components/LocationSelector";
import { Input } from "@/components/ui/input";
import { handleEditBatches, handleEditBrands, handleEditLocations } from "../_actions";
import { getSelectSearch, watchFilter } from "../_search";

export default function WatchSearchAndFilter({ data, setData, brands, batches, locations }) {
    return (
        <div className="mb-6 flex flex-col gap-4 lg:flex-row">
            <div className="flex-1">
                <Input
                    type="text"
                    placeholder="Search watches by name, brand, or SKU..."
                    value={data.search}
                    onChange={(e) => {
                        watchFilter("search", e.target.value);
                        setData("search", e.target.value);
                    }}
                    className="w-full"
                />
            </div>
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <span className="whitespace-nowrap text-sm font-medium text-slate-700">
                        Brand:
                    </span>
                    <BrandSelector
                        value={data.brand}
                        onValueChange={(value) => {
                            setData("brand", value);
                            watchFilter("brand", getSelectSearch(value));
                        }}
                        brands={["All", ...brands]}
                        onEditBrands={handleEditBrands}
                    />
                </div>

                <div className="flex items-center gap-2">
                    <span className="whitespace-nowrap text-sm font-medium text-slate-700">
                        Batch:
                    </span>
                    <BatchSelector
                        value={data.batch}
                        onValueChange={(value) => {
                            setData("batch", value);
                            watchFilter("batch", getSelectSearch(value));
                        }}
                        batches={["All", ...batches]}
                        onEditBatches={handleEditBatches}
                    />
                </div>

                <div className="flex items-center gap-2">
                    <span className="whitespace-nowrap text-sm font-medium text-slate-700">
                        Location:
                    </span>
                    <LocationSelector
                        value={data.location}
                        onValueChange={(value) => {
                            setData("location", value);
                            watchFilter("location", getSelectSearch(value));
                        }}
                        locations={["All", ...locations]}
                        onEditLocations={handleEditLocations}
                    />
                </div>
            </div>
        </div>
    );
}
