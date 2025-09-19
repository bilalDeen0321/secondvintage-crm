import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { PlatformField } from "./_actions";

import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type Props = {
    platformData: PlatformField[];
    setPlatformData: (data: PlatformField[]) => void;
};

export default function PlatformDataTable({ platformData, setPlatformData }: Props) {
    const handleFieldChange = (index: number, newValue: string) => {
        const updatedData = [...platformData];
        updatedData[index].value = newValue;
        setPlatformData(updatedData);
    };

    const renderField = (field: PlatformField, index: number) => {
        switch (field.type) {
            case "select":
                return (
                    <Select
                        value={field.value ?? ""}
                        onValueChange={(value) => handleFieldChange(index, value || null)}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select..." />
                        </SelectTrigger> 
                        {/* Actual placeholder as selectable option */}                            
                        <SelectContent>
                            <SelectItem value="none">-</SelectItem>
                            {field.options?.map((option) => (
                                <SelectItem key={option} value={option}>
                                    {option}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                );
            case "textarea":
                return (
                    <Textarea
                        value={field.value}
                        onChange={(e) => handleFieldChange(index, e.target.value)}
                        className="min-h-[240px]"
                    />
                );
            case "number":
                return (
                    <Input
                        type="number"
                        value={field.value}
                        onChange={(e) => handleFieldChange(index, e.target.value)}
                    />
                );
            default:
                return (
                    <Input
                        value={field.value}
                        onChange={(e) => handleFieldChange(index, e.target.value)}
                    />
                );
        }
    };

    return (
        <div className="mt-6">
            <div className="overflow-hidden rounded-lg border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-1/3">Field</TableHead>
                            <TableHead>Value</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {platformData.map((field, index) => (
                            <TableRow key={index} className="hover:bg-slate-50">
                                <TableCell className="py-2 align-top font-medium text-slate-900">
                                    {field.field}
                                </TableCell>
                                <TableCell className="py-1 text-slate-700">
                                    {renderField(field, index)}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
