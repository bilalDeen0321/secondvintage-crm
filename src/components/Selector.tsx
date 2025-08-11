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
import { useMemo, useState } from "react";

type Option = string | { name: string; id: string };

interface Props {
    value: string;
    onValueChange: (value: string) => void;
    options: Option[];
    placeholder?: string;
    onUpdate?: () => void;
}

const Selector = ({ value, onValueChange, options, placeholder = "Select an option", onUpdate }: Props) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    // Normalize options into a consistent { id, name } shape
    const normalizedOptions = useMemo(() => {
        return options.map((opt) =>
            typeof opt === "string"
                ? { id: opt, name: opt }
                : { id: opt.id, name: opt.name }
        );
    }, [options]);

    const filteredOptions = normalizedOptions.filter((opt) =>
        opt?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Select
            value={value}
            onValueChange={onValueChange}
            open={isOpen}
            onOpenChange={setIsOpen}
        >
            <SelectTrigger className="w-full">
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
                {/* Search bar + optional edit button */}
                <div className="flex items-center space-x-2 border-b p-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder={`Search ${placeholder.toLowerCase()}...`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-8"
                        />
                    </div>
                    {onUpdate && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                onUpdate();
                                setIsOpen(false);
                            }}
                        >
                            <Edit3 className="h-4 w-4" />
                        </Button>
                    )}
                </div>

                {/* List */}
                <div className="max-h-48 overflow-y-auto">
                    {filteredOptions.map((opt) => (
                        <SelectItem key={opt.id} value={opt.id}>
                            {opt.name}
                        </SelectItem>
                    ))}
                    {filteredOptions.length === 0 && (
                        <div className="p-2 text-center text-sm text-muted-foreground">
                            No options found
                        </div>
                    )}
                </div>
            </SelectContent>
        </Select>
    );
};

export default Selector;
