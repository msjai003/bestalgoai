
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
import { STORAGE_BUCKETS } from "@/utils/storageUtils";
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
        .from('file_links')
        .select('*')
        .eq('bucket_type', selectedBucket)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Error fetching files:", error);
        toast({
          title: "Error fetching files",
          description: "Could not load file list. Please try again later.",
          variant: "destructive",
        });
        return;
      }
      
      // Format the data to match the FileItem interface
      const filesWithFormat = data.map(file => {
        // Get file type
        let fileType = 'unknown';
        const extension = file.file_type.toLowerCase();
        
        if (extension === 'pdf') fileType = 'pdf';
        else if (['doc', 'docx'].includes(extension)) fileType = 'docx';
        else if (['zip', 'rar', '7z'].includes(extension)) fileType = 'zip';
        else if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) fileType = 'image';
        else if (['exe', 'msi'].includes(extension)) fileType = 'exe';
        else if (['xlsx', 'xls', 'csv'].includes(extension)) fileType = 'xlsx';
        
        return {
          id: file.id,
          name: file.name,
          size: file.size_display || 'Unknown size',
          created_at: file.created_at,
          type: fileType,
          url: file.google_drive_url,
          bucket: file.bucket_type
        };
      });
      
      setFiles(filesWithFormat);
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
                {files.length === 0 ? (
                  <div className="text-center py-8 flex flex-col items-center justify-center">
                    <FileArchive className="h-12 w-12 mb-3 text-gray-500" />
                    <p className="text-gray-400">Check back later for available files</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                    {files.map((file) => (
                      <FileItem 
                        key={file.id}
                        {...file}
                      />
                    ))}
                  </div>
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
