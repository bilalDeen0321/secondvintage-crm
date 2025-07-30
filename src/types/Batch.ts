
export interface BatchWatch {
  id: string;
  name: string;
  sku: string;
  brand: string;
  image?: string;
}

export interface Batch {
  id: string;
  name: string;
  trackingNumber: string;
  origin: string;
  destination: string;
  status: 'Preparing' | 'Shipped' | 'In Transit' | 'Customs' | 'Delivered';
  watches: BatchWatch[];
  shippedDate?: string;
  estimatedDelivery?: string;
  actualDelivery?: string;
  notes?: string;
}
