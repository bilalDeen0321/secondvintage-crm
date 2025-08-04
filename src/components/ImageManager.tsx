import { Button } from "@/components/ui/button";
import {
    closestCenter,
    DndContext,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    arrayMove,
    rectSortingStrategy,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Move, Sparkles, Upload, X, ZoomIn } from "lucide-react";
import React, { useRef, useState } from "react";
import { WatchImage } from "../types/Watch";
import ImageViewer from "./ImageViewer";

interface ImageManagerProps {
    images: WatchImage[];
    onChange: (images: WatchImage[]) => void;
}

interface SortableImageProps {
    image: WatchImage;
    index: number;
    onRemove: (imageId: string) => void;
    onToggleAI: (imageId: string) => void;
    onView: (index: number) => void;
    canToggleAI: boolean;
}

const SortableImage = ({
    image,
    index,
    onRemove,
    onToggleAI,
    onView,
    canToggleAI,
}: SortableImageProps) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: image.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="group relative aspect-square"
        >
            <img
                src={image.url}
                alt="Watch"
                className={`h-full w-full rounded-lg border object-cover ${
                    image.useForAI ? "border-orange-500" : "border-gray-200"
                }`}
            />
            <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black bg-opacity-0 transition-all group-hover:bg-opacity-50">
                <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100">
                    {/* First row: AI and Delete */}
                    <div className="flex gap-1">
                        <Button
                            type="button"
                            size="sm"
                            variant={image.useForAI ? "default" : "secondary"}
                            onClick={() => onToggleAI(image.id)}
                            disabled={!canToggleAI}
                            className="h-6 w-8 p-0 text-xs"
                        >
                            <Sparkles className="h-3 w-3" />
                        </Button>
                        <Button
                            type="button"
                            size="sm"
                            variant="destructive"
                            onClick={() => onRemove(image.id)}
                            className="h-6 w-8 p-0"
                        >
                            <X className="h-3 w-3" />
                        </Button>
                    </div>
                    {/* Second row: Zoom and Rearrange */}
                    <div className="flex gap-1">
                        <Button
                            type="button"
                            size="sm"
                            variant="secondary"
                            onClick={() => onView(index)}
                            className="h-6 w-8 p-0 text-xs"
                        >
                            <ZoomIn className="h-3 w-3" />
                        </Button>
                        <Button
                            type="button"
                            size="sm"
                            variant="secondary"
                            className="h-6 w-8 cursor-move p-0 text-xs"
                            {...attributes}
                            {...listeners}
                        >
                            <Move className="h-3 w-3" />
                        </Button>
                    </div>
                </div>
            </div>
            {image.useForAI && (
                <div className="absolute right-1 top-1">
                    <Sparkles className="h-4 w-4 text-amber-500" />
                </div>
            )}
        </div>
    );
};

const ImageManager = ({ images, onChange }: ImageManagerProps) => {
    const [isDragging, setIsDragging] = useState(false);
    const [viewerIndex, setViewerIndex] = useState<number | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
    );

    const addImages = (imageUrls: string[]) => {
        const newImages: WatchImage[] = imageUrls.map((url) => ({
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            url,
            useForAI: false,
        }));

        const totalImages = images.length + newImages.length;
        if (totalImages <= 40) {
            onChange([...images, ...newImages]);
        } else {
            const remainingSlots = 40 - images.length;
            if (remainingSlots > 0) {
                onChange([...images, ...newImages.slice(0, remainingSlots)]);
            }
        }
    };

    const removeImage = (imageId: string) => {
        if (window.confirm("Are you sure you want to remove this image?")) {
            onChange(images.filter((img) => img.id !== imageId));
        }
    };

    const toggleAIUsage = (imageId: string) => {
        const aiCount = images.filter((img) => img.useForAI).length;
        const targetImage = images.find((img) => img.id === imageId);

        // If trying to enable AI and already at limit, don't allow
        if (targetImage && !targetImage.useForAI && aiCount >= 10) {
            return;
        }

        onChange(
            images.map((img) =>
                img.id === imageId ? { ...img, useForAI: !img.useForAI } : img,
            ),
        );
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const files = Array.from(e.dataTransfer.files);
        const imageFiles = files.filter((file) =>
            file.type.startsWith("image/"),
        );

        if (imageFiles.length > 0) {
            const imageUrls: string[] = [];
            let processedCount = 0;

            imageFiles.forEach((file) => {
                const reader = new FileReader();
                reader.onload = (event) => {
                    if (event.target?.result) {
                        imageUrls.push(event.target.result as string);
                        processedCount++;

                        if (processedCount === imageFiles.length) {
                            addImages(imageUrls);
                        }
                    }
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const imageFiles = files.filter((file) =>
            file.type.startsWith("image/"),
        );

        if (imageFiles.length > 0) {
            const imageUrls: string[] = [];
            let processedCount = 0;

            imageFiles.forEach((file) => {
                const reader = new FileReader();
                reader.onload = (event) => {
                    if (event.target?.result) {
                        imageUrls.push(event.target.result as string);
                        processedCount++;

                        if (processedCount === imageFiles.length) {
                            addImages(imageUrls);
                        }
                    }
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const handleDragEnd = (event: any) => {
        const { active, over } = event;

        if (active.id !== over?.id) {
            const oldIndex = images.findIndex((img) => img.id === active.id);
            const newIndex = images.findIndex((img) => img.id === over.id);

            onChange(arrayMove(images, oldIndex, newIndex));
        }
    };

    const openViewer = (index: number) => {
        setViewerIndex(index);
    };

    const closeViewer = () => {
        setViewerIndex(null);
    };

    const previousImage = () => {
        if (viewerIndex !== null && viewerIndex > 0) {
            setViewerIndex(viewerIndex - 1);
        }
    };

    const nextImage = () => {
        if (viewerIndex !== null && viewerIndex < images.length - 1) {
            setViewerIndex(viewerIndex + 1);
        }
    };

    return (
        <>
            <div className="space-y-4">
                <div className="flex items-stretch gap-4">
                    <Button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={images.length >= 40}
                        variant="outline"
                        className="flex h-[72px] flex-shrink-0 flex-col items-center justify-center px-4"
                    >
                        <Upload className="mb-1 h-4 w-4" />
                        <span className="text-xs">Upload Images</span>
                    </Button>

                    <div
                        className={`flex-1 rounded-lg border-2 border-dashed p-3 text-center transition-colors ${
                            isDragging
                                ? "border-amber-400 bg-amber-50"
                                : "border-slate-300 hover:border-slate-400"
                        }`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        <Upload className="mx-auto mb-1 h-5 w-5 text-slate-400" />
                        <p className="text-xs text-slate-600">
                            Drag & drop images here
                        </p>
                        <p className="text-xs text-slate-500">JPG, PNG, WebP</p>
                    </div>

                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                    />
                </div>

                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={images.map((img) => img.id)}
                        strategy={rectSortingStrategy}
                    >
                        <div
                            className="mb-12 grid grid-cols-7 gap-3 overflow-y-auto"
                            style={{ maxHeight: "600px" }}
                        >
                            {images.map((image, index) => {
                                const aiCount = images.filter(
                                    (img) => img.useForAI,
                                ).length;
                                const canToggleAI =
                                    image.useForAI || aiCount < 10;

                                return (
                                    <SortableImage
                                        key={image.id}
                                        image={image}
                                        index={index}
                                        onRemove={removeImage}
                                        onToggleAI={toggleAIUsage}
                                        onView={openViewer}
                                        canToggleAI={canToggleAI}
                                    />
                                );
                            })}
                        </div>
                    </SortableContext>
                </DndContext>
            </div>

            {viewerIndex !== null && (
                <ImageViewer
                    images={images}
                    currentIndex={viewerIndex}
                    onClose={closeViewer}
                    onPrevious={previousImage}
                    onNext={nextImage}
                />
            )}
        </>
    );
};

export default ImageManager;
