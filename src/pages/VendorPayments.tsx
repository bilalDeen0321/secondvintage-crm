import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import Layout from '../components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../components/ui/alert-dialog';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Calendar } from '../components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Plus, Search, Download, Edit, Trash2, CalendarIcon, X, SquareArrowRight, ArrowUp, ArrowDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';
import CurrencyDisplay from '../components/CurrencyDisplay';
import AddWatchToPaymentDialog from '../components/AddWatchToPaymentDialog';
import { useToast } from '../hooks/use-toast';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis } from '../components/ui/pagination';

interface AgentBalance {
  id: string;
  name: string;
  location: string;
  balance: number;
  currency: string;
  localCurrency: string;
  exchangeRate: number;
}

interface Payment {
  id: string;
  seller: string;
  agent: string;
  quantity: number;
  description: string;
  amount: number;
  status: 'Unpaid' | 'Paid (not received)' | 'Paid (received)' | 'Refunded';
  currency: string;
  agentId: string;
  date: string;
  paymentMethod: 'Bank Transfer' | 'Cash' | 'PayPal' | 'Wise' | 'Other';
  createdBy: string;
  createdDate: string;
  documentation?: File[];
}

interface PaymentItem {
  id: string;
  image: string;
  name: string;
  sku?: string;
  brand: string;
  status: 'Unpaid' | 'Paid (not received)' | 'Paid (received)' | 'Refunded';
  seller: string;
  notes: string;
  price: number;
}

interface Deposit {
  id: string;
  agent: string;
  agentId: string;
  amount: number;
  currency: string;
  date: string;
  paymentMethod: 'Bank Transfer' | 'Cash' | 'PayPal' | 'Wise' | 'Other';
  description: string;
  status: 'Completed' | 'Processing' | 'Pending';
  createdBy: string;
  createdDate: string;
}

const VendorPayments = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sellerFilter, setSellerFilter] = useState('all');
  const [agentFilter, setAgentFilter] = useState('all');
  const [selectedAgent, setSelectedAgent] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState<Date>();
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentDescription, setPaymentDescription] = useState('');
  const [depositDescription, setDepositDescription] = useState('');
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isNewPaymentDialogOpen, setIsNewPaymentDialogOpen] = useState(false);
  const [isNewDepositDialogOpen, setIsNewDepositDialogOpen] = useState(false);
  const [documentationFiles, setDocumentationFiles] = useState<File[]>([]);
  const [isAddWatchDialogOpen, setIsAddWatchDialogOpen] = useState(false);
  const [isAddWatchToEditDialogOpen, setIsAddWatchToEditDialogOpen] = useState(false);
  const [selectedPaymentForDraft, setSelectedPaymentForDraft] = useState<Payment | null>(null);
  
  // Payment table sorting
  const [paymentSortField, setPaymentSortField] = useState<keyof Payment>('date');
  const [paymentSortDirection, setPaymentSortDirection] = useState<'asc' | 'desc'>('desc');
  
  // Payment items sorting for edit dialog
  const [paymentItemsSortField, setPaymentItemsSortField] = useState<keyof PaymentItem>('name');
  const [paymentItemsSortDirection, setPaymentItemsSortDirection] = useState<'asc' | 'desc'>('asc');

  // Pagination state for payments
  const [paymentCurrentPage, setPaymentCurrentPage] = useState(1);
  const [paymentPageSize, setPaymentPageSize] = useState(10);

  // Pagination state for deposits
  const [depositCurrentPage, setDepositCurrentPage] = useState(1);
  const [depositPageSize, setDepositPageSize] = useState(10);

  // Sample payment items for the list - but start empty for new payments
  const [paymentItems, setPaymentItems] = useState<PaymentItem[]>([]);

  const [agentBalances] = useState<AgentBalance[]>([
    {
      id: 'AG001',
      name: 'Andy',
      location: 'Vietnam',
      balance: 45000,
      currency: 'USD',
      localCurrency: 'VND',
      exchangeRate: 24000
    },
    {
      id: 'AG002',
      name: 'Akira',
      location: 'Japan',
      balance: 32500,
      currency: 'USD',
      localCurrency: 'JPY',
      exchangeRate: 150
    },
    {
      id: 'AG003',
      name: 'Marco',
      location: 'Italy',
      balance: 18750,
      currency: 'EUR',
      localCurrency: 'EUR',
      exchangeRate: 1
    },
    {
      id: 'AG004',
      name: 'Sophie',
      location: 'France',
      balance: 28000,
      currency: 'EUR',
      localCurrency: 'EUR',
      exchangeRate: 1
    }
  ]);

  const [deposits] = useState<Deposit[]>([
    {
      id: 'DEP-001',
      agent: 'Andy (Vietnam)',
      agentId: 'AG001',
      amount: 25000,
      currency: 'USD',
      date: '2024-02-05',
      paymentMethod: 'Bank Transfer',
      description: 'Monthly agent deposit',
      status: 'Completed',
      createdBy: 'Admin',
      createdDate: '2024-02-05'
    },
    {
      id: 'DEP-002',
      agent: 'Marco (Italy)',
      agentId: 'AG003',
      amount: 15000,
      currency: 'EUR',
      date: '2024-02-03',
      paymentMethod: 'Wise',
      description: 'Weekly sales deposit',
      status: 'Completed',
      createdBy: 'Admin',
      createdDate: '2024-02-03'
    },
    {
      id: 'DEP-003',
      agent: 'Sophie (France)',
      agentId: 'AG004',
      amount: 8500,
      currency: 'EUR',
      date: '2024-02-01',
      paymentMethod: 'PayPal',
      description: 'Emergency fund deposit',
      status: 'Processing',
      createdBy: 'Admin',
      createdDate: '2024-02-01'
    }
  ]);

  const [payments, setPayments] = useState<Payment[]>([
    {
      id: 'PAY-001',
      seller: 'WatchCorp Ltd',
      agent: 'Andy (Vietnam)',
      agentId: 'AG001',
      quantity: 3,
      description: 'Vintage Rolex collection - Submariner, GMT, Daytona',
      amount: 45000,
      status: 'Paid (received)',
      currency: 'USD',
      date: '2024-01-15',
      paymentMethod: 'Wise',
      createdBy: 'Admin',
      createdDate: '2024-01-15'
    },
    {
      id: 'PAY-002',
      seller: 'TimeKeepers Inc',
      agent: 'Akira (Japan)',
      agentId: 'AG002',
      quantity: 2,
      description: 'Seiko Grand Seiko Limited Edition, Citizen Eco-Drive',
      amount: 12000,
      status: 'Paid (not received)',
      currency: 'USD',
      date: '2024-01-20',
      paymentMethod: 'Bank Transfer',
      createdBy: 'Admin',
      createdDate: '2024-01-20'
    },
    {
      id: 'PAY-003',
      seller: 'European Watches',
      agent: 'Marco (Italy)',
      agentId: 'AG003',
      quantity: 1,
      description: 'Panerai Luminor Marina',
      amount: 5000,
      status: 'Unpaid',
      currency: 'EUR',
      date: '2024-01-25',
      paymentMethod: 'PayPal',
      createdBy: 'Admin',
      createdDate: '2024-01-25'
    },
    {
      id: 'PAY-004',
      seller: 'Luxury Timepieces',
      agent: 'Sophie (France)',
      agentId: 'AG004',
      quantity: 4,
      description: 'Cartier collection - Tank, Santos, Ballon Bleu, Calibre',
      amount: 20000,
      status: 'Refunded',
      currency: 'EUR',
      date: '2024-01-10',
      paymentMethod: 'Wise',
      createdBy: 'Admin',
      createdDate: '2024-01-10'
    },
    {
      id: 'PAY-005',
      seller: 'WatchCorp Ltd',
      agent: 'Andy (Vietnam)',
      agentId: 'AG001',
      quantity: 2,
      description: 'Omega Speedmaster Professional, Seamaster Planet Ocean',
      amount: 18000,
      status: 'Paid (received)',
      currency: 'USD',
      date: '2024-02-01',
      paymentMethod: 'Bank Transfer',
      createdBy: 'Admin',
      createdDate: '2024-02-01'
    },
    {
      id: 'FEE-001',
      seller: 'Platform Fee',
      agent: 'Andy (Vietnam)',
      agentId: 'AG001',
      quantity: 1,
      description: 'Monthly platform usage fee',
      amount: 500,
      status: 'Paid (received)',
      currency: 'USD',
      date: '2024-01-30',
      paymentMethod: 'Bank Transfer',
      createdBy: 'Admin',
      createdDate: '2024-01-30'
    },
    {
      id: 'WM-001',
      seller: 'Master Watchmaker',
      agent: 'Marco (Italy)',
      agentId: 'AG003',
      quantity: 1,
      description: 'Rolex service and restoration work',
      amount: 800,
      status: 'Paid (not received)',
      currency: 'EUR',
      date: '2024-01-28',
      paymentMethod: 'PayPal',
      createdBy: 'Admin',
      createdDate: '2024-01-28'
    },
    {
      id: 'SHIP-001',
      seller: 'Global Shipping Co',
      agent: 'Akira (Japan)',
      agentId: 'AG002',
      quantity: 1,
      description: 'International watch shipment to collector',
      amount: 250,
      status: 'Paid (received)',
      currency: 'USD',
      date: '2024-01-26',
      paymentMethod: 'Wise',
      createdBy: 'Admin',
      createdDate: '2024-01-26'
    },
    {
      id: 'BONUS-001',
      seller: 'Performance Bonus',
      agent: 'Sophie (France)',
      agentId: 'AG004',
      quantity: 1,
      description: 'Q4 sales performance bonus',
      amount: 2500,
      status: 'Unpaid',
      currency: 'EUR',
      date: '2024-01-31',
      paymentMethod: 'Bank Transfer',
      createdBy: 'Admin',
      createdDate: '2024-01-31'
    },
    {
      id: 'OTHER-001',
      seller: 'Marketing Services',
      agent: 'Andy (Vietnam)',
      agentId: 'AG001',
      quantity: 1,
      description: 'Social media promotion campaign',
      amount: 300,
      status: 'Paid (received)',
      currency: 'USD',
      date: '2024-01-22',
      paymentMethod: 'PayPal',
      createdBy: 'Admin',
      createdDate: '2024-01-22'
    },
    {
      id: 'FEE-002',
      seller: 'Authentication Fee',
      agent: 'Marco (Italy)',
      agentId: 'AG003',
      quantity: 1,
      description: 'Watch authentication service fee',
      amount: 150,
      status: 'Paid (received)',
      currency: 'EUR',
      date: '2024-01-18',
      paymentMethod: 'Bank Transfer',
      createdBy: 'Admin',
      createdDate: '2024-01-18'
    },
    {
      id: 'WM-002',
      seller: 'Vintage Restoration',
      agent: 'Akira (Japan)',
      agentId: 'AG002',
      quantity: 1,
      description: 'Vintage Seiko movement restoration',
      amount: 450,
      status: 'Unpaid',
      currency: 'USD',
      date: '2024-01-24',
      paymentMethod: 'Cash',
      createdBy: 'Admin',
      createdDate: '2024-01-24'
    }
  ]);

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.agent.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.seller.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    const matchesSeller = sellerFilter === 'all' || payment.seller === sellerFilter;
    const matchesAgent = agentFilter === 'all' || payment.agent === agentFilter;
    return matchesSearch && matchesStatus && matchesSeller && matchesAgent;
  });

  // Sort payments
  const sortedPayments = [...filteredPayments].sort((a, b) => {
    const aValue = a[paymentSortField];
    const bValue = b[paymentSortField];
    
    let comparison = 0;
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      comparison = aValue.localeCompare(bValue);
    } else if (typeof aValue === 'number' && typeof bValue === 'number') {
      comparison = aValue - bValue;
    } else {
      comparison = String(aValue).localeCompare(String(bValue));
    }
    
    return paymentSortDirection === 'asc' ? comparison : -comparison;
  });

  // Paginate payments
  const paymentTotalPages = Math.ceil(sortedPayments.length / paymentPageSize);
  const paginatedPayments = sortedPayments.slice(
    (paymentCurrentPage - 1) * paymentPageSize,
    paymentCurrentPage * paymentPageSize
  );

  // Paginate deposits
  const depositTotalPages = Math.ceil(deposits.length / depositPageSize);
  const paginatedDeposits = deposits.slice(
    (depositCurrentPage - 1) * depositPageSize,
    depositCurrentPage * depositPageSize
  );

  // Sort payment items
  const sortedPaymentItems = [...paymentItems].sort((a, b) => {
    const aValue = a[paymentItemsSortField];
    const bValue = b[paymentItemsSortField];
    
    let comparison = 0;
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      comparison = aValue.localeCompare(bValue);
    } else if (typeof aValue === 'number' && typeof bValue === 'number') {
      comparison = aValue - bValue;
    } else {
      comparison = String(aValue).localeCompare(String(bValue));
    }
    
    return paymentItemsSortDirection === 'asc' ? comparison : -comparison;
  });

  const handlePaymentSort = (field: keyof Payment) => {
    if (paymentSortField === field) {
      setPaymentSortDirection(paymentSortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setPaymentSortField(field);
      setPaymentSortDirection('asc');
    }
  };

  const getPaymentSortIcon = (field: keyof Payment) => {
    if (paymentSortField !== field) {
      return null;
    }
    return paymentSortDirection === 'asc' 
      ? <ArrowUp className="h-4 w-4 ml-2" />
      : <ArrowDown className="h-4 w-4 ml-2" />;
  };

  const handlePaymentItemsSort = (field: keyof PaymentItem) => {
    if (paymentItemsSortField === field) {
      setPaymentItemsSortDirection(paymentItemsSortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setPaymentItemsSortField(field);
      setPaymentItemsSortDirection('asc');
    }
  };

  const getPaymentItemsSortIcon = (field: keyof PaymentItem) => {
    if (paymentItemsSortField !== field) {
      return null;
    }
    return paymentItemsSortDirection === 'asc' 
      ? <ArrowUp className="h-4 w-4 ml-2" />
      : <ArrowDown className="h-4 w-4 ml-2" />;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid (received)': return 'bg-green-100 text-green-800';
      case 'Paid (not received)': return 'bg-yellow-100 text-yellow-800';
      case 'Unpaid': return 'bg-red-100 text-red-800';
      case 'Refunded': return 'bg-gray-100 text-gray-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Processing': return 'bg-blue-100 text-blue-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentType = (paymentId: string) => {
    if (paymentId.startsWith('PAY-')) return 'Watches';
    if (paymentId.startsWith('FEE-')) return 'Fee';
    if (paymentId.startsWith('WM-')) return 'Watchmaker';
    if (paymentId.startsWith('SHIP-')) return 'Shipping';
    if (paymentId.startsWith('BONUS-')) return 'Bonus';
    if (paymentId.startsWith('OTHER-')) return 'Other';
    return 'Other';
  };

  const getSelectedAgentData = () => {
    return agentBalances.find(agent => agent.id === selectedAgent);
  };

  const calculateLocalCurrency = (euroAmount: number, agent: AgentBalance) => {
    if (agent.localCurrency === 'EUR') return euroAmount;
    const usdAmount = euroAmount * 1.1;
    if (agent.localCurrency === 'VND') return usdAmount * agent.exchangeRate;
    if (agent.localCurrency === 'JPY') return usdAmount * agent.exchangeRate;
    return euroAmount;
  };

  const getLocalCurrencySymbol = (currency: string) => {
    switch (currency) {
      case 'VND': return '₫';
      case 'JPY': return '¥';
      case 'EUR': return '€';
      case 'USD': return '$';
      default: return '';
    }
  };

  const convertToVND = (euroPrice: number) => {
    return euroPrice * 26500;
  };

  const calculateTotalAmount = () => {
    return paymentItems.reduce((sum, item) => sum + item.price, 0);
  };

  // Update payment amount when payment items change
  useEffect(() => {
    const total = calculateTotalAmount();
    setPaymentAmount(total.toString());
  }, [paymentItems]);

  const handleEditPayment = (payment: Payment) => {
    setEditingPayment(payment);
    setSelectedAgent(payment.agentId);
    setPaymentDate(new Date(payment.date));
    setPaymentMethod(payment.paymentMethod);
    setPaymentDescription(payment.description);
    
    const sampleItems: PaymentItem[] = [
      {
        id: `item-${payment.id}-1`,
        image: '/lovable-uploads/0464203d-f5d6-4f95-8d96-7ac6a8a62fba.png',
        name: 'Rolex Submariner',
        sku: 'ROL-SUB-001',
        brand: 'Rolex',
        status: payment.status,
        seller: payment.seller,
        notes: 'Excellent condition vintage piece',
        price: Math.floor(payment.amount * 0.6)
      },
      {
        id: `item-${payment.id}-2`,
        image: '/lovable-uploads/1f4e1ffe-7868-4e62-bbbe-9b6aba3835d7.png',
        name: 'Omega Speedmaster',
        sku: 'OME-SPE-001',
        brand: 'Omega',
        status: payment.status,
        seller: payment.seller,
        notes: 'Classic moonwatch',
        price: Math.floor(payment.amount * 0.4)
      }
    ];
    
    setPaymentItems(sampleItems);
    setIsEditDialogOpen(true);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter(file => 
      file.type === 'application/pdf' || 
      file.type.startsWith('image/')
    );
    setDocumentationFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setDocumentationFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddWatchesToPayment = (watches: PaymentItem[]) => {
    setPaymentItems(prev => [...prev, ...watches]);
  };

  const handleRemovePaymentItem = (itemId: string) => {
    setPaymentItems(prev => prev.filter(item => item.id !== itemId));
  };

  const handlePaymentItemStatusChange = (itemId: string, newStatus: 'Unpaid' | 'Paid (not received)' | 'Paid (received)' | 'Refunded') => {
    setPaymentItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, status: newStatus } : item
    ));
  };

  const openFile = (file: File) => {
    const url = URL.createObjectURL(file);
    window.open(url, '_blank');
  };

  const uniqueSellers = [...new Set(payments.map(payment => payment.seller))];
  const uniqueAgents = [...new Set(payments.map(payment => payment.agent))];

  const handleSendToDraft = (payment: Payment) => {
    console.log('Sending payment to draft:', payment.id);
    setSelectedPaymentForDraft(null);
  };

  const resetForm = () => {
    setSelectedAgent('');
    setPaymentAmount('');
    setPaymentDate(undefined);
    setPaymentMethod('');
    setPaymentDescription('');
    setDepositDescription('');
    setDocumentationFiles([]);
    setPaymentItems([]);
  };

  const handleCreatePayment = () => {
    if (!selectedAgent || !paymentDate || !paymentMethod) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const selectedAgentData = agentBalances.find(agent => agent.id === selectedAgent);
    if (!selectedAgentData) return;

    const newPayment: Payment = {
      id: `PAY-${String(payments.length + 1).padStart(3, '0')}`,
      seller: paymentItems.length > 0 ? paymentItems[0].seller : 'Unknown Seller',
      agent: `${selectedAgentData.name} (${selectedAgentData.location})`,
      agentId: selectedAgent,
      quantity: paymentItems.length,
      description: paymentDescription || `Payment for ${paymentItems.length} items`,
      amount: calculateTotalAmount(),
      status: 'Unpaid',
      currency: 'EUR',
      date: format(paymentDate, 'yyyy-MM-dd'),
      paymentMethod: paymentMethod as 'Bank Transfer' | 'Cash' | 'PayPal' | 'Wise' | 'Other',
      createdBy: 'Admin',
      createdDate: format(new Date(), 'yyyy-MM-dd'),
      documentation: documentationFiles
    };

    setPayments(prev => [...prev, newPayment]);
    setIsNewPaymentDialogOpen(false);
    resetForm();
    
    toast({
      title: "Payment Created",
      description: `Payment ${newPayment.id} has been created successfully`
    });
  };

  const handleUpdatePayment = () => {
    if (!editingPayment || !selectedAgent || !paymentDate || !paymentMethod) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const selectedAgentData = agentBalances.find(agent => agent.id === selectedAgent);
    if (!selectedAgentData) return;

    const updatedPayment: Payment = {
      ...editingPayment,
      agent: `${selectedAgentData.name} (${selectedAgentData.location})`,
      agentId: selectedAgent,
      quantity: paymentItems.length,
      description: paymentDescription,
      amount: calculateTotalAmount(),
      date: format(paymentDate, 'yyyy-MM-dd'),
      paymentMethod: paymentMethod as 'Bank Transfer' | 'Cash' | 'PayPal' | 'Wise' | 'Other',
      documentation: documentationFiles
    };

    setPayments(prev => prev.map(payment => 
      payment.id === editingPayment.id ? updatedPayment : payment
    ));

    setIsEditDialogOpen(false);
    setEditingPayment(null);
    resetForm();
    
    toast({
      title: "Payment Updated",
      description: `Payment ${updatedPayment.id} has been updated successfully`
    });
  };

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Agent Balance</h1>
            <p className="text-muted-foreground">Manage agent payments and balances</p>
          </div>
          <div className="flex space-x-2">
            <Dialog open={isNewDepositDialogOpen} onOpenChange={setIsNewDepositDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  New Deposit
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New Deposit</DialogTitle>
                  <DialogDescription>Record a new deposit from an agent.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="agent" className="text-right">Agent</Label>
                    <Select value={selectedAgent} onValueChange={setSelectedAgent}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select an agent" />
                      </SelectTrigger>
                      <SelectContent>
                        {agentBalances.map((agent) => (
                          <SelectItem key={agent.id} value={agent.id}>
                            {agent.name} ({agent.location})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="amount" className="text-right">Amount</Label>
                    <div className="col-span-3">
                      <Input 
                        id="amount" 
                        type="number" 
                        value={paymentAmount}
                        onChange={(e) => setPaymentAmount(e.target.value)}
                        placeholder="Enter amount in EUR"
                      />
                      {selectedAgent && paymentAmount && (
                        <div className="mt-2 text-sm text-slate-600">
                          <div>€{Number(paymentAmount).toLocaleString()}</div>
                          {(() => {
                            const agent = getSelectedAgentData();
                            if (agent && agent.localCurrency !== 'EUR') {
                              const localAmount = calculateLocalCurrency(Number(paymentAmount), agent);
                              return (
                                <div>
                                  {getLocalCurrencySymbol(agent.localCurrency)}{localAmount.toLocaleString()}
                                </div>
                              );
                            }
                            return null;
                          })()}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="date" className="text-right">Date</Label>
                    <div className="col-span-3">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !paymentDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {paymentDate ? format(paymentDate, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={paymentDate}
                            onSelect={setPaymentDate}
                            initialFocus
                            className={cn("p-3 pointer-events-auto")}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="paymentMethod" className="text-right">Payment Method</Label>
                    <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                        <SelectItem value="Cash">Cash</SelectItem>
                        <SelectItem value="PayPal">PayPal</SelectItem>
                        <SelectItem value="Wise">Wise</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="depositDescription" className="text-right">Deposit description</Label>
                    <Input 
                      id="depositDescription" 
                      className="col-span-3" 
                      value={depositDescription}
                      onChange={(e) => setDepositDescription(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="documentation" className="text-right">Documentation</Label>
                    <div className="col-span-3">
                      <Input 
                        id="documentation" 
                        type="file"
                        multiple
                        accept=".pdf,.png,.jpg,.jpeg"
                        onChange={handleFileUpload}
                        className="cursor-pointer"
                      />
                      {documentationFiles.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {documentationFiles.map((file, index) => (
                            <div key={index} className="flex items-center justify-between text-xs bg-gray-50 p-2 rounded">
                              <button 
                                className="text-blue-600 hover:underline cursor-pointer"
                                onClick={() => openFile(file)}
                              >
                                {file.name}
                              </button>
                              <Button 
                                type="button" 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => removeFile(index)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-xs text-slate-500">
                    Created by Admin on {format(new Date(), 'MMM dd, yyyy')}
                  </div>
                  <DialogFooter>
                    <Button type="submit">Create Deposit</Button>
                  </DialogFooter>
                </div>
              </DialogContent>
            </Dialog>
            <Dialog open={isNewPaymentDialogOpen} onOpenChange={setIsNewPaymentDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New Payment
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New Payment</DialogTitle>
                  <DialogDescription>Record a new payment to an agent.</DialogDescription>
                </DialogHeader>
                <div className="space-y-6">
                  <div className="grid gap-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="agent" className="text-right">Agent</Label>
                      <Select value={selectedAgent} onValueChange={setSelectedAgent}>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select an agent" />
                        </SelectTrigger>
                        <SelectContent>
                          {agentBalances.map((agent) => (
                            <SelectItem key={agent.id} value={agent.id}>
                              {agent.name} ({agent.location})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    {selectedAgent && paymentItems.length > 0 && (
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Total Amount</Label>
                        <div className="col-span-3">
                          <div className="text-sm text-slate-600">
                            <div className="font-medium">€{calculateTotalAmount().toLocaleString()}</div>
                            {(() => {
                              const agent = getSelectedAgentData();
                              if (agent && agent.localCurrency !== 'EUR') {
                                const localAmount = calculateLocalCurrency(calculateTotalAmount(), agent);
                                return (
                                  <div>
                                    {getLocalCurrencySymbol(agent.localCurrency)}{localAmount.toLocaleString()}
                                  </div>
                                );
                              }
                              return null;
                            })()}
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="date" className="text-right">Date</Label>
                      <div className="col-span-3">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !paymentDate && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {paymentDate ? format(paymentDate, "PPP") : <span>Pick a date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={paymentDate}
                              onSelect={setPaymentDate}
                              initialFocus
                              className={cn("p-3 pointer-events-auto")}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="paymentMethod" className="text-right">Payment Method</Label>
                      <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                          <SelectItem value="Cash">Cash</SelectItem>
                          <SelectItem value="PayPal">PayPal</SelectItem>
                          <SelectItem value="Wise">Wise</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="paymentDescription" className="text-right">Payment description</Label>
                      <Input 
                        id="paymentDescription" 
                        className="col-span-3" 
                        value={paymentDescription}
                        onChange={(e) => setPaymentDescription(e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="documentation" className="text-right">Documentation</Label>
                      <div className="col-span-3">
                        <Input 
                          id="documentation" 
                          type="file"
                          multiple
                          accept=".pdf,.png,.jpg,.jpeg"
                          onChange={handleFileUpload}
                          className="cursor-pointer"
                        />
                        {documentationFiles.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {documentationFiles.map((file, index) => (
                              <div key={index} className="flex items-center justify-between text-xs bg-gray-50 p-2 rounded">
                                <button 
                                  className="text-blue-600 hover:underline cursor-pointer"
                                  onClick={() => openFile(file)}
                                >
                                  {file.name}
                                </button>
                                <Button 
                                  type="button" 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => removeFile(index)}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">Payment Items</h3>
                      <Button 
                        variant="outline" 
                        onClick={() => setIsAddWatchDialogOpen(true)}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Watch to Payment
                      </Button>
                    </div>
                    <div className="border rounded-lg">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-16">Image</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>SKU</TableHead>
                            <TableHead>Brand</TableHead>
                            <TableHead>Seller</TableHead>
                            <TableHead>Notes</TableHead>
                            <TableHead className="text-right">Price</TableHead>
                            <TableHead>Payment Status</TableHead>
                            <TableHead className="w-16">Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {paymentItems.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell>
                                <img 
                                  src={item.image} 
                                  alt={item.name}
                                  className="w-12 h-12 object-cover rounded-md aspect-square"
                                />
                              </TableCell>
                              <TableCell className="font-medium">{item.name}</TableCell>
                              <TableCell>{item.sku || '-'}</TableCell>
                              <TableCell>{item.brand}</TableCell>
                              <TableCell>{item.seller}</TableCell>
                              <TableCell className="max-w-xs truncate" title={item.notes}>
                                {item.notes}
                              </TableCell>
                              <TableCell className="text-right">
                                <div>
                                  <div>€{item.price.toLocaleString()}</div>
                                  <div className="text-xs text-muted-foreground">
                                    ₫{convertToVND(item.price).toLocaleString()}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant={item.status === 'Paid (received)' ? 'default' : 'secondary'}>
                                  {item.status}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Button 
                                  size="sm" 
                                  variant="ghost"
                                  onClick={() => handleRemovePaymentItem(item.id)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-xs text-slate-500">
                    Created by Admin on {format(new Date(), 'MMM dd, yyyy')}
                  </div>
                  <DialogFooter>
                    <Button type="button" onClick={handleCreatePayment}>Create Payment</Button>
                  </DialogFooter>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Agent Balances - Compact Version */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Agent Balances</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {agentBalances.map((agent) => (
                <Card key={agent.id} className="relative">
                  <CardHeader className="pb-2 pt-3">
                    <CardTitle className="text-base">{agent.name}</CardTitle>
                    <CardDescription className="text-xs">({agent.location})</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0 pb-3">
                    <div className="text-lg font-bold">
                      {agent.currency === 'USD' ? '$' : '€'}{agent.balance.toLocaleString()}
                    </div>
                    {agent.localCurrency !== agent.currency && (
                      <div className="text-sm text-slate-600">
                        {getLocalCurrencySymbol(agent.localCurrency)}{calculateLocalCurrency(agent.balance, agent).toLocaleString()}
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground">Current balance</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tabs for Payment History and Deposit History */}
        <Tabs defaultValue="payments" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="payments">Payment History</TabsTrigger>
            <TabsTrigger value="deposits">Deposit History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="payments">
            <Card>
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
                <CardDescription>All agent payment records</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search records..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                  <Select value={sellerFilter} onValueChange={setSellerFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Seller" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sellers</SelectItem>
                      {uniqueSellers.map((seller) => (
                        <SelectItem key={seller} value={seller}>
                          {seller}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={agentFilter} onValueChange={setAgentFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Agent" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Agents</SelectItem>
                      {uniqueAgents.map((agent) => (
                        <SelectItem key={agent} value={agent}>
                          {agent}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="Unpaid">Unpaid</SelectItem>
                      <SelectItem value="Paid (not received)">Paid (not received)</SelectItem>
                      <SelectItem value="Paid (received)">Paid (received)</SelectItem>
                      <SelectItem value="Refunded">Refunded</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={paymentPageSize.toString()} onValueChange={(value) => setPaymentPageSize(Number(value))}>
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead 
                        className="cursor-pointer hover:bg-muted/50 select-none"
                        onClick={() => handlePaymentSort('id')}
                      >
                        <div className="flex items-center">
                          ID
                          {getPaymentSortIcon('id')}
                        </div>
                      </TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-muted/50 select-none"
                        onClick={() => handlePaymentSort('seller')}
                      >
                        <div className="flex items-center">
                          Seller
                          {getPaymentSortIcon('seller')}
                        </div>
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-muted/50 select-none"
                        onClick={() => handlePaymentSort('agent')}
                      >
                        <div className="flex items-center">
                          Agent
                          {getPaymentSortIcon('agent')}
                        </div>
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-muted/50 select-none"
                        onClick={() => handlePaymentSort('date')}
                      >
                        <div className="flex items-center">
                          Date
                          {getPaymentSortIcon('date')}
                        </div>
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-muted/50 select-none"
                        onClick={() => handlePaymentSort('quantity')}
                      >
                        <div className="flex items-center">
                          Quantity
                          {getPaymentSortIcon('quantity')}
                        </div>
                      </TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-muted/50 select-none"
                        onClick={() => handlePaymentSort('amount')}
                      >
                        <div className="flex items-center">
                          Amount
                          {getPaymentSortIcon('amount')}
                        </div>
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-muted/50 select-none"
                        onClick={() => handlePaymentSort('paymentMethod')}
                      >
                        <div className="flex items-center">
                          Payment Method
                          {getPaymentSortIcon('paymentMethod')}
                        </div>
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-muted/50 select-none"
                        onClick={() => handlePaymentSort('status')}
                      >
                        <div className="flex items-center">
                          Payment Status
                          {getPaymentSortIcon('status')}
                        </div>
                      </TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedPayments.map((payment) => {
                      const agent = agentBalances.find(a => a.id === payment.agentId);
                      return (
                        <TableRow key={payment.id}>
                          <TableCell className="font-medium">{payment.id}</TableCell>
                          <TableCell>{getPaymentType(payment.id)}</TableCell>
                          <TableCell>{payment.seller}</TableCell>
                          <TableCell>{payment.agent}</TableCell>
                          <TableCell>{format(new Date(payment.date), 'MMM dd, yyyy')}</TableCell>
                          <TableCell>{payment.quantity}</TableCell>
                          <TableCell className="max-w-xs truncate" title={payment.description}>
                            {payment.description}
                          </TableCell>
                          <TableCell>
                            <div>
                              <div>€{payment.amount.toLocaleString()}</div>
                              {agent && agent.localCurrency !== 'EUR' && (
                                <div className="text-xs text-slate-600">
                                  {getLocalCurrencySymbol(agent.localCurrency)}{calculateLocalCurrency(payment.amount, agent).toLocaleString()}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{payment.paymentMethod}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(payment.status)}>
                              {payment.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleEditPayment(payment)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    className="text-green-600 hover:text-green-700"
                                  >
                                    <SquareArrowRight className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Ready for draft?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to send these watches to draft?
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleSendToDraft(payment)}>
                                      Yes
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>

                {/* Payment Pagination */}
                <div className="flex items-center justify-between space-x-2 py-4">
                  <div className="text-sm text-muted-foreground">
                    Showing {Math.min((paymentCurrentPage - 1) * paymentPageSize + 1, sortedPayments.length)} to {Math.min(paymentCurrentPage * paymentPageSize, sortedPayments.length)} of {sortedPayments.length} entries
                  </div>
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => setPaymentCurrentPage(Math.max(1, paymentCurrentPage - 1))}
                          className={paymentCurrentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                      {Array.from({ length: Math.min(5, paymentTotalPages) }, (_, i) => {
                        const page = Math.max(1, Math.min(paymentTotalPages - 4, paymentCurrentPage - 2)) + i;
                        if (page > paymentTotalPages) return null;
                        return (
                          <PaginationItem key={page}>
                            <PaginationLink
                              onClick={() => setPaymentCurrentPage(page)}
                              isActive={paymentCurrentPage === page}
                              className="cursor-pointer"
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      })}
                      {paymentTotalPages > 5 && paymentCurrentPage < paymentTotalPages - 2 && (
                        <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>
                      )}
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => setPaymentCurrentPage(Math.min(paymentTotalPages, paymentCurrentPage + 1))}
                          className={paymentCurrentPage === paymentTotalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="deposits">
            <Card>
              <CardHeader>
                <CardTitle>Deposit History</CardTitle>
                <CardDescription>All agent deposits</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Select value={depositPageSize.toString()} onValueChange={(value) => setDepositPageSize(Number(value))}>
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Agent</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Payment Method</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedDeposits.map((deposit) => {
                      const agent = agentBalances.find(a => a.id === deposit.agentId);
                      return (
                        <TableRow key={deposit.id}>
                          <TableCell className="font-medium">{deposit.id}</TableCell>
                          <TableCell>{deposit.agent}</TableCell>
                          <TableCell>{format(new Date(deposit.date), 'MMM dd, yyyy')}</TableCell>
                          <TableCell>
                            <div>
                              <div>{deposit.currency === 'USD' ? '$' : '€'}{deposit.amount.toLocaleString()}</div>
                              {agent && agent.localCurrency !== deposit.currency && (
                                <div className="text-xs text-slate-600">
                                  {getLocalCurrencySymbol(agent.localCurrency)}{calculateLocalCurrency(deposit.amount, agent).toLocaleString()}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{deposit.paymentMethod}</TableCell>
                          <TableCell className="max-w-xs truncate" title={deposit.description}>
                            {deposit.description}
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(deposit.status)}>
                              {deposit.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>

                {/* Deposit Pagination */}
                <div className="flex items-center justify-between space-x-2 py-4">
                  <div className="text-sm text-muted-foreground">
                    Showing {Math.min((depositCurrentPage - 1) * depositPageSize + 1, deposits.length)} to {Math.min(depositCurrentPage * depositPageSize, deposits.length)} of {deposits.length} entries
                  </div>
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => setDepositCurrentPage(Math.max(1, depositCurrentPage - 1))}
                          className={depositCurrentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                      {Array.from({ length: Math.min(5, depositTotalPages) }, (_, i) => {
                        const page = Math.max(1, Math.min(depositTotalPages - 4, depositCurrentPage - 2)) + i;
                        if (page > depositTotalPages) return null;
                        return (
                          <PaginationItem key={page}>
                            <PaginationLink
                              onClick={() => setDepositCurrentPage(page)}
                              isActive={depositCurrentPage === page}
                              className="cursor-pointer"
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      })}
                      {depositTotalPages > 5 && depositCurrentPage < depositTotalPages - 2 && (
                        <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>
                      )}
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => setDepositCurrentPage(Math.min(depositTotalPages, depositCurrentPage + 1))}
                          className={depositCurrentPage === depositTotalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Payment</DialogTitle>
              <DialogDescription>Update payment details.</DialogDescription>
            </DialogHeader>
            {editingPayment && (
              <div className="space-y-6">
                <div className="grid gap-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="editAgent" className="text-right">Agent</Label>
                    <Select value={selectedAgent} onValueChange={setSelectedAgent}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select an agent" />
                      </SelectTrigger>
                      <SelectContent>
                        {agentBalances.map((agent) => (
                          <SelectItem key={agent.id} value={agent.id}>
                            {agent.name} ({agent.location})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {selectedAgent && paymentItems.length > 0 && (
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right">Total Amount</Label>
                      <div className="col-span-3">
                        <div className="text-sm text-slate-600">
                          <div className="font-medium">€{calculateTotalAmount().toLocaleString()}</div>
                          {(() => {
                            const agent = getSelectedAgentData();
                            if (agent && agent.localCurrency !== 'EUR') {
                              const localAmount = calculateLocalCurrency(calculateTotalAmount(), agent);
                              return (
                                <div>
                                  {getLocalCurrencySymbol(agent.localCurrency)}{localAmount.toLocaleString()}
                                </div>
                              );
                            }
                            return null;
                          })()}
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="editDate" className="text-right">Date</Label>
                    <div className="col-span-3">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !paymentDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {paymentDate ? format(paymentDate, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={paymentDate}
                            onSelect={setPaymentDate}
                            initialFocus
                            className={cn("p-3 pointer-events-auto")}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="editPaymentMethod" className="text-right">Payment Method</Label>
                    <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                        <SelectItem value="Cash">Cash</SelectItem>
                        <SelectItem value="PayPal">PayPal</SelectItem>
                        <SelectItem value="Wise">Wise</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="editDescription" className="text-right">Description</Label>
                    <Input 
                      id="editDescription" 
                      className="col-span-3" 
                      value={paymentDescription}
                      onChange={(e) => setPaymentDescription(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="editDocumentation" className="text-right">Documentation</Label>
                    <div className="col-span-3">
                      <Input 
                        id="editDocumentation" 
                        type="file"
                        multiple
                        accept=".pdf,.png,.jpg,.jpeg"
                        onChange={handleFileUpload}
                        className="cursor-pointer"
                      />
                      {documentationFiles.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {documentationFiles.map((file, index) => (
                            <div key={index} className="flex items-center justify-between text-xs bg-gray-50 p-2 rounded">
                              <button 
                                className="text-blue-600 hover:underline cursor-pointer"
                                onClick={() => openFile(file)}
                              >
                                {file.name}
                              </button>
                              <Button 
                                type="button" 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => removeFile(index)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Payment Items</h3>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsAddWatchToEditDialogOpen(true)}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Watch to Payment
                    </Button>
                  </div>
                  <div className="border rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-16">Image</TableHead>
                          <TableHead 
                            className="cursor-pointer hover:bg-muted/50 select-none"
                            onClick={() => handlePaymentItemsSort('name')}
                          >
                            <div className="flex items-center">
                              Name
                              {getPaymentItemsSortIcon('name')}
                            </div>
                          </TableHead>
                          <TableHead 
                            className="cursor-pointer hover:bg-muted/50 select-none"
                            onClick={() => handlePaymentItemsSort('sku')}
                          >
                            <div className="flex items-center">
                              SKU
                              {getPaymentItemsSortIcon('sku')}
                            </div>
                          </TableHead>
                          <TableHead 
                            className="cursor-pointer hover:bg-muted/50 select-none"
                            onClick={() => handlePaymentItemsSort('brand')}
                          >
                            <div className="flex items-center">
                              Brand
                              {getPaymentItemsSortIcon('brand')}
                            </div>
                          </TableHead>
                          <TableHead 
                            className="cursor-pointer hover:bg-muted/50 select-none"
                            onClick={() => handlePaymentItemsSort('seller')}
                          >
                            <div className="flex items-center">
                              Seller
                              {getPaymentItemsSortIcon('seller')}
                            </div>
                          </TableHead>
                          <TableHead>Notes</TableHead>
                          <TableHead 
                            className="text-right cursor-pointer hover:bg-muted/50 select-none"
                            onClick={() => handlePaymentItemsSort('price')}
                          >
                            <div className="flex items-center justify-end">
                              Price
                              {getPaymentItemsSortIcon('price')}
                            </div>
                          </TableHead>
                          <TableHead>Payment Status</TableHead>
                          <TableHead className="w-16">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sortedPaymentItems.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>
                              <img 
                                src={item.image} 
                                alt={item.name}
                                className="w-12 h-12 object-cover rounded-md aspect-square"
                              />
                            </TableCell>
                            <TableCell className="font-medium">{item.name}</TableCell>
                            <TableCell>{item.sku || '-'}</TableCell>
                            <TableCell>{item.brand}</TableCell>
                            <TableCell>{item.seller}</TableCell>
                            <TableCell className="max-w-xs truncate" title={item.notes}>
                              {item.notes}
                            </TableCell>
                            <TableCell className="text-right">
                              <div>
                                <div>€{item.price.toLocaleString()}</div>
                                <div className="text-xs text-muted-foreground">
                                  ₫{convertToVND(item.price).toLocaleString()}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Select 
                                value={item.status} 
                                onValueChange={(value: 'Unpaid' | 'Paid (not received)' | 'Paid (received)' | 'Refunded') => 
                                  handlePaymentItemStatusChange(item.id, value)
                                }
                              >
                                <SelectTrigger className="w-40">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-white z-50">
                                  <SelectItem value="Unpaid">Unpaid</SelectItem>
                                  <SelectItem value="Paid (not received)">Paid (not received)</SelectItem>
                                  <SelectItem value="Paid (received)">Paid (received)</SelectItem>
                                  <SelectItem value="Refunded">Refunded</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => handleRemovePaymentItem(item.id)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            )}
            <div className="flex justify-between items-center">
              <div className="text-xs text-slate-500">
                Created by {editingPayment?.createdBy} on {editingPayment && format(new Date(editingPayment.createdDate), 'MMM dd, yyyy')}
              </div>
              <DialogFooter>
                <Button type="button" onClick={handleUpdatePayment}>Update Payment</Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>

        <AddWatchToPaymentDialog
          open={isAddWatchDialogOpen}
          onOpenChange={setIsAddWatchDialogOpen}
          onAddWatches={handleAddWatchesToPayment}
          existingWatches={paymentItems}
        />

        <AddWatchToPaymentDialog
          open={isAddWatchToEditDialogOpen}
          onOpenChange={setIsAddWatchToEditDialogOpen}
          onAddWatches={handleAddWatchesToPayment}
          existingWatches={paymentItems}
        />
      </div>
    </Layout>
  );
};

export default VendorPayments;
