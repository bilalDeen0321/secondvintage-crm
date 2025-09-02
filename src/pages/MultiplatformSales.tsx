import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Head } from "@inertiajs/react";
import {
    AlertTriangle,
    ChevronDown,
    ChevronUp,
    Download,
    Edit,
    Eye,
    FileText,
    Filter,
    MapPin,
    Package,
    Search,
} from "lucide-react";
import React, { useMemo, useState } from "react";
import Layout from "../components/Layout";
import { Watch } from "../types/Watch";
import PlatformDataModal from "./sales/components/platform/PlatformDataModal";

type SortField =
    | "name"
    | "sku"
    | "brand"
    | "acquisitionCost"
    | "batchGroup"
    | "status"
    | "location";
type SortDirection = "asc" | "desc";

const MultiplatformSales = () => {
    // Sample watches data - in real app this would come from your watch management
    const [watches, setWatches] = useState<Watch[]>([
        {
            id: "1",
            name: "Rolex Submariner 116610LN",
            sku: "ROL-SUB-001",
            brand: "Rolex",
            acquisitionCost: 8500,
            status: "Approved",
            location: "Denmark",
            batchGroup: "BATCH-001",
            description: "Excellent condition Rolex Submariner with box and papers.",
            images: [
                {
                    id: "1",
                    url: "/lovable-uploads/e42df4f6-4752-4442-9e7c-06e8184162be.png",
                    useForAI: true,
                },
                {
                    id: "2",
                    url: "/lovable-uploads/c9668ac2-5bda-49b2-9679-1759280598e1.png",
                    useForAI: false,
                },
                {
                    id: "3",
                    url: "/lovable-uploads/8a246750-c18b-4b1c-b6af-25185e84d3d7.png",
                    useForAI: true,
                },
                {
                    id: "4",
                    url: "/lovable-uploads/5557d546-574f-45fb-bd5a-014ec53e5792.png",
                    useForAI: true,
                },
                {
                    id: "5",
                    url: "/lovable-uploads/42d61632-8522-4f3e-9f7f-712379b47422.png",
                    useForAI: true,
                },
                {
                    id: "6",
                    url: "/lovable-uploads/e42df4f6-4752-4442-9e7c-06e8184162be.png",
                    useForAI: false,
                },
                {
                    id: "7",
                    url: "/lovable-uploads/c9668ac2-5bda-49b2-9679-1759280598e1.png",
                    useForAI: true,
                },
            ],
        },
        {
            id: "2",
            name: "Omega Speedmaster Professional",
            sku: "OME-SPE-002",
            brand: "Omega",
            acquisitionCost: 3200,
            status: "Platform Review",
            location: "Vietnam",
            batchGroup: "BATCH-002",
            description: "Classic moonwatch with manual wind movement.",
            images: [
                {
                    id: "2",
                    url: "/lovable-uploads/c9668ac2-5bda-49b2-9679-1759280598e1.png",
                    useForAI: false,
                },
                {
                    id: "9",
                    url: "/lovable-uploads/5557d546-574f-45fb-bd5a-014ec53e5792.png",
                    useForAI: true,
                },
                {
                    id: "10",
                    url: "/lovable-uploads/42d61632-8522-4f3e-9f7f-712379b47422.png",
                    useForAI: false,
                },
                {
                    id: "11",
                    url: "/lovable-uploads/e42df4f6-4752-4442-9e7c-06e8184162be.png",
                    useForAI: true,
                },
                {
                    id: "12",
                    url: "/lovable-uploads/8a246750-c18b-4b1c-b6af-25185e84d3d7.png",
                    useForAI: false,
                },
            ],
        },
        {
            id: "3",
            name: "TAG Heuer Monaco",
            sku: "TAG-MON-003",
            brand: "TAG Heuer",
            acquisitionCost: 2800,
            status: "Ready for listing",
            location: "Japan",
            batchGroup: "BATCH-001",
            description: "Iconic square case chronograph.",
            images: [
                {
                    id: "3",
                    url: "/lovable-uploads/8a246750-c18b-4b1c-b6af-25185e84d3d7.png",
                    useForAI: true,
                },
                {
                    id: "13",
                    url: "/lovable-uploads/c9668ac2-5bda-49b2-9679-1759280598e1.png",
                    useForAI: false,
                },
                {
                    id: "14",
                    url: "/lovable-uploads/e42df4f6-4752-4442-9e7c-06e8184162be.png",
                    useForAI: true,
                },
                {
                    id: "15",
                    url: "/lovable-uploads/5557d546-574f-45fb-bd5a-014ec53e5792.png",
                    useForAI: false,
                },
                {
                    id: "16",
                    url: "/lovable-uploads/42d61632-8522-4f3e-9f7f-712379b47422.png",
                    useForAI: true,
                },
                {
                    id: "17",
                    url: "/lovable-uploads/8a246750-c18b-4b1c-b6af-25185e84d3d7.png",
                    useForAI: false,
                },
            ],
        },
        {
            id: "4",
            name: "Breitling Navitimer",
            sku: "BRE-NAV-004",
            brand: "Breitling",
            acquisitionCost: 4200,
            status: "Approved",
            location: "Denmark",
            batchGroup: "BATCH-003",
            description: "Aviation chronograph with slide rule bezel.",
            images: [
                {
                    id: "4",
                    url: "/lovable-uploads/5557d546-574f-45fb-bd5a-014ec53e5792.png",
                    useForAI: true,
                },
                {
                    id: "18",
                    url: "/lovable-uploads/42d61632-8522-4f3e-9f7f-712379b47422.png",
                    useForAI: false,
                },
                {
                    id: "19",
                    url: "/lovable-uploads/e42df4f6-4752-4442-9e7c-06e8184162be.png",
                    useForAI: true,
                },
                {
                    id: "20",
                    url: "/lovable-uploads/c9668ac2-5bda-49b2-9679-1759280598e1.png",
                    useForAI: false,
                },
                {
                    id: "21",
                    url: "/lovable-uploads/8a246750-c18b-4b1c-b6af-25185e84d3d7.png",
                    useForAI: true,
                },
            ],
        },
        {
            id: "5",
            name: "IWC Pilot Mark XVIII",
            sku: "IWC-PIL-005",
            brand: "IWC",
            acquisitionCost: 3800,
            status: "Approved",
            location: "In Transit",
            batchGroup: "BATCH-002",
            description: "Military-inspired pilot watch.",
            images: [
                {
                    id: "5",
                    url: "/lovable-uploads/42d61632-8522-4f3e-9f7f-712379b47422.png",
                    useForAI: true,
                },
                {
                    id: "22",
                    url: "/lovable-uploads/e42df4f6-4752-4442-9e7c-06e8184162be.png",
                    useForAI: false,
                },
                {
                    id: "23",
                    url: "/lovable-uploads/c9668ac2-5bda-49b2-9679-1759280598e1.png",
                    useForAI: true,
                },
                {
                    id: "24",
                    url: "/lovable-uploads/8a246750-c18b-4b1c-b6af-25185e84d3d7.png",
                    useForAI: false,
                },
                {
                    id: "25",
                    url: "/lovable-uploads/5557d546-574f-45fb-bd5a-014ec53e5792.png",
                    useForAI: true,
                },
            ],
        },
        {
            id: "6",
            name: "Seiko Prospex Turtle",
            sku: "SEI-PRO-006",
            brand: "Seiko",
            acquisitionCost: 280,
            status: "Platform Review",
            location: "Vietnam",
            batchGroup: "BATCH-004",
            description: "Reliable dive watch with automatic movement.",
            images: [
                {
                    id: "26",
                    url: "/lovable-uploads/e42df4f6-4752-4442-9e7c-06e8184162be.png",
                    useForAI: true,
                },
                {
                    id: "27",
                    url: "/lovable-uploads/c9668ac2-5bda-49b2-9679-1759280598e1.png",
                    useForAI: false,
                },
                {
                    id: "28",
                    url: "/lovable-uploads/8a246750-c18b-4b1c-b6af-25185e84d3d7.png",
                    useForAI: true,
                },
                {
                    id: "29",
                    url: "/lovable-uploads/5557d546-574f-45fb-bd5a-014ec53e5792.png",
                    useForAI: false,
                },
            ],
        },
        {
            id: "7",
            name: "Tudor Black Bay 58",
            sku: "TUD-BB-007",
            brand: "Tudor",
            acquisitionCost: 3100,
            status: "Ready for listing",
            location: "Denmark",
            batchGroup: "BATCH-005",
            description: "Vintage-inspired dive watch with modern movement.",
            images: [
                {
                    id: "30",
                    url: "/lovable-uploads/42d61632-8522-4f3e-9f7f-712379b47422.png",
                    useForAI: true,
                },
                {
                    id: "31",
                    url: "/lovable-uploads/e42df4f6-4752-4442-9e7c-06e8184162be.png",
                    useForAI: false,
                },
                {
                    id: "32",
                    url: "/lovable-uploads/c9668ac2-5bda-49b2-9679-1759280598e1.png",
                    useForAI: true,
                },
            ],
        },
        {
            id: "8",
            name: "Casio G-Shock GA-2100",
            sku: "CAS-GSH-008",
            brand: "Casio",
            acquisitionCost: 95,
            status: "Listed",
            location: "Japan",
            batchGroup: "BATCH-006",
            description: "Modern CasiOak with analog-digital display.",
            images: [
                {
                    id: "33",
                    url: "/lovable-uploads/8a246750-c18b-4b1c-b6af-25185e84d3d7.png",
                    useForAI: true,
                },
                {
                    id: "34",
                    url: "/lovable-uploads/5557d546-574f-45fb-bd5a-014ec53e5792.png",
                    useForAI: false,
                },
            ],
        },
        {
            id: "9",
            name: "Panerai Luminor Marina",
            sku: "PAN-LUM-009",
            brand: "Panerai",
            acquisitionCost: 5200,
            status: "Approved",
            location: "Sweden",
            batchGroup: "BATCH-007",
            description: "Italian military heritage watch with crown guard.",
            images: [
                {
                    id: "35",
                    url: "/lovable-uploads/42d61632-8522-4f3e-9f7f-712379b47422.png",
                    useForAI: true,
                },
                {
                    id: "36",
                    url: "/lovable-uploads/e42df4f6-4752-4442-9e7c-06e8184162be.png",
                    useForAI: false,
                },
                {
                    id: "37",
                    url: "/lovable-uploads/c9668ac2-5bda-49b2-9679-1759280598e1.png",
                    useForAI: true,
                },
                {
                    id: "38",
                    url: "/lovable-uploads/8a246750-c18b-4b1c-b6af-25185e84d3d7.png",
                    useForAI: false,
                },
                {
                    id: "39",
                    url: "/lovable-uploads/5557d546-574f-45fb-bd5a-014ec53e5792.png",
                    useForAI: true,
                },
            ],
        },
        {
            id: "10",
            name: "Citizen Eco-Drive",
            sku: "CIT-ECO-010",
            brand: "Citizen",
            acquisitionCost: 150,
            status: "Platform Review",
            location: "Germany",
            batchGroup: "BATCH-008",
            description: "Solar-powered watch with perpetual calendar.",
            images: [
                {
                    id: "40",
                    url: "/lovable-uploads/e42df4f6-4752-4442-9e7c-06e8184162be.png",
                    useForAI: true,
                },
                {
                    id: "41",
                    url: "/lovable-uploads/c9668ac2-5bda-49b2-9679-1759280598e1.png",
                    useForAI: false,
                },
            ],
        },
        {
            id: "11",
            name: "Longines HydroConquest",
            sku: "LON-HYD-011",
            brand: "Longines",
            acquisitionCost: 1200,
            status: "Ready for listing",
            location: "USA",
            batchGroup: "BATCH-009",
            description: "Swiss diving watch with ceramic bezel.",
            images: [
                {
                    id: "42",
                    url: "/lovable-uploads/8a246750-c18b-4b1c-b6af-25185e84d3d7.png",
                    useForAI: true,
                },
                {
                    id: "43",
                    url: "/lovable-uploads/5557d546-574f-45fb-bd5a-014ec53e5792.png",
                    useForAI: false,
                },
                {
                    id: "44",
                    url: "/lovable-uploads/42d61632-8522-4f3e-9f7f-712379b47422.png",
                    useForAI: true,
                },
            ],
        },
        {
            id: "12",
            name: "Tissot PRC 200",
            sku: "TIS-PRC-012",
            brand: "Tissot",
            acquisitionCost: 320,
            status: "Listed",
            location: "Denmark",
            batchGroup: "BATCH-010",
            description: "Sports chronograph with quartz movement.",
            images: [
                {
                    id: "45",
                    url: "/lovable-uploads/e42df4f6-4752-4442-9e7c-06e8184162be.png",
                    useForAI: true,
                },
                {
                    id: "46",
                    url: "/lovable-uploads/c9668ac2-5bda-49b2-9679-1759280598e1.png",
                    useForAI: false,
                },
            ],
        },
        {
            id: "13",
            name: "Hamilton Khaki Field",
            sku: "HAM-KHA-013",
            brand: "Hamilton",
            acquisitionCost: 450,
            status: "Approved",
            location: "Vietnam",
            batchGroup: "BATCH-011",
            description: "Military field watch with automatic movement.",
            images: [
                {
                    id: "47",
                    url: "/lovable-uploads/8a246750-c18b-4b1c-b6af-25185e84d3d7.png",
                    useForAI: true,
                },
                {
                    id: "48",
                    url: "/lovable-uploads/5557d546-574f-45fb-bd5a-014ec53e5792.png",
                    useForAI: false,
                },
                {
                    id: "49",
                    url: "/lovable-uploads/42d61632-8522-4f3e-9f7f-712379b47422.png",
                    useForAI: true,
                },
                {
                    id: "50",
                    url: "/lovable-uploads/e42df4f6-4752-4442-9e7c-06e8184162be.png",
                    useForAI: false,
                },
            ],
        },
        {
            id: "14",
            name: "Rolex GMT-Master II 116710BLNR",
            sku: "ROL-GMT-014",
            brand: "Rolex",
            acquisitionCost: 15200,
            status: "Approved",
            location: "Denmark",
            batchGroup: "BATCH-012",
            description: "Batman GMT-Master II with blue and black ceramic bezel.",
            images: [
                {
                    id: "51",
                    url: "/lovable-uploads/e42df4f6-4752-4442-9e7c-06e8184162be.png",
                    useForAI: true,
                },
                {
                    id: "52",
                    url: "/lovable-uploads/c9668ac2-5bda-49b2-9679-1759280598e1.png",
                    useForAI: false,
                },
                {
                    id: "53",
                    url: "/lovable-uploads/8a246750-c18b-4b1c-b6af-25185e84d3d7.png",
                    useForAI: true,
                },
            ],
        },
        {
            id: "15",
            name: "Omega Seamaster Planet Ocean",
            sku: "OME-SEA-015",
            brand: "Omega",
            acquisitionCost: 4100,
            status: "Platform Review",
            location: "Germany",
            batchGroup: "BATCH-013",
            description: "Professional diving watch with helium escape valve.",
            images: [
                {
                    id: "54",
                    url: "/lovable-uploads/5557d546-574f-45fb-bd5a-014ec53e5792.png",
                    useForAI: true,
                },
                {
                    id: "55",
                    url: "/lovable-uploads/42d61632-8522-4f3e-9f7f-712379b47422.png",
                    useForAI: false,
                },
                {
                    id: "56",
                    url: "/lovable-uploads/e42df4f6-4752-4442-9e7c-06e8184162be.png",
                    useForAI: true,
                },
            ],
        },
        {
            id: "16",
            name: "Cartier Santos de Cartier",
            sku: "CAR-SAN-016",
            brand: "Cartier",
            acquisitionCost: 6800,
            status: "Approved",
            location: "Sweden",
            batchGroup: "BATCH-014",
            description: "Elegant dress watch with Roman numerals.",
            images: [
                {
                    id: "57",
                    url: "/lovable-uploads/c9668ac2-5bda-49b2-9679-1759280598e1.png",
                    useForAI: true,
                },
                {
                    id: "58",
                    url: "/lovable-uploads/8a246750-c18b-4b1c-b6af-25185e84d3d7.png",
                    useForAI: false,
                },
                {
                    id: "59",
                    url: "/lovable-uploads/5557d546-574f-45fb-bd5a-014ec53e5792.png",
                    useForAI: true,
                },
            ],
        },
        {
            id: "17",
            name: "Patek Philippe Calatrava",
            sku: "PAT-CAL-017",
            brand: "Patek Philippe",
            acquisitionCost: 22500,
            status: "Platform Review",
            location: "Denmark",
            batchGroup: "BATCH-015",
            description: "Classic dress watch with small seconds.",
            images: [
                {
                    id: "60",
                    url: "/lovable-uploads/42d61632-8522-4f3e-9f7f-712379b47422.png",
                    useForAI: true,
                },
                {
                    id: "61",
                    url: "/lovable-uploads/e42df4f6-4752-4442-9e7c-06e8184162be.png",
                    useForAI: false,
                },
                {
                    id: "62",
                    url: "/lovable-uploads/c9668ac2-5bda-49b2-9679-1759280598e1.png",
                    useForAI: true,
                },
            ],
        },
        {
            id: "18",
            name: "Audemars Piguet Royal Oak",
            sku: "AUD-ROY-018",
            brand: "Audemars Piguet",
            acquisitionCost: 28000,
            status: "Approved",
            location: "Vietnam",
            batchGroup: "BATCH-016",
            description: "Iconic octagonal bezel sports watch.",
            images: [
                {
                    id: "63",
                    url: "/lovable-uploads/8a246750-c18b-4b1c-b6af-25185e84d3d7.png",
                    useForAI: true,
                },
                {
                    id: "64",
                    url: "/lovable-uploads/5557d546-574f-45fb-bd5a-014ec53e5792.png",
                    useForAI: false,
                },
                {
                    id: "65",
                    url: "/lovable-uploads/42d61632-8522-4f3e-9f7f-712379b47422.png",
                    useForAI: true,
                },
            ],
        },
        {
            id: "19",
            name: "Zenith Chronomaster Sport",
            sku: "ZEN-CHR-019",
            brand: "Zenith",
            acquisitionCost: 8900,
            status: "Platform Review",
            location: "Japan",
            batchGroup: "BATCH-017",
            description: "High-frequency chronograph movement.",
            images: [
                {
                    id: "66",
                    url: "/lovable-uploads/e42df4f6-4752-4442-9e7c-06e8184162be.png",
                    useForAI: true,
                },
                {
                    id: "67",
                    url: "/lovable-uploads/c9668ac2-5bda-49b2-9679-1759280598e1.png",
                    useForAI: false,
                },
                {
                    id: "68",
                    url: "/lovable-uploads/8a246750-c18b-4b1c-b6af-25185e84d3d7.png",
                    useForAI: true,
                },
            ],
        },
        {
            id: "20",
            name: "Vacheron Constantin Overseas",
            sku: "VAC-OVE-020",
            brand: "Vacheron Constantin",
            acquisitionCost: 19800,
            status: "Approved",
            location: "USA",
            batchGroup: "BATCH-018",
            description: "Luxury sports watch with Maltese cross bezel.",
            images: [
                {
                    id: "69",
                    url: "/lovable-uploads/5557d546-574f-45fb-bd5a-014ec53e5792.png",
                    useForAI: true,
                },
                {
                    id: "70",
                    url: "/lovable-uploads/42d61632-8522-4f3e-9f7f-712379b47422.png",
                    useForAI: false,
                },
                {
                    id: "71",
                    url: "/lovable-uploads/e42df4f6-4752-4442-9e7c-06e8184162be.png",
                    useForAI: true,
                },
            ],
        },
        {
            id: "21",
            name: "Jaeger-LeCoultre Reverso",
            sku: "JAE-REV-021",
            brand: "Jaeger-LeCoultre",
            acquisitionCost: 7200,
            status: "Platform Review",
            location: "Germany",
            batchGroup: "BATCH-019",
            description: "Art Deco reversible case watch.",
            images: [
                {
                    id: "72",
                    url: "/lovable-uploads/c9668ac2-5bda-49b2-9679-1759280598e1.png",
                    useForAI: true,
                },
                {
                    id: "73",
                    url: "/lovable-uploads/8a246750-c18b-4b1c-b6af-25185e84d3d7.png",
                    useForAI: false,
                },
                {
                    id: "74",
                    url: "/lovable-uploads/5557d546-574f-45fb-bd5a-014ec53e5792.png",
                    useForAI: true,
                },
            ],
        },
        {
            id: "22",
            name: "Hublot Big Bang Unico",
            sku: "HUB-BIG-022",
            brand: "Hublot",
            acquisitionCost: 12500,
            status: "Approved",
            location: "In Transit",
            batchGroup: "BATCH-020",
            description: "Fusion of materials chronograph.",
            images: [
                {
                    id: "75",
                    url: "/lovable-uploads/42d61632-8522-4f3e-9f7f-712379b47422.png",
                    useForAI: true,
                },
                {
                    id: "76",
                    url: "/lovable-uploads/e42df4f6-4752-4442-9e7c-06e8184162be.png",
                    useForAI: false,
                },
                {
                    id: "77",
                    url: "/lovable-uploads/c9668ac2-5bda-49b2-9679-1759280598e1.png",
                    useForAI: true,
                },
            ],
        },
        {
            id: "23",
            name: "A. Lange & Söhne Lange 1",
            sku: "LAN-LAN-023",
            brand: "A. Lange & Söhne",
            acquisitionCost: 31500,
            status: "Platform Review",
            location: "Sweden",
            batchGroup: "BATCH-021",
            description: "German haute horlogerie with asymmetric dial.",
            images: [
                {
                    id: "78",
                    url: "/lovable-uploads/8a246750-c18b-4b1c-b6af-25185e84d3d7.png",
                    useForAI: true,
                },
                {
                    id: "79",
                    url: "/lovable-uploads/5557d546-574f-45fb-bd5a-014ec53e5792.png",
                    useForAI: false,
                },
                {
                    id: "80",
                    url: "/lovable-uploads/42d61632-8522-4f3e-9f7f-712379b47422.png",
                    useForAI: true,
                },
            ],
        },
        {
            id: "24",
            name: "Oris Aquis Date",
            sku: "ORI-AQU-024",
            brand: "Oris",
            acquisitionCost: 1800,
            status: "Approved",
            location: "Denmark",
            batchGroup: "BATCH-022",
            description: "Swiss diving watch with ceramic bezel.",
            images: [
                {
                    id: "81",
                    url: "/lovable-uploads/e42df4f6-4752-4442-9e7c-06e8184162be.png",
                    useForAI: true,
                },
                {
                    id: "82",
                    url: "/lovable-uploads/c9668ac2-5bda-49b2-9679-1759280598e1.png",
                    useForAI: false,
                },
            ],
        },
        {
            id: "25",
            name: "Sinn 556 I",
            sku: "SIN-556-025",
            brand: "Sinn",
            acquisitionCost: 1100,
            status: "Platform Review",
            location: "Germany",
            batchGroup: "BATCH-023",
            description: "German tool watch with pilot aesthetics.",
            images: [
                {
                    id: "83",
                    url: "/lovable-uploads/8a246750-c18b-4b1c-b6af-25185e84d3d7.png",
                    useForAI: true,
                },
                {
                    id: "84",
                    url: "/lovable-uploads/5557d546-574f-45fb-bd5a-014ec53e5792.png",
                    useForAI: false,
                },
            ],
        },
        {
            id: "26",
            name: "Grand Seiko Spring Drive",
            sku: "GS-SPR-026",
            brand: "Grand Seiko",
            acquisitionCost: 4500,
            status: "Approved",
            location: "Japan",
            batchGroup: "BATCH-024",
            description: "Japanese precision with Spring Drive movement.",
            images: [
                {
                    id: "85",
                    url: "/lovable-uploads/42d61632-8522-4f3e-9f7f-712379b47422.png",
                    useForAI: true,
                },
                {
                    id: "86",
                    url: "/lovable-uploads/e42df4f6-4752-4442-9e7c-06e8184162be.png",
                    useForAI: false,
                },
            ],
        },
        {
            id: "27",
            name: "Monta Ocean King",
            sku: "MON-OCE-027",
            brand: "Monta",
            acquisitionCost: 1900,
            status: "Platform Review",
            location: "USA",
            batchGroup: "BATCH-025",
            description: "Micro-brand dive watch with Swiss movement.",
            images: [
                {
                    id: "87",
                    url: "/lovable-uploads/c9668ac2-5bda-49b2-9679-1759280598e1.png",
                    useForAI: true,
                },
                {
                    id: "88",
                    url: "/lovable-uploads/8a246750-c18b-4b1c-b6af-25185e84d3d7.png",
                    useForAI: false,
                },
            ],
        },
        {
            id: "28",
            name: "Nomos Tangente",
            sku: "NOM-TAN-028",
            brand: "Nomos",
            acquisitionCost: 1600,
            status: "Approved",
            location: "Germany",
            batchGroup: "BATCH-026",
            description: "Bauhaus design with in-house movement.",
            images: [
                {
                    id: "89",
                    url: "/lovable-uploads/5557d546-574f-45fb-bd5a-014ec53e5792.png",
                    useForAI: true,
                },
                {
                    id: "90",
                    url: "/lovable-uploads/42d61632-8522-4f3e-9f7f-712379b47422.png",
                    useForAI: false,
                },
            ],
        },
        {
            id: "29",
            name: "Frederique Constant Slimline",
            sku: "FC-SLI-029",
            brand: "Frederique Constant",
            acquisitionCost: 800,
            status: "Platform Review",
            location: "Switzerland",
            batchGroup: "BATCH-027",
            description: "Elegant dress watch with Swiss movement.",
            images: [
                {
                    id: "91",
                    url: "/lovable-uploads/e42df4f6-4752-4442-9e7c-06e8184162be.png",
                    useForAI: true,
                },
                {
                    id: "92",
                    url: "/lovable-uploads/c9668ac2-5bda-49b2-9679-1759280598e1.png",
                    useForAI: false,
                },
            ],
        },
        {
            id: "30",
            name: "Squale 1521",
            sku: "SQU-1521-030",
            brand: "Squale",
            acquisitionCost: 650,
            status: "Approved",
            location: "Italy",
            batchGroup: "BATCH-028",
            description: "Italian dive watch with vintage charm.",
            images: [
                {
                    id: "93",
                    url: "/lovable-uploads/8a246750-c18b-4b1c-b6af-25185e84d3d7.png",
                    useForAI: true,
                },
                {
                    id: "94",
                    url: "/lovable-uploads/5557d546-574f-45fb-bd5a-014ec53e5792.png",
                    useForAI: false,
                },
            ],
        },
        {
            id: "31",
            name: "Yema Superman",
            sku: "YEM-SUP-031",
            brand: "Yema",
            acquisitionCost: 420,
            status: "Platform Review",
            location: "France",
            batchGroup: "BATCH-029",
            description: "French dive watch with rotating bezel.",
            images: [
                {
                    id: "95",
                    url: "/lovable-uploads/42d61632-8522-4f3e-9f7f-712379b47422.png",
                    useForAI: true,
                },
                {
                    id: "96",
                    url: "/lovable-uploads/e42df4f6-4752-4442-9e7c-06e8184162be.png",
                    useForAI: false,
                },
            ],
        },
        {
            id: "32",
            name: "Certina DS Action",
            sku: "CER-DSA-032",
            brand: "Certina",
            acquisitionCost: 380,
            status: "Approved",
            location: "Switzerland",
            batchGroup: "BATCH-030",
            description: "Swiss sports watch with Powermatic 80 movement.",
            images: [
                {
                    id: "97",
                    url: "/lovable-uploads/c9668ac2-5bda-49b2-9679-1759280598e1.png",
                    useForAI: true,
                },
                {
                    id: "98",
                    url: "/lovable-uploads/8a246750-c18b-4b1c-b6af-25185e84d3d7.png",
                    useForAI: false,
                },
            ],
        },
        {
            id: "33",
            name: "Zelos Mako V3",
            sku: "ZEL-MAK-033",
            brand: "Zelos",
            acquisitionCost: 520,
            status: "Platform Review",
            location: "Singapore",
            batchGroup: "BATCH-031",
            description: "Micro-brand dive watch with bronze case.",
            images: [
                {
                    id: "99",
                    url: "/lovable-uploads/5557d546-574f-45fb-bd5a-014ec53e5792.png",
                    useForAI: true,
                },
                {
                    id: "100",
                    url: "/lovable-uploads/42d61632-8522-4f3e-9f7f-712379b47422.png",
                    useForAI: false,
                },
            ],
        },
    ]);

    const [selectedWatches, setSelectedWatches] = useState<string[]>([]);
    const [statusFilter, setStatusFilter] = useState<string>("Approved & Platform Review");
    const [brandFilter, setBrandFilter] = useState<string>("All");
    const [platformFilter, setPlatformFilter] = useState<string>("All");
    const [batchFilter, setBatchFilter] = useState<string>("All");
    const [batchSearchTerm, setBatchSearchTerm] = useState<string>("");
    const [searchTerm, setSearchTerm] = useState("");
    const [sortField, setSortField] = useState<SortField>("name");
    const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
    const [watchPlatforms, setWatchPlatforms] = useState<Record<string, string>>({
        "1": "Catawiki (Auction)",
        "4": "Catawiki (Auction)",
        "6": "Tradera (Auction)",
        "10": "Chrono24 (Fixed Price)",
        "15": "Webshop (Fixed Price)",
    });

    // New state for tracking processing status
    const [processingWatches, setProcessingWatches] = useState<Set<string>>(new Set());

    const [platformDataModal, setPlatformDataModal] = useState<{
        isOpen: boolean;
        watch: Watch | null;
        platform: string;
    }>({
        isOpen: false,
        watch: null,
        platform: "",
    });

    const [singleViewModal, setSingleViewModal] = useState<{
        isOpen: boolean;
        watch: Watch | null;
        selectedImageIndex: number;
    }>({
        isOpen: false,
        watch: null,
        selectedImageIndex: 0,
    });

    const platforms = [
        "None",
        "Catawiki (Auction)",
        "Tradera (Auction)",
        "eBay (Fixed Price)",
        "eBay (Auction)",
        "Chrono24 (Fixed Price)",
        "Webshop (Fixed Price)",
    ];
    const locations = ["Denmark", "Vietnam", "Japan", "In Transit", "Sweden", "Germany", "USA"];
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

    const statusColors = {
        Draft: "bg-gray-100 text-gray-800",
        Review: "bg-blue-100 text-blue-800",
        Approved: "bg-green-100 text-green-800",
        "Platform Review": "bg-blue-600 text-white",
        "Ready for listing": "bg-green-100 text-green-800",
        Listed: "bg-green-600 text-white",
        Reserved: "bg-purple-100 text-purple-800",
        Sold: "bg-slate-100 text-slate-800",
        "Defect/Problem": "bg-red-100 text-red-800",
        Standby: "bg-amber-100 text-amber-800",
    };

    // Get unique batch groups for the batch filter
    const uniqueBatchGroups = [
        "All",
        ...Array.from(new Set(watches.map((w) => w.batchGroup).filter(Boolean))),
    ];

    // Filter batch groups based on search term
    const filteredBatchGroups = uniqueBatchGroups.filter(
        (batch) => batch === "All" || batch.toLowerCase().includes(batchSearchTerm.toLowerCase()),
    );

    // Filter watches based on search and filters
    const filteredWatches = useMemo(() => {
        const filtered = watches.filter((watch) => {
            let matchesStatus = statusFilter === "All";
            if (statusFilter === "Approved & Platform Review") {
                matchesStatus = watch.status === "Approved" || watch.status === "Platform Review";
            } else if (statusFilter !== "All") {
                matchesStatus = watch.status === statusFilter;
            }

            const matchesBrand = brandFilter === "All" || watch.brand === brandFilter;
            const matchesBatch = batchFilter === "All" || watch.batchGroup === batchFilter;
            const watchPlatform = watchPlatforms[watch.id] || "None";
            const matchesPlatform = platformFilter === "All" || watchPlatform === platformFilter;
            const matchesSearch =
                watch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                watch.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                watch.sku.toLowerCase().includes(searchTerm.toLowerCase());
            return (
                matchesStatus && matchesBrand && matchesBatch && matchesPlatform && matchesSearch
            );
        });

        // Sort the filtered results
        return filtered.sort((a, b) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let aValue: any = a[sortField];
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let bValue: any = b[sortField];

            if (typeof aValue === "string") {
                aValue = aValue.toLowerCase();
                bValue = bValue.toLowerCase();
            }

            if (sortDirection === "asc") {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });
    }, [
        watches,
        statusFilter,
        brandFilter,
        batchFilter,
        platformFilter,
        searchTerm,
        watchPlatforms,
        sortField,
        sortDirection,
    ]);

    // Get unique values for filter dropdowns
    const uniqueBrands = ["All", ...Array.from(new Set(watches.map((w) => w.brand)))];
    const uniqueStatuses = [
        "Approved & Platform Review",
        "Approved",
        "Platform Review",
        "Ready for listing",
        "Listed",
    ];
    const uniquePlatforms = [
        "All",
        ...Array.from(new Set(Object.values(watchPlatforms).filter((p) => p !== "None"))),
        "None",
    ];

    const handleSelectWatch = (watchId: string, checked: boolean) => {
        if (checked) {
            setSelectedWatches([...selectedWatches, watchId]);
        } else {
            setSelectedWatches(selectedWatches.filter((id) => id !== watchId));
        }
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedWatches(filteredWatches.map((w) => w.id));
        } else {
            setSelectedWatches([]);
        }
    };

    const handleSelectByStatus = (status: string) => {
        const watchesByStatus = filteredWatches.filter((w) => w.status === status);
        const statusWatchIds = watchesByStatus.map((w) => w.id);
        setSelectedWatches([...new Set([...selectedWatches, ...statusWatchIds])]);
    };

    const handlePlatformChange = (watchId: string, platform: string) => {
        // Add the watch to processing state
        setProcessingWatches((prev) => new Set([...prev, watchId]));

        // Update the platform immediately
        setWatchPlatforms((prev) => ({
            ...prev,
            [watchId]: platform,
        }));

        // Remove from processing state after 3 seconds
        setTimeout(() => {
            setProcessingWatches((prev) => {
                const newSet = new Set(prev);
                newSet.delete(watchId);
                return newSet;
            });
        }, 3000);
    };

    const handleBulkStatusChange = (newStatus: string) => {
        setWatches((prev) =>
            prev.map((watch) =>
                selectedWatches.includes(watch.id)
                    ? { ...watch, status: newStatus as Watch["status"] }
                    : watch,
            ),
        );
    };

    const handleBulkLocationChange = (newLocation: string) => {
        setWatches((prev) =>
            prev.map((watch) =>
                selectedWatches.includes(watch.id) ? { ...watch, location: newLocation } : watch,
            ),
        );
    };

    const handleBulkBatchGroupChange = (newBatchGroup: string) => {
        setWatches((prev) =>
            prev.map((watch) =>
                selectedWatches.includes(watch.id)
                    ? { ...watch, batchGroup: newBatchGroup }
                    : watch,
            ),
        );
    };

    const handleBulkPlatformChange = (newPlatform: string) => {
        const updates: Record<string, string> = {};
        selectedWatches.forEach((watchId) => {
            updates[watchId] = newPlatform;
            // Add each watch to processing state
            setProcessingWatches((prev) => new Set([...prev, watchId]));
        });
        setWatchPlatforms((prev) => ({
            ...prev,
            ...updates,
        }));

        // Remove all from processing state after 3 seconds
        setTimeout(() => {
            setProcessingWatches((prev) => {
                const newSet = new Set(prev);
                selectedWatches.forEach((watchId) => newSet.delete(watchId));
                return newSet;
            });
        }, 3000);
    };

    const handleExport = (platform: string) => {
        const selectedWatchData = watches.filter((w) => selectedWatches.includes(w.id));

        // Create CSV content
        const headers = [
            "Name",
            "SKU",
            "Brand",
            "Status",
            "Acquisition Cost",
            "Platform",
            "Description",
        ];
        const csvContent = [
            headers.join(","),
            ...selectedWatchData.map((watch) =>
                [
                    `"${watch.name}"`,
                    watch.sku,
                    watch.brand,
                    watch.status,
                    watch.acquisitionCost || "",
                    watchPlatforms[watch.id] || "None",
                    `"${watch.description || ""}"`,
                ].join(","),
            ),
        ].join("\n");

        // Download CSV
        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${platform}_export_${new Date().toISOString().split("T")[0]}.csv`;
        link.click();
        window.URL.revokeObjectURL(url);
    };

    const handleViewPlatformData = (watch: Watch, platform: string) => {
        setPlatformDataModal({
            isOpen: true,
            watch,
            platform,
        });
    };

    const closePlatformDataModal = () => {
        setPlatformDataModal({
            isOpen: false,
            watch: null,
            platform: "",
        });
    };

    // Navigation functions for modal
    const handleModalNext = () => {
        if (!platformDataModal.watch) return;

        const currentIndex = filteredWatches.findIndex((w) => w.id === platformDataModal.watch!.id);
        const nextIndex = (currentIndex + 1) % filteredWatches.length;
        const nextWatch = filteredWatches[nextIndex];
        const nextPlatform = watchPlatforms[nextWatch.id] || "None";

        if (nextPlatform !== "None") {
            setPlatformDataModal({
                isOpen: true,
                watch: nextWatch,
                platform: nextPlatform,
            });
        }
    };

    const handleModalPrevious = () => {
        if (!platformDataModal.watch) return;

        const currentIndex = filteredWatches.findIndex((w) => w.id === platformDataModal.watch!.id);
        const prevIndex = currentIndex === 0 ? filteredWatches.length - 1 : currentIndex - 1;
        const prevWatch = filteredWatches[prevIndex];
        const prevPlatform = watchPlatforms[prevWatch.id] || "None";

        if (prevPlatform !== "None") {
            setPlatformDataModal({
                isOpen: true,
                watch: prevWatch,
                platform: prevPlatform,
            });
        }
    };

    const handleOpenSingleView = (watch: Watch) => {
        setSingleViewModal({
            isOpen: true,
            watch,
            selectedImageIndex: 0,
        });
    };

    const closeSingleViewModal = () => {
        setSingleViewModal({
            isOpen: false,
            watch: null,
            selectedImageIndex: 0,
        });
    };

    const handleThumbnailClick = (index: number) => {
        setSingleViewModal((prev) => ({
            ...prev,
            selectedImageIndex: index,
        }));
    };

    const getStatusColor = (status: Watch["status"]) => {
        switch (status) {
            case "Draft":
                return "bg-gray-100 text-gray-800";
            case "Review":
                return "bg-blue-100 text-blue-800";
            case "Approved":
                return "bg-green-100 text-green-800";
            case "Platform Review":
                return "bg-blue-600 text-white";
            case "Ready for listing":
                return "bg-green-100 text-green-800";
            case "Listed":
                return "bg-green-600 text-white";
            case "Reserved":
                return "bg-purple-100 text-purple-800";
            case "Sold":
                return "bg-slate-100 text-slate-800";
            case "Defect/Problem":
                return "bg-red-100 text-red-800";
            case "Standby":
                return "bg-amber-100 text-amber-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortDirection("asc");
        }
    };

    const SortableHeader = ({
        field,
        children,
    }: {
        field: SortField;
        children: React.ReactNode;
    }) => (
        <th
            className="cursor-pointer select-none p-3 text-xs font-medium text-slate-700 hover:bg-slate-100"
            onClick={() => handleSort(field)}
        >
            <div className="flex items-center gap-1">
                {children}
                {sortField === field &&
                    (sortDirection === "asc" ? (
                        <ChevronUp className="h-3 w-3" />
                    ) : (
                        <ChevronDown className="h-3 w-3" />
                    ))}
            </div>
        </th>
    );

    // Helper function to determine if a platform should be greyed out
    const isGreyedOutPlatform = (platform: string) => {
        return [
            "eBay (Fixed Price)",
            "eBay (Auction)",
            "Chrono24 (Fixed Price)",
            "Webshop (Fixed Price)",
        ].includes(platform);
    };

    return (
        <Layout>
            <Head title="Multi-platform Sales" />
            <div className="p-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900">
                                Multi-platform Sales
                            </h1>
                            <p className="mt-1 text-slate-600">
                                Select and export watches for different sales platforms
                            </p>
                        </div>
                    </div>

                    {/* Search and Filters */}
                    <div className="mb-6 flex flex-col gap-4 lg:flex-row">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                <Input
                                    type="text"
                                    placeholder="Search watches by name, brand, or SKU..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-40">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    {uniqueStatuses.map((status) => (
                                        <SelectItem key={status} value={status}>
                                            {status}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="w-40 justify-between">
                                        {batchFilter === "All" ? "Batch" : batchFilter}
                                        <ChevronDown className="ml-2 h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-40 bg-white">
                                    <div className="p-2">
                                        <Input
                                            placeholder="Search batches..."
                                            value={batchSearchTerm}
                                            onChange={(e) => setBatchSearchTerm(e.target.value)}
                                            className="h-8"
                                        />
                                    </div>
                                    {filteredBatchGroups.map((batch) => (
                                        <DropdownMenuItem
                                            key={batch}
                                            onClick={() => setBatchFilter(batch)}
                                        >
                                            {batch}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <Select value={brandFilter} onValueChange={setBrandFilter}>
                                <SelectTrigger className="w-40">
                                    <SelectValue placeholder="Brand" />
                                </SelectTrigger>
                                <SelectContent>
                                    {uniqueBrands.map((brand) => (
                                        <SelectItem key={brand} value={brand}>
                                            {brand}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select value={platformFilter} onValueChange={setPlatformFilter}>
                                <SelectTrigger className="w-40">
                                    <SelectValue placeholder="Platform" />
                                </SelectTrigger>
                                <SelectContent>
                                    {uniquePlatforms.map((platform) => (
                                        <SelectItem key={platform} value={platform}>
                                            {platform}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Quick Selection Actions */}
                    <div className="mb-6 flex flex-wrap gap-4 rounded-lg bg-slate-50 p-4">
                        <div className="flex items-center gap-2">
                            <Filter className="h-4 w-4 text-slate-600" />
                            <span className="text-sm font-medium text-slate-700">
                                Quick Select:
                            </span>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => handleSelectAll(true)}>
                            Select All ({filteredWatches.length})
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleSelectAll(false)}>
                            Clear Selection
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSelectByStatus("Approved")}
                        >
                            Select Approved
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSelectByStatus("Platform Review")}
                        >
                            Select Platform Review
                        </Button>
                    </div>

                    {/* Bulk Actions */}
                    {selectedWatches.length > 0 && (
                        <div className="mb-6 flex flex-wrap gap-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
                            <div className="flex items-center gap-2">
                                <Edit className="h-4 w-4 text-blue-600" />
                                <span className="text-sm font-medium text-blue-800">
                                    {selectedWatches.length} watches selected - Bulk Actions:
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="text-sm text-blue-700">Status:</span>
                                <Select onValueChange={handleBulkStatusChange}>
                                    <SelectTrigger className="w-40">
                                        <SelectValue placeholder="Change Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {statuses.map((status) => (
                                            <SelectItem key={status} value={status}>
                                                {status}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="text-sm text-blue-700">Location:</span>
                                <Select onValueChange={handleBulkLocationChange}>
                                    <SelectTrigger className="w-40">
                                        <SelectValue placeholder="Change Location" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {locations.map((location) => (
                                            <SelectItem key={location} value={location}>
                                                {location}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="text-sm text-blue-700">Batch Group:</span>
                                <Select onValueChange={handleBulkBatchGroupChange}>
                                    <SelectTrigger className="w-40">
                                        <SelectValue placeholder="Change Batch" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {uniqueBatchGroups
                                            .filter((b) => b !== "All")
                                            .map((batch) => (
                                                <SelectItem key={batch} value={batch}>
                                                    {batch}
                                                </SelectItem>
                                            ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="text-sm text-blue-700">Platform:</span>
                                <Select onValueChange={handleBulkPlatformChange}>
                                    <SelectTrigger className="w-48">
                                        <SelectValue placeholder="Change Platform" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {platforms.map((platform) => (
                                            <SelectItem
                                                key={platform}
                                                value={platform}
                                                className={
                                                    isGreyedOutPlatform(platform)
                                                        ? "text-gray-400"
                                                        : ""
                                                }
                                            >
                                                {platform}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}

                    {/* Export Actions */}
                    {selectedWatches.length > 0 && (
                        <div className="mb-6 flex gap-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
                            <div className="flex items-center gap-2">
                                <Download className="h-4 w-4 text-amber-600" />
                                <span className="text-sm font-medium text-amber-800">
                                    {selectedWatches.length} watches selected - Export to:
                                </span>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleExport("Catawiki")}
                                className="border-amber-300 text-amber-600 hover:bg-amber-100"
                            >
                                Catawiki
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleExport("Tradera")}
                                className="border-amber-300 text-amber-600 hover:bg-amber-100"
                            >
                                Tradera
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleExport("General")}
                                className="border-amber-300 text-amber-600 hover:bg-amber-100"
                            >
                                General CSV
                            </Button>
                        </div>
                    )}
                </div>

                {/* Watch Table */}
                <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50">
                                <tr className="text-left">
                                    <th className="w-8 p-3 text-xs font-medium text-slate-700">
                                        <Checkbox
                                            checked={
                                                selectedWatches.length === filteredWatches.length &&
                                                filteredWatches.length > 0
                                            }
                                            onCheckedChange={handleSelectAll}
                                        />
                                    </th>
                                    <th className="w-16 p-3 text-xs font-medium text-slate-700">
                                        Image
                                    </th>
                                    <SortableHeader field="name">Name</SortableHeader>
                                    <SortableHeader field="sku">SKU</SortableHeader>
                                    <SortableHeader field="brand">Brand</SortableHeader>
                                    <SortableHeader field="acquisitionCost">Cost</SortableHeader>
                                    <SortableHeader field="batchGroup">Batch Group</SortableHeader>
                                    <SortableHeader field="status">Status</SortableHeader>
                                    <th className="w-48 p-3 text-xs font-medium text-slate-700">
                                        Platform
                                    </th>
                                    <th className="w-20 p-3 text-xs font-medium text-slate-700">
                                        View Data
                                    </th>
                                    <SortableHeader field="location">Location</SortableHeader>
                                    <th className="w-24 p-3 text-xs font-medium text-slate-700">
                                        Description
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 bg-white">
                                {filteredWatches.map((watch) => (
                                    <tr
                                        key={watch.id}
                                        className={`hover:bg-slate-50 ${selectedWatches.includes(watch.id) ? "bg-amber-50" : ""}`}
                                    >
                                        <td className="p-3">
                                            <Checkbox
                                                checked={selectedWatches.includes(watch.id)}
                                                onCheckedChange={(checked) =>
                                                    handleSelectWatch(watch.id, checked as boolean)
                                                }
                                            />
                                        </td>
                                        <td className="p-3">
                                            <div
                                                className="flex h-12 w-12 cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-slate-100 hover:opacity-80"
                                                onClick={() => handleOpenSingleView(watch)}
                                            >
                                                {watch.images?.[0] ? (
                                                    <img
                                                        src={watch.images[0].url}
                                                        alt={watch.name}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <img
                                                        src="/lovable-uploads/02bcd7a1-2bd6-4118-ac09-c5414b210a1f.png"
                                                        alt="Watch placeholder"
                                                        className="h-6 w-6 opacity-40"
                                                    />
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-3">
                                            <div
                                                className="cursor-pointer text-sm font-medium text-slate-900 transition-colors hover:text-blue-600"
                                                onClick={() => handleOpenSingleView(watch)}
                                            >
                                                {watch.name}
                                            </div>
                                        </td>
                                        <td className="p-3">
                                            <div
                                                className="cursor-pointer text-sm text-slate-600 transition-colors hover:text-blue-600"
                                                onClick={() => handleOpenSingleView(watch)}
                                            >
                                                {watch.sku}
                                            </div>
                                        </td>
                                        <td className="p-2">
                                            <div className="text-sm text-slate-600">
                                                {watch.brand}
                                            </div>
                                        </td>
                                        <td className="p-2">
                                            <div className="text-sm font-semibold">
                                                €{watch.acquisitionCost?.toLocaleString()}
                                            </div>
                                        </td>
                                        <td className="p-2">
                                            <div className="text-sm text-slate-600">
                                                {watch.batchGroup}
                                            </div>
                                        </td>
                                        <td className="p-2">
                                            <span
                                                className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(watch.status)}`}
                                            >
                                                {watch.status}
                                            </span>
                                        </td>
                                        <td className="p-2">
                                            <Select
                                                value={watchPlatforms[watch.id] || "None"}
                                                onValueChange={(value) =>
                                                    handlePlatformChange(watch.id, value)
                                                }
                                            >
                                                <SelectTrigger className="w-48">
                                                    <SelectValue placeholder="Platform" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {platforms.map((platform) => (
                                                        <SelectItem
                                                            key={platform}
                                                            value={platform}
                                                            className={
                                                                isGreyedOutPlatform(platform)
                                                                    ? "text-gray-400"
                                                                    : ""
                                                            }
                                                        >
                                                            {platform}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </td>
                                        <td className="p-2">
                                            {processingWatches.has(watch.id) ? (
                                                <div className="flex items-center justify-center">
                                                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-orange-500 border-t-transparent"></div>
                                                </div>
                                            ) : watch.id === "13" ? (
                                                // Show red exclamation mark for Hamilton Khaki Field
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="text-red-600 hover:bg-red-50 hover:text-red-800"
                                                        >
                                                            <AlertTriangle className="h-5 w-5" />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle className="text-red-600">
                                                                Platform Data Error
                                                            </AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                There was an error processing the
                                                                platform data for this watch. Please
                                                                check the platform configuration and
                                                                try again, or contact support if the
                                                                issue persists.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogAction>
                                                                OK
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            ) : (
                                                watchPlatforms[watch.id] &&
                                                watchPlatforms[watch.id] !== "None" && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleViewPlatformData(
                                                                watch,
                                                                watchPlatforms[watch.id],
                                                            )
                                                        }
                                                        className="text-blue-600 hover:text-blue-800"
                                                    >
                                                        <Eye className="mr-1 h-4 w-4" />
                                                        Data
                                                    </Button>
                                                )
                                            )}
                                        </td>
                                        <td className="p-2">
                                            <div className="text-sm text-slate-600">
                                                {watch.location}
                                            </div>
                                        </td>
                                        <td className="p-2">
                                            <div
                                                className="line-clamp-2 text-xs leading-tight text-slate-600"
                                                style={{
                                                    display: "-webkit-box",
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient: "vertical",
                                                    overflow: "hidden",
                                                }}
                                                title={watch.description}
                                            >
                                                {watch.description || "-"}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {filteredWatches.length === 0 && (
                    <div className="py-12 text-center">
                        <div className="mb-4 text-6xl">⌚</div>
                        <h3 className="mb-2 text-xl font-medium text-slate-900">
                            No watches found
                        </h3>
                        <p className="text-slate-600">Try adjusting your search or filters</p>
                    </div>
                )}

                {/* Platform Data Modal with Navigation */}
                <PlatformDataModal
                    watch={platformDataModal.watch}
                    platform={platformDataModal.platform}
                    isOpen={platformDataModal.isOpen}
                    onClose={closePlatformDataModal}
                    onNext={handleModalNext}
                    onPrevious={handleModalPrevious}
                />

                {/* Single View Modal - BIGGER with MORE IMAGES */}
                <Dialog open={singleViewModal.isOpen} onOpenChange={closeSingleViewModal}>
                    <DialogContent className="max-h-[95vh] max-w-7xl overflow-y-auto">
                        <DialogHeader>
                            <div className="flex items-start justify-between">
                                <div>
                                    <DialogTitle className="text-3xl font-bold text-slate-900">
                                        {singleViewModal.watch?.name}
                                    </DialogTitle>
                                    <div className="mt-2 flex items-center gap-4">
                                        <span className="text-lg text-slate-600">
                                            SKU: {singleViewModal.watch?.sku}
                                        </span>
                                        <Badge
                                            className={`px-3 py-1 text-sm ${singleViewModal.watch ? getStatusColor(singleViewModal.watch.status) : ""}`}
                                        >
                                            {singleViewModal.watch?.status}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        </DialogHeader>

                        {singleViewModal.watch && (
                            <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
                                {/* Images Section */}
                                <div>
                                    {/* Main Image - Larger */}
                                    <div className="mb-6 aspect-square overflow-hidden rounded-lg bg-slate-100">
                                        <img
                                            src={
                                                singleViewModal.watch.images?.[
                                                    singleViewModal.selectedImageIndex
                                                ]?.url || "/placeholder.svg"
                                            }
                                            alt={singleViewModal.watch.name}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>

                                    {/* Thumbnail Images Grid - Show more images */}
                                    {singleViewModal.watch.images &&
                                        singleViewModal.watch.images.length > 1 && (
                                            <div className="grid grid-cols-6 gap-3">
                                                {singleViewModal.watch.images.map(
                                                    (image, index) => (
                                                        <div
                                                            key={image.id}
                                                            className={`aspect-square cursor-pointer overflow-hidden rounded-lg bg-slate-100 transition-all duration-200 hover:opacity-80 ${
                                                                index ===
                                                                singleViewModal.selectedImageIndex
                                                                    ? "ring-3 ring-blue-500 ring-offset-2"
                                                                    : "hover:ring-2 hover:ring-slate-300"
                                                            }`}
                                                            onClick={() =>
                                                                handleThumbnailClick(index)
                                                            }
                                                        >
                                                            <img
                                                                src={image.url}
                                                                alt={`${singleViewModal.watch.name} ${index + 1}`}
                                                                className="h-full w-full object-cover"
                                                            />
                                                        </div>
                                                    ),
                                                )}
                                            </div>
                                        )}

                                    {/* Image Counter */}
                                    {singleViewModal.watch.images &&
                                        singleViewModal.watch.images.length > 1 && (
                                            <div className="mt-4 text-center text-sm text-slate-600">
                                                Image {singleViewModal.selectedImageIndex + 1} of{" "}
                                                {singleViewModal.watch.images.length}
                                            </div>
                                        )}
                                </div>

                                {/* Details Section */}
                                <div className="space-y-8">
                                    <div>
                                        <h3 className="mb-4 text-xl font-semibold text-slate-900">
                                            Details
                                        </h3>
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3">
                                                <Package className="h-5 w-5 text-slate-400" />
                                                <span className="text-slate-600">Brand:</span>
                                                <span className="text-lg font-medium">
                                                    {singleViewModal.watch.brand}
                                                </span>
                                            </div>
                                            {singleViewModal.watch.acquisitionCost && (
                                                <div className="flex items-center gap-3">
                                                    <span className="text-slate-600">
                                                        Acquisition Cost:
                                                    </span>
                                                    <span className="text-lg font-medium">
                                                        €
                                                        {singleViewModal.watch.acquisitionCost.toLocaleString()}
                                                    </span>
                                                </div>
                                            )}
                                            <div className="flex items-center gap-3">
                                                <MapPin className="h-5 w-5 text-slate-400" />
                                                <span className="text-slate-600">Location:</span>
                                                <span className="text-lg font-medium">
                                                    {singleViewModal.watch.location}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {singleViewModal.watch.description && (
                                        <div>
                                            <div className="mb-4 flex items-center gap-3">
                                                <FileText className="h-5 w-5 text-slate-400" />
                                                <h3 className="text-xl font-semibold text-slate-900">
                                                    Description
                                                </h3>
                                            </div>
                                            <p className="text-base leading-relaxed text-slate-700">
                                                {singleViewModal.watch.description}
                                            </p>
                                        </div>
                                    )}

                                    {singleViewModal.watch.aiInstructions && (
                                        <div>
                                            <h3 className="mb-4 text-xl font-semibold text-slate-900">
                                                AI Instructions
                                            </h3>
                                            <p className="rounded-lg bg-slate-50 p-4 text-base leading-relaxed text-slate-700">
                                                {singleViewModal.watch.aiInstructions}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </Layout>
    );
};

export default MultiplatformSales;
