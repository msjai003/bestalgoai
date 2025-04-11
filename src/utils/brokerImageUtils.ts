
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
    
    // Get the public URL for the uploaded file
    const { data: { publicUrl } } = supabase.storage
      .from('broker-logos')
      .getPublicUrl(filePath);
    
    // Update the broker_image field in the broker_infocap table
    // First check if we have any records for this broker, if not create one
    const { data: brokerData, error: fetchError } = await supabase
      .from('broker_infocap')
      .select('id')
      .eq('broker_id', brokerId)
      .limit(1);
      
    if (fetchError) {
      console.error('Error checking broker existence:', fetchError);
    }
    
    if (brokerData && brokerData.length > 0) {
      // Update existing broker records
      const { error: updateError } = await supabase
        .from('broker_infocap')
        .update({ broker_image: publicUrl })
        .eq('broker_id', brokerId);
      
      if (updateError) {
        console.error('Error updating broker image in database:', updateError);
      }
    } else {
      // Create a placeholder record to store the image URL
      const brokerInfo = await supabase
        .from('broker_infocap')
        .select('*')
        .eq('broker_id', brokerId)
        .limit(1);
        
      // If no records exist, create a basic one with the image
      if (!brokerInfo.data || brokerInfo.data.length === 0) {
        const { error: insertError } = await supabase
          .from('broker_infocap')
          .insert({
            broker_id: brokerId,
            broker_name: `Broker ${brokerId}`,
            function_name: 'default',
            function_slug: 'default',
            broker_image: publicUrl,
            function_order: 0
          });
          
        if (insertError) {
          console.error('Error inserting broker placeholder with image:', insertError);
        }
      }
    }
    
    return publicUrl;
  } catch (error) {
    console.error('Exception uploading broker image:', error);
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
