
import { supabase } from "@/integrations/supabase/client";
import { brokers } from "@/components/broker-integration/BrokerData";
import { getBrokerImageUrl } from "./brokerImageUtils";
import { toast } from "sonner";

/**
 * Ensures that all broker images are properly saved in the broker_profile_images table
 * This is useful to run on application startup to make sure all hardcoded images are in the database
 */
export const ensureAllBrokerImagesInDatabase = async (): Promise<void> => {
  try {
    console.log("Ensuring all broker images are saved in the database...");
    
    // Process each broker in the static data
    for (const broker of brokers) {
      await ensureBrokerImageInDatabase(broker.id, broker.logo);
    }
    
    console.log("All broker images have been verified in the database");
  } catch (error) {
    console.error("Error ensuring broker images in database:", error);
  }
};

/**
 * Ensures a specific broker image is saved in the broker_profile_images table
 * If the image already exists in the database, this function does nothing
 */
export const ensureBrokerImageInDatabase = async (
  brokerId: number, 
  imageUrl: string
): Promise<void> => {
  try {
    // First check if broker already has an image in the database
    const existingImage = await getBrokerImageUrl(brokerId);
    
    // If there's no existing image or it doesn't match the one we want to ensure
    if (!existingImage || !existingImage.includes(imageUrl)) {
      console.log(`Saving broker image for broker ${brokerId} to database: ${imageUrl}`);
      
      // Save the image URL to the broker_profile_images table
      const { data, error } = await supabase.rpc(
        'save_broker_profile_image',
        {
          p_broker_id: brokerId,
          p_image_url: imageUrl
        }
      );
      
      if (error) {
        console.error(`Error saving broker image for broker ${brokerId}:`, error);
      } else {
        console.log(`Successfully saved broker image for broker ${brokerId}:`, data);
      }
      
      // Also update broker_infocap for backward compatibility
      const { error: upsertError } = await supabase.rpc(
        'upsert_broker_image',
        {
          p_broker_id: brokerId,
          p_image_url: imageUrl
        }
      );
      
      if (upsertError) {
        console.error(`Error updating broker_infocap for broker ${brokerId}:`, upsertError);
      } else {
        console.log(`Successfully updated broker_infocap for broker ${brokerId}`);
      }
    } else {
      console.log(`Broker ${brokerId} already has the correct image in the database`);
    }
  } catch (error) {
    console.error(`Error ensuring broker image in database for broker ${brokerId}:`, error);
  }
};

/**
 * Updates a broker image in the database with a new URL
 * This is useful when manually changing images in the admin panel
 * @param brokerId The broker ID
 * @param newImageUrl The new image URL
 * @returns boolean indicating success
 */
export const updateBrokerImageInDatabase = async (
  brokerId: number,
  newImageUrl: string
): Promise<boolean> => {
  try {
    console.log(`Updating broker image for broker ${brokerId} to: ${newImageUrl}`);
    
    // Save to broker_profile_images table (this will mark old images as inactive)
    const { data, error } = await supabase.rpc(
      'save_broker_profile_image',
      {
        p_broker_id: brokerId,
        p_image_url: newImageUrl
      }
    );
    
    if (error) {
      console.error(`Error updating broker image for broker ${brokerId}:`, error);
      toast.error(`Failed to update image for broker ID ${brokerId}`);
      return false;
    }
    
    // Also update broker_infocap for backward compatibility
    const { error: upsertError } = await supabase.rpc(
      'upsert_broker_image',
      {
        p_broker_id: brokerId,
        p_image_url: newImageUrl
      }
    );
    
    if (upsertError) {
      console.error(`Error updating broker_infocap with image URL:`, upsertError);
      // Don't return false here, as the primary update succeeded
    }
    
    // Update the static data as well if possible
    try {
      const brokerIndex = brokers.findIndex(b => b.id === brokerId);
      if (brokerIndex >= 0) {
        console.log(`Updating static data for broker ${brokerId}`);
        brokers[brokerIndex].logo = newImageUrl;
      }
    } catch (staticError) {
      console.warn("Could not update static broker data:", staticError);
    }
    
    toast.success(`Updated image for broker ID ${brokerId}`);
    return true;
  } catch (error) {
    console.error(`Exception updating broker image in database for broker ${brokerId}:`, error);
    toast.error(`Failed to update image for broker ID ${brokerId}`);
    return false;
  }
};

/**
 * Force refresh all broker images from the database
 * This is useful when images have been updated in the database
 * and you want to ensure the UI reflects these changes
 */
export const refreshBrokerImagesFromDatabase = async (): Promise<void> => {
  try {
    console.log("Refreshing all broker images from database...");
    
    // Clear any cached images first by adding a random timestamp
    localStorage.setItem('broker_image_refresh', Date.now().toString());
    
    // For each broker in the static data, force refresh image
    for (const broker of brokers) {
      const imageUrl = await getBrokerImageUrl(broker.id, true);
      console.log(`Refreshed image for broker ${broker.id}:`, imageUrl);
    }
    
    console.log("All broker images have been refreshed");
    toast.success("Broker images refreshed successfully");
  } catch (error) {
    console.error("Error refreshing broker images:", error);
    toast.error("Failed to refresh broker images");
  }
};
