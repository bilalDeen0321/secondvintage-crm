import {
    Edit,
    Filter,
    Grid3X3,
    List,
    Plus,
    Search,
    Trash2,
} from "lucide-react";
import React, { useState,useEffect } from "react";
import axios from "axios";
import { usePage } from '@inertiajs/react';
import { Check } from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { router } from '@inertiajs/react'; 


import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
 
import Layout from "../components/Layout";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "../components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../components/ui/select";
import { useToast } from "@/components/ui/use-toast";

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "../components/ui/sheet";
import { useIsMobile } from "../hooks/use-mobile";

interface WishListItem {
    id: string;
    brand: string;
    model: string;
    description: string;
    price_range_min: number;
    price_range_max: number;
    priority: "High" | "Medium" | "Low";
    dateAdded: string;
    image?: string;
}

const WishList = () => {
    const isMobile = useIsMobile();
    // const [wishList, setWishList] = useState<WishListItem[]>([
    //     {
    //         id: "1",
    //         brand: "Rolex",
    //         model: "Submariner",
    //         description:
    //             "Black dial, ceramic bezel, steel bracelet. No date preferred.",
    //         price_range_min: 10000,
    //         price_range_max: 12000,
    //         priority: "High",
    //         dateAdded: "2024-01-15",
    //         image: "/lovable-uploads/c9668ac2-5bda-49b2-9679-1759280598e1.png",
    //     },
    //     {
    //         id: "2",
    //         brand: "Omega",
    //         model: "Speedmaster",
    //         description:
    //             "Moonwatch Professional. Manual wind, hesalite crystal.",
    //         price_range_min: 5500,
    //         price_range_max: 6500,
    //         priority: "Medium",
    //         dateAdded: "2024-01-20",
    //         image: "/lovable-uploads/8a246750-c18b-4b1c-b6af-25185e84d3d7.png",
    //     },
    //     {
    //         id: "3",
    //         brand: "Tudor",
    //         model: "Black Bay",
    //         description: "Blue dial variant. 39mm case size preferred.",
    //         price_range_min: 3200,
    //         price_range_max: 3800,
    //         priority: "Low",
    //         dateAdded: "2024-01-25",
    //         image: "/lovable-uploads/27ec6583-00c5-4c9f-bf57-429e50240830.png",
    //     },
    //     {
    //         id: "4",
    //         brand: "Patek Philippe",
    //         model: "Calatrava",
    //         description:
    //             "Classic dress watch with white gold case. Looking for ref. 5196.",
    //         price_range_min: 22000,
    //         price_range_max: 25000,
    //         priority: "High",
    //         dateAdded: "2024-01-30",
    //         image: "/lovable-uploads/cd305798-ab49-4a3b-9157-fb8db777bd8f.png",
    //     },
    //     {
    //         id: "5",
    //         brand: "Audemars Piguet",
    //         model: "Royal Oak",
    //         description: "Steel case with blue dial. 39mm or 41mm preferred.",
    //         price_range_min: 32000,
    //         price_range_max: 35000,
    //         priority: "High",
    //         dateAdded: "2024-02-05",
    //         image: "/lovable-uploads/c3abfafa-8986-4b30-bd89-3d163701cb64.png",
    //     },
    //     {
    //         id: "6",
    //         brand: "Cartier",
    //         model: "Santos",
    //         description:
    //             "Medium size in steel and gold. Square case classic design.",
    //         price_range_min: 7500,
    //         price_range_max: 8500,
    //         priority: "Medium",
    //         dateAdded: "2024-02-10",
    //         image: "/lovable-uploads/e42df4f6-4752-4442-9e7c-06e8184162be.png",
    //     },
    //     {
    //         id: "7",
    //         brand: "Vacheron Constantin",
    //         model: "Overseas",
    //         description:
    //             "Sports watch with integrated bracelet. Blue dial preferred.",
    //         price_range_min: 25000,
    //         price_range_max: 28000,
    //         priority: "Medium",
    //         dateAdded: "2024-02-15",
    //         image: "/lovable-uploads/5557d546-574f-45fb-bd5a-014ec53e5792.png",
    //     },
    // ]);
    const { toast } = useToast(); 
     const { props } = usePage();
    // Use props AFTER you have them
    const [wishList, setWishList] = useState<WishListItem[]>(props.wishlist);
   
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [searchTerm, setSearchTerm] = useState("");
    const [priorityFilter, setPriorityFilter] = useState<string>("all");
    const [budgetFilter, setBudgetFilter] = useState<string>("all");
    const [sortBy, setSortBy] = useState<string>("dateAdded");
    const [showFilters, setShowFilters] = useState(false);
 
    const filteredWishList = wishList
        .filter((item) => {
            const matchesSearch =
                (item.brand ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                item?.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item?.description
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase());

            const matchesPriority =
                priorityFilter === "all" || item.priority === priorityFilter;

            let matchesBudget = true;
            if (budgetFilter !== "all") {
                switch (budgetFilter) {
                    case "under5k":
                        matchesBudget = item.price_range_max < 5000;
                        break;
                    case "5k-15k":
                        matchesBudget =
                            item.price_range_max >= 5000 && item.price_range_max <= 15000;
                        break;
                    case "15k-30k":
                        matchesBudget =
                            item.price_range_max > 15000 && item.price_range_max <= 30000;
                        break;
                    case "over30k":
                        matchesBudget = item.price_range_max > 30000;
                        break;
                }
            }

            return matchesSearch && matchesPriority && matchesBudget;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case "brand":
                    return a.brand?.localeCompare(b.brand);
                case "budget":
                    return b.price_range_max - a.price_range_max;
                case "priority": {
                    const priorityOrder = { High: 3, Medium: 2, Low: 1 };
                    return (
                        priorityOrder[b.priority] - priorityOrder[a.priority]
                    );
                }
                case "dateAdded":
                default:
                    return (
                        new Date(b.dateAdded).getTime() -
                        new Date(a.dateAdded).getTime()
                    );
            }
        });

    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<WishListItem | null>(null);
  interface WishListFormItem {
  brand_id: string;
  model: string;
  description: string;
  price_range_min: number;
  price_range_max: number;
  priority: "High" | "Medium" | "Low";
  image?: string;
  imageFile?: File | null;
}

const [newItem, setNewItem] = useState<WishListFormItem>({
  brand_id: "",
  model: "",
  description: "",
  price_range_min: 0,
  price_range_max: 0,
  priority: "Medium",
  image: "",
  imageFile: null,
});

   const handleAddItem = async () => { 
       try {
        const formData = new FormData();  
        formData.append('brand_id', newItem.brand_id);
        formData.append('model', newItem.model);
        formData.append('description', newItem.description);
        formData.append('price_range_min', String(newItem.price_range_min));
        formData.append('price_range_max', String(newItem.price_range_max));
        formData.append('priority', newItem.priority);
        if (newItem.imageFile) {
            formData.append('image', newItem.imageFile);
        }
 
             // Send to create route
          let  response = await axios.post('/wishlist', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

        // Get saved item from backend response
        const savedItem = response.data.item; 
         
            setWishList([...wishList, savedItem]);
            setNewItem({
                brand_id: "",
                model: "",
                description: "",
                price_range_min: 0,
                price_range_max: 0,
                priority: "Medium",
                image: "",
                imageFile: null,
            });
            setIsAddDialogOpen(false);
        
      toast({
            title: "Success",
            description: "Form submitted successfully.",
            variant: "default", // or "success" if you have that variant configured
            });
    } catch (error) {
        toast({
        title: "Error",
        description: error.response?.data?.message || "Something went wrong.",
        variant: "destructive",
        });
    }
        //setIsAddDialogOpen(false);
    };

    const handleEditItem = (item: WishListItem) => {
        setEditingItem(item);
        setIsEditDialogOpen(true);
    };

    const handleUpdateItem = async () => {
        if (editingItem) { 
            try {
                const formData = new FormData();   
                formData.append('brand_id', editingItem.brand_id);
                formData.append('model', editingItem.model);
                formData.append('description', editingItem.description);
                formData.append('price_range_min', String(editingItem.price_range_min));
                formData.append('price_range_max', String(editingItem.price_range_max));
                formData.append('priority', editingItem.priority);
                if (editingItem.imageFile) {
                    formData.append('image', editingItem.imageFile);
                } 
                //formData.append('_method', 'POST');
              const response = await axios.post(
                                `/wishlist/${editingItem.id}`,
                                formData,
                                {
                                headers: { 'Content-Type': 'multipart/form-data' },
                                params: { _method: 'PUT' },
                                }
                            );
                const updatedItem = response.data.item;

                console.log('returned response : ', updatedItem);

                //update the editted item back into the List and hench the UI
                setWishList(wishList.map((item) => item.id === updatedItem.id ? updatedItem : item));

                // close the modal
                setIsEditDialogOpen(false);

                toast({
                    title: "Success",
                    description: "Form submitted successfully.",
                    variant: "default", // or "success" if you have that variant configured
                });

            } catch (error) {
                alert('else');
                    toast({
                    title: "Error",
                    description: error.response?.data?.message || "Something went wrong.",
                    variant: "destructive",
                    });
                }  
        }
    };

    const handleDeleteItem = (id: string) => {
        const confirmed = window.confirm("Are you sure you want to delete this item?");
        if (!confirmed) return; // exit if user cancels 
        try {
            axios.delete(`/wishlist/${id}`).then(() => {
            setWishList(wishList.filter((item) => item.id !== id));

            toast({
                title: "Deleted",
                description: "Item has been deleted successfully.",
                variant: "destructive",
            });
            });
        } catch (error) {
            toast({
            title: "Error",
            description: error.response?.data?.message || "Something went wrong.",
            variant: "destructive",
            });
  }

    };

 const handleImageUpload = (
  e: React.ChangeEvent<HTMLInputElement>,
  isEdit: boolean = false
) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    const imageUrl = event.target?.result as string;

    if (isEdit && editingItem) {
      setEditingItem((prev) => ({
        ...prev!,
        image: imageUrl,   // Preview
        imageFile: file,   // File for upload
      }));
    } else {
      setNewItem((prev) => ({
        ...prev,
        image: imageUrl,   // Preview
        imageFile: file,   // File for upload
      }));
    }
  };
  reader.readAsDataURL(file);
};


    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "High":
                return "destructive";
            case "Medium":
                return "default";
            case "Low":
                return "secondary";
            default:
                return "default";
        }
    };

    const FiltersContent = () => (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="search">Search</Label>
                <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        id="search"
                        placeholder="Search brand, model, or description..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label>Priority</Label>
                <Select
                    value={priorityFilter}
                    onValueChange={setPriorityFilter}
                >
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Priorities</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label>Budget Range</Label>
                <Select value={budgetFilter} onValueChange={setBudgetFilter}>
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Budgets</SelectItem>
                        <SelectItem value="under5">Under €500</SelectItem>
                        <SelectItem value="5so-1k">€500 - €1000</SelectItem>
                        <SelectItem value="15so-2k">€1500 - €2000</SelectItem>
                        <SelectItem value="2k-5k">€2000 - €5000</SelectItem>
                        <SelectItem value="5k-10k">€5000 - €10,000</SelectItem>
                        <SelectItem value="over10k">Over €10,000</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label>Sort By</Label>
                <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="dateAdded">Date Added</SelectItem>
                        <SelectItem value="brand">Brand</SelectItem>
                        <SelectItem value="budget">
                            Budget (High to Low)
                        </SelectItem>
                        <SelectItem value="priority">Priority</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );

  const ItemFormContent = ({
  item,
  setItem,
  isEdit = false,
}: {
  item: any, //Omit<WishListItem, "id" | "dateAdded"> | WishListItem;
  setItem: any, //React.Dispatch<React.SetStateAction<WishListItem>>;

  isEdit?: boolean;
}) => {
  const [localItem, setLocalItem] = useState({ ...item });

  // Sync local state if parent changes (e.g., editingItem updates)
  useEffect(() => {
    setLocalItem({ ...item });
  }, [item]);

  const handleChange = (key: string, value: string | number) => {
    setLocalItem({ ...localItem, [key]: value });
  };

  const handleBlur = () => {
    setItem(localItem); // update parent on blur
  };

  return (
    <div className={isMobile ? "space-y-4" : "grid grid-cols-2 gap-4"}>
      <div className="space-y-2">
        <Label htmlFor="brand">Brand</Label>
        <BrandSelect
                brands={brands}
                value={localItem.brand_id} // bind directly to state
                onChange={(val) => {
                    // console.log('{ ...localItem, brand_id: val }', { ...localItem, brand_id: val }, localItem, brands);
                    const updated = { ...localItem, brand_id: Number(val) };
                    setLocalItem(updated);
                    setItem(updated);
                }}
                />
      </div>

      <div className="space-y-2">
        <Label htmlFor="model">Model</Label>
        <Input
          id="model"
          value={localItem.model}
          onChange={(e) => handleChange("model", e.target.value)}
          onBlur={handleBlur}
        />
      </div>

      <div className={`space-y-2 ${isMobile ? "" : "col-span-2"}`}>
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          value={localItem.description}
          onChange={(e) => handleChange("description", e.target.value)}
          onBlur={handleBlur}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="price_range_min">Min Budget (€)</Label>
        <Input
          id="price_range_min"
          type="number"
          value={localItem.price_range_min}
          onChange={(e) =>
            handleChange("price_range_min", Number(e.target.value))
          }
          onBlur={handleBlur}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="price_range_max">Max Budget (€)</Label>
        <Input
          id="price_range_max"
          type="number"
          value={localItem.price_range_max}
          onChange={(e) =>
            handleChange("price_range_max", Number(e.target.value))
          }
          onBlur={handleBlur}
        />
      </div>

      <div className="space-y-2">
        <Label>Priority</Label>
        <Select
          name="priority"
          value={localItem.priority}
          onValueChange={(val: "High" | "Medium" | "Low") => {
            const updated = { ...localItem, priority: val };
            setLocalItem(updated);
            setItem(updated);
        }}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="High">High</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="Low">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

     <div className="space-y-2">
  <Label>Image</Label>
  <div className="flex items-center space-x-2">
    <input
      key={localItem.imageFile ? localItem.imageFile.name : "file-input"}
      type="file"
      accept="image/*"
      onChange={(e) => handleImageUpload(e, isEdit)}
      className="flex-1"
    />
  </div>
  {localItem.image && (
    <div className="mt-2">
      <img
        src={localItem.image}
        alt="Preview"
        className="h-16 w-16 rounded object-cover"
      />
    </div>
  )}
</div>

    </div>
  );
};

// Debounced router update
useEffect(() => {
  const timeout = setTimeout(() => {
    router.get(
      route("wishlist.index"),
      {
        search: searchTerm || undefined,
        priority: priorityFilter !== "all" ? priorityFilter : undefined,
        budget: budgetFilter !== "all" ? budgetFilter : undefined,
        sortBy: sortBy || undefined,
      },
      { preserveState: true, replace: true }
    );
  }, 300);

  return () => clearTimeout(timeout);
}, [searchTerm, priorityFilter, budgetFilter, sortBy]);


  const items = props.items as any[];   // data from Laravel
  const brands = props.brands as any[]; // data from Laravel

function BrandSelect({ brands, value, onChange }: { 
    brands: { id: string; name: string; code: string }[];
    value: string;
    onChange: (val: string) => void;
}) {
    const [open, setOpen] = useState(false);
    const selected = brands.find((b) => b.id === value);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <button
                    type="button"
                    className="w-full border rounded px-3 py-2 text-left flex justify-between items-center"
                >
                    {selected ? `${selected.name} (${selected.code})` : "Select brand"}
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-[250px] p-0">
                <Command>
                    <CommandInput placeholder="Search brand..." />
                    <CommandEmpty>No brand found.</CommandEmpty>
                    <CommandGroup>
                        {brands.map((brand) => (
                            <CommandItem
                                key={brand.id}
                                value={brand.id} // only ID
                                onSelect={() => {
                                    onChange(brand.id); // update form state
                                    setOpen(false);
                                }}
                            >
                                <Check
                                    className={`mr-2 h-4 w-4 ${
                                        value === brand.id ? "opacity-100" : "opacity-0"
                                    }`}
                                />
                                {brand.name} ({brand.code})
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    );
}

    return (
        <Layout>
            <div className="p-4 lg:p-8">
                {/* Mobile Header */}
                <div className="flex flex-col space-y-4 lg:hidden">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold">Wish List</h1>
                        <Dialog
                            open={isAddDialogOpen}
                            onOpenChange={setIsAddDialogOpen}
                        >
                            <DialogTrigger asChild>
                                <Button size="sm">
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-sm">
                                <DialogHeader>
                                    <DialogTitle>
                                        Add New Wish List Item
                                    </DialogTitle>
                                </DialogHeader>
                                <ItemFormContent
                                    item={newItem}
                                    setItem={setNewItem}
                                />
                                <Button
                                    onClick={handleAddItem}
                                    className="mt-4"
                                >
                                    Add Item
                                </Button>
                            </DialogContent>
                        </Dialog>
                    </div>

                    {/* Mobile Controls */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Sheet
                                open={showFilters}
                                onOpenChange={setShowFilters}
                            >
                                <SheetTrigger asChild>
                                    <Button variant="outline" size="sm">
                                        <Filter className="mr-2 h-4 w-4" />
                                        Filters
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="left" className="w-80">
                                    <SheetHeader>
                                        <SheetTitle>Filters</SheetTitle>
                                    </SheetHeader>
                                    <div className="mt-6">
                                        <FiltersContent />
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Button
                                variant={
                                    viewMode === "grid" ? "default" : "outline"
                                }
                                size="sm"
                                onClick={() => setViewMode("grid")}
                            >
                                <Grid3X3 className="h-4 w-4" />
                            </Button>
                            <Button
                                variant={
                                    viewMode === "list" ? "default" : "outline"
                                }
                                size="sm"
                                onClick={() => setViewMode("list")}
                            >
                                <List className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Desktop Header */}
                <div className="hidden lg:block">
                    <div className="mb-8 flex items-center justify-between">
                        <h1 className="text-3xl font-bold">Wish List</h1>
                        <Dialog
                            open={isAddDialogOpen}
                            onOpenChange={setIsAddDialogOpen}
                        >
                            <DialogTrigger asChild>
                                <Button>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add New Item
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>
                                        Add New Wish List Item
                                    </DialogTitle>
                                </DialogHeader>
                                <ItemFormContent
                                    item={newItem}
                                    setItem={setNewItem}
                                />
                                <Button
                                    onClick={handleAddItem}
                                    className="mt-4"
                                >
                                    Add Item
                                </Button>
                            </DialogContent>
                        </Dialog>
                    </div>

                    {/* Desktop Filters and Controls */}
                    <div className="mb-6 flex flex-col gap-6 lg:flex-row">
                        <div className="lg:w-80">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">
                                        Filters & Search
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <FiltersContent />
                                </CardContent>
                            </Card>
                        </div>

                        <div className="flex-1">
                            <div className="mb-4 flex items-center justify-between">
                                <div className="text-sm text-muted-foreground">
                                    Showing {filteredWishList.length} of{" "}
                                    {wishList.length} items
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Button
                                        variant={
                                            viewMode === "grid"
                                                ? "default"
                                                : "outline"
                                        }
                                        size="sm"
                                        onClick={() => setViewMode("grid")}
                                    >
                                        <Grid3X3 className="mr-2 h-4 w-4" />
                                        Grid
                                    </Button>
                                    <Button
                                        variant={
                                            viewMode === "list"
                                                ? "default"
                                                : "outline"
                                        }
                                        size="sm"
                                        onClick={() => setViewMode("list")}
                                    >
                                        <List className="mr-2 h-4 w-4" />
                                        List
                                    </Button>
                                </div>
                            </div>

                            {/* Content */}
                            {viewMode === "grid" ? (
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                    {filteredWishList.map((item) => (
                                        <Card
                                            key={item.id}
                                            className="transition-shadow hover:shadow-lg"
                                        >
                                            {item.image_url && (
                                                <div className="aspect-square overflow-hidden rounded-t-lg">
                                                    <img
                                                        src={item.image_url}
                                                        alt={`${item.brand} ${item.model}`}
                                                        className="h-full w-full object-cover"
                                                    />
                                                </div>
                                            )}
                                            <CardContent className="p-4">
                                                <div className="mb-2 flex items-start justify-between">
                                                    <div>
                                                        <h3 className="text-lg font-semibold">
                                                            {item.brand}
                                                        </h3>
                                                        <p className="text-muted-foreground">
                                                            {item.model}
                                                        </p>
                                                    </div>
                                                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                                    <Badge
                                                        variant={
                                                            getPriorityColor(
                                                                item.priority,
                                                            ) as any
                                                        }
                                                    >
                                                        {item.priority}
                                                    </Badge>
                                                </div>
                                                <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
                                                    {item.description}
                                                </p>
                                                <div className="mb-3">
                                                    <span className="text-lg font-semibold text-primary">
                                                        €
                                                        {item?.price_range_min?.toLocaleString() ?? "0"}
                                                        - €
                                                       {(item?.price_range_max ?? 0).toLocaleString()}
                                                    </span>
                                                </div>
                                                <div className="flex space-x-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="flex-1"
                                                        onClick={() =>
                                                            handleEditItem(item)
                                                        }
                                                    >
                                                        <Edit className="mr-1 h-4 w-4" />
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleDeleteItem(
                                                                item.id,
                                                            )
                                                        }
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {filteredWishList.map((item) => (
                                        <Card key={item.id}>
                                            <CardContent className="p-4">
                                                <div className="flex items-center space-x-4">
                                                    {item.image_url && (
                                                        <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg">
                                                            <img
                                                                src={item.image_url}
                                                                alt={`${item.brand} ${item.model}`}
                                                                className="h-full w-full object-cover"
                                                            />
                                                        </div>
                                                    )}
                                                    <div className="min-w-0 flex-1">
                                                        <div className="mb-2 flex items-start justify-between">
                                                            <div>
                                                                <h3 className="text-lg font-semibold">
                                                                    {item.brand}{" "}
                                                                    {item.model}
                                                                </h3>
                                                                <p className="text-sm text-muted-foreground">
                                                                    {
                                                                        item.description
                                                                    }
                                                                </p>
                                                            </div>
                                                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                                            <Badge
                                                                variant={
                                                                    getPriorityColor(
                                                                        item.priority,
                                                                    ) as any
                                                                }
                                                            >
                                                                {item.priority}
                                                            </Badge>
                                                        </div>
                                                        <div className="flex items-center justify-between">
                                                            <div>
                                                                <span className="text-lg font-semibold text-primary">
                                                                    €
                                                                     {(item?.price_range_min ?? 0).toLocaleString()}
                                                                     
                                                                    - €
                                                                   {(item?.price_range_max ?? 0).toLocaleString()}
                                                                </span>
                                                            </div>
                                                            <div className="flex space-x-2">
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() =>
                                                                        handleEditItem(
                                                                            item,
                                                                        )
                                                                    }
                                                                >
                                                                    <Edit className="mr-1 h-4 w-4" />
                                                                    Edit
                                                                </Button>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() =>
                                                                        handleDeleteItem(
                                                                            item.id,
                                                                        )
                                                                    }
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                            {filteredWishList.length === 0 && (
                                <div className="py-12 text-center">
                                    <div className="mb-4 text-6xl">⌚</div>
                                    <h3 className="mb-2 text-xl font-medium text-slate-900">No Wishlist found</h3>
                                    <p className="text-slate-600">Try adjusting your search or filters</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Mobile Content */}
                <div className="lg:hidden">
                    <div className="mb-4 text-sm text-muted-foreground">
                        Showing {filteredWishList.length} of {wishList.length}{" "}
                        items
                    </div>

                    {viewMode === "grid" ? (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            {filteredWishList.map((item) => (
                                <Card
                                    key={item.id}
                                    className="transition-shadow hover:shadow-lg"
                                >
                                    {item.image_url && (
                                        <div className="aspect-square overflow-hidden rounded-t-lg">
                                            <img
                                                src={item.image_url}
                                                alt={`${item.brand} ${item.model}`}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                    )}
                                    <CardContent className="p-3">
                                        <div className="mb-2 flex items-start justify-between">
                                            <div className="min-w-0 flex-1">
                                                <h3 className="truncate text-base font-semibold">
                                                    {item.brand}
                                                </h3>
                                                <p className="truncate text-sm text-muted-foreground">
                                                    {item.model}
                                                </p>
                                            </div>
                                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                            <Badge
                                                variant={
                                                    getPriorityColor(
                                                        item.priority,
                                                    ) as any
                                                }
                                                className="ml-2 text-xs"
                                            >
                                                {item.priority}
                                            </Badge>
                                        </div>
                                        <p className="mb-3 line-clamp-2 text-xs text-muted-foreground">
                                            {item.description}
                                        </p>
                                        <div className="mb-3">
                                            <div className="text-sm font-semibold text-primary">
                                                €
                                                {(item?.price_range_min ?? 0).toLocaleString()}
                                                - €
                                                {(item?.price_range_max ?? 0).toLocaleString()}
                                            </div>
                                        </div>
                                        <div className="flex space-x-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="flex-1 text-xs"
                                                onClick={() =>
                                                    handleEditItem(item)
                                                }
                                            >
                                                <Edit className="mr-1 h-3 w-3" />
                                                Edit
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    handleDeleteItem(item.id)
                                                }
                                                className="text-xs"
                                            >
                                                <Trash2 className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {filteredWishList.map((item) => (
                                <Card key={item.id}>
                                    <CardContent className="p-3">
                                        <div className="flex items-start space-x-3">
                                            {item.image_url && (
                                                <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg">
                                                    <img
                                                        src={item.image_url}
                                                        alt={`${item.brand} ${item.model}`}
                                                        className="h-full w-full object-cover"
                                                    />
                                                </div>
                                            )}
                                            <div className="min-w-0 flex-1">
                                                <div className="mb-1 flex items-start justify-between">
                                                    <div className="min-w-0 flex-1">
                                                        <h3 className="text-sm font-semibold">
                                                            {item.brand}{" "}
                                                            {item.model}
                                                        </h3>
                                                        <p className="line-clamp-1 text-xs text-muted-foreground">
                                                            {item.description}
                                                        </p>
                                                    </div>
                                                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                                    <Badge
                                                        variant={
                                                            getPriorityColor(
                                                                item.priority,
                                                            ) as any
                                                        }
                                                        className="ml-2 text-xs"
                                                    >
                                                        {item.priority}
                                                    </Badge>
                                                </div>
                                                <div className="mt-2 flex items-center justify-between">
                                                    <div>
                                                        <div className="text-xs font-semibold text-primary">
                                                            €
                                                            {(item?.price_range_min ?? 0).toLocaleString()}
                                                            - €
                                                            {item.price_range_max.toLocaleString()}
                                                        </div>
                                                    </div>
                                                    <div className="flex space-x-1">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="px-2 text-xs"
                                                            onClick={() =>
                                                                handleEditItem(
                                                                    item,
                                                                )
                                                            }
                                                        >
                                                            <Edit className="h-3 w-3" />
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() =>
                                                                handleDeleteItem(
                                                                    item.id,
                                                                )
                                                            }
                                                            className="px-2 text-xs"
                                                        >
                                                            <Trash2 className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>

                {/* Edit Item Dialog */}
                <Dialog
                    open={isEditDialogOpen}
                    onOpenChange={setIsEditDialogOpen}
                >
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit Wish List Item</DialogTitle>
                        </DialogHeader>
                        {editingItem && (
                            <>
                                <ItemFormContent
                                    item={editingItem}
                                    setItem={setEditingItem}
                                    isEdit={true}
                                />
                                <Button
                                    onClick={handleUpdateItem}
                                    className="mt-4"
                                >
                                    Update Item
                                </Button>
                            </>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </Layout>
    );
};

export default WishList;
