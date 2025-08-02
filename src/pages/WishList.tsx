import {
  Edit,
  Filter,
  Grid3X3,
  List,
  Plus,
  Search,
  Trash2
} from 'lucide-react';
import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../components/ui/sheet';
import { useIsMobile } from '../hooks/use-mobile';

interface WishListItem {
  id: string;
  brand: string;
  model: string;
  description: string;
  minBudget: number;
  maxBudget: number;
  priority: 'High' | 'Medium' | 'Low';
  dateAdded: string;
  image?: string;
}

const WishList = () => {
  const isMobile = useIsMobile();
  const [wishList, setWishList] = useState<WishListItem[]>([
    {
      id: '1',
      brand: 'Rolex',
      model: 'Submariner',
      description: 'Black dial, ceramic bezel, steel bracelet. No date preferred.',
      minBudget: 10000,
      maxBudget: 12000,
      priority: 'High',
      dateAdded: '2024-01-15',
      image: '/lovable-uploads/c9668ac2-5bda-49b2-9679-1759280598e1.png'
    },
    {
      id: '2',
      brand: 'Omega',
      model: 'Speedmaster',
      description: 'Moonwatch Professional. Manual wind, hesalite crystal.',
      minBudget: 5500,
      maxBudget: 6500,
      priority: 'Medium',
      dateAdded: '2024-01-20',
      image: '/lovable-uploads/8a246750-c18b-4b1c-b6af-25185e84d3d7.png'
    },
    {
      id: '3',
      brand: 'Tudor',
      model: 'Black Bay',
      description: 'Blue dial variant. 39mm case size preferred.',
      minBudget: 3200,
      maxBudget: 3800,
      priority: 'Low',
      dateAdded: '2024-01-25',
      image: '/lovable-uploads/27ec6583-00c5-4c9f-bf57-429e50240830.png'
    },
    {
      id: '4',
      brand: 'Patek Philippe',
      model: 'Calatrava',
      description: 'Classic dress watch with white gold case. Looking for ref. 5196.',
      minBudget: 22000,
      maxBudget: 25000,
      priority: 'High',
      dateAdded: '2024-01-30',
      image: '/lovable-uploads/cd305798-ab49-4a3b-9157-fb8db777bd8f.png'
    },
    {
      id: '5',
      brand: 'Audemars Piguet',
      model: 'Royal Oak',
      description: 'Steel case with blue dial. 39mm or 41mm preferred.',
      minBudget: 32000,
      maxBudget: 35000,
      priority: 'High',
      dateAdded: '2024-02-05',
      image: '/lovable-uploads/c3abfafa-8986-4b30-bd89-3d163701cb64.png'
    },
    {
      id: '6',
      brand: 'Cartier',
      model: 'Santos',
      description: 'Medium size in steel and gold. Square case classic design.',
      minBudget: 7500,
      maxBudget: 8500,
      priority: 'Medium',
      dateAdded: '2024-02-10',
      image: '/lovable-uploads/e42df4f6-4752-4442-9e7c-06e8184162be.png'
    },
    {
      id: '7',
      brand: 'Vacheron Constantin',
      model: 'Overseas',
      description: 'Sports watch with integrated bracelet. Blue dial preferred.',
      minBudget: 25000,
      maxBudget: 28000,
      priority: 'Medium',
      dateAdded: '2024-02-15',
      image: '/lovable-uploads/5557d546-574f-45fb-bd5a-014ec53e5792.png'
    }
  ]);

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [budgetFilter, setBudgetFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('dateAdded');
  const [showFilters, setShowFilters] = useState(false);

  const filteredWishList = wishList.filter(item => {
    const matchesSearch = item.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPriority = priorityFilter === 'all' || item.priority === priorityFilter;

    let matchesBudget = true;
    if (budgetFilter !== 'all') {
      switch (budgetFilter) {
        case 'under5k':
          matchesBudget = item.maxBudget < 5000;
          break;
        case '5k-15k':
          matchesBudget = item.maxBudget >= 5000 && item.maxBudget <= 15000;
          break;
        case '15k-30k':
          matchesBudget = item.maxBudget > 15000 && item.maxBudget <= 30000;
          break;
        case 'over30k':
          matchesBudget = item.maxBudget > 30000;
          break;
      }
    }

    return matchesSearch && matchesPriority && matchesBudget;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'brand':
        return a.brand.localeCompare(b.brand);
      case 'budget':
        return b.maxBudget - a.maxBudget;
      case 'priority':
        {
          const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        }
      case 'dateAdded':
      default:
        return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
    }
  });

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<WishListItem | null>(null);
  const [newItem, setNewItem] = useState<Omit<WishListItem, 'id' | 'dateAdded'>>({
    brand: '',
    model: '',
    description: '',
    minBudget: 0,
    maxBudget: 0,
    priority: 'Medium',
    image: ''
  });

  const handleAddItem = () => {
    const item: WishListItem = {
      ...newItem,
      id: Date.now().toString(),
      dateAdded: new Date().toISOString().split('T')[0]
    };
    setWishList([...wishList, item]);
    setNewItem({
      brand: '',
      model: '',
      description: '',
      minBudget: 0,
      maxBudget: 0,
      priority: 'Medium',
      image: ''
    });
    setIsAddDialogOpen(false);
  };

  const handleEditItem = (item: WishListItem) => {
    setEditingItem(item);
    setIsEditDialogOpen(true);
  };

  const handleUpdateItem = () => {
    if (editingItem) {
      setWishList(wishList.map(item =>
        item.id === editingItem.id ? editingItem : item
      ));
      setIsEditDialogOpen(false);
      setEditingItem(null);
    }
  };

  const handleDeleteItem = (id: string) => {
    setWishList(wishList.filter(item => item.id !== id));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean = false) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        if (isEdit && editingItem) {
          setEditingItem({ ...editingItem, image: imageUrl });
        } else {
          setNewItem({ ...newItem, image: imageUrl });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'destructive';
      case 'Medium': return 'default';
      case 'Low': return 'secondary';
      default: return 'default';
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
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
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
            <SelectItem value="under5k">Under €5,000</SelectItem>
            <SelectItem value="5k-15k">€5,000 - €15,000</SelectItem>
            <SelectItem value="15k-30k">€15,000 - €30,000</SelectItem>
            <SelectItem value="over30k">Over €30,000</SelectItem>
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
            <SelectItem value="budget">Budget (High to Low)</SelectItem>
            <SelectItem value="priority">Priority</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const ItemFormContent = ({ item, setItem, isEdit = false }: {
    item: Omit<WishListItem, 'id' | 'dateAdded'> | WishListItem,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setItem: (item: any) => void,
    isEdit?: boolean
  }) => (
    <div className={isMobile ? "space-y-4" : "grid grid-cols-2 gap-4"}>
      <div className="space-y-2">
        <Label htmlFor="brand">Brand</Label>
        <Input
          id="brand"
          value={item.brand}
          onChange={(e) => setItem({ ...item, brand: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="model">Model</Label>
        <Input
          id="model"
          value={item.model}
          onChange={(e) => setItem({ ...item, model: e.target.value })}
        />
      </div>
      <div className={`space-y-2 ${isMobile ? '' : 'col-span-2'}`}>
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          value={item.description}
          onChange={(e) => setItem({ ...item, description: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="minBudget">Min Budget (€)</Label>
        <Input
          id="minBudget"
          type="number"
          value={item.minBudget}
          onChange={(e) => setItem({ ...item, minBudget: parseInt(e.target.value) || 0 })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="maxBudget">Max Budget (€)</Label>
        <Input
          id="maxBudget"
          type="number"
          value={item.maxBudget}
          onChange={(e) => setItem({ ...item, maxBudget: parseInt(e.target.value) || 0 })}
        />
      </div>
      <div className="space-y-2">
        <Label>Priority</Label>
        <Select value={item.priority} onValueChange={(value: 'High' | 'Medium' | 'Low') => setItem({ ...item, priority: value })}>
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
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload(e, isEdit)}
            className="flex-1"
          />
        </div>
        {item.image && (
          <div className="mt-2">
            <img src={item.image} alt="Preview" className="w-16 h-16 object-cover rounded" />
          </div>
        )}
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="p-4 lg:p-8">
        {/* Mobile Header */}
        <div className="flex flex-col space-y-4 lg:hidden">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Wish List</h1>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-sm">
                <DialogHeader>
                  <DialogTitle>Add New Wish List Item</DialogTitle>
                </DialogHeader>
                <ItemFormContent item={newItem} setItem={setNewItem} />
                <Button onClick={handleAddItem} className="mt-4">Add Item</Button>
              </DialogContent>
            </Dialog>
          </div>

          {/* Mobile Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sheet open={showFilters} onOpenChange={setShowFilters}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
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
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden lg:block">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">Wish List</h1>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Item
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Wish List Item</DialogTitle>
                </DialogHeader>
                <ItemFormContent item={newItem} setItem={setNewItem} />
                <Button onClick={handleAddItem} className="mt-4">Add Item</Button>
              </DialogContent>
            </Dialog>
          </div>

          {/* Desktop Filters and Controls */}
          <div className="flex flex-col lg:flex-row gap-6 mb-6">
            <div className="lg:w-80">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Filters & Search</CardTitle>
                </CardHeader>
                <CardContent>
                  <FiltersContent />
                </CardContent>
              </Card>
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm text-muted-foreground">
                  Showing {filteredWishList.length} of {wishList.length} items
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid3X3 className="h-4 w-4 mr-2" />
                    Grid
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="h-4 w-4 mr-2" />
                    List
                  </Button>
                </div>
              </div>

              {/* Content */}
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredWishList.map((item) => (
                    <Card key={item.id} className="hover:shadow-lg transition-shadow">
                      {item.image && (
                        <div className="aspect-square overflow-hidden rounded-t-lg">
                          <img
                            src={item.image}
                            alt={`${item.brand} ${item.model}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-lg">{item.brand}</h3>
                            <p className="text-muted-foreground">{item.model}</p>
                          </div>
                          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                          <Badge variant={getPriorityColor(item.priority) as any}>
                            {item.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {item.description}
                        </p>
                        <div className="mb-3">
                          <span className="font-semibold text-primary text-lg">
                            €{item.minBudget.toLocaleString()} - €{item.maxBudget.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEditItem(item)}>
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteItem(item.id)}
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
                          {item.image && (
                            <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                              <img
                                src={item.image}
                                alt={`${item.brand} ${item.model}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="font-semibold text-lg">{item.brand} {item.model}</h3>
                                <p className="text-sm text-muted-foreground">{item.description}</p>
                              </div>
                              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                              <Badge variant={getPriorityColor(item.priority) as any}>
                                {item.priority}
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="font-semibold text-primary text-lg">
                                  €{item.minBudget.toLocaleString()} - €{item.maxBudget.toLocaleString()}
                                </span>
                              </div>
                              <div className="flex space-x-2">
                                <Button variant="outline" size="sm" onClick={() => handleEditItem(item)}>
                                  <Edit className="h-4 w-4 mr-1" />
                                  Edit
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDeleteItem(item.id)}
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
            </div>
          </div>
        </div>

        {/* Mobile Content */}
        <div className="lg:hidden">
          <div className="mb-4 text-sm text-muted-foreground">
            Showing {filteredWishList.length} of {wishList.length} items
          </div>

          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredWishList.map((item) => (
                <Card key={item.id} className="hover:shadow-lg transition-shadow">
                  {item.image && (
                    <div className="aspect-square overflow-hidden rounded-t-lg">
                      <img
                        src={item.image}
                        alt={`${item.brand} ${item.model}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-base truncate">{item.brand}</h3>
                        <p className="text-muted-foreground text-sm truncate">{item.model}</p>
                      </div>
                      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                      <Badge variant={getPriorityColor(item.priority) as any} className="ml-2 text-xs">
                        {item.priority}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                      {item.description}
                    </p>
                    <div className="mb-3">
                      <div className="text-sm font-semibold text-primary">
                        €{item.minBudget.toLocaleString()} - €{item.maxBudget.toLocaleString()}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="flex-1 text-xs" onClick={() => handleEditItem(item)}>
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteItem(item.id)}
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
                      {item.image && (
                        <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={item.image}
                            alt={`${item.brand} ${item.model}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <div className="min-w-0 flex-1">
                            <h3 className="font-semibold text-sm">{item.brand} {item.model}</h3>
                            <p className="text-xs text-muted-foreground line-clamp-1">{item.description}</p>
                          </div>
                          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                          <Badge variant={getPriorityColor(item.priority) as any} className="ml-2 text-xs">
                            {item.priority}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div>
                            <div className="text-xs font-semibold text-primary">
                              €{item.minBudget.toLocaleString()} - €{item.maxBudget.toLocaleString()}
                            </div>
                          </div>
                          <div className="flex space-x-1">
                            <Button variant="outline" size="sm" className="text-xs px-2" onClick={() => handleEditItem(item)}>
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteItem(item.id)}
                              className="text-xs px-2"
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
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Wish List Item</DialogTitle>
            </DialogHeader>
            {editingItem && (
              <>
                <ItemFormContent item={editingItem} setItem={setEditingItem} isEdit={true} />
                <Button onClick={handleUpdateItem} className="mt-4">Update Item</Button>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default WishList;
