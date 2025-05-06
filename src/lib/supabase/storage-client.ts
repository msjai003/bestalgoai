
import { supabase } from './client';

// Storage credentials
const STORAGE_ACCESS_KEY = '75638775071c0690fd0949b66f828a86';
const STORAGE_SECRET_KEY = 'd30ade96f258048bc38bb236a0dcac80da898def97a1a5c15708062a43eda327';

// Function to get storage client with credentials
export const getStorageClient = () => {
  return {
    // Enhanced storage client with credentials
    downloadFile: async (bucket: string, filePath: string) => {
      try {
        const { data, error } = await supabase
          .storage
          .from(bucket)
          .download(filePath, {
            headers: {
              'x-access-key': STORAGE_ACCESS_KEY,
              'x-secret-key': STORAGE_SECRET_KEY,
            }
          });
          
        if (error) throw error;
        return { data, error: null };
      } catch (error) {
        console.error('Error downloading file:', error);
        return { data: null, error };
      }
    },
    
    // Get public URL with authentication headers
    getAuthenticatedUrl: (bucket: string, filePath: string) => {
      const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
      const url = new URL(data.publicUrl);
      
      // Append authentication parameters safely to URL
      url.searchParams.append('access_key', STORAGE_ACCESS_KEY);
      // Note: In a production environment, you should use a more secure way to pass the secret key
      
      return url.toString();
    }
  };
};
