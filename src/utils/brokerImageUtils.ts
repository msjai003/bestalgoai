
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
    
    // Insert the image URL into the broker_profile_images table using the save_broker_profile_image function
    try {
      // Use the dedicated RPC function for broker_profile_images
      const { data: saveData, error: saveError } = await supabase.rpc(
        'save_broker_profile_image',
        {
          p_broker_id: brokerId,
          p_image_url: publicUrl
        }
      );
      
      if (saveError) {
        console.error('Error saving broker profile image:', saveError);
      } else {
        console.log('Successfully saved broker profile image:', saveData);
      }
      
      // Also update broker_infocap for backward compatibility
      const { error: upsertError } = await supabase.rpc(
        'upsert_broker_image',
        {
          p_broker_id: brokerId,
          p_image_url: publicUrl
        }
      );
      
      if (upsertError) {
        console.error('Error updating broker_infocap with image URL:', upsertError);
      }
    } catch (saveDbError) {
      console.error('Exception during save to database:', saveDbError);
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
    
    // First try to get broker image from broker_profile_images table using the RPC function
    const { data: profileImageData, error: profileImageError } = await supabase.rpc(
      'get_broker_profile_image',
      { p_broker_id: brokerId }
    );
    
    if (!profileImageError && profileImageData) {
      console.log('Retrieved broker image URL from profile_images function:', profileImageData);
      return profileImageData;
    }
    
    // If RPC fails, try direct query to broker_profile_images
    const { data: imageData, error: imageError } = await supabase
      .from('broker_profile_images')
      .select('image_url')
      .eq('broker_id', brokerId)
      .eq('is_active', true)
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    
    if (!imageError && imageData?.image_url) {
      console.log('Retrieved broker image URL from profile_images table:', imageData.image_url);
      return imageData.image_url;
    }
    
    // Fall back to checking broker_infocap table
    const { data: fallbackData, error: fallbackError } = await supabase
      .from('broker_infocap')
      .select('broker_image_url')
      .eq('broker_id', brokerId)
      .limit(1)
      .maybeSingle();
    
    if (!fallbackError && fallbackData?.broker_image_url) {
      console.log('Retrieved fallback broker image URL:', fallbackData.broker_image_url);
      return fallbackData.broker_image_url;
    }
    
    console.log('No image URL found for broker:', brokerId);
    return null;
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
