
import { useState, useRef, useCallback } from "react";
import { Camera, Upload, X, ZoomIn, ZoomOut, Check, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface ProfilePictureUploadProps {
  currentImageUrl: string;
  onImageChange: (newImageUrl: string) => void;
}

export function ProfilePictureUpload({ 
  currentImageUrl, 
  onImageChange 
}: ProfilePictureUploadProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [zoom, setZoom] = useState<number[]>([1]);
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isUploading, setIsUploading] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.match('image/(jpeg|jpg|png|gif|webp)')) {
      toast.error("Please select an image file (JPEG, PNG, GIF, WEBP)");
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image is too large. Maximum size is 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
      // Reset adjustments when a new image is loaded
      setZoom([1]);
      setRotation(0);
      setPosition({ x: 0, y: 0 });
    };
    reader.readAsDataURL(file);
  };

  const uploadToSupabase = async (dataUrl: string): Promise<string | null> => {
    if (!user) {
      toast.error("You must be logged in to upload a profile picture");
      return null;
    }
    
    try {
      setIsUploading(true);
      
      // Convert data URL to Blob
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      
      // Generate a unique file name
      const fileExt = blob.type.split('/')[1];
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;
      
      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('profile_pictures')
        .upload(filePath, blob);
      
      if (error) {
        throw error;
      }
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('profile_pictures')
        .getPublicUrl(filePath);
      
      return publicUrl;
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      toast.error('Failed to upload profile picture');
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveImage = async () => {
    if (previewUrl) {
      try {
        // In a real implementation, we would apply the zoom, rotation and position
        // to the image by rendering to a canvas before saving
        
        // Upload the image to Supabase
        const uploadedUrl = await uploadToSupabase(previewUrl);
        
        if (uploadedUrl) {
          onImageChange(uploadedUrl);
          toast.success("Profile picture updated successfully");
          setIsDialogOpen(false);
          resetImageState();
        }
      } catch (error) {
        console.error("Error saving profile picture:", error);
        toast.error("Failed to update profile picture");
      }
    }
  };

  const resetImageState = () => {
    setPreviewUrl(null);
    setZoom([1]);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCancelUpload = () => {
    resetImageState();
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  // Mouse/touch event handlers for dragging
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  }, [position]);

  const handleTouchStart = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      const touch = e.touches[0];
      setDragStart({
        x: touch.clientX - position.x,
        y: touch.clientY - position.y
      });
    }
  }, [position]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  }, [isDragging, dragStart]);

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (isDragging && e.touches.length === 1) {
      const touch = e.touches[0];
      setPosition({
        x: touch.clientX - dragStart.x,
        y: touch.clientY - dragStart.y
      });
    }
  }, [isDragging, dragStart]);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  const getTransformStyle = () => {
    return {
      transform: `translate(${position.x}px, ${position.y}px) rotate(${rotation}deg) scale(${zoom[0]})`,
      cursor: isDragging ? 'grabbing' : 'grab'
    };
  };

  return (
    <>
      <div className="relative group">
        <Avatar className="w-16 h-16 border-2 border-pink-600 group-hover:opacity-80 transition-opacity">
          <AvatarImage 
            src={currentImageUrl} 
            alt="Profile" 
            className="object-cover"
          />
          <AvatarFallback className="bg-gray-800 text-white text-lg">
            {currentImageUrl ? 'U' : '?'}
          </AvatarFallback>
        </Avatar>
        <button
          onClick={() => setIsDialogOpen(true)}
          className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Camera className="w-5 h-5 text-white" />
        </button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-gray-900/95 backdrop-blur-xl border border-gray-700 text-gray-100 p-6 rounded-xl w-[95%] max-w-md mx-auto shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold mb-4">
              Update Profile Picture
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {previewUrl ? (
              <div className="flex flex-col items-center">
                <div 
                  ref={imageContainerRef}
                  className="relative w-64 h-64 rounded-full overflow-hidden border-2 border-pink-500 mb-4"
                  style={{ touchAction: 'none' }}
                >
                  <div 
                    className="absolute inset-0 flex items-center justify-center"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleDragEnd}
                    onMouseLeave={handleDragEnd}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleDragEnd}
                  >
                    <img 
                      src={previewUrl} 
                      alt="Preview" 
                      className="h-full w-full object-cover transition-transform"
                      style={getTransformStyle()}
                      draggable={false}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-center space-x-3 mb-4">
                  <Button 
                    size="icon" 
                    variant="outline" 
                    onClick={() => setZoom(prev => [Math.max(prev[0] - 0.1, 0.5)])}
                    className="border border-gray-700 bg-gray-800 text-gray-200"
                  >
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  
                  <div className="w-32">
                    <Slider
                      value={zoom}
                      min={0.5}
                      max={2}
                      step={0.01}
                      onValueChange={setZoom}
                      className="cursor-pointer"
                    />
                  </div>
                  
                  <Button 
                    size="icon" 
                    variant="outline" 
                    onClick={() => setZoom(prev => [Math.min(prev[0] + 0.1, 2)])}
                    className="border border-gray-700 bg-gray-800 text-gray-200"
                  >
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                  
                  <Button 
                    size="icon" 
                    variant="outline"
                    onClick={handleRotate}
                    className="border border-gray-700 bg-gray-800 text-gray-200"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex gap-3 w-full">
                  <Button 
                    onClick={handleCancelUpload}
                    variant="outline"
                    className="flex-1 border border-gray-700 bg-transparent text-white py-5 rounded-xl font-medium"
                  >
                    <X className="w-4 h-4 mr-2" /> Cancel
                  </Button>
                  
                  <Button 
                    onClick={handleSaveImage}
                    disabled={isUploading}
                    className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600 text-white py-5 rounded-xl font-medium"
                  >
                    {isUploading ? 'Uploading...' : <><Check className="w-4 h-4 mr-2" /> Apply</>}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div 
                  className="w-32 h-32 rounded-full bg-gray-800 border-2 border-dashed border-gray-600 flex items-center justify-center cursor-pointer hover:bg-gray-750 transition-colors"
                  onClick={triggerFileInput}
                >
                  <Upload className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-sm text-gray-400 mt-2">Click to select an image</p>
              </div>
            )}

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/jpeg, image/png, image/gif, image/webp"
              className="hidden"
            />

            {!previewUrl && (
              <>
                <div className="text-xs text-gray-400 bg-gray-800/50 p-3 rounded-lg">
                  <p>• Square images work best (1:1 ratio)</p>
                  <p>• Maximum size: 5MB</p>
                  <p>• Formats: JPEG, PNG, GIF, WEBP</p>
                </div>

                <div className="flex flex-col gap-3 mt-4">
                  <Button 
                    onClick={triggerFileInput}
                    className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-5 rounded-xl font-medium"
                  >
                    Select Image
                  </Button>
                  
                  <DialogClose asChild>
                    <Button 
                      variant="outline" 
                      className="w-full border border-gray-700 bg-transparent text-white py-5 rounded-xl font-medium"
                    >
                      Cancel
                    </Button>
                  </DialogClose>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
