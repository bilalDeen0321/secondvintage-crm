import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Head } from "@inertiajs/react";
import { format } from "date-fns";
import {
    ArrowDown,
    ArrowUp,
    CalendarIcon,
    Edit,
    Filter,
    Grid3X3,
    List,
    Plus,
    Search,
    Tag,
    Trash2,
    Upload,
} from "lucide-react";
import { useState } from "react";
import BrandSelector from "../components/BrandSelector";
import ImageManager from "../components/ImageManager";
import Layout from "../components/Layout";
import { WatchImage } from "../types/Watch";

interface AgentWatch {
    id: string;
    name: string;
    sku: string;
    brand: string;
    serialNumber: string;
    referenceNumber: string;
    caseSize: string;
    price: number;
    currency: string;
    notes: string;
    description: string;
    images: WatchImage[];
    status: "Unpaid" | "Paid (not received)" | "Paid (received)" | "Refunded";
    createdAt: Date;
    seller: string;
    agent?: string;
    paymentId?: string;
}

const AgentWatches = () => {
    // Add sorting state
    const [sortField, setSortField] = useState<keyof AgentWatch | null>(null);
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

    // Add the missing watches state with 23 watch examples
    const [watches, setWatches] = useState<AgentWatch[]>([
        {
            id: "1",
            name: "Rolex Submariner",
            sku: "ROL-SUB-001",
            brand: "Rolex",
            serialNumber: "S123456789",
            referenceNumber: "116610LN",
            caseSize: "40mm",
            price: 8500,
            currency: "EUR",
            notes: "Excellent condition, box and papers included",
            description: "Classic black Submariner with ceramic bezel",
            images: [],
            status: "Unpaid",
            createdAt: new Date("2024-01-15"),
            seller: "John Smith",
            agent: "Agent Smith",
            paymentId: "PAY-001",
        },
        {
            id: "2",
            name: "Omega Speedmaster",
            sku: "OME-SPE-002",
            brand: "Omega",
            serialNumber: "O987654321",
            referenceNumber: "310.30.42.50.01.001",
            caseSize: "42mm",
            price: 3200,
            currency: "EUR",
            notes: "Moon watch, manual wind",
            description: "Professional Moonwatch with hesalite crystal",
            images: [],
            status: "Paid (not received)",
            createdAt: new Date("2024-01-20"),
            seller: "Maria Garcia",
            agent: "Agent Johnson",
        },
        {
            id: "3",
            name: "Tudor Black Bay",
            sku: "TUD-BB-003",
            brand: "Tudor",
            serialNumber: "T456789123",
            referenceNumber: "79230N",
            caseSize: "39mm",
            price: 2800,
            currency: "EUR",
            notes: "Blue dial variant, NATO strap included",
            description: "Heritage Black Bay with blue bezel and dial",
            images: [],
            status: "Paid (received)",
            createdAt: new Date("2024-01-25"),
            seller: "Robert Johnson",
            agent: "Agent Brown",
        },
        {
            id: "4",
            name: "Patek Philippe Calatrava",
            sku: "PAT-CAL-004",
            brand: "Patek Philippe",
            serialNumber: "P789123456",
            referenceNumber: "5196P-001",
            caseSize: "37mm",
            price: 22000,
            currency: "EUR",
            notes: "Platinum case, pristine condition",
            description: "Classic dress watch with hobnail bezel",
            images: [],
            status: "Unpaid",
            createdAt: new Date("2024-01-28"),
            seller: "Emma Wilson",
            agent: "Agent Davis",
            paymentId: "PAY-011",
        },
        {
            id: "5",
            name: "Audemars Piguet Royal Oak",
            sku: "AUD-ROY-005",
            brand: "Audemars Piguet",
            serialNumber: "A147258369",
            referenceNumber: "15400ST.OO.1220ST.03",
            caseSize: "41mm",
            price: 18500,
            currency: "EUR",
            notes: "Blue dial, minor wear on bracelet",
            description: "Iconic octagonal bezel design",
            images: [],
            status: "Paid (not received)",
            createdAt: new Date("2024-01-30"),
            seller: "David Brown",
            agent: "Agent Wilson",
        },
        {
            id: "6",
            name: "Cartier Santos",
            sku: "CAR-SAN-006",
            brand: "Cartier",
            serialNumber: "C369258147",
            referenceNumber: "WSSA0009",
            caseSize: "39.8mm",
            price: 4200,
            currency: "EUR",
            notes: "Steel and gold two-tone",
            description: "Classic aviation-inspired design",
            images: [],
            status: "Paid (received)",
            createdAt: new Date("2024-02-01"),
            seller: "Lisa Davis",
            agent: "Agent Garcia",
        },
        {
            id: "7",
            name: "Jaeger-LeCoultre Reverso",
            sku: "JAE-REV-007",
            brand: "Jaeger-LeCoultre",
            serialNumber: "J852741963",
            referenceNumber: "3978420",
            caseSize: "45.6mm x 27.4mm",
            price: 8900,
            currency: "EUR",
            notes: "Rose gold case, manual wind",
            description: "Art Deco reversible case design",
            images: [],
            status: "Unpaid",
            createdAt: new Date("2024-02-03"),
            seller: "Michael Chen",
            agent: "Agent Martinez",
        },
        {
            id: "8",
            name: "Vacheron Constantin Overseas",
            sku: "VAC-OVE-008",
            brand: "Vacheron Constantin",
            serialNumber: "V741852963",
            referenceNumber: "4500V/110A-B126",
            caseSize: "41mm",
            price: 15200,
            currency: "EUR",
            notes: "Blue dial, integrated bracelet",
            description: "Luxury sports watch with Maltese cross bezel",
            images: [],
            status: "Paid (not received)",
            createdAt: new Date("2024-02-05"),
            seller: "Sarah Thompson",
            agent: "Agent Anderson",
        },
        {
            id: "9",
            name: "IWC Pilot's Watch",
            sku: "IWC-PIL-009",
            brand: "IWC",
            serialNumber: "I963852741",
            referenceNumber: "IW377709",
            caseSize: "43mm",
            price: 3800,
            currency: "EUR",
            notes: "Chronograph function, leather strap",
            description: "Aviation heritage timepiece",
            images: [],
            status: "Paid (received)",
            createdAt: new Date("2024-02-07"),
            seller: "James Martinez",
            agent: "Agent Smith",
        },
        {
            id: "10",
            name: "Breitling Navitimer",
            sku: "BRE-NAV-010",
            brand: "Breitling",
            serialNumber: "B159753468",
            referenceNumber: "AB0121211C1P1",
            caseSize: "46mm",
            price: 4500,
            currency: "EUR",
            notes: "Slide rule bezel, automatic movement",
            description: "Professional pilot's chronograph",
            images: [],
            status: "Unpaid",
            createdAt: new Date("2024-02-09"),
            seller: "Anna Rodriguez",
            agent: "Agent Johnson",
        },
        {
            id: "11",
            name: "Panerai Luminor",
            sku: "PAN-LUM-011",
            brand: "Panerai",
            serialNumber: "P357159264",
            referenceNumber: "PAM00372",
            caseSize: "47mm",
            price: 5200,
            currency: "EUR",
            notes: "Crown guard, sandwich dial",
            description: "Italian naval heritage design",
            images: [],
            status: "Paid (not received)",
            createdAt: new Date("2024-02-11"),
            seller: "Thomas Lee",
            agent: "Agent Brown",
        },
        {
            id: "12",
            name: "TAG Heuer Carrera",
            sku: "TAG-CAR-012",
            brand: "TAG Heuer",
            serialNumber: "T864297531",
            referenceNumber: "CBG2A10.BA0654",
            caseSize: "45mm",
            price: 2900,
            currency: "EUR",
            notes: "Tourbillon complication, titanium case",
            description: "Racing-inspired chronograph",
            images: [],
            status: "Paid (received)",
            createdAt: new Date("2024-02-13"),
            seller: "Jennifer White",
            agent: "Agent Davis",
        },
        {
            id: "13",
            name: "Hublot Big Bang",
            sku: "HUB-BIG-013",
            brand: "Hublot",
            serialNumber: "H975314682",
            referenceNumber: "301.SB.131.RX",
            caseSize: "44mm",
            price: 6800,
            currency: "EUR",
            notes: "Carbon fiber case, rubber strap",
            description: "Bold fusion of materials and design",
            images: [],
            status: "Unpaid",
            createdAt: new Date("2024-02-15"),
            seller: "John Smith",
            agent: "Agent Wilson",
        },
        {
            id: "14",
            name: "Zenith El Primero",
            sku: "ZEN-ELP-014",
            brand: "Zenith",
            serialNumber: "Z468129357",
            referenceNumber: "03.2040.400/69.C494",
            caseSize: "42mm",
            price: 4100,
            currency: "EUR",
            notes: "High-frequency movement, tri-color subdials",
            description: "Historic chronograph caliber",
            images: [],
            status: "Paid (not received)",
            createdAt: new Date("2024-02-17"),
            seller: "Maria Garcia",
            agent: "Agent Garcia",
        },
        {
            id: "15",
            name: "Longines Master Collection",
            sku: "LON-MAS-015",
            brand: "Longines",
            serialNumber: "L579246831",
            referenceNumber: "L2.893.4.78.3",
            caseSize: "44mm",
            price: 2200,
            currency: "EUR",
            notes: "Moon phase complication, alligator strap",
            description: "Elegant dress watch with complications",
            images: [],
            status: "Paid (received)",
            createdAt: new Date("2024-02-19"),
            seller: "Robert Johnson",
            agent: "Agent Martinez",
        },
        {
            id: "16",
            name: "Seiko Prospex",
            sku: "SEI-PRO-016",
            brand: "Seiko",
            serialNumber: "S681357924",
            referenceNumber: "SBDC061",
            caseSize: "42mm",
            price: 380,
            currency: "EUR",
            notes: "Diving watch, 200m water resistance",
            description: "Professional diving timepiece",
            images: [],
            status: "Unpaid",
            createdAt: new Date("2024-02-21"),
            seller: "Emma Wilson",
            agent: "Agent Anderson",
        },
        {
            id: "17",
            name: "Casio G-Shock",
            sku: "CAS-GSH-017",
            brand: "Casio",
            serialNumber: "C792468135",
            referenceNumber: "GA-2100-1A1ER",
            caseSize: "45mm",
            price: 120,
            currency: "EUR",
            notes: "Carbon Core Guard, shock resistant",
            description: "Ultra-tough digital-analog watch",
            images: [],
            status: "Paid (not received)",
            createdAt: new Date("2024-02-23"),
            seller: "David Brown",
            agent: "Agent Smith",
        },
        {
            id: "18",
            name: "Citizen Eco-Drive",
            sku: "CIT-ECO-018",
            brand: "Citizen",
            serialNumber: "C135792468",
            referenceNumber: "AT2141-52L",
            caseSize: "43mm",
            price: 280,
            currency: "EUR",
            notes: "Solar powered, perpetual calendar",
            description: "Eco-friendly chronograph",
            images: [],
            status: "Paid (received)",
            createdAt: new Date("2024-02-25"),
            seller: "Lisa Davis",
            agent: "Agent Johnson",
        },
        {
            id: "19",
            name: "Tissot PRC 200",
            sku: "TIS-PRC-019",
            brand: "Tissot",
            serialNumber: "T246813579",
            referenceNumber: "T067.417.11.051.01",
            caseSize: "39mm",
            price: 320,
            currency: "EUR",
            notes: "Swiss quartz movement, sport design",
            description: "Sporty chronograph with Swiss precision",
            images: [],
            status: "Unpaid",
            createdAt: new Date("2024-02-27"),
            seller: "Michael Chen",
            agent: "Agent Brown",
        },
        {
            id: "20",
            name: "Hamilton Khaki Field",
            sku: "HAM-KHA-020",
            brand: "Hamilton",
            serialNumber: "H357924681",
            referenceNumber: "H70555533",
            caseSize: "42mm",
            price: 450,
            currency: "EUR",
            notes: "Military heritage, automatic movement",
            description: "Field watch with military DNA",
            images: [],
            status: "Paid (not received)",
            createdAt: new Date("2024-03-01"),
            seller: "Sarah Thompson",
            agent: "Agent Davis",
        },
        {
            id: "21",
            name: "Frederique Constant Classics",
            sku: "FRE-CLA-021",
            brand: "Frederique Constant",
            serialNumber: "F468135792",
            referenceNumber: "FC-303MC4P6",
            caseSize: "40mm",
            price: 1200,
            currency: "EUR",
            notes: "Manufacture movement, open heart dial",
            description: "Swiss independent watchmaker elegance",
            images: [],
            status: "Paid (received)",
            createdAt: new Date("2024-03-03"),
            seller: "James Martinez",
            agent: "Agent Wilson",
        },
        {
            id: "22",
            name: "Montblanc Heritage",
            sku: "MON-HER-022",
            brand: "Montblanc",
            serialNumber: "M579246813",
            referenceNumber: "116508",
            caseSize: "39mm",
            price: 1800,
            currency: "EUR",
            notes: "Manufacture caliber, vintage inspired",
            description: "Heritage chronograph with pulsometer scale",
            images: [],
            status: "Unpaid",
            createdAt: new Date("2024-03-05"),
            seller: "Anna Rodriguez",
            agent: "Agent Garcia",
        },
        {
            id: "23",
            name: "Oris Aquis",
            sku: "ORI-AQU-023",
            brand: "Oris",
            serialNumber: "O691357248",
            referenceNumber: "01 733 7766 4154-07 4 22 64FC",
            caseSize: "43.5mm",
            price: 1600,
            currency: "EUR",
            notes: "Diving watch, unidirectional bezel",
            description: "Professional dive watch from Swiss independents",
            images: [],
            status: "Paid (not received)",
            createdAt: new Date("2024-03-07"),
            seller: "Thomas Lee",
            agent: "Agent Martinez",
        },
    ]);

    const [viewMode, setViewMode] = useState<"list" | "grid">("list");
    const [selectedWatches, setSelectedWatches] = useState<string[]>([]);
    const [brandFilter, setBrandFilter] = useState<string>("all");
    const [sellerFilter, setSellerFilter] = useState<string>("all");
    const [statusFilter, setStatusFilter] = useState<string>("Unpaid");
    const [assignOpen, setAssignOpen] = useState(false);
    const [paymentIdSearch, setPaymentIdSearch] = useState("");
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [editingWatch, setEditingWatch] = useState<AgentWatch | null>(null);
    const [showNewPaymentDialog, setShowNewPaymentDialog] = useState(false);

    // Sample Payment IDs for assignment
    const availablePaymentIds = [
        "PAY-001",
        "PAY-002",
        "PAY-003",
        "PAY-004",
        "PAY-005",
        "PAY-006",
        "PAY-007",
        "PAY-008",
        "PAY-009",
        "PAY-010",
        "PAY-036",
        "PAY-037",
        "PAY-038",
        "PAY-039",
        "PAY-040",
        "PAY-041",
        "PAY-042",
        "PAY-043",
        "PAY-044",
        "PAY-045",
        "PAY-046",
        "PAY-047",
        "PAY-048",
        "PAY-049",
        "PAY-050",
    ];

    // Sample agents for the dropdown
    const availableAgents = [
        "Agent Smith",
        "Agent Johnson",
        "Agent Brown",
        "Agent Davis",
        "Agent Wilson",
        "Agent Garcia",
        "Agent Martinez",
        "Agent Anderson",
    ];

    // Sample sellers for the dropdown
    const availableSellers = [
        "John Smith",
        "Maria Garcia",
        "Robert Johnson",
        "Emma Wilson",
        "David Brown",
        "Lisa Davis",
        "Michael Chen",
        "Sarah Thompson",
        "James Martinez",
        "Anna Rodriguez",
        "Thomas Lee",
        "Jennifer White",
    ];

    // Add brands state for the BrandSelector
    const [brands, setBrands] = useState<string[]>([
        "Rolex",
        "Omega",
        "Tudor",
        "Patek Philippe",
        "Audemars Piguet",
        "Cartier",
        "Jaeger-LeCoultre",
        "Vacheron Constantin",
        "IWC",
        "Breitling",
        "Panerai",
        "TAG Heuer",
        "Hublot",
        "Zenith",
        "Longines",
        "Seiko",
        "Casio",
        "Citizen",
        "Tissot",
        "Hamilton",
        "Frederique Constant",
        "Montblanc",
        "Oris",
    ]);

    // Form state for add/edit watch
    const [formData, setFormData] = useState({
        name: "",
        sku: "",
        brand: "",
        serialNumber: "",
        referenceNumber: "",
        caseSize: "",
        price: "",
        currency: "EUR",
        notes: "",
        description: "",
        seller: "",
        agent: "",
        paymentId: "",
        status: "Unpaid" as AgentWatch["status"],
    });

    // Add state for images
    const [formImages, setFormImages] = useState<WatchImage[]>([]);

    // New payment form state
    const [newPaymentData, setNewPaymentData] = useState({
        date: new Date(),
        agent: "",
        paymentMethod: "",
        paymentDescription: "",
        documentation: "",
    });

    const resetForm = () => {
        setFormData({
            name: "",
            sku: "",
            brand: "",
            serialNumber: "",
            referenceNumber: "",
            caseSize: "",
            price: "",
            currency: "EUR",
            notes: "",
            description: "",
            seller: "",
            agent: "",
            paymentId: "",
            status: "Unpaid",
        });
        setFormImages([]);
    };

    const resetNewPaymentForm = () => {
        setNewPaymentData({
            date: new Date(),
            agent: "",
            paymentMethod: "",
            paymentDescription: "",
            documentation: "",
        });
    };

    const handleAddWatch = () => {
        resetForm();
        setEditingWatch(null);
        setShowAddDialog(true);
    };

    const handleEditWatch = (watch: AgentWatch) => {
        setFormData({
            name: watch.name,
            sku: watch.sku,
            brand: watch.brand,
            serialNumber: watch.serialNumber,
            referenceNumber: watch.referenceNumber,
            caseSize: watch.caseSize,
            price: watch.price.toString(),
            currency: watch.currency,
            notes: watch.notes,
            description: watch.description,
            seller: watch.seller,
            agent: watch.agent || "",
            paymentId: watch.paymentId || "",
            status: watch.status,
        });
        setFormImages(watch.images || []);
        setEditingWatch(watch);
        setShowAddDialog(true);
    };

    const handleSaveWatch = () => {
        if (editingWatch) {
            // Edit existing watch
            setWatches((prev) =>
                prev.map((w) =>
                    w.id === editingWatch.id
                        ? {
                              ...w,
                              ...formData,
                              price: parseFloat(formData.price) || 0,
                              images: formImages,
                          }
                        : w,
                ),
            );
        } else {
            // Add new watch
            const newWatch: AgentWatch = {
                id: Date.now().toString(),
                ...formData,
                price: parseFloat(formData.price) || 0,
                images: formImages,
                createdAt: new Date(),
            };
            setWatches((prev) => [newWatch, ...prev]);
        }
        setShowAddDialog(false);
        resetForm();
        setEditingWatch(null);
    };

    const handleCreateNewPayment = () => {
        if (selectedWatches.length === 0) return;

        // Generate a new payment ID
        const newPaymentId = `PAY-${String(Date.now()).slice(-6)}`;

        // Create the payment with selected watches
        console.log("Creating new payment with:", {
            paymentId: newPaymentId,
            date: newPaymentData.date,
            agent: newPaymentData.agent,
            paymentMethod: newPaymentData.paymentMethod,
            paymentDescription: newPaymentData.paymentDescription,
            documentation: newPaymentData.documentation,
            selectedWatches: selectedWatches,
        });

        // Update selected watches with the new payment ID
        setWatches((prev) =>
            prev.map((watch) =>
                selectedWatches.includes(watch.id)
                    ? {
                          ...watch,
                          paymentId: newPaymentId,
                          status: "Paid (not received)" as AgentWatch["status"],
                      }
                    : watch,
            ),
        );

        setSelectedWatches([]);
        setShowNewPaymentDialog(false);
        resetNewPaymentForm();
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Unpaid":
                return "bg-red-100 text-red-800";
            case "Paid (not received)":
                return "bg-yellow-100 text-yellow-800";
            case "Paid (received)":
                return "bg-green-100 text-green-800";
            case "Refunded":
                return "bg-gray-100 text-gray-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    // Add sorting function
    const handleSort = (field: keyof AgentWatch) => {
        if (sortField === field) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortDirection("asc");
        }
    };

    // Add getSortIcon function
    const getSortIcon = (field: keyof AgentWatch) => {
        if (sortField !== field) {
            return null; // Don't show any icon for inactive fields
        }
        return sortDirection === "asc" ? (
            <ArrowUp className="ml-2 h-4 w-4" />
        ) : (
            <ArrowDown className="ml-2 h-4 w-4" />
        );
    };

    // Get unique values for filters
    const uniqueBrands = [...new Set(watches.map((watch) => watch.brand))];
    const uniqueSellers = [...new Set(watches.map((watch) => watch.seller))];
    const uniqueStatuses = [...new Set(watches.map((watch) => watch.status))];

    // Filter and sort watches
    let filteredWatches = watches.filter((watch) => {
        return (
            (brandFilter === "all" || watch.brand === brandFilter) &&
            (sellerFilter === "all" || watch.seller === sellerFilter) &&
            (statusFilter === "all" || watch.status === statusFilter)
        );
    });

    // Apply sorting
    if (sortField) {
        filteredWatches = [...filteredWatches].sort((a, b) => {
            let aValue = a[sortField];
            let bValue = b[sortField];

            // Handle different data types
            if (sortField === "price") {
                aValue = Number(aValue);
                bValue = Number(bValue);
            } else if (sortField === "createdAt") {
                aValue = new Date(aValue as Date).getTime();
                bValue = new Date(bValue as Date).getTime();
            } else {
                aValue = String(aValue || "").toLowerCase();
                bValue = String(bValue || "").toLowerCase();
            }

            if (aValue < bValue) {
                return sortDirection === "asc" ? -1 : 1;
            }
            if (aValue > bValue) {
                return sortDirection === "asc" ? 1 : -1;
            }
            return 0;
        });
    }

    const totalWatches = filteredWatches.length;
    const totalValue = filteredWatches.reduce(
        (sum, watch) => sum + watch.price,
        0,
    );

    const DEFAULT_IMAGE =
        "/lovable-uploads/e4da5380-362e-422c-a981-6370f96719da.png";

    const handleSelectWatch = (watchId: string, checked: boolean) => {
        setSelectedWatches((prev) =>
            checked ? [...prev, watchId] : prev.filter((id) => id !== watchId),
        );
    };

    const handleSelectAll = (checked: boolean) => {
        setSelectedWatches(
            checked ? filteredWatches.map((watch) => watch.id) : [],
        );
    };

    const handleStatusChange = (newStatus: string) => {
        if (selectedWatches.length === 0) return;

        setWatches((prev) =>
            prev.map((watch) =>
                selectedWatches.includes(watch.id)
                    ? { ...watch, status: newStatus as AgentWatch["status"] }
                    : watch,
            ),
        );
        setSelectedWatches([]);
    };

    const handlePaymentIdAssign = (paymentId: string) => {
        if (selectedWatches.length === 0) return;

        setWatches((prev) =>
            prev.map((watch) =>
                selectedWatches.includes(watch.id)
                    ? { ...watch, paymentId }
                    : watch,
            ),
        );
        setSelectedWatches([]);
        setAssignOpen(false);
    };

    const filteredPaymentIds = availablePaymentIds.filter((id) =>
        id.toLowerCase().includes(paymentIdSearch.toLowerCase()),
    );

    const handlePrintSKULabel = () => {
        if (!formData.sku) {
            alert("No SKU available to print");
            return;
        }

        // Create a simple print dialog with formatted SKU label
        const printWindow = window.open("", "_blank", "width=400,height=300");
        if (printWindow) {
            printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>SKU Label - ${formData.sku}</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                margin: 20px; 
                text-align: center;
                background: white;
              }
              .label {
                border: 2px solid #000;
                padding: 20px;
                margin: 20px auto;
                width: 300px;
                background: white;
              }
              .sku {
                font-size: 24px;
                font-weight: bold;
                margin: 10px 0;
              }
              .watch-name {
                font-size: 16px;
                margin: 10px 0;
              }
              @media print {
                body { margin: 0; }
                .no-print { display: none; }
              }
            </style>
          </head>
          <body>
            <div class="label">
              <div class="sku">${formData.sku}</div>
              <div class="watch-name">${formData.name || "Watch"}</div>
              <div>${formData.brand || ""}</div>
            </div>
            <div class="no-print">
              <button onclick="window.print()">Print</button>
              <button onclick="window.close()">Close</button>
            </div>
          </body>
        </html>
      `);
            printWindow.document.close();
        }
    };

    const handleEditBrands = () => {
        // Placeholder for brand editing functionality
        console.log("Edit brands functionality would open here");
    };

    return (
        <Layout>
            <Head title="Agent Watches" />
            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">
                            Agent Watches
                        </h1>
                        <p className="mt-1 text-slate-600">
                            Manage agent watch inventory
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            onClick={handleAddWatch}
                            className="flex items-center gap-2"
                        >
                            <Plus className="h-4 w-4" />
                            Add Watch
                        </Button>
                        <Button
                            variant={
                                viewMode === "list" ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => setViewMode("list")}
                        >
                            <List className="mr-2 h-4 w-4" />
                            List
                        </Button>
                        <Button
                            variant={
                                viewMode === "grid" ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => setViewMode("grid")}
                        >
                            <Grid3X3 className="mr-2 h-4 w-4" />
                            Grid
                        </Button>
                    </div>
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Filter className="h-5 w-5" />
                            Filters
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Brand
                                </label>
                                <Select
                                    value={brandFilter}
                                    onValueChange={setBrandFilter}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="All Brands" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            All Brands
                                        </SelectItem>
                                        {uniqueBrands
                                            .filter(
                                                (brand) =>
                                                    brand &&
                                                    brand.trim() !== "",
                                            )
                                            .map((brand) => (
                                                <SelectItem
                                                    key={brand}
                                                    value={brand}
                                                >
                                                    {brand}
                                                </SelectItem>
                                            ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Seller
                                </label>
                                <Select
                                    value={sellerFilter}
                                    onValueChange={setSellerFilter}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="All Sellers" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            All Sellers
                                        </SelectItem>
                                        {uniqueSellers
                                            .filter(
                                                (seller) =>
                                                    seller &&
                                                    seller.trim() !== "",
                                            )
                                            .map((seller) => (
                                                <SelectItem
                                                    key={seller}
                                                    value={seller}
                                                >
                                                    {seller}
                                                </SelectItem>
                                            ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Payment Status
                                </label>
                                <Select
                                    value={statusFilter}
                                    onValueChange={setStatusFilter}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="All Statuses" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            All Statuses
                                        </SelectItem>
                                        {uniqueStatuses
                                            .filter(
                                                (status) =>
                                                    status &&
                                                    status.trim() !== "",
                                            )
                                            .map((status) => (
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
                        </div>
                    </CardContent>
                </Card>

                {/* Multi-select Actions - Updated */}
                {selectedWatches.length > 0 && (
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-slate-700">
                                    {selectedWatches.length} watch
                                    {selectedWatches.length !== 1 ? "es" : ""}{" "}
                                    selected
                                </span>
                                <div className="flex gap-2">
                                    {/* New Payment Button - Updated with theme color */}
                                    <Button
                                        onClick={() =>
                                            setShowNewPaymentDialog(true)
                                        }
                                    >
                                        New Payment
                                    </Button>

                                    {/* Assign Payment ID Dropdown */}
                                    <Popover
                                        open={assignOpen}
                                        onOpenChange={setAssignOpen}
                                    >
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className="w-48"
                                            >
                                                <Search className="mr-2 h-4 w-4" />
                                                Assign Payment ID
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent
                                            className="w-64 p-0"
                                            align="start"
                                        >
                                            <Command>
                                                <CommandInput
                                                    placeholder="Search Payment ID..."
                                                    value={paymentIdSearch}
                                                    onValueChange={
                                                        setPaymentIdSearch
                                                    }
                                                />
                                                <CommandList>
                                                    <CommandEmpty>
                                                        No Payment ID found.
                                                    </CommandEmpty>
                                                    <CommandGroup>
                                                        {filteredPaymentIds.map(
                                                            (paymentId) => (
                                                                <CommandItem
                                                                    key={
                                                                        paymentId
                                                                    }
                                                                    value={
                                                                        paymentId
                                                                    }
                                                                    onSelect={() =>
                                                                        handlePaymentIdAssign(
                                                                            paymentId,
                                                                        )
                                                                    }
                                                                >
                                                                    {paymentId}
                                                                </CommandItem>
                                                            ),
                                                        )}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>

                                    {/* Change Payment Status */}
                                    <Select onValueChange={handleStatusChange}>
                                        <SelectTrigger className="w-48">
                                            <SelectValue placeholder="Change Payment Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Unpaid">
                                                Unpaid
                                            </SelectItem>
                                            <SelectItem value="Paid (not received)">
                                                Paid (not received)
                                            </SelectItem>
                                            <SelectItem value="Paid (received)">
                                                Paid (received)
                                            </SelectItem>
                                            <SelectItem value="Refunded">
                                                Refunded
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Summary Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-5 gap-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-slate-900">
                                    {totalWatches}
                                </div>
                                <div className="text-sm text-slate-600">
                                    Total Watches
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-red-600">
                                    {
                                        filteredWatches.filter(
                                            (w) => w.status === "Unpaid",
                                        ).length
                                    }
                                </div>
                                <div className="text-sm text-slate-600">
                                    Unpaid
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-yellow-600">
                                    {
                                        filteredWatches.filter(
                                            (w) =>
                                                w.status ===
                                                "Paid (not received)",
                                        ).length
                                    }
                                </div>
                                <div className="text-sm text-slate-600">
                                    Paid (not received)
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-600">
                                    {
                                        filteredWatches.filter(
                                            (w) =>
                                                w.status === "Paid (received)",
                                        ).length
                                    }
                                </div>
                                <div className="text-sm text-slate-600">
                                    Paid (received)
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">
                                    €{totalValue.toLocaleString()}
                                </div>
                                <div className="text-sm text-slate-600">
                                    Total Value
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Content based on view mode */}
                {viewMode === "list" ? (
                    <Card>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-12">
                                            <Checkbox
                                                checked={
                                                    selectedWatches.length ===
                                                        filteredWatches.length &&
                                                    filteredWatches.length > 0
                                                }
                                                onCheckedChange={
                                                    handleSelectAll
                                                }
                                            />
                                        </TableHead>
                                        <TableHead className="w-16">
                                            Image
                                        </TableHead>
                                        <TableHead
                                            className="cursor-pointer hover:bg-slate-50"
                                            onClick={() => handleSort("name")}
                                        >
                                            <div className="flex items-center">
                                                Name
                                                {getSortIcon("name")}
                                            </div>
                                        </TableHead>
                                        <TableHead
                                            className="cursor-pointer hover:bg-slate-50"
                                            onClick={() => handleSort("sku")}
                                        >
                                            <div className="flex items-center">
                                                SKU
                                                {getSortIcon("sku")}
                                            </div>
                                        </TableHead>
                                        <TableHead
                                            className="cursor-pointer hover:bg-slate-50"
                                            onClick={() => handleSort("brand")}
                                        >
                                            <div className="flex items-center">
                                                Brand
                                                {getSortIcon("brand")}
                                            </div>
                                        </TableHead>
                                        <TableHead
                                            className="cursor-pointer hover:bg-slate-50"
                                            onClick={() => handleSort("seller")}
                                        >
                                            <div className="flex items-center">
                                                Seller
                                                {getSortIcon("seller")}
                                            </div>
                                        </TableHead>
                                        <TableHead className="w-32">
                                            Notes
                                        </TableHead>
                                        <TableHead
                                            className="w-32 cursor-pointer hover:bg-slate-50"
                                            onClick={() => handleSort("price")}
                                        >
                                            <div className="flex items-center">
                                                Price
                                                {getSortIcon("price")}
                                            </div>
                                        </TableHead>
                                        <TableHead
                                            className="cursor-pointer hover:bg-slate-50"
                                            onClick={() =>
                                                handleSort("paymentId")
                                            }
                                        >
                                            <div className="flex items-center">
                                                Payment ID
                                                {getSortIcon("paymentId")}
                                            </div>
                                        </TableHead>
                                        <TableHead
                                            className="cursor-pointer hover:bg-slate-50"
                                            onClick={() => handleSort("status")}
                                        >
                                            <div className="flex items-center">
                                                Payment Status
                                                {getSortIcon("status")}
                                            </div>
                                        </TableHead>
                                        <TableHead className="w-20">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredWatches.map((watch) => (
                                        <TableRow key={watch.id}>
                                            <TableCell>
                                                <Checkbox
                                                    checked={selectedWatches.includes(
                                                        watch.id,
                                                    )}
                                                    onCheckedChange={(
                                                        checked,
                                                    ) =>
                                                        handleSelectWatch(
                                                            watch.id,
                                                            checked as boolean,
                                                        )
                                                    }
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <div className="h-12 w-12 overflow-hidden rounded-lg bg-slate-100">
                                                    <img
                                                        src={
                                                            watch.images
                                                                .length > 0
                                                                ? watch
                                                                      .images[0]
                                                                      .url
                                                                : DEFAULT_IMAGE
                                                        }
                                                        alt={watch.name}
                                                        className="h-full w-full object-cover"
                                                    />
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-medium">
                                                    {watch.name}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-sm text-slate-600">
                                                    {watch.sku}
                                                </div>
                                            </TableCell>
                                            <TableCell>{watch.brand}</TableCell>
                                            <TableCell>
                                                {watch.seller}
                                            </TableCell>
                                            <TableCell className="max-w-24">
                                                <div className="truncate text-xs text-slate-600">
                                                    {watch.notes}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-sm text-slate-900">
                                                    ₫
                                                    {(
                                                        watch.price * 25000
                                                    ).toLocaleString()}
                                                </div>
                                                <div className="text-xs text-slate-500">
                                                    €
                                                    {watch.price.toLocaleString()}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-sm text-slate-600">
                                                    {watch.paymentId || "-"}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    className={getStatusColor(
                                                        watch.status,
                                                    )}
                                                >
                                                    {watch.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleEditWatch(
                                                                watch,
                                                            )
                                                        }
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-red-600 hover:text-red-700"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                ) : (
                    /* Grid View */
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {filteredWatches.map((watch) => (
                            <Card key={watch.id} className="overflow-hidden">
                                <div className="relative aspect-square">
                                    <img
                                        src={
                                            watch.images.length > 0
                                                ? watch.images[0].url
                                                : DEFAULT_IMAGE
                                        }
                                        alt={watch.name}
                                        className="h-full w-full object-cover"
                                    />
                                    <Badge
                                        className={`absolute right-2 top-2 ${getStatusColor(watch.status)}`}
                                    >
                                        {watch.status}
                                    </Badge>
                                    <div className="absolute left-2 top-2">
                                        <Checkbox
                                            checked={selectedWatches.includes(
                                                watch.id,
                                            )}
                                            onCheckedChange={(checked) =>
                                                handleSelectWatch(
                                                    watch.id,
                                                    checked as boolean,
                                                )
                                            }
                                            className="bg-white"
                                        />
                                    </div>
                                </div>
                                <CardContent className="p-4">
                                    <h3 className="mb-1 truncate text-lg font-semibold">
                                        {watch.name}
                                    </h3>
                                    <div className="mb-2 text-sm text-slate-600">
                                        {watch.sku}
                                    </div>
                                    <div className="space-y-1 text-sm text-slate-600">
                                        <div>
                                            <span className="font-medium">
                                                Brand:
                                            </span>{" "}
                                            {watch.brand}
                                        </div>
                                        <div>
                                            <span className="font-medium">
                                                Seller:
                                            </span>{" "}
                                            {watch.seller}
                                        </div>
                                        <div className="mb-2 truncate text-xs text-slate-500">
                                            {watch.notes}
                                        </div>
                                        <div className="mt-2">
                                            <div className="text-sm text-slate-900">
                                                ₫
                                                {(
                                                    watch.price * 25000
                                                ).toLocaleString()}
                                            </div>
                                            <div className="text-xs text-slate-500">
                                                €{watch.price.toLocaleString()}
                                            </div>
                                        </div>
                                        {watch.paymentId && (
                                            <div>
                                                <span className="font-medium">
                                                    Payment ID:
                                                </span>{" "}
                                                {watch.paymentId}
                                            </div>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="mt-4 flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex-1"
                                            onClick={() =>
                                                handleEditWatch(watch)
                                            }
                                        >
                                            <Edit className="mr-1 h-4 w-4" />
                                            Edit
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="text-red-600 hover:text-red-700"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {filteredWatches.length === 0 && (
                    <Card>
                        <CardContent className="p-12 text-center">
                            <Upload className="mx-auto mb-4 h-12 w-12 text-slate-400" />
                            <h3 className="mb-2 text-xl font-semibold text-slate-900">
                                No watches found
                            </h3>
                            <p className="text-slate-600">
                                No watches match your current filters
                            </p>
                        </CardContent>
                    </Card>
                )}

                {/* Add/Edit Watch Dialog */}
                <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                    <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>
                                {editingWatch ? "Edit Watch" : "Add New Watch"}
                            </DialogTitle>
                        </DialogHeader>

                        <div className="grid gap-6">
                            {/* Form Fields */}
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                {/* Seller and Agent - moved to top */}
                                <div className="space-y-2">
                                    <Label htmlFor="seller">Seller</Label>
                                    <Input
                                        id="seller"
                                        value={formData.seller}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                seller: e.target.value,
                                            }))
                                        }
                                        placeholder="Enter seller name"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="agent">Agent</Label>
                                    <Select
                                        value={formData.agent}
                                        onValueChange={(value) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                agent: value,
                                            }))
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select agent" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {availableAgents
                                                .filter(
                                                    (agent) =>
                                                        agent &&
                                                        agent.trim() !== "",
                                                )
                                                .map((agent) => (
                                                    <SelectItem
                                                        key={agent}
                                                        value={agent}
                                                    >
                                                        {agent}
                                                    </SelectItem>
                                                ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="name">Watch Name</Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                name: e.target.value,
                                            }))
                                        }
                                        placeholder="Enter watch name"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="sku">SKU</Label>
                                    <div className="flex items-center space-x-2">
                                        <Input
                                            id="sku"
                                            value={formData.sku}
                                            readOnly
                                            className="flex-1 cursor-not-allowed bg-slate-50 text-slate-600"
                                            placeholder="Auto-generated"
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={handlePrintSKULabel}
                                            className="p-2"
                                            title="Print SKU Label"
                                        >
                                            <Tag className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="brand">Brand</Label>
                                    <BrandSelector
                                        value={formData.brand}
                                        onValueChange={(value) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                brand: value,
                                            }))
                                        }
                                        brands={brands}
                                        onEditBrands={handleEditBrands}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="serialNumber">
                                        Serial Number
                                    </Label>
                                    <Input
                                        id="serialNumber"
                                        value={formData.serialNumber}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                serialNumber: e.target.value,
                                            }))
                                        }
                                        placeholder="Enter serial number"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="referenceNumber">
                                        Reference Number
                                    </Label>
                                    <Input
                                        id="referenceNumber"
                                        value={formData.referenceNumber}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                referenceNumber: e.target.value,
                                            }))
                                        }
                                        placeholder="Enter reference number"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="caseSize">Case Size</Label>
                                    <Input
                                        id="caseSize"
                                        value={formData.caseSize}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                caseSize: e.target.value,
                                            }))
                                        }
                                        placeholder="Enter case size"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="price">Price</Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        value={formData.price}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                price: e.target.value,
                                            }))
                                        }
                                        placeholder="Enter price"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="currency">Currency</Label>
                                    <Select
                                        value={formData.currency}
                                        onValueChange={(value) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                currency: value,
                                            }))
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="EUR">
                                                EUR
                                            </SelectItem>
                                            <SelectItem value="USD">
                                                USD
                                            </SelectItem>
                                            <SelectItem value="VND">
                                                VND
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="status">
                                        Payment Status
                                    </Label>
                                    <Select
                                        value={formData.status}
                                        onValueChange={(value) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                status: value as AgentWatch["status"],
                                            }))
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Unpaid">
                                                Unpaid
                                            </SelectItem>
                                            <SelectItem value="Paid (not received)">
                                                Paid (not received)
                                            </SelectItem>
                                            <SelectItem value="Paid (received)">
                                                Paid (received)
                                            </SelectItem>
                                            <SelectItem value="Refunded">
                                                Refunded
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="paymentId">
                                        Payment ID
                                    </Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                className="w-full justify-between"
                                            >
                                                {formData.paymentId ||
                                                    "Select payment ID"}
                                                <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-full p-0">
                                            <Command>
                                                <CommandInput placeholder="Search payment ID..." />
                                                <CommandList>
                                                    <CommandEmpty>
                                                        No payment ID found.
                                                    </CommandEmpty>
                                                    <CommandGroup>
                                                        {availablePaymentIds.map(
                                                            (paymentId) => (
                                                                <CommandItem
                                                                    key={
                                                                        paymentId
                                                                    }
                                                                    value={
                                                                        paymentId
                                                                    }
                                                                    onSelect={() =>
                                                                        setFormData(
                                                                            (
                                                                                prev,
                                                                            ) => ({
                                                                                ...prev,
                                                                                paymentId,
                                                                            }),
                                                                        )
                                                                    }
                                                                >
                                                                    {paymentId}
                                                                </CommandItem>
                                                            ),
                                                        )}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="notes">Notes</Label>
                                <Textarea
                                    id="notes"
                                    value={formData.notes}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            notes: e.target.value,
                                        }))
                                    }
                                    placeholder="Enter notes"
                                    rows={3}
                                />
                            </div>

                            {/* Image Upload Section */}
                            <div className="space-y-2">
                                <Label>Images</Label>
                                <ImageManager
                                    images={formImages}
                                    onChange={setFormImages}
                                />
                            </div>
                        </div>

                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => setShowAddDialog(false)}
                            >
                                Cancel
                            </Button>
                            <Button onClick={handleSaveWatch}>
                                {editingWatch ? "Update Watch" : "Add Watch"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* New Payment Dialog */}
                <Dialog
                    open={showNewPaymentDialog}
                    onOpenChange={setShowNewPaymentDialog}
                >
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle>Create New Payment</DialogTitle>
                        </DialogHeader>

                        <div className="space-y-4">
                            <div className="text-sm text-slate-600">
                                Creating payment for {selectedWatches.length}{" "}
                                selected watch
                                {selectedWatches.length !== 1 ? "es" : ""}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="date">Date</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className={cn(
                                                "w-full justify-start text-left font-normal",
                                                !newPaymentData.date &&
                                                    "text-muted-foreground",
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {newPaymentData.date ? (
                                                format(
                                                    newPaymentData.date,
                                                    "PPP",
                                                )
                                            ) : (
                                                <span>Pick a date</span>
                                            )}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent
                                        className="w-auto p-0"
                                        align="start"
                                    >
                                        <Calendar
                                            mode="single"
                                            selected={newPaymentData.date}
                                            onSelect={(date) =>
                                                setNewPaymentData((prev) => ({
                                                    ...prev,
                                                    date: date || new Date(),
                                                }))
                                            }
                                            initialFocus
                                            className={cn(
                                                "pointer-events-auto p-3",
                                            )}
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="agent">Agent</Label>
                                <Select
                                    value={newPaymentData.agent}
                                    onValueChange={(value) =>
                                        setNewPaymentData((prev) => ({
                                            ...prev,
                                            agent: value,
                                        }))
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select agent" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableAgents
                                            .filter(
                                                (agent) =>
                                                    agent &&
                                                    agent.trim() !== "",
                                            )
                                            .map((agent) => (
                                                <SelectItem
                                                    key={agent}
                                                    value={agent}
                                                >
                                                    {agent}
                                                </SelectItem>
                                            ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="paymentMethod">
                                    Payment Method
                                </Label>
                                <Select
                                    value={newPaymentData.paymentMethod}
                                    onValueChange={(value) =>
                                        setNewPaymentData((prev) => ({
                                            ...prev,
                                            paymentMethod: value,
                                        }))
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select payment method" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="bank-transfer">
                                            Bank Transfer
                                        </SelectItem>
                                        <SelectItem value="cash">
                                            Cash
                                        </SelectItem>
                                        <SelectItem value="check">
                                            Check
                                        </SelectItem>
                                        <SelectItem value="paypal">
                                            PayPal
                                        </SelectItem>
                                        <SelectItem value="wise">
                                            Wise
                                        </SelectItem>
                                        <SelectItem value="other">
                                            Other
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="paymentDescription">
                                    Payment Description
                                </Label>
                                <Textarea
                                    id="paymentDescription"
                                    value={newPaymentData.paymentDescription}
                                    onChange={(e) =>
                                        setNewPaymentData((prev) => ({
                                            ...prev,
                                            paymentDescription: e.target.value,
                                        }))
                                    }
                                    placeholder="Enter payment description"
                                    rows={3}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="documentation">
                                    Documentation
                                </Label>
                                <Textarea
                                    id="documentation"
                                    value={newPaymentData.documentation}
                                    onChange={(e) =>
                                        setNewPaymentData((prev) => ({
                                            ...prev,
                                            documentation: e.target.value,
                                        }))
                                    }
                                    placeholder="Enter documentation details"
                                    rows={3}
                                />
                            </div>
                        </div>

                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => setShowNewPaymentDialog(false)}
                            >
                                Cancel
                            </Button>
                            <Button onClick={handleCreateNewPayment}>
                                Create Payment
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </Layout>
    );
};

export default AgentWatches;
