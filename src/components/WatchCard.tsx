
import React, { useState } from 'react';
import { Watch } from '../types/Watch';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import ImageViewer from './ImageViewer';

interface WatchCardProps {
  watch: Watch;
  onEdit: (watch: Watch) => void;
  onDelete: (id: string) => void;
}

const WatchCard = ({ watch, onEdit, onDelete }: WatchCardProps) => {
  const [imageViewer, setImageViewer] = useState<{
    isOpen: boolean;
    images: any[];
    currentIndex: number;
  }>({
    isOpen: false,
    images: [],
    currentIndex: 0
  });

  const getStatusColor = (status: Watch['status']) => {
    switch (status) {
      case 'Draft': return 'bg-gray-100 text-gray-800';
      case 'Review': return 'bg-blue-100 text-blue-800';
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'Platform Review': return 'bg-blue-600 text-white';
      case 'Ready for listing': return 'bg-green-100 text-green-800';
      case 'Listed': return 'bg-green-600 text-white';
      case 'Reserved': return 'bg-purple-100 text-purple-800';
      case 'Sold': return 'bg-slate-100 text-slate-800';
      case 'Defect/Problem': return 'bg-red-100 text-red-800';
      case 'Standby': return 'bg-amber-100 text-amber-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (watch.images && watch.images.length > 0) {
      setImageViewer({
        isOpen: true,
        images: watch.images,
        currentIndex: 0
      });
    }
  };

  const handleCloseImageViewer = () => {
    setImageViewer({
      isOpen: false,
      images: [],
      currentIndex: 0
    });
  };

  const handlePreviousImage = () => {
    setImageViewer(prev => ({
      ...prev,
      currentIndex: Math.max(0, prev.currentIndex - 1)
    }));
  };

  const handleNextImage = () => {
    setImageViewer(prev => ({
      ...prev,
      currentIndex: Math.min(prev.images.length - 1, prev.currentIndex + 1)
    }));
  };

  const handleCardClick = () => {
    onEdit(watch);
  };

  const handleNameClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(watch);
  };

  return (
    <>
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
        {/* Image */}
        <div 
          className="aspect-square bg-slate-100 relative overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
          onClick={handleImageClick}
        >
          {watch.images && watch.images.length > 0 ? (
            <img
              src={watch.images[0].url}
              alt={watch.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src="/lovable-uploads/e4da5380-362e-422c-a981-6370f96719da.png"
              alt="Watch placeholder"
              className="w-full h-full object-cover opacity-50"
            />
          )}
          {watch.images && watch.images.length > 1 && (
            <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
              +{watch.images.length - 1}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 
              className="font-medium text-slate-900 line-clamp-2 cursor-pointer hover:text-blue-600 transition-colors"
              onClick={handleNameClick}
            >
              {watch.name}
            </h3>
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ml-2 ${getStatusColor(watch.status)}`}>
              {watch.status}
            </span>
          </div>
          
          <div className="space-y-1 mb-3">
            <p className="text-sm text-slate-600">SKU: {watch.sku}</p>
            <p className="text-sm text-slate-600">Brand: {watch.brand}</p>
            {watch.acquisitionCost && (
              <p className="text-sm font-medium text-slate-900">
                €{watch.acquisitionCost.toLocaleString()}
              </p>
            )}
            <p className="text-sm text-slate-600">Location: {watch.location}</p>
          </div>

          {watch.description && (
            <p className="text-xs text-slate-600 line-clamp-2 mb-3">
              {watch.description}
            </p>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(watch)}
              className="flex-1 text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700"
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(watch.id)}
              className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {imageViewer.isOpen && (
        <ImageViewer
          images={imageViewer.images}
          currentIndex={imageViewer.currentIndex}
          onClose={handleCloseImageViewer}
          onPrevious={handlePreviousImage}
          onNext={handleNextImage}
        />
      )}
    </>
  );
};

export default WatchCard;
