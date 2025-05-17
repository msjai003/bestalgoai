
import React, { useState } from "react";
import Header from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { useAuth } from "@/contexts/auth/AuthContext";
import LoadingState from "@/components/files/LoadingState";
import EmptyFilesState from "@/components/files/EmptyFilesState";
import FilesList from "@/components/files/FilesList";
import { useFileManagement } from "@/hooks/useFileManagement";
import PaymentSuccessModal from "@/components/files/PaymentSuccessModal";

const Files: React.FC = () => {
  const { user } = useAuth();
  const { 
    files, 
    isLoading, 
    hasPremium 
  } = useFileManagement(user?.id);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

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

          {files.length === 0 ? (
            <EmptyFilesState />
          ) : (
            <FilesList 
              files={files} 
              hasPremium={hasPremium}
              onPaymentSuccess={() => setShowSuccessModal(true)}
            />
          )}
        </div>
      </main>
      
      <PaymentSuccessModal 
        show={showSuccessModal} 
        onClose={() => setShowSuccessModal(false)} 
      />
      
      <BottomNav />
    </div>
  );
};

export default Files;
