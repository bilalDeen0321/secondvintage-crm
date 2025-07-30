
import React, { useEffect } from 'react';
import { WatchImage } from '../types/Watch';
import { Button } from '@/components/ui/button';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageViewerProps {
  images: WatchImage[];
  currentIndex: number;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
}

const ImageViewer = ({ images, currentIndex, onClose, onPrevious, onNext }: ImageViewerProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      e.stopPropagation(); // Prevent event bubbling
      
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
        e.preventDefault();
        onPrevious();
      } else if (e.key === 'ArrowRight' && currentIndex < images.length - 1) {
        e.preventDefault();
        onNext();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
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
      className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-[70]"
      onClick={handleBackdropClick}
    >
      {/* Close button */}
      <Button
        variant="outline"
        size="sm"
        onClick={handleClose}
        className="absolute top-4 right-4 z-10 bg-white/10 border-white/20 text-white hover:bg-white/20"
      >
        <X className="h-4 w-4" />
      </Button>

      {/* Previous button */}
      {currentIndex > 0 && (
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrevious}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/10 border-white/20 text-white hover:bg-white/20"
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
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/10 border-white/20 text-white hover:bg-white/20"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      )}

      {/* Image container */}
      <div className="relative max-w-[50vw] max-h-[50vh] flex flex-col items-center justify-center">
        <img
          src={images[currentIndex].url}
          alt={`Watch image ${currentIndex + 1}`}
          className="max-w-full max-h-full object-contain"
          onClick={(e) => e.stopPropagation()}
        />
        
        {/* Image counter - moved below the image */}
        <div className="mt-4 bg-black/50 text-white px-3 py-1 rounded text-sm">
          {currentIndex + 1} / {images.length}
        </div>
      </div>
    </div>
  );
};

export default ImageViewer;
