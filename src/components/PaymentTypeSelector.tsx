
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PaymentTypeSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
}

const paymentTypes = [
  'Watches',
  'Freelancer/Agent Fee',
  'Watchmaker',
  'Shipping',
  'Bonus',
  'Other'
];

const PaymentTypeSelector = ({ value, onValueChange }: PaymentTypeSelectorProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Payment Type</label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select payment type" />
        </SelectTrigger>
        <SelectContent>
          {paymentTypes.map((type) => (
            <SelectItem key={type} value={type}>
              {type}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default PaymentTypeSelector;
