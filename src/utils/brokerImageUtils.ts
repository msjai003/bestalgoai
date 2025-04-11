
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";

/**
 * Upload a broker image to storage and return the public URL
 */
export const uploadBrokerImage = async (
  file: File,
  brokerId: number
): Promise<string | null> => {
  try {
    // Generate a unique file name
    const fileExt = file.name.split('.').pop();
    const fileName = `${brokerId}-${uuidv4()}.${fileExt}`;
    const filePath = `broker-logos/${fileName}`;
    
    console.log(`Uploading image for broker ${brokerId}, path: ${filePath}`);
    
    // Upload the file to Supabase storage
    const { data, error } = await supabase.storage
      .from('broker-logos')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });
    
    if (error) {
      console.error('Error uploading broker image:', error);
      return null;
    }
    
    console.log('File uploaded successfully:', data);
    
    // Get the public URL for the uploaded file
    const { data: { publicUrl } } = supabase.storage
      .from('broker-logos')
      .getPublicUrl(filePath);
    
    console.log('Generated public URL:', publicUrl);
    
    // Store the image URL in the broker_image table using our RPC function
    // The function now returns an integer ID instead of UUID
    const { data: imageData, error: insertError } = await supabase.rpc(
      'upsert_broker_image',
      {
        p_broker_id: brokerId,
        p_image_url: publicUrl
      }
    );
    
    if (insertError) {
      console.error('Error storing broker image URL:', insertError);
    } else {
      console.log('Broker image URL stored successfully, ID:', imageData);
    }
    
    return publicUrl;
  } catch (error) {
    console.error('Exception uploading broker image:', error);
    return null;
  }
};

/**
 * Get the latest image URL for a broker by ID
 */
export const getBrokerImageUrl = async (brokerId: number): Promise<string | null> => {
  try {
    console.log(`Fetching image URL for broker ${brokerId}`);
    
    // Use our RPC function to get the broker image URL
    const { data, error } = await supabase.rpc(
      'get_broker_image_url',
      {
        p_broker_id: brokerId
      }
    );
    
    if (error) {
      console.error('Error fetching broker image URL:', error);
      return null;
    }
    
    console.log('Retrieved broker image URL:', data);
    return data || null;
  } catch (error) {
    console.error('Exception fetching broker image URL:', error);
    return null;
  }
};

/**
 * Convert a base64 image to a File object
 */
export const base64ToFile = (
  base64String: string,
  filename: string
): File | null => {
  try {
    // Extract the MIME type and base64 data
    const arr = base64String.split(',');
    if (arr.length < 2) return null;
    
    const mimeMatch = arr[0].match(/:(.*?);/);
    if (!mimeMatch) return null;
    
    const mime = mimeMatch[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    
    return new File([u8arr], filename, { type: mime });
  } catch (error) {
    console.error('Error converting base64 to File:', error);
    return null;
  }
};
