
import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { uploadBrokerLogo, deleteBrokerLogo } from "@/utils/brokerImageUtils";
import { Loader2, RefreshCcw, Trash, Upload } from "lucide-react";

interface BrokerImage {
  id: number;
  broker_id: number;
  broker_name: string;
  image_url: string;
  updated_at: string;
}

export const BrokerImageManager = () => {
  const [brokerImages, setBrokerImages] = useState<BrokerImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadingFor, setUploadingFor] = useState<number | null>(null);
  const [deletingFor, setDeletingFor] = useState<number | null>(null);
  
  // Fetch broker images from Supabase
  const fetchBrokerImages = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('broker_images')
        .select('*')
        .order('broker_id', { ascending: true });
        
      if (error) {
        console.error('Error fetching broker images:', error);
        toast.error('Failed to load broker images');
        return;
      }
      
      setBrokerImages(data || []);
    } catch (error) {
      console.error('Exception fetching broker images:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchBrokerImages();
  }, []);
  
  // Handle file upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, brokerId: number, brokerName: string) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Validate file type
    const fileType = file.type;
    if (!fileType.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }
    
    setUploadingFor(brokerId);
    
    try {
      const publicUrl = await uploadBrokerLogo(file, brokerId, brokerName);
      if (publicUrl) {
        // Refresh the list
        fetchBrokerImages();
      }
    } finally {
      setUploadingFor(null);
      // Reset the file input
      event.target.value = '';
    }
  };
  
  // Handle logo deletion
  const handleDeleteLogo = async (brokerId: number) => {
    setDeletingFor(brokerId);
    
    try {
      const success = await deleteBrokerLogo(brokerId);
      if (success) {
        // Refresh the list
        fetchBrokerImages();
      }
    } finally {
      setDeletingFor(null);
    }
  };
  
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Broker Image Manager</h1>
        <Button 
          variant="outline" 
          onClick={fetchBrokerImages}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <RefreshCcw className="h-4 w-4 mr-2" />
          )}
          Refresh
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Broker ID</TableHead>
              <TableHead>Broker Name</TableHead>
              <TableHead>Current Image</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {brokerImages.length > 0 ? (
              brokerImages.map((image) => (
                <TableRow key={image.id}>
                  <TableCell>{image.broker_id}</TableCell>
                  <TableCell>{image.broker_name}</TableCell>
                  <TableCell>
                    <div className="w-16 h-16 relative">
                      <img 
                        src={image.image_url} 
                        alt={image.broker_name}
                        className="w-full h-full object-cover rounded-md"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://placehold.co/100x100?text=Error';
                        }}
                      />
                    </div>
                  </TableCell>
                  <TableCell>{new Date(image.updated_at).toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <div className="relative">
                        <input
                          type="file"
                          id={`file-${image.broker_id}`}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          onChange={(e) => handleFileUpload(e, image.broker_id, image.broker_name)}
                          accept="image/*"
                          disabled={uploadingFor === image.broker_id}
                        />
                        <Button 
                          variant="outline" 
                          size="sm"
                          disabled={uploadingFor === image.broker_id}
                        >
                          {uploadingFor === image.broker_id ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-1" />
                          ) : (
                            <Upload className="h-4 w-4 mr-1" />
                          )}
                          Update
                        </Button>
                      </div>
                      
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDeleteLogo(image.broker_id)}
                        disabled={deletingFor === image.broker_id}
                      >
                        {deletingFor === image.broker_id ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-1" />
                        ) : (
                          <Trash className="h-4 w-4 mr-1" />
                        )}
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  No broker images found. Upload images for your brokers.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
};
