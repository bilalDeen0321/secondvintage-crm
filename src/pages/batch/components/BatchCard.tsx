import { Batch } from "@/app/models/Batch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BatchResource } from "@/types/resources/batch";
import { Calendar, Edit, ExternalLink, FileText, MapPin, Package, Receipt, Truck } from "lucide-react";

interface BatchCardProps {
    batch: BatchResource;
    viewMode: "grid" | "list";
    onWatchClick: (watchId: string) => void;
    onEditBatch: (batchId: string) => void;
    onCreateInvoice: (batchId: string) => void;
    onStatusUpdate: (batchId: string, status: string) => void;
    getStatusColor: (status: string) => string;
    getTrackingUrl: (trackingNumber: string) => string;
}

export const BatchCard = ({ batch, viewMode, onWatchClick, onEditBatch, onCreateInvoice, onStatusUpdate, getStatusColor, getTrackingUrl }: BatchCardProps) => {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <Package className="h-5 w-5" />
                            {batch.name}
                        </CardTitle>
                        <div className="mt-2 flex items-center gap-4 text-sm text-slate-600">
                            <div className="flex items-center gap-1">
                                <Truck className="h-4 w-4" />
                                <a href={getTrackingUrl(batch.trackingNumber)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline">
                                    {batch.trackingNumber}
                                    <ExternalLink className="h-3 w-3" />
                                </a>
                            </div>
                            <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {batch.origin} → {batch.destination}
                            </div>
                            {batch.shippedDate && (
                                <div className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    Shipped: {new Date(batch.shippedDate).toLocaleDateString()}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge className={Batch.toColorClass(batch.status)}>{Batch.toHuman(batch.status)}</Badge>
                        <Button variant="outline" size="sm" onClick={() => onEditBatch(String(batch.id))} className="flex items-center gap-1">
                            <Edit className="h-3 w-3" />
                            Edit batch
                        </Button>
                        <Button onClick={() => onCreateInvoice(String(batch.id))} variant="outline" className="flex items-center gap-2" size="sm">
                            <Receipt className="h-3 w-3" />
                            Invoice
                        </Button>
                        <Select value={batch.status} onValueChange={(value) => onStatusUpdate(String(batch.id), value)}>
                            <SelectTrigger className="w-32">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Preparing">Preparing</SelectItem>
                                <SelectItem value="Shipped">Shipped</SelectItem>
                                <SelectItem value="In Transit">In Transit</SelectItem>
                                <SelectItem value="Customs">Customs</SelectItem>
                                <SelectItem value="Delivered">Delivered</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {/* Watches in batch */}
                    <div>
                        <h4 className="mb-3 font-medium">Watches in this batch ({batch.watches.length})</h4>
                        {viewMode === "list" ? (
                            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {batch.watches.map((watch) => (
                                    <div key={watch.id} className="cursor-pointer rounded-lg border p-3 transition-colors hover:bg-slate-50" onClick={() => onWatchClick(String(watch.id))}>
                                        <div className="truncate text-sm font-medium" title={watch.name}>
                                            {watch.name}
                                        </div>
                                        <div className="truncate text-xs text-slate-600">{watch.sku}</div>
                                        <div className="text-xs text-slate-500">{watch.brand}</div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-5 gap-2 md:grid-cols-10">
                                {batch.watches.map((watch) => (
                                    <div key={watch.id} className="cursor-pointer rounded-lg border p-2 transition-colors hover:bg-slate-50" onClick={() => onWatchClick(String(watch.id))} title={`${watch.name} - ${watch.sku}`}>
                                        <div className="mb-1 aspect-square overflow-hidden rounded-md">
                                            <img src={watch.image_urls[0] || "/images/placeholder.png"} alt={watch.name} className="h-full w-full object-cover" />
                                        </div>
                                        <div className="truncate text-xs font-medium">{watch.brand}</div>
                                        <div className="truncate text-xs text-slate-500">{watch.sku}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Delivery info */}
                    {(batch.estimatedDelivery || batch.actualDelivery) && (
                        <div className="flex gap-4 text-sm">
                            {batch.estimatedDelivery && (
                                <div>
                                    <span className="text-slate-600">Est. Delivery: </span>
                                    <span className="font-medium">{new Date(batch.estimatedDelivery).toLocaleDateString()}</span>
                                </div>
                            )}
                            {batch.actualDelivery && (
                                <div>
                                    <span className="text-slate-600">Actual Delivery: </span>
                                    <span className="font-medium">{new Date(batch.actualDelivery).toLocaleDateString()}</span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Notes */}
                    {batch.notes && (
                        <div className="flex items-start gap-2 text-sm">
                            <FileText className="mt-0.5 h-4 w-4 text-slate-400" />
                            <div>
                                <span className="text-slate-600">Notes: </span>
                                <span>{batch.notes}</span>
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};
