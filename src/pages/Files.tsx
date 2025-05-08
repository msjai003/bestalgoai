
import React from "react";
import Header from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { useAuth } from "@/contexts/AuthContext";
import LoadingState from "@/components/files/LoadingState";
import PremiumBanner from "@/components/files/PremiumBanner";
import EmptyFilesState from "@/components/files/EmptyFilesState";
import FilesList from "@/components/files/FilesList";
import { useFileManagement } from "@/hooks/useFileManagement";

const Files: React.FC = () => {
  const { user } = useAuth();
  const { 
    files, 
    isLoading, 
    hasPremium,
    hasPremiumFiles
  } = useFileManagement(user?.id);

  // Check if any file is a ZIP file
  const hasZipFiles = files.some(
    file => file.type === "zip" || file.name.toLowerCase().endsWith('.zip')
  );

  // Show premium banner if there are premium or zip files
  const shouldShowPremiumBanner = hasPremiumFiles || hasZipFiles;

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="bg-charcoalPrimary min-h-screen">
      <Header />
      <main className="pt-16 pb-20 px-4">
        <div className="mt-4 mb-6">
          <h1 className="text-2xl font-semibold text-white">Files</h1>
          <p className="text-gray-400 mt-1">Download trading resources and templates</p>
        </div>

        <div className="bg-charcoalSecondary rounded-lg p-4">
          <h2 className="text-lg font-medium text-white mb-4">Trading Files</h2>

          {/* Premium features notice */}
          {shouldShowPremiumBanner && (
            <PremiumBanner />
          )}

          {files.length === 0 ? (
            <EmptyFilesState />
          ) : (
            <FilesList files={files} hasPremium={hasPremium} />
          )}
        </div>
      </main>
      
      <BottomNav />
    </div>
  );
};

export default Files;
