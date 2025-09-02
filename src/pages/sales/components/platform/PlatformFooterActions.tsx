import { Button } from "@/components/ui/button";
import { Check, Save } from "lucide-react";

type Props = {
    handleApproveGoNext: () => void;
    handleSave: () => void;
};

export function PlatformFooterActions({ handleApproveGoNext, handleSave }: Props) {
    return (
        <div className="mt-6 flex items-center justify-end gap-2 border-t pt-4">
            <Button
                onClick={handleSave}
                variant="default"
                className="bg-green-600 hover:bg-green-700"
            >
                <Save className="mr-2 h-4 w-4" />
                Save
            </Button>
            <Button
                onClick={handleApproveGoNext}
                variant="default"
                className="bg-blue-600 hover:bg-blue-700"
            >
                <Check className="mr-2 h-4 w-4" />
                Approve - Go Next
            </Button>
        </div>
    );
}
