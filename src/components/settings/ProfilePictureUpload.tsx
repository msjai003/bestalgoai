
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, UserCircle } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ProfilePictureUploadProps {
  currentImageUrl: string | null;
  onImageChange: (url: string) => void;
}

export const ProfilePictureUpload = ({
  currentImageUrl,
  onImageChange,
}: ProfilePictureUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }

    const file = e.target.files[0];
    
    if (!file.type.match('image/(jpeg|jpg|png|gif|webp)')) {
      toast.error("Please select an image file (JPEG, PNG, GIF, WEBP)");
      return;
    }
    
    // No file size check - allow any size

    setIsUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload the file to Supabase storage
      const { data, error } = await supabase.storage
        .from('profile_pictures')
        .upload(filePath, file);

      if (error) {
        throw error;
      }

      // Get the public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from('profile_pictures')
        .getPublicUrl(filePath);

      // Call the onImageChange callback to update the parent component
      onImageChange(publicUrl);
      toast.success("Profile picture uploaded successfully");

    } catch (error: any) {
      console.error('Error uploading profile picture:', error);
      toast.error(error.message || 'Failed to upload profile picture');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="relative group">
      <input
        type="file"
        id="profilePicture"
        className="hidden"
        accept="image/jpeg,image/png,image/gif,image/webp"
        onChange={handleFileSelect}
      />
      <label htmlFor="profilePicture">
        <div className="relative cursor-pointer">
          <Avatar className="w-20 h-20 border-2 border-gray-700 group-hover:border-pink-500 transition-all">
            {currentImageUrl ? (
              <AvatarImage src={currentImageUrl} alt="Profile" className="object-cover" />
            ) : null}
            <AvatarFallback className="bg-gray-800 text-white">
              <UserCircle className="w-8 h-8" />
            </AvatarFallback>
          </Avatar>
          
          <div className="absolute inset-0 bg-black bg-opacity-0 rounded-full flex items-center justify-center group-hover:bg-opacity-50 transition-all">
            <Upload className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-all" />
          </div>
          
          {isUploading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          )}
        </div>
      </label>
    </div>
  );
};
