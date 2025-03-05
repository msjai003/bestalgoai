
import { useState, useRef } from "react";
import { Camera, Upload, X } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

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
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    };
    reader.readAsDataURL(file);
  };

  const handleSaveImage = () => {
    if (previewUrl) {
      onImageChange(previewUrl);
      toast.success("Profile picture updated successfully");
      setIsDialogOpen(false);
      setPreviewUrl(null);
    }
  };

  const handleCancelUpload = () => {
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <>
      <div className="relative group">
        <img 
          src={currentImageUrl} 
          alt="Profile" 
          className="w-16 h-16 rounded-full border-2 border-pink-600 transition-opacity group-hover:opacity-80 object-cover"
        />
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
                <div className="relative">
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    className="w-32 h-32 rounded-full object-cover border-2 border-pink-500"
                  />
                  <button
                    onClick={handleCancelUpload}
                    className="absolute -top-2 -right-2 bg-gray-800 rounded-full p-1 border border-gray-700"
                  >
                    <X className="w-4 h-4 text-gray-200" />
                  </button>
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

            <div className="text-xs text-gray-400 bg-gray-800/50 p-3 rounded-lg">
              <p>• Recommended: Square image (1:1 ratio)</p>
              <p>• Maximum size: 5MB</p>
              <p>• Formats: JPEG, PNG, GIF, WEBP</p>
            </div>

            <div className="flex flex-col gap-3 mt-4">
              {previewUrl ? (
                <Button 
                  onClick={handleSaveImage}
                  className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-5 rounded-xl font-medium"
                >
                  Save New Picture
                </Button>
              ) : (
                <Button 
                  onClick={triggerFileInput}
                  className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-5 rounded-xl font-medium"
                >
                  Select Image
                </Button>
              )}
              
              <DialogClose asChild>
                <Button 
                  variant="outline" 
                  className="w-full border border-gray-700 bg-transparent text-white py-5 rounded-xl font-medium"
                >
                  Cancel
                </Button>
              </DialogClose>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
