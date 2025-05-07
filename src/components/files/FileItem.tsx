
import React, { useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface FileItemProps {
  id: number;
  name: string;
  size: string;
  type: string;
  url: string;
  created_at: string;
  bucket: string;
  hasPremium: boolean;
  is_premium: boolean;
}

const FileItem = ({
  id,
  name,
  size,
  type,
  url,
  created_at,
  bucket,
  hasPremium,
  is_premium,
}: FileItemProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [hasPaid, setHasPaid] = useState(false);

  // Check if user has already paid for this premium file
  React.useEffect(() => {
    const checkPaymentStatus = async () => {
      if (user && is_premium) {
        const { data } = await supabase
          .from('user_file_payments')
          .select('*')
          .eq('user_id', user.id)
          .eq('file_id', id)
          .eq('status', 'completed')
          .maybeSingle();
        
        if (data) {
          setHasPaid(true);
        }
      }
    };
    
    checkPaymentStatus();
  }, [user, id, is_premium]);

  const canDownload = hasPremium || !is_premium || hasPaid;

  const handleDownload = async () => {
    setDownloadingId(id);
    
    try {
      // Open Google Drive link in a new tab
      window.open(url, '_blank');
      
      toast({
        title: "Download link opened",
        description: `${name} is being downloaded from Google Drive.`,
      });
    } catch (error) {
      console.error("Error during download:", error);
      toast({
        title: "Download failed",
        description: "Could not open the download link. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="flex items-center justify-between py-3 px-2 border-b border-gray-800 last:border-0 hover:bg-charcoalPrimary/30 rounded-md transition-colors">
      <div className="flex flex-col">
        <div className="flex items-center">
          <span className="font-medium text-white">{name}</span>
          {is_premium && hasPaid && (
            <Badge variant="success" className="ml-2">
              Paid
            </Badge>
          )}
        </div>
        <span className="text-sm text-gray-400">{size}</span>
      </div>
      
      {canDownload ? (
        <Button
          onClick={handleDownload}
          variant="ghost"
          size="sm"
          className="text-cyan hover:text-cyan hover:bg-transparent"
          disabled={downloadingId === id}
        >
          {downloadingId === id ? (
            <div className="h-4 w-4 border-2 border-current border-r-transparent rounded-full animate-spin"></div>
          ) : (
            <Download className="h-5 w-5" />
          )}
        </Button>
      ) : (
        <Button
          variant="ghost"
          size="sm" 
          disabled={true}
          className="text-gray-500 hover:bg-transparent cursor-not-allowed"
        >
          <Download className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
};

export default FileItem;
