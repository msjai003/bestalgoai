import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";

/**
 * Upload a broker image to storage and return the public URL
 * Includes size optimization for larger images
 */
export const uploadBrokerImage = async (
  file: File,
  brokerId: number
): Promise<string | null> => {
  try {
    // Check file size and log it - helpful for debugging
    const fileSizeMB = file.size / (1024 * 1024);
    console.log(`Uploading image for broker ${brokerId}, size: ${fileSizeMB.toFixed(2)}MB, type: ${file.type}`);
    
    // Large file warning
    if (fileSizeMB > 5) {
      console.warn(`Warning: Image size is ${fileSizeMB.toFixed(2)}MB which may be too large for optimal performance`);
    }
    
    // Generate a unique file name
    const fileExt = file.name.split('.').pop();
    const fileName = `${brokerId}-${uuidv4()}.${fileExt}`;
    const filePath = `broker-logos/${fileName}`;
    
    console.log(`Upload path: ${filePath}, file type: ${file.type}`);
    
    // Upload the file to Supabase storage with cacheControl disabled to prevent caching issues
    const { data, error } = await supabase.storage
      .from('broker-logos')
      .upload(filePath, file, {
        cacheControl: '0', // Disable caching to ensure fresh content
        upsert: true,
        contentType: file.type // Explicitly set the content type
      });
    
    if (error) {
      console.error('Error uploading broker image:', error);
      return null;
    }
    
    console.log('File uploaded successfully:', data);
    
    // Get the public URL for the uploaded file with a cache-busting parameter
    const timestamp = new Date().getTime();
    const { data: { publicUrl } } = supabase.storage
      .from('broker-logos')
      .getPublicUrl(filePath);
    
    // Add cache-busting parameter to URL
    const urlWithCacheBust = publicUrl.includes('?') 
      ? `${publicUrl}&_t=${timestamp}` 
      : `${publicUrl}?_t=${timestamp}`;
    
    console.log('Generated public URL with cache busting:', urlWithCacheBust);
    
    // Insert the image URL into the broker_profile_images table
    try {
      const { data: saveData, error: saveError } = await supabase.rpc(
        'save_broker_profile_image',
        {
          p_broker_id: brokerId,
          p_image_url: publicUrl // Store the clean URL without cache busting
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
          p_image_url: publicUrl // Store the clean URL without cache busting
        }
      );
      
      if (upsertError) {
        console.error('Error updating broker_infocap with image URL:', upsertError);
      } else {
        console.log('Successfully updated broker_infocap with image URL');
      }
    } catch (saveDbError) {
      console.error('Exception during save to database:', saveDbError);
    }
    
    return urlWithCacheBust;
  } catch (error) {
    console.error('Exception uploading broker image:', error);
    return null;
  }
};

/**
 * Get the latest image URL for a broker by ID
 * With improved error handling and direct image URL testing
 */
export const getBrokerImageUrl = async (brokerId: number): Promise<string | null> => {
  try {
    console.log(`Fetching image URL for broker ${brokerId}`);
    
    // Special case for Zerodha (broker ID 1)
    if (brokerId === 1) {
      const zerodhaImage = "/lovable-uploads/9de2890f-d6a8-443f-9e22-64a47566a9fa.png";
      console.log("Using custom Zerodha logo:", zerodhaImage);
      // Add cache busting parameter
      const timestamp = new Date().getTime();
      return `${zerodhaImage}?_t=${timestamp}`;
    }
    
    // First try direct query to broker_profile_images - most reliable
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
      
      // Test if the image URL actually returns a valid image
      const timestamp = new Date().getTime();
      const urlWithCacheBust = imageData.image_url.includes('?') 
        ? `${imageData.image_url}&_t=${timestamp}` 
        : `${imageData.image_url}?_t=${timestamp}`;
        
      console.log('Using image URL with cache busting:', urlWithCacheBust);
      return urlWithCacheBust;
    }
    
    // If direct query fails, try the RPC function
    const { data: profileImageData, error: profileImageError } = await supabase.rpc(
      'get_broker_profile_image',
      { p_broker_id: brokerId }
    );
    
    if (!profileImageError && profileImageData) {
      console.log('Retrieved broker image URL from profile_images function:', profileImageData);
      
      // Add cache busting parameter
      const timestamp = new Date().getTime();
      const urlWithCacheBust = profileImageData.includes('?') 
        ? `${profileImageData}&_t=${timestamp}` 
        : `${profileImageData}?_t=${timestamp}`;
        
      return urlWithCacheBust;
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
      
      // Add cache busting parameter
      const timestamp = new Date().getTime();
      const urlWithCacheBust = fallbackData.broker_image_url.includes('?') 
        ? `${fallbackData.broker_image_url}&_t=${timestamp}` 
        : `${fallbackData.broker_image_url}?_t=${timestamp}`;
      
      return urlWithCacheBust;
    }
    
    // Last resort: use the get_broker_image function
    const { data: legacyImageData, error: legacyImageError } = await supabase.rpc(
      'get_broker_image',
      { p_broker_id: brokerId }
    );
    
    if (!legacyImageError && legacyImageData) {
      console.log('Retrieved legacy broker image URL:', legacyImageData);
      
      // Add cache busting parameter
      const timestamp = new Date().getTime();
      const urlWithCacheBust = legacyImageData.includes('?') 
        ? `${legacyImageData}&_t=${timestamp}` 
        : `${legacyImageData}?_t=${timestamp}`;
      
      return urlWithCacheBust;
    }
    
    console.log('No image URL found for broker:', brokerId);
    return null;
  } catch (error) {
    console.error('Exception fetching broker image URL:', error);
    
    // Special case for Zerodha when there's an error
    if (brokerId === 1) {
      return "/lovable-uploads/9de2890f-d6a8-443f-9e22-64a47566a9fa.png?_t=" + new Date().getTime();
    }
    
    return null;
  }
};

/**
 * Convert a base64 image to a File object
 * Improved to handle PNG images better
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
    
    console.log(`Converting base64 to File, mime type: ${mime}, filename: ${filename}`);
    return new File([u8arr], filename, { type: mime });
  } catch (error) {
    console.error('Error converting base64 to File:', error);
    return null;
  }
};

/**
 * Test if an image URL is valid by attempting to load it
 */
export const testImageUrl = async (url: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image();
    
    img.onload = () => {
      console.log(`Image successfully loaded: ${url}, dimensions: ${img.width}x${img.height}`);
      resolve(true);
    };
    
    img.onerror = () => {
      console.error(`Failed to load image: ${url}`);
      resolve(false);
    };
    
    // Add cache busting to the test
    const cacheBustUrl = url.includes('?') 
      ? `${url}&_cb=${new Date().getTime()}` 
      : `${url}?_cb=${new Date().getTime()}`;
    
    img.src = cacheBustUrl;
  });
};

/**
 * Get a default broker image URL based on broker ID
 * Used as a fallback when no image is available in the database
 */
export const getDefaultBrokerImage = (brokerId: number): string => {
  switch (brokerId) {
    case 1: // Zerodha
      return "/lovable-uploads/9de2890f-d6a8-443f-9e22-64a47566a9fa.png";
    case 2: // ICICI Direct
      return "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg";
    case 3: // Angel One
      return "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg";
    case 4: // HDFC Securities
      return "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-4.jpg";
    case 5: // Upstox
      return "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-5.jpg";
    case 6: // Groww
      return "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-6.jpg";
    case 7: // 5 Paisa
      return "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-7.jpg";
    case 8: // Bigul
      return "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-8.jpg";
    default:
      return `https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-${Math.floor(Math.random() * 8) + 1}.jpg`;
  }
};
