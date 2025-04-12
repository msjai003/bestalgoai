
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getBrokerImageUrl } from "@/utils/brokerImageUtils";
import { updateBrokerImageInDatabase, refreshBrokerImagesFromDatabase } from "@/utils/ensureBrokerImages";
import { brokers } from "./BrokerData";
import { toast } from "sonner";
import { Loader, RefreshCw, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const BrokerImageManager: React.FC = () => {
  const [brokerImages, setBrokerImages] = useState<{ [key: number]: string | null }>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [updating, setUpdating] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    loadBrokerImages();
  }, []);

  const loadBrokerImages = async () => {
    setLoading(true);
    const images: { [key: number]: string | null } = {};
    
    for (const broker of brokers) {
      try {
        images[broker.id] = await getBrokerImageUrl(broker.id);
      } catch (err) {
        console.error(`Error fetching image for broker ${broker.id}:`, err);
        images[broker.id] = null;
      }
    }
    
    setBrokerImages(images);
    setLoading(false);
  };

  const handleImageUpload = async (brokerId: number, event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }

    const file = event.target.files[0];
    setUpdating((prev) => ({ ...prev, [brokerId]: true }));
    
    try {
      // Check file size
      if (file.size > 5 * 1024 * 1024) {
        toast.warning("File is too large (max 5MB)");
        return;
      }
      
      // Convert file to base64 to use as interim preview
      const reader = new FileReader();
      reader.onloadend = async () => {
        // Update state temporarily with the preview
        if (typeof reader.result === 'string') {
          setBrokerImages((prev) => ({ ...prev, [brokerId]: reader.result as string }));
          
          // Upload the file to storage
          const broker = brokers.find(b => b.id === brokerId);
          if (broker) {
            try {
              // Create a unique filename
              const fileExt = file.name.split('.').pop();
              const fileName = `${brokerId}-${Date.now()}.${fileExt}`;
              const filePath = `broker-logos/${fileName}`;
              
              // Upload to Supabase Storage
              const { data: uploadData, error: uploadError } = await supabase.storage
                .from('broker-logos')
                .upload(filePath, file, {
                  cacheControl: '0',
                  upsert: true,
                  contentType: file.type
                });
              
              if (uploadError) {
                console.error('Error uploading file:', uploadError);
                toast.error(`Error uploading image: ${uploadError.message}`);
                return;
              }
              
              // Get the public URL
              const { data: { publicUrl } } = supabase.storage
                .from('broker-logos')
                .getPublicUrl(filePath);
              
              // Update the image in the database with the new URL
              const success = await updateBrokerImageInDatabase(brokerId, publicUrl);
              
              if (success) {
                // Refresh the image from database
                const newImageUrl = await getBrokerImageUrl(brokerId, true);
                setBrokerImages((prev) => ({ ...prev, [brokerId]: newImageUrl }));
                toast.success(`Image for ${broker.name} updated successfully`);
              } else {
                toast.error(`Failed to update image for ${broker.name} in the database`);
              }
            } catch (err) {
              console.error(`Error processing upload for broker ${brokerId}:`, err);
              toast.error("Error processing upload");
            }
          }
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error(`Error uploading image for broker ${brokerId}:`, err);
      toast.error("Error uploading image");
    } finally {
      setUpdating((prev) => ({ ...prev, [brokerId]: false }));
    }
  };

  const handleRefreshImages = async () => {
    setRefreshing(true);
    try {
      await refreshBrokerImagesFromDatabase();
      await loadBrokerImages();
      toast.success("Broker images refreshed");
    } catch (err) {
      console.error("Error refreshing images:", err);
      toast.error("Error refreshing images");
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center">
        <Loader className="h-6 w-6 animate-spin text-cyan" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Broker Image Management</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefreshImages}
          disabled={refreshing}
          className="flex items-center gap-2"
        >
          {refreshing ? <Loader className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          Refresh All Images
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {brokers.map((broker) => (
          <div key={broker.id} className="bg-gray-800/30 p-4 rounded-xl border border-gray-700">
            <div className="flex items-center gap-4 mb-3">
              <Avatar className="w-12 h-12 rounded-lg overflow-hidden">
                <AvatarImage
                  src={brokerImages[broker.id] || undefined}
                  alt={broker.name}
                  className="rounded-lg object-cover"
                />
                <AvatarFallback className="w-12 h-12 rounded-lg bg-gray-700 flex items-center justify-center text-gray-300">
                  {broker.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">{broker.name}</h3>
                <p className="text-xs text-gray-400">ID: {broker.id}</p>
              </div>
            </div>

            <div className="mt-3">
              <Button
                variant="outline"
                size="sm"
                className="w-full relative flex items-center justify-center gap-2"
                disabled={updating[broker.id]}
              >
                {updating[broker.id] ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    Upload New Image
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(broker.id, e)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={updating[broker.id]}
                />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrokerImageManager;
