import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Edit3, Search } from "lucide-react";
import { useState } from "react";

interface LocationSelectorProps {
    value: string;
    onValueChange: (value: string) => void;
    locations: string[];
    onEditLocations?: () => void;
}

const LocationSelector = ({
    value,
    onValueChange,
    locations,
    onEditLocations,
}: LocationSelectorProps) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    const filteredLocations = locations.filter((location) =>
        location.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    return (
        <Select
    value={value}
    onValueChange={onValueChange}
    open={isOpen}
    onOpenChange={setIsOpen}
>
    <SelectTrigger className="w-full">
        <SelectValue placeholder="Location" />
    </SelectTrigger>

    <SelectContent>
        <div className="flex items-center space-x-2 border-b p-2">
            <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search locations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                    ref={(input) => input && input.focus()} // keep focus
                    onPointerDown={(e) => e.stopPropagation()} // stop Radix hijack
                    onKeyDown={(e) => e.stopPropagation()}    // stop Radix intercept
                    onKeyUp={(e) => e.stopPropagation()}
                    onClick={(e) => e.stopPropagation()}
                />
            </div>
            {onEditLocations && (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                        e.stopPropagation(); // ⚡ stop Select from closing
                        onEditLocations?.();
                        setIsOpen(false);
                    }}
                >
                    <Edit3 className="h-4 w-4" />
                </Button>
            )}
        </div>

        <div className="max-h-48 overflow-y-auto">
            {filteredLocations.length > 0 ? (
                filteredLocations.map((location) => (
                    <SelectItem key={location} value={location}>
                        {location}
                    </SelectItem>
                ))
            ) : (
                <div className="p-2 text-center text-sm text-muted-foreground">
                    No locations found
                </div>
            )}
        </div>
    </SelectContent>
</Select>

    );
};

export default LocationSelector;
