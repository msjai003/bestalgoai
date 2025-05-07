
import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { FileArchive, Loader } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase/client";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import { STORAGE_BUCKETS, formatFileSize } from "@/utils/storageUtils";
import FileItem from "@/components/files/FileItem";

interface FileItem {
  id: string;
  name: string;
  size: string;
  created_at: string;
  type: string;
  url: string;
  bucket: string;
}

const Files = () => {
  const { toast } = useToast();
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBucket, setSelectedBucket] = useState(STORAGE_BUCKETS.APP_FILES);

  useEffect(() => {
    fetchFiles();
  }, [selectedBucket]);

  const fetchFiles = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .storage
        .from(selectedBucket)
        .list();
      
      if (error) {
        console.error("Error fetching files:", error);
        toast({
          title: "Error fetching files",
          description: "Could not load file list. Please try again later.",
          variant: "destructive",
        });
        return;
      }
      
      // Filter out folders (.emptyFolders)
      const actualFiles = data?.filter(item => !item.id.includes('.emptyFolders')) || [];
      
      // Get URLs for each file
      const filesWithUrls = await Promise.all(actualFiles.map(async (file) => {
        const { data: urlData } = supabase
          .storage
          .from(selectedBucket)
          .getPublicUrl(file.name);
          
        // Get file type
        let fileType = 'unknown';
        const extension = file.name.split('.').pop()?.toLowerCase();
        
        if (extension === 'pdf') fileType = 'pdf';
        else if (['doc', 'docx'].includes(extension || '')) fileType = 'docx';
        else if (['zip', 'rar', '7z'].includes(extension || '')) fileType = 'zip';
        else if (['jpg', 'jpeg', 'png', 'gif'].includes(extension || '')) fileType = 'image';
        else if (['exe', 'msi'].includes(extension || '')) fileType = 'exe';
        
        // Format size
        const formattedSize = formatFileSize(file.metadata?.size || 0);
        
        return {
          id: file.id,
          name: file.name,
          size: formattedSize,
          created_at: file.created_at,
          type: fileType,
          url: urlData.publicUrl,
          bucket: selectedBucket
        };
      }));
      
      setFiles(filesWithUrls);
    } catch (error) {
      console.error("Exception fetching files:", error);
      toast({
        title: "Error fetching files",
        description: "Could not load file list. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getBucketDisplayName = (bucketId: string) => {
    switch (bucketId) {
      case STORAGE_BUCKETS.APP_FILES:
        return "Document Files";
      case STORAGE_BUCKETS.EXE_FILES:
        return "Executable Files";
      default:
        return bucketId;
    }
  };

  if (isLoading) {
    return (
      <div className="bg-charcoalPrimary min-h-screen">
        <Header />
        <main className="pt-16 pb-20 px-4 flex items-center justify-center">
          <div className="text-center">
            <Loader className="h-8 w-8 animate-spin text-cyan mx-auto mb-4" />
            <p className="text-gray-300">Loading files...</p>
          </div>
        </main>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="bg-charcoalPrimary min-h-screen">
      <Header />
      <main className="pt-16 pb-20 px-4">
        <div className="mt-4 mb-6">
          <h1 className="text-2xl font-semibold text-white">Files</h1>
          <p className="text-gray-400 mt-1">Download trading resources and templates</p>
        </div>

        <Tabs 
          defaultValue={STORAGE_BUCKETS.APP_FILES}
          value={selectedBucket}
          onValueChange={setSelectedBucket}
          className="w-full"
        >
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value={STORAGE_BUCKETS.APP_FILES} className="data-[state=active]:text-cyan">
              Documents
            </TabsTrigger>
            <TabsTrigger value={STORAGE_BUCKETS.EXE_FILES} className="data-[state=active]:text-cyan">
              Applications
            </TabsTrigger>
          </TabsList>

          {[STORAGE_BUCKETS.APP_FILES, STORAGE_BUCKETS.EXE_FILES].map((bucketId) => (
            <TabsContent key={bucketId} value={bucketId} className="mt-0">
              <div className="bg-charcoalSecondary rounded-lg p-4">
                <h2 className="text-lg text-white font-medium mb-3">
                  {getBucketDisplayName(bucketId)} 
                </h2>

                {files.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <FileArchive className="h-10 w-10 mx-auto mb-2 text-gray-500" />
                    <p>No files available in this section.</p>
                  </div>
                ) : (
                  <>
                    {files.map((file) => (
                      <FileItem 
                        key={file.id}
                        {...file}
                      />
                    ))}
                  </>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </main>
      <BottomNav />
    </div>
  );
};

export default Files;
