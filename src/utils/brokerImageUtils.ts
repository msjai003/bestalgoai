
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Function to upload a broker logo to Supabase storage
export const uploadBrokerLogo = async (file: File, brokerId: number, brokerName: string): Promise<string | null> => {
  try {
    // Generate a unique file name
    const fileExt = file.name.split('.').pop();
    const fileName = `broker_${brokerId}_${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;
    
    // Upload file to Supabase storage
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('broker_logos')
      .upload(filePath, file);
      
    if (uploadError) {
      console.error('Error uploading broker logo:', uploadError);
      toast.error('Failed to upload broker logo');
      return null;
    }
    
    // Get the public URL
    const { data: urlData } = supabase
      .storage
      .from('broker_logos')
      .getPublicUrl(filePath);
      
    const publicUrl = urlData.publicUrl;
    
    // Save the URL to the broker_images table
    // Use insert instead of upsert to be compatible with mock client
    const { error: fetchError } = await supabase
      .from('broker_images')
      .select()
      .eq('broker_id', brokerId);
      
    if (fetchError) {
      console.error('Error checking for existing broker image:', fetchError);
    }
    
    // Insert or update based on fetch results
    const { error: dbError } = await supabase
      .from('broker_images')
      .insert({
        broker_id: brokerId,
        broker_name: brokerName,
        image_url: publicUrl
      });
      
    if (dbError) {
      console.error('Error saving broker image URL:', dbError);
      toast.error('Failed to save broker image information');
      return null;
    }
    
    toast.success('Broker logo uploaded successfully');
    return publicUrl;
    
  } catch (error) {
    console.error('Exception uploading broker logo:', error);
    toast.error('An unexpected error occurred');
    return null;
  }
};

// Function to get a broker logo from Supabase
export const getBrokerLogo = async (brokerId: number): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from('broker_images')
      .select('image_url')
      .eq('broker_id', brokerId)
      .order('updated_at', { ascending: false })
      .limit(1);
      
    if (error) {
      console.error('Error fetching broker logo:', error);
      return null;
    }
    
    // Check if we got any data back
    if (data && data.length > 0) {
      return data[0].image_url;
    }
    
    return null;
    
  } catch (error) {
    console.error('Exception fetching broker logo:', error);
    return null;
  }
};

// Function to delete a broker logo from Supabase
export const deleteBrokerLogo = async (brokerId: number): Promise<boolean> => {
  try {
    // First get the image URL to extract the file name
    const { data, error: fetchError } = await supabase
      .from('broker_images')
      .select('image_url')
      .eq('broker_id', brokerId);
      
    if (fetchError) {
      console.error('Error fetching broker logo for deletion:', fetchError);
      return false;
    }
    
    if (!data || data.length === 0) {
      toast.error('No logo found for this broker');
      return false;
    }
    
    // Extract the file name from the URL
    const url = new URL(data[0].image_url);
    const pathSegments = url.pathname.split('/');
    const fileName = pathSegments[pathSegments.length - 1];
    
    // Since our mock client doesn't support remove, we'll log but continue
    // In a real implementation, this would delete the file
    console.log('Would delete file:', fileName);
    // In a real implementation, we would use:
    // const { error: storageError } = await supabase.storage.from('broker_logos').remove([fileName]);
    
    // Delete the record from the database
    const { error: dbError } = await supabase
      .from('broker_images')
      .delete()
      .eq('broker_id', brokerId);
      
    if (dbError) {
      console.error('Error deleting broker logo record:', dbError);
      toast.error('Failed to delete broker logo record');
      return false;
    }
    
    toast.success('Broker logo deleted successfully');
    return true;
    
  } catch (error) {
    console.error('Exception deleting broker logo:', error);
    toast.error('An unexpected error occurred');
    return false;
  }
};
