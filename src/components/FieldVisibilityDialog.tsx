
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Settings } from 'lucide-react';

interface FieldVisibilityDialogProps {
  visibleFields: Record<string, boolean>;
  onFieldToggle: (fieldKey: string, visible: boolean) => void;
}

const FieldVisibilityDialog = ({ visibleFields, onFieldToggle }: FieldVisibilityDialogProps) => {
  const allFields = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'sku', label: 'SKU' },
    { key: 'batch', label: 'Batch' },
    { key: 'brand', label: 'Brand' },
    { key: 'status', label: 'Status' },
    { key: 'location', label: 'Location' },
    { key: 'acquisitionCost', label: 'Acquisition Cost' },
    { key: 'salesPrice', label: 'Sales Price' },
    { key: 'profit', label: 'Profit' },
    { key: 'agentHandler', label: 'Agent Handler' },
    { key: 'depositId', label: 'Deposit ID' },
    { key: 'batchGroup', label: 'Batch Group' },
    { key: 'dateAdded', label: 'Date Added' },
    { key: 'dateListed', label: 'Date Listed' },
    { key: 'dateSold', label: 'Date Sold' },
    { key: 'platform', label: 'Platform' },
    { key: 'condition', label: 'Condition' },
    { key: 'movement', label: 'Movement' },
    { key: 'caseMaterial', label: 'Case Material' },
    { key: 'caseSize', label: 'Case Size' },
    { key: 'waterResistance', label: 'Water Resistance' },
    { key: 'warranty', label: 'Warranty' },
    { key: 'serialNumber', label: 'Serial Number' },
    { key: 'referenceNumber', label: 'Reference Number' },
    { key: 'yearOfManufacture', label: 'Year' },
    { key: 'seller', label: 'Seller' },
    { key: 'apiStatus', label: 'API Status' },
    { key: 'apiLastSync', label: 'API Last Sync' },
    { key: 'apiPlatformId', label: 'API Platform ID' },
    { key: 'apiListingUrl', label: 'API Listing URL' },
    { key: 'apiErrors', label: 'API Errors' },
    { key: 'apiSyncFrequency', label: 'API Sync Frequency' },
    { key: 'imageUrls', label: 'Image URLs' },
    { key: 'description', label: 'Description' },
    { key: 'aiInstructions', label: 'AI Instructions' }
  ];

  const handleSelectAll = () => {
    allFields.forEach(field => {
      onFieldToggle(field.key, true);
    });
  };

  const handleSelectNone = () => {
    allFields.forEach(field => {
      onFieldToggle(field.key, false);
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          Edit Visible Fields
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Edit Visible Fields</DialogTitle>
        </DialogHeader>
        <div className="flex gap-2 mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSelectAll}
          >
            Select All
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSelectNone}
          >
            Select None
          </Button>
        </div>
        <ScrollArea className="h-96">
          <div className="space-y-3 pr-4">
            {allFields.map(field => (
              <div key={field.key} className="flex items-center space-x-3">
                <Checkbox
                  id={field.key}
                  checked={visibleFields[field.key] ?? true}
                  onCheckedChange={(checked) => onFieldToggle(field.key, checked as boolean)}
                />
                <label
                  htmlFor={field.key}
                  className="text-sm text-slate-700 cursor-pointer flex-1"
                >
                  {field.label}
                </label>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default FieldVisibilityDialog;
