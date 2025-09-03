import Status from "@/app/models/Status";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";

type Props = {
    watcheLength: number | string;
    handleSelectAll: (checked: boolean) => void;
    handleSelectByStatus: (status: string) => void;
};

export default function SaleQuickSelectionActions(props: Props) {
    const { handleSelectAll, watcheLength, handleSelectByStatus } = props;
    return (
        <div className="mb-6 flex flex-wrap gap-4 rounded-lg bg-slate-50 p-4">
            <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-slate-600" />
                <span className="text-sm font-medium text-slate-700">Quick Select:</span>
            </div>
            <Button variant="outline" size="sm" onClick={() => handleSelectAll(true)}>
                Select All ({watcheLength})
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleSelectAll(false)}>
                Clear Selection
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleSelectByStatus(Status.APPROVED)}>
                Select Approved
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleSelectByStatus(Status.PLATFORM_REVIEW)}>
                Select Platform Review
            </Button>
        </div>
    );
}
