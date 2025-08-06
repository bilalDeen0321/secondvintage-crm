import BatchSelector from "@/components/BatchSelector";
import BrandSelector from "@/components/BrandSelector";
import Layout from "@/components/Layout";
import LocationSelector from "@/components/LocationSelector";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import WatchCard from "@/components/WatchCard";
import WatchForm from "@/components/WatchForm";
import WatchListView from "@/components/WatchListView";
import { useSearchParams } from "@/hooks/useSearchParams";
import { Watch } from "@/types/Watch";
import { Head } from "@inertiajs/react";
import { Edit, Grid, List, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const WatchManagement = ({ watches: data }) => {
    const [searchParams, setSearchParams] = useSearchParams();

    const [watches, setWatches] = useState<Watch[]>([
        {
            id: "1",
            name: "SEIKO LM SPECIAL",
            sku: "SEI-LM-001",
            brand: "Seiko",
            acquisitionCost: 634.5,
            status: "Listed",
            location: "Denmark",
            batchGroup: "B020",
            serial: "SEI15P3R3Y000",
            ref: "545521",
            caseSize: "36mm",
            caliber: "5216A",
            timegrapher: "+1-3 s/d",
            aiInstructions: "",
            notes: "",
            description: `A standout example of Seiko's legendary 1970s design, this LM Special brings together refined engineering and vibrant aesthetics. The striking metallic-blue sunburst dial, sharply faceted hour markers, and prominent day-date display reflect Seiko's attention to detail and distinctive Lord Matic DNA. Its robust stainless steel case and matching original bracelet ensure lasting presence and comfort on the wrist. For collectors and enthusiasts alike, this Seiko LM Special offers a compelling mix of reliability, period style, and craftsmanship—an exceptional opportunity to own a true icon of Japanese watchmaking.

Brand: Seiko  
Model: LM Special (Lord Matic Special)  
Reference Number: 5206-6090  
Serial Number: 217348  
Movement: Seiko Automatic Caliber 5206, 23 Jewels  
Dial: Metallic blue sunburst finish with applied indices, day-date at 3 o'clock, "LM Special" and 23 Jewels text  
Case Size: 36mm (excluding the crown)  
Case Material: Stainless steel  
Production Year: 1972  
Condition: Very good vintage condition, dial and hands clean, case shows light wear consistent with age, currently running and keeping time within vintage tolerances.

Dial and Hands  
The dial features a radiant metallic blue sunburst finish, with applied rhodium-plated faceted hour markers and matching hands. The "LM Special" and "23 Jewels" insignia are intact and crisp, and the Seiko logo is clean and sharply printed. The day-date complication at 3 o'clock displays both English and Kanji, changing crisply at midnight.

Case and Crystal  
The stainless steel case retains its original sharp profile with only minor signs of use. The faceted case is unpolished, preserving crisp lines and original geometry. Crystal is clear and free from major scratches, providing an unobstructed view of the striking dial.

Movement  
Powered by the Seiko automatic caliber 5206 with 23 jewels, renowned for smooth winding and robust reliability. The movement is clean, operates as intended, and the quickset day-date mechanism functions correctly.

Strap  
Fitted with the original Seiko stainless steel bracelet in excellent condition, shows only light surface wear. Secure folding clasp bears the Seiko logo.

Condition  
Very good vintage condition. Minor surface marks on the case and bracelet consistent with age. The dial, hands, and markers are in excellent, unrestored condition. The movement is currently running and keeping time within vintage tolerances.

Dimensions  
Case diameter: 36mm (excluding the crown)  
Lug-to-lug: 41mm  
Lug width: 18mm  
Thickness: 12mm
Fits up to approx 18.5cm wrist 

Remarks  
A beautifully preserved example of a 1970s Seiko Lord Matic Special, offered with the original bracelet and stunning sunburst blue dial. Rare to find in such well-kept and original condition.

History  
The Seiko Lord Matic Special series represents a leap in Japanese watchmaking, offering high-grade automatic movements, innovative day-date complications, and unique design language. Produced during Seiko's golden era, these watches embody the spirit of progress and precision that defined 1970s Japan. This reference 5206-6090 is a sought-after model among collectors for its technical sophistication and aesthetic appeal.

Payment and Shipping
Payment must be completed within 1-3 days after purchase.
The watch will be securely packaged and shipped with tracking and insurance for your peace of mind.
Please review the pictures carefully before bidding. I strive to showcase the watch from multiple angles for an accurate representation.
As with all vintage watches, water resistance is not guaranteed.
The watch will be delivered in fully functional working condition.
If you have any questions, feel free to contact me after the auction ends.`,
            images: [
                {
                    id: "1",
                    url: "/lovable-uploads/16448c53-9684-40db-9ba2-cc8db08e871c.png",
                    useForAI: true,
                },
                {
                    id: "2",
                    url: "/lovable-uploads/a6232645-6dfc-4c8c-a163-63a08b5a152f.png",
                    useForAI: false,
                },
                {
                    id: "3",
                    url: "/lovable-uploads/7bfeae47-b926-4feb-9e5e-dc722793f8b1.png",
                    useForAI: false,
                },
                {
                    id: "4",
                    url: "/lovable-uploads/c5705a12-d674-4b2c-93d3-566cbb3757fa.png",
                    useForAI: false,
                },
                {
                    id: "5",
                    url: "/lovable-uploads/7130fbd8-0c96-4588-a7a8-c2ba32b3a07f.png",
                    useForAI: false,
                },
                {
                    id: "6",
                    url: "/lovable-uploads/00f3a5e1-e3e7-43d4-8ad4-841f26b8b622.png",
                    useForAI: false,
                },
            ],
        },
        {
            id: "2",
            name: "Rolex Submariner 116610LN",
            sku: "ROL-SUB-001",
            brand: "Rolex",
            acquisitionCost: 8500,
            status: "Listed",
            location: "Denmark",
            description:
                "Excellent condition Rolex Submariner with box and papers. No visible scratches on case or bracelet.",
            notes: "Customer enquiry pending",
            aiInstructions:
                "Focus on the bezel condition and bracelet stretch when analyzing.",
            images: [
                {
                    id: "1",
                    url: "/lovable-uploads/e42df4f6-4752-4442-9e7c-06e8184162be.png",
                    useForAI: true,
                },
                {
                    id: "1a",
                    url: "/lovable-uploads/c9668ac2-5bda-49b2-9679-1759280598e1.png",
                    useForAI: true,
                },
                {
                    id: "1b",
                    url: "/lovable-uploads/8a246750-c18b-4b1c-b6af-25185e84d3d7.png",
                    useForAI: false,
                },
                {
                    id: "1c",
                    url: "/lovable-uploads/5557d546-574f-45fb-bd5a-014ec53e5792.png",
                    useForAI: false,
                },
                {
                    id: "1d",
                    url: "/lovable-uploads/42d61632-8522-4f3e-9f7f-712379b47422.png",
                    useForAI: true,
                },
                {
                    id: "1e",
                    url: "/lovable-uploads/0884f9b0-c02c-4735-9af7-ebe16f554fe8.png",
                    useForAI: false,
                },
                {
                    id: "1f",
                    url: "/lovable-uploads/27ec6583-00c5-4c9f-bf57-429e50240830.png",
                    useForAI: false,
                },
                {
                    id: "1g",
                    url: "/lovable-uploads/cd305798-ab49-4a3b-9157-fb8db777bd8f.png",
                    useForAI: true,
                },
                {
                    id: "1h",
                    url: "/lovable-uploads/c3abfafa-8986-4b30-bd89-3d163701cb64.png",
                    useForAI: false,
                },
                {
                    id: "1i",
                    url: "/lovable-uploads/52231a31-d92b-4dc7-ab75-1e37c3104e6c.png",
                    useForAI: false,
                },
                {
                    id: "1j",
                    url: "/lovable-uploads/e42df4f6-4752-4442-9e7c-06e8184162be.png",
                    useForAI: true,
                },
                {
                    id: "1k",
                    url: "/lovable-uploads/c9668ac2-5bda-49b2-9679-1759280598e1.png",
                    useForAI: false,
                },
                {
                    id: "1l",
                    url: "/lovable-uploads/8a246750-c18b-4b1c-b6af-25185e84d3d7.png",
                    useForAI: false,
                },
                {
                    id: "1m",
                    url: "/lovable-uploads/5557d546-574f-45fb-bd5a-014ec53e5792.png",
                    useForAI: true,
                },
                {
                    id: "1n",
                    url: "/lovable-uploads/42d61632-8522-4f3e-9f7f-712379b47422.png",
                    useForAI: false,
                },
            ],
        },
        {
            id: "3",
            name: "Omega Speedmaster Professional",
            sku: "OME-SPE-002",
            brand: "Omega",
            acquisitionCost: 3200,
            status: "Ready for listing",
            location: "Vietnam",
            description:
                "Classic moonwatch with manual wind movement. Recently serviced.",
            notes: "Service receipt available",
            aiInstructions: "Check chronograph function and pusher condition.",
            images: [],
        },
        {
            id: "4",
            name: "TAG Heuer Monaco",
            sku: "TAG-MON-003",
            brand: "TAG Heuer",
            acquisitionCost: 2800,
            status: "Review",
            location: "Japan",
            description: "Iconic square case chronograph. Needs minor service.",
            notes: "Waiting for parts",
            aiInstructions: "Analyze case condition and crown operation.",
            images: [],
        },
        {
            id: "5",
            name: "Breitling Navitimer",
            sku: "BRE-NAV-004",
            brand: "Breitling",
            acquisitionCost: 4200,
            status: "Listed",
            location: "Denmark",
            description:
                "Aviation chronograph with slide rule bezel. Complete set with box and papers.",
            notes: "VIP customer interested",
            aiInstructions: "Check bezel operation and chronograph accuracy.",
            images: [
                {
                    id: "4",
                    url: "/lovable-uploads/8a246750-c18b-4b1c-b6af-25185e84d3d7.png",
                    useForAI: true,
                },
                {
                    id: "4a",
                    url: "/lovable-uploads/5557d546-574f-45fb-bd5a-014ec53e5792.png",
                    useForAI: false,
                },
            ],
        },
        {
            id: "6",
            name: "IWC Pilot Mark XVIII",
            sku: "IWC-PIL-005",
            brand: "IWC",
            acquisitionCost: 3800,
            status: "Sold",
            location: "In Transit",
            description:
                "Military-inspired pilot watch with antimagnetic movement.",
            notes: "Sold to regular customer",
            aiInstructions: "Focus on dial condition and case wear.",
            images: [
                {
                    id: "5",
                    url: "/lovable-uploads/42d61632-8522-4f3e-9f7f-712379b47422.png",
                    useForAI: true,
                },
            ],
        },
        {
            id: "7",
            name: "Seiko Grand Seiko SBGA211",
            sku: "SEI-GS-006",
            brand: "Seiko",
            acquisitionCost: 2200,
            status: "Reserved",
            location: "Vietnam",
            description:
                "Spring Drive movement with power reserve indicator. Snowflake dial.",
            notes: "Reserved for walk-in customer",
            aiInstructions: "Check power reserve function and dial finishing.",
            images: [
                {
                    id: "6",
                    url: "/lovable-uploads/0884f9b0-c02c-4735-9af7-ebe16f554fe8.png",
                    useForAI: true,
                },
                {
                    id: "6a",
                    url: "/lovable-uploads/27ec6583-00c5-4c9f-bf57-429e50240830.png",
                    useForAI: false,
                },
            ],
        },
        {
            id: "8",
            name: "Tudor Black Bay 58",
            sku: "TUD-BB-007",
            brand: "Tudor",
            acquisitionCost: 3100,
            status: "Platform Review",
            location: "Japan",
            description:
                "Vintage-inspired diver with in-house movement. Excellent condition.",
            notes: "Featured in newsletter",
            aiInstructions: "Analyze bezel action and case preservation.",
            images: [
                {
                    id: "7",
                    url: "/lovable-uploads/cd305798-ab49-4a3b-9157-fb8db777bd8f.png",
                    useForAI: true,
                },
            ],
        },
        {
            id: "9",
            name: "Cartier Tank Solo",
            sku: "CAR-TAN-008",
            brand: "Cartier",
            acquisitionCost: 1800,
            status: "Draft",
            location: "Denmark",
            description:
                "Classic rectangular dress watch with Roman numerals. Steel case.",
            notes: "Display case featured item",
            aiInstructions: "Check case polish and crown operation.",
            images: [
                {
                    id: "8",
                    url: "/lovable-uploads/c3abfafa-8986-4b30-bd89-3d163701cb64.png",
                    useForAI: true,
                },
                {
                    id: "8a",
                    url: "/lovable-uploads/52231a31-d92b-4dc7-ab75-1e37c3104e6c.png",
                    useForAI: false,
                },
            ],
        },
        {
            id: "10",
            name: "Longines Master Collection",
            sku: "LON-MAS-009",
            brand: "Longines",
            acquisitionCost: 1650,
            status: "Listed",
            location: "Vietnam",
            description:
                "Elegant dress watch with moon phase complication. Automatic movement.",
            notes: "Recently polished",
            aiInstructions: "Focus on moon phase accuracy and case finish.",
            images: [
                {
                    id: "9",
                    url: "/lovable-uploads/e42df4f6-4752-4442-9e7c-06e8184162be.png",
                    useForAI: true,
                },
            ],
        },
        {
            id: "11",
            name: "Omega Seamaster Diver 300M",
            sku: "OME-SEA-010",
            brand: "Omega",
            acquisitionCost: 2900,
            status: "Ready for listing",
            location: "Japan",
            description:
                "Professional diving watch with helium escape valve. Blue ceramic bezel.",
            notes: "Complete with warranty card",
            aiInstructions: "Check bezel operation and water resistance seals.",
            images: [
                {
                    id: "10",
                    url: "/lovable-uploads/c9668ac2-5bda-49b2-9679-1759280598e1.png",
                    useForAI: true,
                },
            ],
        },
        {
            id: "12",
            name: "Seiko Prospex Solar Diver",
            sku: "SEI-PRO-011",
            brand: "Seiko",
            acquisitionCost: 320,
            status: "Listed",
            location: "Denmark",
            description:
                "Solar-powered diving watch with 200m water resistance. Silicone strap.",
            notes: "Popular entry-level model",
            aiInstructions:
                "Test solar charging function and check bezel alignment.",
            images: [
                {
                    id: "11",
                    url: "/lovable-uploads/8a246750-c18b-4b1c-baf-25185e84d3d7.png",
                    useForAI: false,
                },
            ],
        },
        {
            id: "13",
            name: "Longines HydroConquest",
            sku: "LON-HYD-012",
            brand: "Longines",
            acquisitionCost: 1100,
            status: "Review",
            location: "Vietnam",
            description:
                "Sports diving watch with ceramic bezel. 300m water resistance.",
            notes: "Minor bracelet stretch",
            aiInstructions: "Examine bracelet condition and crown threading.",
            images: [
                {
                    id: "12",
                    url: "/lovable-uploads/5557d546-574f-45fb-bd5a-014ec53e5792.png",
                    useForAI: true,
                },
            ],
        },
        {
            id: "14",
            name: "Omega Constellation",
            sku: "OME-CON-013",
            brand: "Omega",
            acquisitionCost: 2400,
            status: "Sold",
            location: "In Transit",
            description:
                "Luxury dress watch with Co-Axial movement. 18k gold bezel.",
            notes: "Sold to collector",
            aiInstructions:
                "Check gold bezel for scratches and movement accuracy.",
            images: [
                {
                    id: "13",
                    url: "/lovable-uploads/42d61632-8522-4f3e-9f7f-712379b47422.png",
                    useForAI: false,
                },
            ],
        },
        {
            id: "15",
            name: "Seiko 5 Sports Automatic",
            sku: "SEI-5SP-014",
            brand: "Seiko",
            acquisitionCost: 180,
            status: "Draft",
            location: "Japan",
            description:
                "Entry-level automatic sports watch. Day-date function.",
            notes: "Great starter watch",
            aiInstructions: "Test automatic winding and date change function.",
            images: [
                {
                    id: "14",
                    url: "/lovable-uploads/0884f9b0-c02c-4735-9af7-ebe16f554fe8.png",
                    useForAI: true,
                },
            ],
        },
        {
            id: "16",
            name: "Longines Spirit Chronometer",
            sku: "LON-SPI-015",
            brand: "Longines",
            acquisitionCost: 1950,
            status: "Platform Review",
            location: "Denmark",
            description:
                "COSC-certified chronometer with aviation heritage. Titanium case.",
            notes: "Limited availability model",
            aiInstructions:
                "Verify chronometer certification and case condition.",
            images: [
                {
                    id: "15",
                    url: "/lovable-uploads/27ec6583-00c5-4c9f-bf57-429e50240830.png",
                    useForAI: true,
                },
            ],
        },
        {
            id: "17",
            name: "Omega De Ville Prestige",
            sku: "OME-DEV-016",
            brand: "Omega",
            acquisitionCost: 1800,
            status: "Reserved",
            location: "Vietnam",
            description:
                "Elegant dress watch with Roman numerals. Leather strap.",
            notes: "Customer deposit received",
            aiInstructions: "Check dial condition and leather strap wear.",
            images: [
                {
                    id: "16",
                    url: "/lovable-uploads/cd305798-ab49-4a3b-9157-fb8db777bd8f.png",
                    useForAI: false,
                },
            ],
        },
        {
            id: "18",
            name: "Seiko Samurai Automatic Diver",
            sku: "SEI-SAM-017",
            brand: "Seiko",
            acquisitionCost: 280,
            status: "Standby",
            location: "Japan",
            description:
                "Distinctive angular case diver with 200m water resistance.",
            notes: "Awaiting photography",
            aiInstructions: "Test bezel action and check crown seal.",
            images: [
                {
                    id: "17",
                    url: "/lovable-uploads/c3abfafa-8986-4b30-bd89-3d163701cb64.png",
                    useForAI: true,
                },
            ],
        },
        {
            id: "19",
            name: "Longines Heritage Classic",
            sku: "LON-HER-018",
            brand: "Longines",
            acquisitionCost: 1400,
            status: "Defect/Problem",
            location: "Denmark",
            description:
                "Vintage-inspired dress watch with sector dial. Needs service.",
            notes: "Crown issue - service required",
            aiInstructions: "Document crown problem and overall condition.",
            images: [
                {
                    id: "18",
                    url: "/lovable-uploads/52231a31-d92b-4dc7-ab75-1e37c3104e6c.png",
                    useForAI: true,
                },
            ],
        },
    ]);

    const [showForm, setShowForm] = useState(false);
    const [editingWatch, setEditingWatch] = useState<Watch | undefined>();
    const [statusFilters, setStatusFilters] = useState<string[]>(["All"]);
    const [brandFilter, setBrandFilter] = useState<string>("All");
    const [batchFilter, setBatchFilter] = useState<string>("All");
    const [locationFilter, setLocationFilter] = useState<string>("All");
    const [searchTerm, setSearchTerm] = useState("");
    const [viewMode, setViewMode] = useState<"grid" | "list">("list");
    const [currentPage, setCurrentPage] = useState(1);
    const [showBrandEditor, setShowBrandEditor] = useState(false);
    const [sortField, setSortField] = useState<string>("");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
    const [selectedWatches, setSelectedWatches] = useState<string[]>([]);

    const itemsPerPage = 50;

    const getBatchGroup = (watchId: string) => {
        // Simple logic to assign batch groups based on watch ID
        const batchNumber = (parseInt(watchId) % 4) + 1;
        return `B00${batchNumber}`;
    };

    const getNavigationInfo = () => {
        if (!editingWatch) return { hasNext: false, hasPrevious: false };

        const currentIndex = filteredAndSortedWatches.findIndex(
            (w) => w.id === editingWatch.id,
        );
        return {
            hasNext: currentIndex < filteredAndSortedWatches.length - 1,
            hasPrevious: currentIndex > 0,
        };
    };

    const handleAddWatch = () => {
        setEditingWatch(undefined);
        setShowForm(true);
    };

    const handleEditWatch = (watch: Watch) => {
        setEditingWatch(watch);
        setShowForm(true);
        // Update URL with SKU parameter for easy sharing
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set("sku", watch.sku);
        setSearchParams(newSearchParams, { replace: true });
    };

    const handleSaveWatch = (watchData: Omit<Watch, "id">) => {
        if (editingWatch) {
            setWatches(
                watches.map((w) =>
                    w.id === editingWatch.id
                        ? { ...watchData, id: editingWatch.id }
                        : w,
                ),
            );
        } else {
            const newWatch: Watch = {
                ...watchData,
                id: Date.now().toString(),
            };
            setWatches([...watches, newWatch]);
        }
        setShowForm(false);
        setEditingWatch(undefined);
        // Clean up URL when closing form
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.delete("sku");
        setSearchParams(newSearchParams, { replace: true });
    };

    const handleDeleteWatch = (id: string) => {
        if (window.confirm("Are you sure you want to delete this watch?")) {
            setWatches(watches.filter((w) => w.id !== id));
        }
    };

    const handleSort = (field: string) => {
        if (sortField === field) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortDirection("asc");
        }
    };

    const handleSelectWatch = (watchId: string, checked: boolean) => {
        if (checked) {
            setSelectedWatches([...selectedWatches, watchId]);
        } else {
            setSelectedWatches(selectedWatches.filter((id) => id !== watchId));
        }
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedWatches(filteredAndSortedWatches.map((w) => w.id));
        } else {
            setSelectedWatches([]);
        }
    };

    const handleBulkStatusChange = (newStatus: string) => {
        setWatches((prev) =>
            prev.map((watch) =>
                selectedWatches.includes(watch.id)
                    ? { ...watch, status: newStatus as Watch["status"] }
                    : watch,
            ),
        );
        setSelectedWatches([]);
    };

    const handleBulkLocationChange = (newLocation: string) => {
        setWatches((prev) =>
            prev.map((watch) =>
                selectedWatches.includes(watch.id)
                    ? { ...watch, location: newLocation }
                    : watch,
            ),
        );
        setSelectedWatches([]);
    };

    const handleBulkBatchChange = (batchGroup: string) => {
        setWatches((prev) =>
            prev.map((watch) =>
                selectedWatches.includes(watch.id)
                    ? { ...watch, batchGroup }
                    : watch,
            ),
        );
        setSelectedWatches([]);
    };

    const handleStatusToggle = (status: string) => {
        if (status === "All") {
            setStatusFilters(["All"]);
        } else {
            setStatusFilters((prev) => {
                // Remove 'All' if it's selected and we're selecting another status
                const newFilters = prev.filter((s) => s !== "All");

                if (newFilters.includes(status)) {
                    // Remove the status if it's already selected
                    const filtered = newFilters.filter((s) => s !== status);
                    return filtered.length === 0 ? ["All"] : filtered;
                } else {
                    // Add the status
                    return [...newFilters, status];
                }
            });
        }
        setCurrentPage(1);
    };

    const filteredAndSortedWatches = useMemo(() => {
        let filtered = watches.filter((watch) => {
            const matchesStatus =
                statusFilters.includes("All") ||
                statusFilters.includes(watch.status);
            const matchesBrand =
                brandFilter === "All" || watch.brand === brandFilter;
            const matchesBatch =
                batchFilter === "All" ||
                getBatchGroup(watch.id) === batchFilter;
            const matchesLocation =
                locationFilter === "All" || watch.location === locationFilter;
            const matchesSearch =
                watch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                watch.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                watch.sku.toLowerCase().includes(searchTerm.toLowerCase());
            return (
                matchesStatus &&
                matchesBrand &&
                matchesBatch &&
                matchesLocation &&
                matchesSearch
            );
        });

        if (sortField) {
            filtered = [...filtered].sort((a, b) => {
                let aValue = a[sortField as keyof Watch];
                let bValue = b[sortField as keyof Watch];

                if (typeof aValue === "string") {
                    aValue = aValue.toLowerCase();
                }
                if (typeof bValue === "string") {
                    bValue = bValue.toLowerCase();
                }

                if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
                if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
                return 0;
            });
        }

        return filtered;
    }, [
        watches,
        statusFilters,
        brandFilter,
        batchFilter,
        locationFilter,
        searchTerm,
        sortField,
        sortDirection,
    ]);

    const paginatedWatches = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredAndSortedWatches.slice(
            startIndex,
            startIndex + itemsPerPage,
        );
    }, [filteredAndSortedWatches, currentPage, itemsPerPage]);

    const totalPages = Math.ceil(
        filteredAndSortedWatches.length / itemsPerPage,
    );

    // Fix: Filter out empty strings when creating unique brands, batches, and locations
    const uniqueBrands = [
        "All",
        ...Array.from(
            new Set(
                watches
                    .map((w) => w.brand)
                    .filter((brand) => brand && brand.trim() !== ""),
            ),
        ),
    ];
    const uniqueBatches = [
        "All",
        ...Array.from(new Set(watches.map((w) => getBatchGroup(w.id)))),
    ];
    const uniqueLocations = [
        "All",
        ...Array.from(
            new Set(
                watches
                    .map((w) => w.location)
                    .filter((location) => location && location.trim() !== ""),
            ),
        ),
    ];

    const statusCounts = {
        All: watches.length,
        Draft: watches.filter((w) => w.status === "Draft").length,
        Review: watches.filter((w) => w.status === "Review").length,
        Approved: watches.filter((w) => w.status === "Approved").length,
        "Platform Review": watches.filter((w) => w.status === "Platform Review")
            .length,
        "Ready for listing": watches.filter(
            (w) => w.status === "Ready for listing",
        ).length,
        Listed: watches.filter((w) => w.status === "Listed").length,
        Reserved: watches.filter((w) => w.status === "Reserved").length,
        Sold: watches.filter((w) => w.status === "Sold").length,
        "Defect/Problem": watches.filter((w) => w.status === "Defect/Problem")
            .length,
        Standby: watches.filter((w) => w.status === "Standby").length,
    };

    // Split status counts into two rows
    const firstRowStatuses = [
        "All",
        "Draft",
        "Review",
        "Approved",
        "Platform Review",
        "Ready for listing",
    ];
    const secondRowStatuses = [
        "Listed",
        "Reserved",
        "Sold",
        "Defect/Problem",
        "Standby",
    ];

    const handleEditBrands = () => {
        alert(
            "Brand editing feature would be implemented here. This would open a modal to add, edit, or remove brands from the list.",
        );
    };

    const handleEditBatches = () => {
        alert(
            "Batch editing feature would be implemented here. This would open a modal to add, edit, or remove batch groups from the list.",
        );
    };

    const handleEditLocations = () => {
        alert(
            "Location editing feature would be implemented here. This would open a modal to add, edit, or remove locations from the list.",
        );
    };

    const statuses = [
        "Draft",
        "Review",
        "Approved",
        "Platform Review",
        "Ready for listing",
        "Listed",
        "Reserved",
        "Sold",
        "Defect/Problem",
        "Standby",
    ];
    const locations = ["Denmark", "Vietnam", "Japan", "In Transit"];
    const batchGroups = ["B001", "B002", "B003", "B004"];

    const handleNextWatch = () => {
        if (editingWatch) {
            const currentIndex = filteredAndSortedWatches.findIndex(
                (w) => w.id === editingWatch.id,
            );
            if (currentIndex < filteredAndSortedWatches.length - 1) {
                const nextWatch = filteredAndSortedWatches[currentIndex + 1];
                setEditingWatch(nextWatch);
                // Update URL with new SKU
                const newSearchParams = new URLSearchParams(searchParams);
                newSearchParams.set("sku", nextWatch.sku);
                setSearchParams(newSearchParams, { replace: true });
            }
        }
    };

    const handlePreviousWatch = () => {
        if (editingWatch) {
            const currentIndex = filteredAndSortedWatches.findIndex(
                (w) => w.id === editingWatch.id,
            );
            if (currentIndex > 0) {
                const previousWatch =
                    filteredAndSortedWatches[currentIndex - 1];
                setEditingWatch(previousWatch);
                // Update URL with new SKU
                const newSearchParams = new URLSearchParams(searchParams);
                newSearchParams.set("sku", previousWatch.sku);
                setSearchParams(newSearchParams, { replace: true });
            }
        }
    };

    // Handle SKU query parameter
    useEffect(() => {
        const skuParam = searchParams.get("sku");
        if (skuParam && !showForm) {
            const watchToEdit = watches.find((watch) => watch.sku === skuParam);
            if (watchToEdit) {
                setEditingWatch(watchToEdit);
                setShowForm(true);
            }
        }
    }, [searchParams, watches, showForm]);

    return (
        <Layout>
            <Head title="Watch Management" />
            <div className="p-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900">
                                Watch Management
                            </h1>
                            <p className="mt-1 text-slate-600">
                                Manage your watch inventory and track status
                            </p>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex h-[42px] rounded-lg border border-slate-300">
                                <Button
                                    variant={
                                        viewMode === "grid"
                                            ? "default"
                                            : "ghost"
                                    }
                                    size="sm"
                                    onClick={() => setViewMode("grid")}
                                    className="h-full rounded-r-none"
                                >
                                    <Grid className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant={
                                        viewMode === "list"
                                            ? "default"
                                            : "ghost"
                                    }
                                    size="sm"
                                    onClick={() => setViewMode("list")}
                                    className="h-full rounded-l-none"
                                >
                                    <List className="h-4 w-4" />
                                </Button>
                            </div>
                            <Button
                                onClick={handleAddWatch}
                                className="flex items-center gap-2"
                            >
                                <span className="text-lg">+</span>
                                Add New Watch
                            </Button>
                        </div>
                    </div>

                    {/* Multi-select Status Filter */}
                    <div className="mb-6">
                        <div className="flex flex-wrap gap-2">
                            {Object.entries(statusCounts).map(
                                ([status, count]) => (
                                    <button
                                        key={status}
                                        onClick={() =>
                                            handleStatusToggle(status)
                                        }
                                        className={`h-16 w-[100px] rounded-lg border p-2 text-center transition-all ${statusFilters.includes(status)
                                            ? "border-primary bg-primary/10 ring-2 ring-primary/30"
                                            : "border-slate-200 bg-white hover:border-slate-300"
                                            }`}
                                    >
                                        <div className="text-lg font-bold text-slate-900">
                                            {count}
                                        </div>
                                        <div className="truncate text-xs leading-tight text-slate-600">
                                            {status}
                                        </div>
                                    </button>
                                ),
                            )}
                        </div>

                        {/* Clear status filters button */}
                        {statusFilters.length > 1 ||
                            (statusFilters.length === 1 &&
                                !statusFilters.includes("All")) ? (
                            <div className="mt-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setStatusFilters(["All"])}
                                    className="border-slate-300 text-slate-600 hover:bg-slate-100"
                                >
                                    <X className="mr-1 h-3 w-3" />
                                    Clear Status Filters
                                </Button>
                            </div>
                        ) : null}
                    </div>

                    {/* Search and Filters */}
                    <div className="mb-6 flex flex-col gap-4 lg:flex-row">
                        <div className="flex-1">
                            <Input
                                type="text"
                                placeholder="Search watches by name, brand, or SKU..."
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1);
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
                                    value={brandFilter}
                                    onValueChange={(value) => {
                                        setBrandFilter(value);
                                        setCurrentPage(1);
                                    }}
                                    brands={uniqueBrands}
                                    onEditBrands={handleEditBrands}
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="whitespace-nowrap text-sm font-medium text-slate-700">
                                    Batch:
                                </span>
                                <BatchSelector
                                    value={batchFilter}
                                    onValueChange={(value) => {
                                        setBatchFilter(value);
                                        setCurrentPage(1);
                                    }}
                                    batches={uniqueBatches}
                                    onEditBatches={handleEditBatches}
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="whitespace-nowrap text-sm font-medium text-slate-700">
                                    Location:
                                </span>
                                <LocationSelector
                                    value={locationFilter}
                                    onValueChange={(value) => {
                                        setLocationFilter(value);
                                        setCurrentPage(1);
                                    }}
                                    locations={uniqueLocations}
                                    onEditLocations={handleEditLocations}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Bulk Actions */}
                    {selectedWatches.length > 0 && (
                        <div className="mb-6 flex flex-wrap gap-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
                            <div className="flex items-center gap-2">
                                <Edit className="h-4 w-4 text-blue-600" />
                                <span className="text-sm font-medium text-blue-800">
                                    {selectedWatches.length} watches selected -
                                    Bulk Actions:
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="text-sm text-blue-700">
                                    Status:
                                </span>
                                <Select onValueChange={handleBulkStatusChange}>
                                    <SelectTrigger className="w-40">
                                        <SelectValue placeholder="Change Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {statuses.map((status) => (
                                            <SelectItem
                                                key={status}
                                                value={status}
                                            >
                                                {status}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="text-sm text-blue-700">
                                    Location:
                                </span>
                                <Select
                                    onValueChange={handleBulkLocationChange}
                                >
                                    <SelectTrigger className="w-40">
                                        <SelectValue placeholder="Change Location" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {locations.map((location) => (
                                            <SelectItem
                                                key={location}
                                                value={location}
                                            >
                                                {location}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="text-sm text-blue-700">
                                    Batch Group:
                                </span>
                                <Select onValueChange={handleBulkBatchChange}>
                                    <SelectTrigger className="w-40">
                                        <SelectValue placeholder="Change Batch" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {batchGroups.map((batch) => (
                                            <SelectItem
                                                key={batch}
                                                value={batch}
                                            >
                                                {batch}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedWatches([])}
                                className="border-blue-300 text-blue-600 hover:bg-blue-100"
                            >
                                Clear Selection
                            </Button>
                        </div>
                    )}

                    {/* Results info and pagination controls */}
                    <div className="mb-4 flex items-center justify-between">
                        <div className="text-sm text-slate-600">
                            Showing {(currentPage - 1) * itemsPerPage + 1}-
                            {Math.min(
                                currentPage * itemsPerPage,
                                filteredAndSortedWatches.length,
                            )}{" "}
                            of {filteredAndSortedWatches.length} watches
                        </div>
                        {totalPages > 1 && (
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        setCurrentPage((prev) =>
                                            Math.max(1, prev - 1),
                                        )
                                    }
                                    disabled={currentPage === 1}
                                >
                                    Previous
                                </Button>
                                <span className="px-3 py-1 text-sm text-slate-600">
                                    Page {currentPage} of {totalPages}
                                </span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        setCurrentPage((prev) =>
                                            Math.min(totalPages, prev + 1),
                                        )
                                    }
                                    disabled={currentPage === totalPages}
                                >
                                    Next
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Content */}
                {viewMode === "grid" ? (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {paginatedWatches.map((watch) => (
                            <WatchCard
                                key={watch.id}
                                watch={watch}
                                onEdit={handleEditWatch}
                                onDelete={handleDeleteWatch}
                            />
                        ))}
                    </div>
                ) : (
                    <WatchListView
                        watches={paginatedWatches}
                        onEdit={handleEditWatch}
                        onDelete={handleDeleteWatch}
                        onSort={handleSort}
                        sortField={sortField}
                        sortDirection={sortDirection}
                        selectedWatches={selectedWatches}
                        onSelectWatch={handleSelectWatch}
                        onSelectAll={handleSelectAll}
                    />
                )}

                {filteredAndSortedWatches.length === 0 && (
                    <div className="py-12 text-center">
                        <div className="mb-4 text-6xl">⌚</div>
                        <h3 className="mb-2 text-xl font-medium text-slate-900">
                            No watches found
                        </h3>
                        <p className="text-slate-600">
                            Try adjusting your search or filters
                        </p>
                    </div>
                )}

                {/* Form Modal */}
                {showForm && (
                    <WatchForm
                        watch={editingWatch}
                        onSave={handleSaveWatch}
                        onCancel={() => {
                            setShowForm(false);
                            setEditingWatch(undefined);
                            // Clean up URL when canceling
                            const newSearchParams = new URLSearchParams(
                                searchParams,
                            );
                            newSearchParams.delete("sku");
                            setSearchParams(newSearchParams, { replace: true });
                        }}
                        onNext={
                            getNavigationInfo().hasNext
                                ? handleNextWatch
                                : undefined
                        }
                        onPrevious={
                            getNavigationInfo().hasPrevious
                                ? handlePreviousWatch
                                : undefined
                        }
                        hasNext={getNavigationInfo().hasNext}
                        hasPrevious={getNavigationInfo().hasPrevious}
                    />
                )}
            </div>
        </Layout>
    );
};

export default WatchManagement;
