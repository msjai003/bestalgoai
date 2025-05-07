
/**
 * Utility functions for interacting with Supabase storage buckets
 */

import { supabase } from '@/lib/supabase/client';
import { STORAGE_BUCKETS } from '@/lib/supabase/connection';

/**
 * Upload a file to a specific storage bucket
 * 
 * @param file The file to upload
 * @param bucketName The bucket name to upload to
 * @param path Optional path within the bucket
 * @returns Promise with the upload result
 */
export const uploadFile = async (file: File, bucketName: string, path?: string) => {
  const filePath = path || file.name;
  
  try {
    console.log(`Attempting to upload ${file.name} (${file.size} bytes, type: ${file.type}) to ${bucketName} bucket`);
    
    // Sanitize the filename - remove special characters that could cause issues
    const sanitizedFileName = filePath.replace(/[#%&{}\<>*?/$!'":@+`|=]/g, '_');
    
    // For ZIP files, ensure we're sending the correct content type
    const options: {
      cacheControl: string;
      upsert: boolean;
      contentType?: string;
    } = {
      cacheControl: '3600',
      upsert: false
    };
    
    // Explicitly set content type for zip files to ensure proper handling
    if (file.name.toLowerCase().endsWith('.zip')) {
      options.contentType = 'application/zip';
      console.log('Setting content type to application/zip for ZIP file upload');
    }
    
    const { data, error } = await supabase
      .storage
      .from(bucketName)
      .upload(sanitizedFileName !== filePath ? sanitizedFileName : filePath, file, options);
    
    if (error) {
      console.error(`Storage upload error: ${error.message}`, error);
      
      // Check for common error messages and provide more specific feedback
      if (error.message.includes('The resource already exists')) {
        return { 
          data: null, 
          error: { 
            message: `A file with the name "${file.name}" already exists. Please rename your file or use a different name.`, 
            status: 409 
          } 
        };
      }
      
      return { data: null, error };
    } else {
      console.log(`Upload successful: ${data?.path}`);
    }
    
    return { data, error };
  } catch (error: any) {
    console.error("Error uploading file:", error);
    return { data: null, error: { message: error.message || "Unknown upload error", status: 500 } };
  }
};

/**
 * Get a list of files from a specific storage bucket
 * 
 * @param bucketName The bucket name to list files from
 * @returns Promise with the file list result
 */
export const listFiles = async (bucketName: string) => {
  try {
    console.log(`Listing files from ${bucketName} bucket`);
    
    const { data, error } = await supabase
      .storage
      .from(bucketName)
      .list();
    
    if (error) {
      console.error(`Storage list error: ${error.message}`);
    } else {
      console.log(`Found ${data?.length || 0} files in ${bucketName}`);
    }
    
    return { data, error };
  } catch (error: any) {
    console.error("Error listing files:", error);
    return { data: null, error: { message: error.message || "Unknown listing error", status: 500 } };
  }
};

/**
 * Get a public URL for a file in a specific storage bucket
 * 
 * @param fileName The file name
 * @param bucketName The bucket name containing the file
 * @returns The public URL for the file
 */
export const getFileUrl = (fileName: string, bucketName: string) => {
  const { data } = supabase
    .storage
    .from(bucketName)
    .getPublicUrl(fileName);
  
  return data.publicUrl;
};

/**
 * Helper to format file size in a human-readable way
 * 
 * @param bytes File size in bytes
 * @returns Formatted file size string
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  
  return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i];
};

// Re-export storage bucket constants for convenience
export { STORAGE_BUCKETS };
