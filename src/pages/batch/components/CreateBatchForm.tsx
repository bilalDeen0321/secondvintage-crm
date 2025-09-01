import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Batch } from "@/types/Batch";

interface CreateBatchFormProps {
    newBatch: Partial<Batch>;
    setNewBatch: (batch: Partial<Batch>) => void;
    onCreateBatch: () => void;
    onCancel: () => void;
}

export const CreateBatchForm = ({
    newBatch,
    setNewBatch,
    onCreateBatch,
    onCancel,
}: CreateBatchFormProps) => {
    return (
        <Card className="mb-6">
            <CardHeader>
                <CardTitle>Create New Batch</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <label className="mb-1 block text-sm font-medium">Batch Name</label>
                        <Input
                            value={newBatch.name}
                            onChange={(e) => setNewBatch({ ...newBatch, name: e.target.value })}
                            placeholder="Vietnam Batch #003"
                        />
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium">Tracking Number</label>
                        <Input
                            value={newBatch.trackingNumber}
                            onChange={(e) =>
                                setNewBatch({ ...newBatch, trackingNumber: e.target.value })
                            }
                            placeholder="VN2024001234569"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <label className="mb-1 block text-sm font-medium">Origin</label>
                        <Input
                            value={newBatch.origin}
                            onChange={(e) => setNewBatch({ ...newBatch, origin: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium">Destination</label>
                        <Input
                            value={newBatch.destination}
                            onChange={(e) =>
                                setNewBatch({ ...newBatch, destination: e.target.value })
                            }
                        />
                    </div>
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium">Status</label>
                    <Select
                        value={newBatch.status}
                        onValueChange={(value) =>
                            setNewBatch({ ...newBatch, status: value as Batch["status"] })
                        }
                    >
                        <SelectTrigger>
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

                <div>
                    <label className="mb-1 block text-sm font-medium">Notes</label>
                    <Textarea
                        value={newBatch.notes}
                        onChange={(e) => setNewBatch({ ...newBatch, notes: e.target.value })}
                        placeholder="Special handling instructions..."
                        rows={3}
                    />
                </div>

                <div className="flex gap-2">
                    <Button onClick={onCreateBatch}>Create Batch</Button>
                    <Button variant="outline" onClick={onCancel}>
                        Cancel
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};
