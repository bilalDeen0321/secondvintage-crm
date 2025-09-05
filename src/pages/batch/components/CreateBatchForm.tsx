import { Batch } from "@/app/models/Batch";
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
import { useForm, usePage } from "@inertiajs/react";
import { FormEvent } from "react";

interface CreateBatchFormProps {
    onCancel?: () => void;
}

export const CreateBatchForm = ({ onCancel }: CreateBatchFormProps) => {
    const {auth} = usePage().props
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        tracking_number: "",
        origin: auth?.user?.country || "Denmark",
        destination: "Denmark",
        status: "preparing",
        notes: "",
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(route("batches.store"), {
            onSuccess: () => {
                reset();
            },
        });
    };

    return (
        <Card className="mb-6">
            <CardHeader>
                <CardTitle>Create New Batch</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <label className="mb-1 block text-sm font-medium">Batch Name</label>
                            <Input
                                value={data.name}
                                onChange={(e) => setData("name", e.target.value)}
                                placeholder="Vietnam Batch #003"
                                className={errors.name ? "border-red-500" : ""}
                            />
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                            )}
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium">
                                Tracking Number
                            </label>
                            <Input
                                value={data.tracking_number}
                                onChange={(e) => setData("tracking_number", e.target.value)}
                                placeholder="VN2024001234569"
                                className={errors.tracking_number ? "border-red-500" : ""}
                            />
                            {errors.tracking_number && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.tracking_number}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <label className="mb-1 block text-sm font-medium">Origin</label>
                            <Input
                                value={data.origin}
                                onChange={(e) => setData("origin", e.target.value)}
                                className={errors.origin ? "border-red-500" : ""}
                            />
                            {errors.origin && (
                                <p className="mt-1 text-sm text-red-500">{errors.origin}</p>
                            )}
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium">Destination</label>
                            <Input
                                value={data.destination}
                                onChange={(e) => setData("destination", e.target.value)}
                                className={errors.destination ? "border-red-500" : ""}
                            />
                            {errors.destination && (
                                <p className="mt-1 text-sm text-red-500">{errors.destination}</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium">Status</label>
                        <Select
                            value={data.status}
                            onValueChange={(value) => setData("status", value)}
                        >
                            <SelectTrigger className={errors.status ? "border-red-500" : ""}>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {Batch.allStatuses().map((status, index) => (
                                    <SelectItem key={index} value={status}>
                                        {status}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.status && (
                            <p className="mt-1 text-sm text-red-500">{errors.status}</p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium">Notes</label>
                        <Textarea
                            value={data.notes}
                            onChange={(e) => setData("notes", e.target.value)}
                            placeholder="Special handling instructions..."
                            rows={3}
                            className={errors.notes ? "border-red-500" : ""}
                        />
                        {errors.notes && (
                            <p className="mt-1 text-sm text-red-500">{errors.notes}</p>
                        )}
                    </div>

                    <div className="flex gap-2">
                        <Button type="submit" disabled={processing}>
                            {processing ? "Creating..." : "Create Batch"}
                        </Button>
                        {onCancel && (
                            <Button type="button" variant="outline" onClick={onCancel}>
                                Cancel
                            </Button>
                        )}
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};
