import { Head } from "@inertiajs/react";
import { Download, Eye, Mail, Plus, Search } from "lucide-react";
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../components/ui/table";

interface Invoice {
    id: string;
    agentName: string;
    agentEmail: string;
    amount: number;
    currency: string;
    status: "draft" | "sent" | "paid" | "overdue";
    issueDate: string;
    dueDate: string;
    items: Array<{
        description: string;
        quantity: number;
        price: number;
    }>;
}

const Invoices = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [invoices] = useState<Invoice[]>([
        {
            id: "INV-001",
            agentName: "Marcus Thompson",
            agentEmail: "marcus.thompson@watchagents.com",
            amount: 12500,
            currency: "USD",
            status: "paid",
            issueDate: "2024-05-15",
            dueDate: "2024-06-15",
            items: [
                {
                    description: "Commission - Vintage Rolex Submariner Sale",
                    quantity: 1,
                    price: 12500,
                },
            ],
        },
        {
            id: "INV-002",
            agentName: "Elena Rodriguez",
            agentEmail: "elena.rodriguez@watchagents.com",
            amount: 8900,
            currency: "USD",
            status: "sent",
            issueDate: "2024-06-01",
            dueDate: "2024-07-01",
            items: [
                {
                    description: "Commission - Omega Speedmaster Professional",
                    quantity: 1,
                    price: 8900,
                },
            ],
        },
        {
            id: "INV-003",
            agentName: "David Chen",
            agentEmail: "david.chen@watchagents.com",
            amount: 15800,
            currency: "USD",
            status: "overdue",
            issueDate: "2024-04-20",
            dueDate: "2024-05-20",
            items: [
                {
                    description: "Commission - Patek Philippe Calatrava",
                    quantity: 1,
                    price: 15800,
                },
            ],
        },
    ]);

    const filteredInvoices = invoices.filter(
        (invoice) =>
            invoice.agentName
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            invoice.id.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    const getStatusColor = (status: string) => {
        switch (status) {
            case "paid":
                return "bg-green-100 text-green-800";
            case "sent":
                return "bg-blue-100 text-blue-800";
            case "draft":
                return "bg-gray-100 text-gray-800";
            case "overdue":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const totalOutstanding = invoices
        .filter((i) => i.status === "sent" || i.status === "overdue")
        .reduce((sum, i) => sum + i.amount, 0);

    const totalPaid = invoices
        .filter((i) => i.status === "paid")
        .reduce((sum, i) => sum + i.amount, 0);

    return (
        <Layout>
            <Head title="Invoices" />
            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Invoices</h1>
                        <p className="text-muted-foreground">
                            Manage agent invoices and payments
                        </p>
                    </div>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                New Invoice
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                            <DialogHeader>
                                <DialogTitle>Create New Invoice</DialogTitle>
                                <DialogDescription>
                                    Generate a new invoice for an agent.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label
                                        htmlFor="agent"
                                        className="text-right"
                                    >
                                        Agent
                                    </Label>
                                    <Input id="agent" className="col-span-3" />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label
                                        htmlFor="email"
                                        className="text-right"
                                    >
                                        Email
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        className="col-span-3"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label
                                        htmlFor="dueDate"
                                        className="text-right"
                                    >
                                        Due Date
                                    </Label>
                                    <Input
                                        id="dueDate"
                                        type="date"
                                        className="col-span-3"
                                    />
                                </div>
                                <div className="col-span-4">
                                    <Label>Invoice Items</Label>
                                    <div className="mt-2 space-y-2">
                                        <div className="grid grid-cols-12 gap-2">
                                            <Input
                                                placeholder="Description"
                                                className="col-span-6"
                                            />
                                            <Input
                                                placeholder="Qty"
                                                type="number"
                                                className="col-span-2"
                                            />
                                            <Input
                                                placeholder="Price"
                                                type="number"
                                                className="col-span-3"
                                            />
                                            <Button
                                                size="sm"
                                                className="col-span-1"
                                            >
                                                +
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline">Save as Draft</Button>
                                <Button type="submit">Create & Send</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Outstanding</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                ${totalOutstanding.toLocaleString()}
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Awaiting payment
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Paid This Month</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">
                                ${totalPaid.toLocaleString()}
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Revenue received
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Overdue</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">
                                $
                                {invoices
                                    .filter((i) => i.status === "overdue")
                                    .reduce((sum, i) => sum + i.amount, 0)
                                    .toLocaleString()}
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Past due date
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Total Invoices</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {invoices.length}
                            </div>
                            <p className="text-sm text-muted-foreground">
                                All time
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Invoice List</CardTitle>
                        <CardDescription>
                            Manage all agent invoices
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-4 flex items-center space-x-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search invoices..."
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    className="pl-8"
                                />
                            </div>
                            <Button variant="outline">
                                <Download className="mr-2 h-4 w-4" />
                                Export
                            </Button>
                        </div>

                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Invoice #</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Issue Date</TableHead>
                                    <TableHead>Due Date</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredInvoices.map((invoice) => (
                                    <TableRow key={invoice.id}>
                                        <TableCell className="font-medium">
                                            {invoice.id}
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <div className="font-medium">
                                                    {invoice.agentName}
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    {invoice.agentEmail}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            ${invoice.amount.toLocaleString()}
                                        </TableCell>
                                        <TableCell>
                                            {invoice.issueDate}
                                        </TableCell>
                                        <TableCell>{invoice.dueDate}</TableCell>
                                        <TableCell>
                                            <Badge
                                                className={getStatusColor(
                                                    invoice.status,
                                                )}
                                            >
                                                {invoice.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex space-x-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                >
                                                    <Mail className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                >
                                                    <Download className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </Layout>
    );
};

export default Invoices;
