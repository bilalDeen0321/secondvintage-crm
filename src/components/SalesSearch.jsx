// src/components/SalesSearch.jsx
import { Search, Download } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

const SalesSearch = ({ searchTerm, setSearchTerm, platformFilter, setPlatformFilter }) => {
  return (
    <div className="mb-6 flex flex-col gap-4 lg:flex-row">
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Search sales by watch name, brand, or SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      <div className="flex gap-4">
        <Select value={platformFilter} onValueChange={setPlatformFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Platform" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Platforms</SelectItem>
            <SelectItem value="Chrono24">Chrono24</SelectItem>
            <SelectItem value="eBay">eBay</SelectItem>
            <SelectItem value="Catawiki">Catawiki</SelectItem>
            <SelectItem value="Tradera">Tradera</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>
    </div>
  );
};

export default SalesSearch;
