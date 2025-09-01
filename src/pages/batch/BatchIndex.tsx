import Layout from "@/components/Layout";
import WatchDetailModal from "@/components/WatchDetailModal";
import { Batch } from "@/types/Batch";
import { WatchResource } from "@/types/resources/watch";
import { Head } from "@inertiajs/react";
import { useState } from "react";
import { AddWatchModal } from "./components/AddWatchModal";
import { BatchFilters } from "./components/BatchFilters";
import { BatchList } from "./components/BatchList";
import { BatchStats } from "./components/BatchStats";
import { CreateBatchForm } from "./components/CreateBatchForm";
import { EditBatchModal } from "./components/EditBatchModal";

const BatchManagement = () => {
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [selectedWatch, setSelectedWatch] = useState<WatchResource | null>(null);
    const [isWatchModalOpen, setIsWatchModalOpen] = useState(false);
    const [editingBatch, setEditingBatch] = useState<string | null>(null);
    const [isAddWatchModalOpen, setIsAddWatchModalOpen] = useState(false);
    const [selectedBatchForWatch, setSelectedBatchForWatch] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [watchSearchTerm, setWatchSearchTerm] = useState("");
    const [watchStatusFilter, setWatchStatusFilter] = useState<string>("all");

    // Sorting states for batch watches table
    const [batchWatchSortField, setBatchWatchSortField] = useState<string>("name");
    const [batchWatchSortDirection, setBatchWatchSortDirection] = useState<"asc" | "desc">("asc");

    // Sorting states for add watch modal
    const [addWatchSortField, setAddWatchSortField] = useState<string>("name");
    const [addWatchSortDirection, setAddWatchSortDirection] = useState<"asc" | "desc">("asc");

    // Multi-select states for add watch modal
    const [selectedWatchesToAdd, setSelectedWatchesToAdd] = useState<(number | string)[]>([]);

    // Mock watch database
    const [availableWatches] = useState<WatchResource[]>([
        {
            id: 1,
            name: "Rolex Datejust",
            sku: "ROL-DAT-001",
            brand: "Rolex",
            status: "Ready for listing",
            location: "Hørning",
            description: "Classic timepiece",
            images: [
                {
                    id: "1",
                    url: "/lovable-uploads/0884f9b0-c02c-4735-9af7-ebe16f554fe8.png",
                    useForAI: false,
                },
            ],
            serial_number: "",
            reference: "",
            case_size: "",
            caliber: "",
            timegrapher: "",
            original_cost: "",
            current_cost: "",
            currency: "",
            ai_instructions: "",
            ai_thread_id: "",
            ai_selected_images: "",
            notes: "",
            stage: "",
            user_id: 0,
            batch_id: 0,
            brand_id: 0,
            agent_id: 0,
            seller_id: 0,
            created_at: "",
            updated_at: "",
            image_urls: [],
            routeKey: "",
            batch: undefined,
        },
        {
            id: 2,
            name: "Omega De Ville",
            sku: "OME-DEV-002",
            brand: "Omega",
            status: "Listed",
            location: "Hørning",
            description: "Elegant dress watch",
            images: [
                {
                    id: "1",
                    url: "/lovable-uploads/02bcd7a1-2bd6-4118-ac09-c5414b210a1f.png",
                    useForAI: false,
                },
            ],
            serial_number: "",
            reference: "",
            case_size: "",
            caliber: "",
            timegrapher: "",
            original_cost: "",
            current_cost: "",
            currency: "",
            ai_instructions: "",
            ai_thread_id: "",
            ai_selected_images: "",
            notes: "",
            stage: "",
            user_id: 0,
            batch_id: 0,
            brand_id: 0,
            agent_id: 0,
            seller_id: 0,
            created_at: "",
            updated_at: "",
            image_urls: [],
            routeKey: "",
            batch: undefined,
        },
        {
            id: 3,
            name: "TAG Heuer Link",
            sku: "TAG-LIN-003",
            brand: "TAG Heuer",
            status: "Draft",
            location: "Hørning",
            description: "Sport luxury watch",
            images: [
                {
                    id: "1",
                    url: "/lovable-uploads/42d61632-8522-4f3e-9f7f-712379b47422.png",
                    useForAI: false,
                },
            ],
            serial_number: "",
            reference: "",
            case_size: "",
            caliber: "",
            timegrapher: "",
            original_cost: "",
            current_cost: "",
            currency: "",
            ai_instructions: "",
            ai_thread_id: "",
            ai_selected_images: "",
            notes: "",
            stage: "",
            user_id: 0,
            batch_id: 0,
            brand_id: 0,
            agent_id: 0,
            seller_id: 0,
            created_at: "",
            updated_at: "",
            image_urls: [],
            routeKey: "",
            batch: undefined,
        },
        {
            id: 4,
            name: "Breitling Avenger",
            sku: "BRE-AVE-004",
            brand: "Breitling",
            status: "Review",
            location: "Hørning",
            description: "Aviation inspired",
            images: [
                {
                    id: "1",
                    url: "/lovable-uploads/52231a31-d92b-4dc7-ab75-1e37c3104e6c.png",
                    useForAI: false,
                },
            ],
            serial_number: "",
            reference: "",
            case_size: "",
            caliber: "",
            timegrapher: "",
            original_cost: "",
            current_cost: "",
            currency: "",
            ai_instructions: "",
            ai_thread_id: "",
            ai_selected_images: "",
            notes: "",
            stage: "",
            user_id: 0,
            batch_id: 0,
            brand_id: 0,
            agent_id: 0,
            seller_id: 0,
            created_at: "",
            updated_at: "",
            image_urls: [],
            routeKey: "",
            batch: undefined,
        },
        {
            id: 6,
            name: "IWC Da Vinci",
            sku: "IWC-DAV-005",
            brand: "IWC",
            status: "Ready for listing",
            location: "Hørning",
            description: "Sophisticated design",
            images: [
                {
                    id: "1",
                    url: "/lovable-uploads/5557d546-574f-45fb-bd5a-014ec53e5792.png",
                    useForAI: false,
                },
            ],
            serial_number: "",
            reference: "",
            case_size: "",
            caliber: "",
            timegrapher: "",
            original_cost: "",
            current_cost: "",
            currency: "",
            ai_instructions: "",
            ai_thread_id: "",
            ai_selected_images: "",
            notes: "",
            stage: "",
            user_id: 0,
            batch_id: 0,
            brand_id: 0,
            agent_id: 0,
            seller_id: 0,
            created_at: "",
            updated_at: "",
            image_urls: [],
            routeKey: "",
            batch: undefined,
        },
    ]);

    const [batches, setBatches] = useState<Batch[]>([
        {
            id: "1",
            name: "Vietnam Batch #001",
            trackingNumber: "VN2024001234567",
            origin: "Ho Chi Minh City, Vietnam",
            destination: "Hørning, Denmark",
            status: "In Transit",
            watches: [
                {
                    id: "1",
                    name: "Rolex Submariner 116610LN",
                    sku: "ROL-SUB-001",
                    brand: "Rolex",
                    image: "/lovable-uploads/0884f9b0-c02c-4735-9af7-ebe16f554fe8.png",
                },
                {
                    id: "2",
                    name: "Omega Speedmaster Professional",
                    sku: "OME-SPE-002",
                    brand: "Omega",
                    image: "/lovable-uploads/02bcd7a1-2bd6-4118-ac09-c5414b210a1f.png",
                },
                {
                    id: "3",
                    name: "TAG Heuer Monaco",
                    sku: "TAG-MON-003",
                    brand: "TAG Heuer",
                    image: "/lovable-uploads/42d61632-8522-4f3e-9f7f-712379b47422.png",
                },
                {
                    id: "4",
                    name: "Breitling Navitimer",
                    sku: "BRE-NAV-004",
                    brand: "Breitling",
                    image: "/lovable-uploads/02bcd7a1-2bd6-4118-ac09-c5414b210a1f.png",
                },
                {
                    id: "5",
                    name: "IWC Pilot Mark XVIII",
                    sku: "IWC-PIL-005",
                    brand: "IWC",
                    image: "/lovable-uploads/5557d546-574f-45fb-bd5a-014ec53e5792.png",
                },
                {
                    id: "6",
                    name: "Patek Philippe Calatrava",
                    sku: "PAT-CAL-006",
                    brand: "Patek Philippe",
                    image: "/lovable-uploads/8a246750-c18b-4b1c-b6af-25185e84d3d7.png",
                },
                {
                    id: "7",
                    name: "Audemars Piguet Royal Oak",
                    sku: "AUD-ROY-007",
                    brand: "Audemars Piguet",
                    image: "/lovable-uploads/02bcd7a1-2bd6-4118-ac09-c5414b210a1f.png",
                },
                {
                    id: "8",
                    name: "Cartier Santos",
                    sku: "CAR-SAN-008",
                    brand: "Cartier",
                    image: "/lovable-uploads/c9668ac2-5bda-49b2-9679-1759280598e1.png",
                },
                {
                    id: "9",
                    name: "Vacheron Constantin Overseas",
                    sku: "VAC-OVE-009",
                    brand: "Vacheron Constantin",
                    image: "/lovable-uploads/cd305798-ab49-4a3b-9157-fb8db777bd8f.png",
                },
                {
                    id: "10",
                    name: "Jaeger-LeCoultre Reverso",
                    sku: "JAE-REV-010",
                    brand: "Jaeger-LeCoultre",
                    image: "/lovable-uploads/e42df4f6-4752-4442-9e7c-06e8184162be.png",
                },
                {
                    id: "11",
                    name: "Rolex GMT-Master II",
                    sku: "ROL-GMT-011",
                    brand: "Rolex",
                    image: "/lovable-uploads/0884f9b0-c02c-4735-9af7-ebe16f554fe8.png",
                },
                {
                    id: "12",
                    name: "Omega Seamaster",
                    sku: "OME-SEA-012",
                    brand: "Omega",
                    image: "/lovable-uploads/02bcd7a1-2bd6-4118-ac09-c5414b210a1f.png",
                },
                {
                    id: "13",
                    name: "TAG Heuer Formula 1",
                    sku: "TAG-FOR-013",
                    brand: "TAG Heuer",
                    image: "/lovable-uploads/42d61632-8522-4f3e-9f7f-712379b47422.png",
                },
                {
                    id: "14",
                    name: "Breitling Superocean",
                    sku: "BRE-SUP-014",
                    brand: "Breitling",
                    image: "/lovable-uploads/52231a31-d92b-4dc7-ab75-1e37c3104e6c.png",
                },
                {
                    id: "15",
                    name: "IWC Portugieser",
                    sku: "IWC-POR-015",
                    brand: "IWC",
                    image: "/lovable-uploads/5557d546-574f-45fb-bd5a-014ec53e5792.png",
                },
                {
                    id: "16",
                    name: "Patek Philippe Nautilus",
                    sku: "PAT-NAU-016",
                    brand: "Patek Philippe",
                    image: "/lovable-uploads/8a246750-c18b-4b1c-b6af-25185e84d3d7.png",
                },
                {
                    id: "17",
                    name: "AP Royal Oak Offshore",
                    sku: "AUD-OFF-017",
                    brand: "Audemars Piguet",
                    image: "/lovable-uploads/c3abfafa-8986-4b30-bd89-3d163701cb64.png",
                },
                {
                    id: "18",
                    name: "Cartier Tank",
                    sku: "CAR-TAN-018",
                    brand: "Cartier",
                    image: "/lovable-uploads/c9668ac2-5bda-49b2-9679-1759280598e1.png",
                },
                {
                    id: "19",
                    name: "VC Patrimony",
                    sku: "VAC-PAT-019",
                    brand: "Vacheron Constantin",
                    image: "/lovable-uploads/cd305798-ab49-4a3b-9157-fb8db777bd8f.png",
                },
                {
                    id: "20",
                    name: "JLC Master Control",
                    sku: "JAE-MAS-020",
                    brand: "Jaeger-LeCoultre",
                    image: "/lovable-uploads/e42df4f6-4752-4442-9e7c-06e8184162be.png",
                },
            ],
            shippedDate: "2024-01-15",
            estimatedDelivery: "2024-01-25",
            notes: "Priority shipping, handle with care",
        },
        {
            id: "2",
            name: "Vietnam Batch #002",
            trackingNumber: "VN2024001234568",
            origin: "Ho Chi Minh City, Vietnam",
            destination: "Hørning, Denmark",
            status: "Delivered",
            watches: [
                {
                    id: "21",
                    name: "Rolex Daytona",
                    sku: "ROL-DAY-021",
                    brand: "Rolex",
                    image: "/lovable-uploads/0884f9b0-c02c-4735-9af7-ebe16f554fe8.png",
                },
                {
                    id: "22",
                    name: "Omega Planet Ocean",
                    sku: "OME-PLA-022",
                    brand: "Omega",
                    image: "/lovable-uploads/02bcd7a1-2bd6-4118-ac09-c5414b210a1f.png",
                },
                {
                    id: "23",
                    name: "TAG Heuer Carrera",
                    sku: "TAG-CAR-023",
                    brand: "TAG Heuer",
                    image: "/lovable-uploads/42d61632-8522-4f3e-9f7f-712379b47422.png",
                },
                {
                    id: "24",
                    name: "Breitling Chronomat",
                    sku: "BRE-CHR-024",
                    brand: "Breitling",
                    image: "/lovable-uploads/52231a31-d92b-4dc7-ab75-1e37c3104e6c.png",
                },
                {
                    id: "25",
                    name: "IWC Big Pilot",
                    sku: "IWC-BIG-025",
                    brand: "IWC",
                    image: "/lovable-uploads/5557d546-574f-45fb-bd5a-014ec53e5792.png",
                },
                {
                    id: "26",
                    name: "Patek Philippe Aquanaut",
                    sku: "PAT-AQU-026",
                    brand: "Patek Philippe",
                    image: "/lovable-uploads/02bcd7a1-2bd6-4118-ac09-c5414b210a1f.png",
                },
                {
                    id: "27",
                    name: "AP Jules Audemars",
                    sku: "AUD-JUL-027",
                    brand: "Audemars Piguet",
                    image: "/lovable-uploads/c3abfafa-8986-4b30-bd89-3d163701cb64.png",
                },
                {
                    id: "28",
                    name: "Cartier Ballon Bleu",
                    sku: "CAR-BAL-028",
                    brand: "Cartier",
                    image: "/lovable-uploads/c9668ac2-5bda-49b2-9679-1759280598e1.png",
                },
                {
                    id: "29",
                    name: "VC Traditionnelle",
                    sku: "VAC-TRA-029",
                    brand: "Vacheron Constantin",
                    image: "/lovable-uploads/cd305798-ab49-4a3b-9157-fb8db777bd8f.png",
                },
                {
                    id: "30",
                    name: "JLC Deep Sea",
                    sku: "JAE-DEE-030",
                    brand: "Jaeger-LeCoultre",
                    image: "/lovable-uploads/e42df4f6-4752-4442-9e7c-06e8184162be.png",
                },
                {
                    id: "31",
                    name: "Rolex Explorer",
                    sku: "ROL-EXP-031",
                    brand: "Rolex",
                    image: "/lovable-uploads/0884f9b0-c02c-4735-9af7-ebe16f554fe8.png",
                },
                {
                    id: "32",
                    name: "Omega Constellation",
                    sku: "OME-CON-032",
                    brand: "Omega",
                    image: "/lovable-uploads/27ec6583-00c5-4c9f-bf57-429e50240830.png",
                },
                {
                    id: "33",
                    name: "TAG Heuer Aquaracer",
                    sku: "TAG-AQU-033",
                    brand: "TAG Heuer",
                    image: "/lovable-uploads/42d61632-8522-4f3e-9f7f-712379b47422.png",
                },
                {
                    id: "34",
                    name: "Breitling Premier",
                    sku: "BRE-PRE-034",
                    brand: "Breitling",
                    image: "/lovable-uploads/52231a31-d92b-4dc7-ab75-1e37c3104e6c.png",
                },
                {
                    id: "35",
                    name: "IWC Aquatimer",
                    sku: "IWC-AQU-035",
                    brand: "IWC",
                    image: "/lovable-uploads/5557d546-574f-45fb-bd5a-014ec53e5792.png",
                },
                {
                    id: "36",
                    name: "Patek Philippe Gondolo",
                    sku: "PAT-GON-036",
                    brand: "Patek Philippe",
                    image: "/lovable-uploads/8a246750-c18b-4b1c-b6af-25185e84d3d7.png",
                },
                {
                    id: "37",
                    name: "AP Code 11.59",
                    sku: "AUD-COD-037",
                    brand: "Audemars Piguet",
                    image: "/lovable-uploads/c3abfafa-8986-4b30-bd89-3d163701cb64.png",
                },
                {
                    id: "38",
                    name: "Cartier Pasha",
                    sku: "CAR-PAS-038",
                    brand: "Cartier",
                    image: "/lovable-uploads/c9668ac2-5bda-49b2-9679-1759280598e1.png",
                },
                {
                    id: "39",
                    name: "VC Malte",
                    sku: "VAC-MAL-039",
                    brand: "Vacheron Constantin",
                    image: "/lovable-uploads/02bcd7a1-2bd6-4118-ac09-c5414b210a1f.png",
                },
                {
                    id: "40",
                    name: "JLC Atmos",
                    sku: "JAE-ATM-040",
                    brand: "Jaeger-LeCoultre",
                    image: "/lovable-uploads/e42df4f6-4752-4442-9e7c-06e8184162be.png",
                },
            ],
            shippedDate: "2024-01-01",
            estimatedDelivery: "2024-01-10",
            actualDelivery: "2024-01-09",
            notes: "Delivered one day early",
        },
        {
            id: "3",
            name: "Singapore Batch #001",
            trackingNumber: "SG2024001234569",
            origin: "Singapore",
            destination: "Hørning, Denmark",
            status: "Customs",
            watches: [
                {
                    id: "41",
                    name: "Rolex Yacht-Master",
                    sku: "ROL-YAC-041",
                    brand: "Rolex",
                    image: "/lovable-uploads/0884f9b0-c02c-4735-9af7-ebe16f554fe8.png",
                },
                {
                    id: "42",
                    name: "Omega Aqua Terra",
                    sku: "OME-AQU-042",
                    brand: "Omega",
                    image: "/lovable-uploads/02bcd7a1-2bd6-4118-ac09-c5414b210a1f.png",
                },
                {
                    id: "43",
                    name: "TAG Heuer Autavia",
                    sku: "TAG-AUT-043",
                    brand: "TAG Heuer",
                    image: "/lovable-uploads/42d61632-8522-4f3e-9f7f-712379b47422.png",
                },
                {
                    id: "44",
                    name: "Breitling Bentley",
                    sku: "BRE-BEN-044",
                    brand: "Breitling",
                    image: "/lovable-uploads/52231a31-d92b-4dc7-ab75-1e37c3104e6c.png",
                },
                {
                    id: "45",
                    name: "IWC Ingenieur",
                    sku: "IWC-ING-045",
                    brand: "IWC",
                    image: "/lovable-uploads/5557d546-574f-45fb-bd5a-014ec53e5792.png",
                },
                {
                    id: "46",
                    name: "Patek Philippe Grand Complications",
                    sku: "PAT-GRA-046",
                    brand: "Patek Philippe",
                    image: "/lovable-uploads/8a246750-c18b-4b1c-b6af-25185e84d3d7.png",
                },
                {
                    id: "47",
                    name: "AP Millenary",
                    sku: "AUD-MIL-047",
                    brand: "Audemars Piguet",
                    image: "/lovable-uploads/c3abfafa-8986-4b30-bd89-3d163701cb64.png",
                },
                {
                    id: "48",
                    name: "Cartier Roadster",
                    sku: "CAR-ROA-048",
                    brand: "Cartier",
                    image: "/lovable-uploads/c9668ac2-5bda-49b2-9679-1759280598e1.png",
                },
                {
                    id: "49",
                    name: "VC Historiques",
                    sku: "VAC-HIS-049",
                    brand: "Vacheron Constantin",
                    image: "/lovable-uploads/cd305798-ab49-4a3b-9157-fb8db777bd8f.png",
                },
                {
                    id: "50",
                    name: "JLC Geophysic",
                    sku: "JAE-GEO-050",
                    brand: "Jaeger-LeCoultre",
                    image: "/lovable-uploads/e42df4f6-4752-4442-9e7c-06e8184162be.png",
                },
            ],
            shippedDate: "2024-02-01",
            estimatedDelivery: "2024-02-15",
            notes: "Delayed at customs for inspection",
        },
        {
            id: "4",
            name: "Hong Kong Batch #001",
            trackingNumber: "HK2024001234570",
            origin: "Hong Kong",
            destination: "Hørning, Denmark",
            status: "Preparing",
            watches: [
                {
                    id: "51",
                    name: "Rolex Air-King",
                    sku: "ROL-AIR-051",
                    brand: "Rolex",
                    image: "/lovable-uploads/0884f9b0-c02c-4735-9af7-ebe16f554fe8.png",
                },
                {
                    id: "52",
                    name: "Omega Railmaster",
                    sku: "OME-RAI-052",
                    brand: "Omega",
                    image: "/lovable-uploads/02bcd7a1-2bd6-4118-ac09-c5414b210a1f.png",
                },
                {
                    id: "53",
                    name: "TAG Heuer Connected",
                    sku: "TAG-CON-053",
                    brand: "TAG Heuer",
                    image: "/lovable-uploads/42d61632-8522-4f3e-9f7f-712379b47422.png",
                },
                {
                    id: "54",
                    name: "Breitling Transocean",
                    sku: "BRE-TRA-054",
                    brand: "Breitling",
                    image: "/lovable-uploads/52231a31-d92b-4dc7-ab75-1e37c3104e6c.png",
                },
                {
                    id: "55",
                    name: "IWC Portofino",
                    sku: "IWC-POR-055",
                    brand: "IWC",
                    image: "/lovable-uploads/5557d546-574f-45fb-bd5a-014ec53e5792.png",
                },
                {
                    id: "56",
                    name: "Patek Philippe Twenty~4",
                    sku: "PAT-TWE-056",
                    brand: "Patek Philippe",
                    image: "/lovable-uploads/8a246750-c18b-4b1c-b6af-25185e84d3d7.png",
                },
                {
                    id: "57",
                    name: "AP Royal Oak Concept",
                    sku: "AUD-ROC-057",
                    brand: "Audemars Piguet",
                    image: "/lovable-uploads/c3abfafa-8986-4b30-bd89-3d163701cb64.png",
                },
                {
                    id: "58",
                    name: "Cartier Calibre",
                    sku: "CAR-CAL-058",
                    brand: "Cartier",
                    image: "/lovable-uploads/c9668ac2-5bda-49b2-9679-1759280598e1.png",
                },
                {
                    id: "59",
                    name: "VC Quai de l'Ile",
                    sku: "VAC-QUA-059",
                    brand: "Vacheron Constantin",
                    image: "/lovable-uploads/cd305798-ab49-4a3b-9157-fb8db777bd8f.png",
                },
                {
                    id: "60",
                    name: "JLC Duomètre",
                    sku: "JAE-DUO-060",
                    brand: "Jaeger-LeCoultre",
                    image: "/lovable-uploads/e42df4f6-4752-4442-9e7c-06e8184162be.png",
                },
                {
                    id: "61",
                    name: "Tudor Black Bay",
                    sku: "TUD-BLA-061",
                    brand: "Tudor",
                    image: "/lovable-uploads/0884f9b0-c02c-4735-9af7-ebe16f554fe8.png",
                },
                {
                    id: "62",
                    name: "Zenith El Primero",
                    sku: "ZEN-ELP-062",
                    brand: "Zenith",
                    image: "/lovable-uploads/02bcd7a1-2bd6-4118-ac09-c5414b210a1f.png",
                },
                {
                    id: "63",
                    name: "Hublot Big Bang",
                    sku: "HUB-BIG-063",
                    brand: "Hublot",
                    image: "/lovable-uploads/42d61632-8522-4f3e-9f7f-712379b47422.png",
                },
                {
                    id: "64",
                    name: "Panerai Luminor",
                    sku: "PAN-LUM-064",
                    brand: "Panerai",
                    image: "/lovable-uploads/52231a31-d92b-4dc7-ab75-1e37c3104e6c.png",
                },
                {
                    id: "65",
                    name: "Montblanc Heritage",
                    sku: "MON-HER-065",
                    brand: "Montblanc",
                    image: "/lovable-uploads/5557d546-574f-45fb-bd5a-014ec53e5792.png",
                },
            ],
            shippedDate: undefined,
            estimatedDelivery: "2024-02-20",
            notes: "Final preparations, ready to ship soon",
        },
        {
            id: "5",
            name: "Japan Batch #001",
            trackingNumber: "JP2024001234571",
            origin: "Tokyo, Japan",
            destination: "Hørning, Denmark",
            status: "Shipped",
            watches: [
                {
                    id: "66",
                    name: "Seiko Prospex",
                    sku: "SEI-PRO-066",
                    brand: "Seiko",
                    image: "/lovable-uploads/0884f9b0-c02c-4735-9af7-ebe16f554fe8.png",
                },
                {
                    id: "67",
                    name: "Citizen Eco-Drive",
                    sku: "CIT-ECO-067",
                    brand: "Citizen",
                    image: "/lovable-uploads/02bcd7a1-2bd6-4118-ac09-c5414b210a1f.png",
                },
                {
                    id: "68",
                    name: "Casio G-Shock",
                    sku: "CAS-GSH-068",
                    brand: "Casio",
                    image: "/lovable-uploads/42d61632-8522-4f3e-9f7f-712379b47422.png",
                },
                {
                    id: "69",
                    name: "Grand Seiko Heritage",
                    sku: "GRA-HER-069",
                    brand: "Grand Seiko",
                    image: "/lovable-uploads/52231a31-d92b-4dc7-ab75-1e37c3104e6c.png",
                },
                {
                    id: "70",
                    name: "Orient Bambino",
                    sku: "ORI-BAM-070",
                    brand: "Orient",
                    image: "/lovable-uploads/5557d546-574f-45fb-bd5a-014ec53e5792.png",
                },
            ],
            shippedDate: "2024-02-10",
            estimatedDelivery: "2024-02-28",
            notes: "Special Japanese watches collection",
        },
        {
            id: "6",
            name: "USA Batch #001",
            trackingNumber: "US2024001234572",
            origin: "New York, USA",
            destination: "Hørning, Denmark",
            status: "In Transit",
            watches: [
                {
                    id: "71",
                    name: "Hamilton Khaki Field",
                    sku: "HAM-KHA-071",
                    brand: "Hamilton",
                    image: "/lovable-uploads/8a246750-c18b-4b1c-b6af-25185e84d3d7.png",
                },
                {
                    id: "72",
                    name: "Timex Weekender",
                    sku: "TIM-WEE-072",
                    brand: "Timex",
                    image: "/lovable-uploads/c3abfafa-8986-4b30-bd89-3d163701cb64.png",
                },
                {
                    id: "73",
                    name: "Fossil Grant",
                    sku: "FOS-GRA-073",
                    brand: "Fossil",
                    image: "/lovable-uploads/c9668ac2-5bda-49b2-9679-1759280598e1.png",
                },
                {
                    id: "74",
                    name: "Nixon Time Teller",
                    sku: "NIX-TIM-074",
                    brand: "Nixon",
                    image: "/lovable-uploads/cd305798-ab49-4a3b-9157-fb8db777bd8f.png",
                },
                {
                    id: "75",
                    name: "Shinola Runwell",
                    sku: "SHI-RUN-075",
                    brand: "Shinola",
                    image: "/lovable-uploads/e42df4f6-4752-4442-9e7c-06e8184162be.png",
                },
                {
                    id: "76",
                    name: "Daniel Wellington Classic",
                    sku: "DAN-CLA-076",
                    brand: "Daniel Wellington",
                    image: "/lovable-uploads/02bcd7a1-2bd6-4118-ac09-c5414b210a1f.png",
                },
                {
                    id: "77",
                    name: "MVMT Classic",
                    sku: "MVM-CLA-077",
                    brand: "MVMT",
                    image: "/lovable-uploads/27ec6583-00c5-4c9f-bf57-429e50240830.png",
                },
            ],
            shippedDate: "2024-02-05",
            estimatedDelivery: "2024-02-25",
            notes: "American brands collection",
        },
    ]);

    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newBatch, setNewBatch] = useState<Partial<Batch>>({
        name: "",
        trackingNumber: "",
        origin: "Ho Chi Minh City, Vietnam",
        destination: "Hørning, Denmark",
        status: "Preparing",
        watches: [],
        notes: "",
    });

    // Editing state for batch details
    const [editingBatchData, setEditingBatchData] = useState<Partial<Batch>>({});

    // Filter batches based on search and status
    const filteredBatches = batches.filter((batch) => {
        const matchesSearch =
            searchTerm === "" ||
            batch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            batch.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            batch.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
            batch.destination.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === "all" || batch.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    // Filter and sort available watches for add modal
    const filteredAndSortedAvailableWatches = availableWatches
        .filter((watch) => {
            const matchesSearch =
                watchSearchTerm === "" ||
                watch.name.toLowerCase().includes(watchSearchTerm.toLowerCase()) ||
                watch.sku.toLowerCase().includes(watchSearchTerm.toLowerCase()) ||
                watch.brand.toLowerCase().includes(watchSearchTerm.toLowerCase());

            const matchesStatus = watchStatusFilter === "all" || watch.status === watchStatusFilter;

            return matchesSearch && matchesStatus;
        })
        .sort((a, b) => {
            const aValue = a[addWatchSortField as keyof WatchResource] || "";
            const bValue = b[addWatchSortField as keyof WatchResource] || "";

            if (addWatchSortDirection === "asc") {
                return aValue.toString().localeCompare(bValue.toString());
            } else {
                return bValue.toString().localeCompare(aValue.toString());
            }
        });

    // Sort batch watches
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const getSortedBatchWatches = (watches: any[]) => {
        return [...watches].sort((a, b) => {
            const aValue = a[batchWatchSortField] || "";
            const bValue = b[batchWatchSortField] || "";

            if (batchWatchSortDirection === "asc") {
                return aValue.toString().localeCompare(bValue.toString());
            } else {
                return bValue.toString().localeCompare(aValue.toString());
            }
        });
    };

    // Sorting functions
    const handleBatchWatchSort = (field: string) => {
        if (batchWatchSortField === field) {
            setBatchWatchSortDirection(batchWatchSortDirection === "asc" ? "desc" : "asc");
        } else {
            setBatchWatchSortField(field);
            setBatchWatchSortDirection("asc");
        }
    };

    const handleAddWatchSort = (field: string) => {
        if (addWatchSortField === field) {
            setAddWatchSortDirection(addWatchSortDirection === "asc" ? "desc" : "asc");
        } else {
            setAddWatchSortField(field);
            setAddWatchSortDirection("asc");
        }
    };

    const getSortIcon = (
        field: string,
        currentSortField: string,
        currentSortDirection: "asc" | "desc",
    ) => {
        if (currentSortField !== field) return null;
        return currentSortDirection === "asc" ? (
            <ChevronUp className="ml-1 inline h-4 w-4" />
        ) : (
            <ChevronDown className="ml-1 inline h-4 w-4" />
        );
    };

    // Multi-select functions
    const handleSelectAllWatches = (checked: boolean) => {
        if (checked) {
            setSelectedWatchesToAdd(filteredAndSortedAvailableWatches.map((w) => String(w.id)));
        } else {
            setSelectedWatchesToAdd([]);
        }
    };

    const handleSelectWatch = (watchId: number, checked: boolean) => {
        if (checked) {
            setSelectedWatchesToAdd([...selectedWatchesToAdd, watchId]);
        } else {
            setSelectedWatchesToAdd(selectedWatchesToAdd.filter((id) => id !== watchId));
        }
    };

    const handleCreateBatch = () => {
        if (newBatch.name && newBatch.trackingNumber) {
            const batch: Batch = {
                id: Date.now().toString(),
                name: newBatch.name,
                trackingNumber: newBatch.trackingNumber,
                origin: newBatch.origin || "Ho Chi Minh City, Vietnam",
                destination: newBatch.destination || "Hørning, Denmark",
                status: (newBatch.status as Batch["status"]) || "Preparing",
                watches: newBatch.watches || [],
                notes: newBatch.notes,
            };
            setBatches([...batches, batch]);
            setNewBatch({
                name: "",
                trackingNumber: "",
                origin: "Ho Chi Minh City, Vietnam",
                destination: "Hørning, Denmark",
                status: "Preparing",
                watches: [],
                notes: "",
            });
            setShowCreateForm(false);
        }
    };

    const updateBatchStatus = (batchId: string, status: Batch["status"]) => {
        setBatches(batches.map((batch) => (batch.id === batchId ? { ...batch, status } : batch)));
    };

    const updateBatchDetails = () => {
        if (editingBatch && editingBatchData) {
            setBatches(
                batches.map((batch) =>
                    batch.id === editingBatch ? { ...batch, ...editingBatchData } : batch,
                ),
            );
        }
    };

    const getStatusColor = (status: Batch["status"]) => {
        switch (status) {
            case "Preparing":
                return "bg-yellow-100 text-yellow-800";
            case "Shipped":
                return "bg-blue-100 text-blue-800";
            case "In Transit":
                return "bg-purple-100 text-purple-800";
            case "Customs":
                return "bg-orange-100 text-orange-800";
            case "Delivered":
                return "bg-green-100 text-green-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const getWatchStatusColor = (status: WatchResource["status"]) => {
        switch (status) {
            case "Draft":
                return "bg-gray-100 text-gray-800";
            case "Review":
                return "bg-yellow-100 text-yellow-800";
            case "Platform Review":
                return "bg-orange-100 text-orange-800";
            case "Ready for listing":
                return "bg-blue-100 text-blue-800";
            case "Listed":
                return "bg-green-100 text-green-800";
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

    const handleWatchClick = (watchId: string) => {
        console.log("Watch clicked:", watchId);

        // Find the watch from all batches
        let foundWatch: WatchResource | null = null;
        for (const batch of batches) {
            const watch = batch.watches.find((w) => w.id === watchId);
            if (watch) {
                // Convert the batch watch to a full Watch object
                foundWatch = {
                    id: Number(watch.id),
                    name: watch.name,
                    sku: watch.sku,
                    brand: watch.brand,
                    status: "Listed" as WatchResource["status"], // Default status since batch watches don't have status
                    location: batch.destination, // Use batch destination as location
                    description: `Part of ${batch.name}`,
                    images: watch.image ? [{ id: "1", url: watch.image, useForAI: false }] : [],
                    serial_number: "",
                    reference: "",
                    case_size: "",
                    caliber: "",
                    timegrapher: "",
                    original_cost: "",
                    current_cost: "",
                    currency: "",
                    ai_instructions: "",
                    ai_thread_id: "",
                    ai_selected_images: "",
                    notes: "",
                    stage: "",
                    user_id: 0,
                    batch_id: Number(batch.id),
                    brand_id: 0,
                    agent_id: 0,
                    seller_id: 0,
                    created_at: "",
                    updated_at: "",
                    image_urls: [],
                    routeKey: "",
                    batch: undefined,
                };
                break;
            }
        }

        if (foundWatch) {
            setSelectedWatch(foundWatch);
            setIsWatchModalOpen(true);
        }
    };

    const getTrackingUrl = (trackingNumber: string) => {
        // This is a placeholder URL - in a real app you'd use the actual carrier's tracking URL
        return `https://www.track-trace.com/trace?t=${trackingNumber}`;
    };

    const handleCreateInvoice = (batchId: string) => {
        console.log("Creating package invoice for batch:", batchId);
        // This would typically generate and download an invoice
        alert(`Package invoice created for batch ${batchId}`);
    };

    const removeWatchFromBatch = (batchId: string, watchId: string) => {
        setBatches(
            batches.map((batch) =>
                batch.id === batchId
                    ? {
                          ...batch,
                          watches: batch.watches.filter((w) => w.id !== watchId),
                      }
                    : batch,
            ),
        );
    };

    const handleAddSelectedWatchesToBatch = () => {
        if (!selectedBatchForWatch || selectedWatchesToAdd.length === 0) return;

        const watchesToAdd = availableWatches
            .filter((w) => selectedWatchesToAdd.includes(String(w.id)))
            .map((watch) => ({
                id: String(watch.id),
                name: watch.name,
                sku: watch.sku,
                brand: watch.brand,
                image:
                    watch.images?.[0]?.url ||
                    "/lovable-uploads/e4da5380-362e-422c-a981-6370f96719da.png",
            }));

        setBatches(
            batches.map((batch) =>
                batch.id === selectedBatchForWatch
                    ? { ...batch, watches: [...batch.watches, ...watchesToAdd] }
                    : batch,
            ),
        );

        setIsAddWatchModalOpen(false);
        setSelectedBatchForWatch(null);
        setSelectedWatchesToAdd([]);
    };

    const handleAddWatchToBatch = (watchId: number) => {
        if (!selectedBatchForWatch) return;

        const watchToAdd = availableWatches.find((w) => w.id === watchId);
        if (!watchToAdd) return;

        const batchWatch = {
            id: String(watchToAdd.id),
            name: watchToAdd.name,
            sku: watchToAdd.sku,
            brand: watchToAdd.brand,
            image:
                watchToAdd.images?.[0]?.url ||
                "/lovable-uploads/e4da5380-362e-422c-a981-6370f96719da.png",
        };

        setBatches(
            batches.map((batch) =>
                batch.id === selectedBatchForWatch
                    ? { ...batch, watches: [...batch.watches, batchWatch] }
                    : batch,
            ),
        );
    };

    const openAddWatchModal = (batchId: string) => {
        setSelectedBatchForWatch(batchId);
        setIsAddWatchModalOpen(true);
        setSelectedWatchesToAdd([]);
    };

    const openEditBatchModal = (batchId: string) => {
        const batch = batches.find((b) => b.id === batchId);
        if (batch) {
            setEditingBatch(batchId);
            setEditingBatchData({
                name: batch.name,
                trackingNumber: batch.trackingNumber,
                origin: batch.origin,
                destination: batch.destination,
                shippedDate: batch.shippedDate,
                estimatedDelivery: batch.estimatedDelivery,
                notes: batch.notes,
            });
        }
    };

    const currentEditingBatch = editingBatch ? batches.find((b) => b.id === editingBatch) : null;

    return (
        <Layout>
            <Head title="Batch Management" />
            <div className="p-8">
                <BatchFilters
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                    viewMode={viewMode}
                    setViewMode={setViewMode}
                    onCreateBatch={() => setShowCreateForm(true)}
                />

                <BatchStats batches={batches} />

                {showCreateForm && (
                    <CreateBatchForm
                        newBatch={newBatch}
                        setNewBatch={setNewBatch}
                        onCreateBatch={handleCreateBatch}
                        onCancel={() => setShowCreateForm(false)}
                    />
                )}

                <BatchList
                    batches={filteredBatches}
                    viewMode={viewMode}
                    onWatchClick={handleWatchClick}
                    onEditBatch={openEditBatchModal}
                    onCreateInvoice={handleCreateInvoice}
                    onStatusUpdate={updateBatchStatus}
                    getStatusColor={getStatusColor}
                    getTrackingUrl={getTrackingUrl}
                />

                <EditBatchModal
                    isOpen={editingBatch !== null}
                    onClose={() => setEditingBatch(null)}
                    batch={currentEditingBatch}
                    editingBatchData={editingBatchData}
                    setEditingBatchData={setEditingBatchData}
                    availableWatches={availableWatches}
                    batchWatchSortField={batchWatchSortField}
                    batchWatchSortDirection={batchWatchSortDirection}
                    onBatchWatchSort={handleBatchWatchSort}
                    onUpdateBatchDetails={updateBatchDetails}
                    onAddWatchToBatch={openAddWatchModal}
                    onRemoveWatchFromBatch={removeWatchFromBatch}
                    getWatchStatusColor={getWatchStatusColor}
                    getSortedBatchWatches={getSortedBatchWatches}
                />

                <AddWatchModal
                    isOpen={isAddWatchModalOpen}
                    onClose={() => setIsAddWatchModalOpen(false)}
                    watchSearchTerm={watchSearchTerm}
                    setWatchSearchTerm={setWatchSearchTerm}
                    watchStatusFilter={watchStatusFilter}
                    setWatchStatusFilter={setWatchStatusFilter}
                    filteredAndSortedWatches={filteredAndSortedAvailableWatches}
                    addWatchSortField={addWatchSortField}
                    addWatchSortDirection={addWatchSortDirection}
                    onAddWatchSort={handleAddWatchSort}
                    selectedWatchesToAdd={selectedWatchesToAdd}
                    onSelectAllWatches={handleSelectAllWatches}
                    onSelectWatch={handleSelectWatch}
                    onAddSelectedWatches={handleAddSelectedWatchesToBatch}
                    onAddSingleWatch={handleAddWatchToBatch}
                    getWatchStatusColor={getWatchStatusColor}
                />

                <WatchDetailModal
                    watch={selectedWatch}
                    isOpen={isWatchModalOpen}
                    onClose={() => {
                        setIsWatchModalOpen(false);
                        setSelectedWatch(null);
                    }}
                    showEditButton={false}
                />
            </div>
        </Layout>
    );
};

export default BatchManagement;
