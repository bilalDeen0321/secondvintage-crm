import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import React, { useEffect } from "react";
import { WatchImage } from "../types/Watch";

interface ImageViewerProps {
    images: WatchImage[];
    currentIndex: number;
    onClose: () => void;
    onPrevious: () => void;
    onNext: () => void;
}

const ImageViewer = ({
    images,
    currentIndex,
    onClose,
    onPrevious,
    onNext,
}: ImageViewerProps) => {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            e.stopPropagation(); // Prevent event bubbling

            if (e.key === "Escape") {
                onClose();
            } else if (e.key === "ArrowLeft" && currentIndex > 0) {
                e.preventDefault();
                onPrevious();
            } else if (
                e.key === "ArrowRight" &&
                currentIndex < images.length - 1
            ) {
                e.preventDefault();
                onNext();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [currentIndex, images.length, onClose, onPrevious, onNext]);

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handlePrevious = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (currentIndex > 0) {
            onPrevious();
        }
    };

    const handleNext = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (currentIndex < images.length - 1) {
            onNext();
        }
    };

    const handleClose = (e: React.MouseEvent) => {
        e.stopPropagation();
        onClose();
    };

    if (!images[currentIndex]) {
        return null;
    }

    return (
        <div
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black bg-opacity-90"
            onClick={handleBackdropClick}
        >
            {/* Close button */}
            <Button
                variant="outline"
                size="sm"
                onClick={handleClose}
                className="absolute right-4 top-4 z-10 border-white/20 bg-white/10 text-white hover:bg-white/20"
            >
                <X className="h-4 w-4" />
            </Button>

            {/* Previous button */}
            {currentIndex > 0 && (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrevious}
                    className="absolute left-4 top-1/2 z-10 -translate-y-1/2 transform border-white/20 bg-white/10 text-white hover:bg-white/20"
                >
                    <ChevronLeft className="h-5 w-5" />
                </Button>
            )}

            {/* Next button */}
            {currentIndex < images.length - 1 && (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNext}
                    className="absolute right-4 top-1/2 z-10 -translate-y-1/2 transform border-white/20 bg-white/10 text-white hover:bg-white/20"
                >
                    <ChevronRight className="h-5 w-5" />
                </Button>
            )}

            {/* Image container */}
            <div className="relative flex max-h-[50vh] max-w-[50vw] flex-col items-center justify-center">
                <img
                    src={images[currentIndex].url}
                    alt={`Watch image ${currentIndex + 1}`}
                    className="max-h-full max-w-full object-contain"
                    onClick={(e) => e.stopPropagation()}
                />

                {/* Image counter - moved below the image */}
                <div className="mt-4 rounded bg-black/50 px-3 py-1 text-sm text-white">
                    {currentIndex + 1} / {images.length}
                </div>
            </div>
        </div>
    );
};

export default ImageViewer;
