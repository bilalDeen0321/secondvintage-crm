import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
    handleNext: () => void;
    handlePrevious: () => void;
    onNext: (() => void) | undefined;
    onPrevious: (() => void) | undefined;
}

export function PlatformNavigation({ handleNext, handlePrevious, onNext, onPrevious }: Props) {
    return (
        <>
            {onPrevious && (
                <Button
                    onClick={handlePrevious}
                    size="icon"
                    variant="outline"
                    className="fixed left-8 top-1/2 z-[60] -translate-y-1/2 transform border-2 bg-white shadow-lg hover:bg-gray-50"
                    style={{ left: "calc(50vw - 600px - 60px)" }}
                >
                    <ChevronLeft className="h-5 w-5" />
                </Button>
            )}

            {onNext && (
                <Button
                    onClick={handleNext}
                    size="icon"
                    variant="outline"
                    className="fixed right-8 top-1/2 z-[60] -translate-y-1/2 transform border-2 bg-white shadow-lg hover:bg-gray-50"
                    style={{ right: "calc(50vw - 600px - 60px)" }}
                >
                    <ChevronRight className="h-5 w-5" />
                </Button>
            )}
        </>
    );
}
