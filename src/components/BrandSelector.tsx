import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Edit3, Search, ChevronDown } from "lucide-react";

interface BrandSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
  brands: string[];
  onEditBrands?: () => void;
  disabled?: boolean;
}

const BrandSelector = ({
  value,
  onValueChange,
  brands,
  onEditBrands,
  disabled = false,
}: BrandSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 🔍 memoized filtering (so it doesn’t re-render uncontrollably)
  const filteredBrands = useCallback(
    () =>
      brands.filter((brand) =>
        brand.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [brands, searchTerm]
  );

  // 🧠 Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🧠 Keep focus on input while dropdown is open
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [open]);

  if (disabled) {
    return (
      <div className="border rounded-md px-3 py-2 text-sm bg-muted text-slate-700 cursor-not-allowed">
        {value || "—"}
      </div>
    );
  }

  return (
<Select
  value={value}
  onValueChange={(val) => onValueChange(val)}
  open={open}
  onOpenChange={setOpen}
>
  <SelectTrigger className="w-full">
    <SelectValue placeholder="Select brand..." />
  </SelectTrigger>

  <SelectContent
    onOpenAutoFocus={(e) => e.preventDefault()}
    onCloseAutoFocus={(e) => e.preventDefault()}
    onInteractOutside={(e) => {
      if (e.target.closest("input")) e.preventDefault();
    }}
  >
    <div className="flex items-center space-x-2 border-b p-2">
      <div className="relative flex-1">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search brands..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-8"
          autoFocus
          onPointerDown={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
          onKeyUp={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        />
      </div>

      {onEditBrands && (
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onEditBrands();
            setOpen(false);
          }}
        >
          <Edit3 className="h-4 w-4" />
        </Button>
      )}
    </div>

    <div className="max-h-48 overflow-y-auto">
      {filteredBrands().length > 0 ? (
        filteredBrands().map((brand) => (
          <SelectItem key={brand} value={brand}>
            {brand}
          </SelectItem>
        ))
      ) : (
        <div className="p-2 text-center text-sm text-muted-foreground">
          No brands found
        </div>
      )}
    </div>
  </SelectContent>
</Select>



  );
};

export default BrandSelector;
