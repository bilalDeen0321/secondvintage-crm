
import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Edit3 } from 'lucide-react';

interface LocationSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
  locations: string[];
  onEditLocations?: () => void;
}

const LocationSelector = ({ value, onValueChange, locations, onEditLocations }: LocationSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const filteredLocations = locations.filter(location => 
    location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Select value={value} onValueChange={onValueChange} open={isOpen} onOpenChange={setIsOpen}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Location" />
      </SelectTrigger>
      <SelectContent>
        <div className="flex items-center space-x-2 p-2 border-b">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          {onEditLocations && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onEditLocations();
                setIsOpen(false);
              }}
            >
              <Edit3 className="h-4 w-4" />
            </Button>
          )}
        </div>
        <div className="max-h-48 overflow-y-auto">
          {filteredLocations.map(location => (
            <SelectItem key={location} value={location}>{location}</SelectItem>
          ))}
          {filteredLocations.length === 0 && (
            <div className="p-2 text-sm text-muted-foreground text-center">
              No locations found
            </div>
          )}
        </div>
      </SelectContent>
    </Select>
  );
};

export default LocationSelector;
