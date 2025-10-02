import { Head } from "@inertiajs/react";
import {
    AlertCircle,
    CheckCircle,
    Download,
    Filter,
    Info,
    Search,
    XCircle,
} from "lucide-react";
import { useState } from "react";
import Layout from "../components/Layout";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../components/ui/table";

interface LogEntry {
    id: string;
    timestamp: string;
    level: "info" | "warning" | "error" | "success";
    category: string;
    message: string;
    user?: string;
    details?: string;
}

const Log = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [levelFilter, setLevelFilter] = useState<string>("all");
    const [categoryFilter, setCategoryFilter] = useState<string>("all");

    const [logs] = useState<LogEntry[]>([
        {
            id: "LOG001",
            timestamp: "2024-06-06 14:30:25",
            level: "info",
            category: "Watch Management",
            message: "New watch added to inventory",
            user: "admin@secondvintage.com",
            details: "Rolex Submariner (REF: SUB001) added successfully",
        },
        {
            id: "LOG002",
            timestamp: "2024-06-06 14:25:12",
            level: "success",
            category: "Sales",
            message: "Sale completed on eBay",
            user: "sales@secondvintage.com",
            details: "Watch ID: W001, Sale Amount: $2,500",
        },
        {
            id: "LOG003",
            timestamp: "2024-06-06 14:20:45",
            level: "warning",
            category: "Inventory",
            message: "Low stock alert for vintage Omega watches",
            details: "Only 2 Omega watches remaining in inventory",
        },
        {
            id: "LOG004",
            timestamp: "2024-06-06 14:15:33",
            level: "error",
            category: "System",
            message: "Failed to sync with eBay API",
            details: "Connection timeout after 30 seconds",
        },
        {
            id: "LOG005",
            timestamp: "2024-06-06 14:10:18",
            level: "info",
            category: "Batch Management",
            message: "New batch created for Vietnam shipment",
            user: "logistics@secondvintage.com",
            details: "Batch ID: BATCH001, 25 watches scheduled for shipment",
        },
        {
            id: "LOG006",
            timestamp: "2024-06-06 14:05:07",
            level: "success",
            category: "Authentication",
            message: "User login successful",
            user: "admin@secondvintage.com",
            details: "Login from IP: 192.168.1.100",
        },
        {
            id: "LOG007",
            timestamp: "2024-06-06 14:00:52",
            level: "warning",
            category: "Vendor Payments",
            message: "Payment overdue notification sent",
            details: "Payment ID: PAY003 to Watch Authentication Service",
        },
        {
            id: "LOG008",
            timestamp: "2024-06-06 13:55:41",
            level: "info",
            category: "Data Export",
            message: "Full data export completed",
            user: "admin@secondvintage.com",
            details: "Exported 1,247 watch records to CSV",
        },
        {
            id: "LOG009",
            timestamp: "2024-06-06 13:50:33",
            level: "info",
            category: "Watch Management",
            message: "Watch cost updated by agent",
            user: "andy@vietnam.agent",
            details:
                "Watch ID: W045, Cost changed from €1,200 to €1,350 (Omega Speedmaster Professional)",
        },
        {
            id: "LOG010",
            timestamp: "2024-06-06 13:45:22",
            level: "error",
            category: "Platform Integration",
            message: "Chrono24 listing upload failed",
            details: "Error: Image size exceeds maximum limit (5MB)",
        },
        {
            id: "LOG011",
            timestamp: "2024-06-06 13:40:15",
            level: "success",
            category: "Agent Payments",
            message: "Payment processed successfully",
            user: "finance@secondvintage.com",
            details: "Payment of €15,000 sent to Marco (Italy) via Wise",
        },
        {
            id: "LOG012",
            timestamp: "2024-06-06 13:35:08",
            level: "warning",
            category: "Watch Management",
            message: "Duplicate watch SKU detected",
            user: "admin@secondvintage.com",
            details: "SKU: ROL-SUB-001 already exists in system",
        },
        {
            id: "LOG013",
            timestamp: "2024-06-06 13:30:44",
            level: "info",
            category: "User Management",
            message: "New agent account created",
            user: "admin@secondvintage.com",
            details:
                "Agent: Sophie France added with permissions for France region",
        },
    ]);

    const filteredLogs = logs.filter((log) => {
        const matchesSearch =
            log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (log.user &&
                log.user.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesLevel = levelFilter === "all" || log.level === levelFilter;
        const matchesCategory =
            categoryFilter === "all" || log.category === categoryFilter;

        return matchesSearch && matchesLevel && matchesCategory;
    });

    const getLevelIcon = (level: string) => {
        switch (level) {
            case "info":
                return <Info className="h-4 w-4" />;
            case "warning":
                return <AlertCircle className="h-4 w-4" />;
            case "error":
                return <XCircle className="h-4 w-4" />;
            case "success":
                return <CheckCircle className="h-4 w-4" />;
            default:
                return <Info className="h-4 w-4" />;
        }
    };

    const getLevelColor = (level: string) => {
        switch (level) {
            case "info":
                return "bg-blue-100 text-blue-800";
            case "warning":
                return "bg-yellow-100 text-yellow-800";
            case "error":
                return "bg-red-100 text-red-800";
            case "success":
                return "bg-green-100 text-green-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const categories = Array.from(new Set(logs.map((log) => log.category)));

    const logCounts = {
        total: logs.length,
        errors: logs.filter((log) => log.level === "error").length,
        warnings: logs.filter((log) => log.level === "warning").length,
        today: logs.filter((log) => log.timestamp.startsWith("2024-06-06"))
            .length,
    };

    return (
        <Layout>
            <Head title="SV - System logs" />
            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">System Log</h1>
                        <p className="text-muted-foreground">
                            Monitor system activities and events
                        </p>
                    </div>
                    <Button>
                        <Download className="mr-2 h-4 w-4" />
                        Export Log
                    </Button>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Total Entries</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {logCounts.total}
                            </div>
                            <p className="text-sm text-muted-foreground">
                                All time
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Errors</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">
                                {logCounts.errors}
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Needs attention
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Warnings</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-yellow-600">
                                {logCounts.warnings}
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Monitor closely
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Today's Activity</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {logCounts.today}
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Entries today
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Activity Log</CardTitle>
                        <CardDescription>
                            Real-time system events and user activities
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-4 flex items-center space-x-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search logs..."
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    className="pl-8"
                                />
                            </div>
                            <Select
                                value={levelFilter}
                                onValueChange={setLevelFilter}
                            >
                                <SelectTrigger className="w-32">
                                    <SelectValue placeholder="Level" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All Levels
                                    </SelectItem>
                                    <SelectItem value="info">Info</SelectItem>
                                    <SelectItem value="warning">
                                        Warning
                                    </SelectItem>
                                    <SelectItem value="error">Error</SelectItem>
                                    <SelectItem value="success">
                                        Success
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <Select
                                value={categoryFilter}
                                onValueChange={setCategoryFilter}
                            >
                                <SelectTrigger className="w-40">
                                    <SelectValue placeholder="Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All Categories
                                    </SelectItem>
                                    {categories.map((category) => (
                                        <SelectItem
                                            key={category}
                                            value={category}
                                        >
                                            {category}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Button variant="outline">
                                <Filter className="mr-2 h-4 w-4" />
                                Clear Filters
                            </Button>
                        </div>

                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Timestamp</TableHead>
                                    <TableHead>Level</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Message</TableHead>
                                    <TableHead>User</TableHead>
                                    <TableHead>Details</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredLogs.map((log) => (
                                    <TableRow key={log.id}>
                                        <TableCell className="font-mono text-sm">
                                            {log.timestamp}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                className={`${getLevelColor(log.level)} flex w-fit items-center gap-1`}
                                            >
                                                {getLevelIcon(log.level)}
                                                {log.level}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline">
                                                {log.category}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{log.message}</TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                            {log.user || "-"}
                                        </TableCell>
                                        <TableCell className="max-w-xs truncate text-sm text-muted-foreground">
                                            {log.details || "-"}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        {filteredLogs.length === 0 && (
                            <div className="py-8 text-center text-muted-foreground">
                                No log entries found matching your criteria.
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </Layout>
    );
};

export default Log;
