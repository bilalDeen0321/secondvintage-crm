import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
    <div className="relative w-full" ref={containerRef}>
      {/* Trigger */}
      <div
        className="border rounded-md px-3 py-2 text-sm flex items-center justify-between cursor-pointer"
        onClick={() => setOpen((o) => !o)}
      >
        <span>{value || "Select brand..."}</span>
        <ChevronDown className="h-4 w-4 text-muted-foreground" />
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-md border bg-background shadow-md">
          <div className="flex items-center space-x-2 border-b p-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                ref={inputRef}
                placeholder="Search brands..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => e.stopPropagation()}
                autoFocus
              />
            </div>
            {onEditBrands && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onEditBrands();
                  setOpen(false);
                }}
              >
                <Edit3 className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Options */}
          <div
            className="max-h-48 overflow-y-auto"
            onMouseDown={(e) => e.preventDefault()} // ⚡ prevent losing focus
          >
            {filteredBrands().length > 0 ? (
              filteredBrands().map((brand) => (
                <div
                  key={brand}
                  className={`cursor-pointer px-3 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground ${
                    brand === value ? "bg-accent text-accent-foreground" : ""
                  }`}
                  onClick={() => {
                    onValueChange(brand);
                    setOpen(false);
                    setSearchTerm("");
                  }}
                >
                  {brand}
                </div>
              ))
            ) : (
              <div className="p-2 text-center text-sm text-muted-foreground">
                No brands found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BrandSelector;
