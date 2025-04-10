
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CredentialsForm } from "@/components/broker-integration/CredentialsForm";
import { AccountSettings } from "@/components/broker-integration/AccountSettings";
import { SuccessDialog } from "@/components/broker-integration/SuccessDialog";
import { BrokerHeader } from "@/components/broker-integration/BrokerHeader";
import { BrokerFunctions } from "@/components/broker-integration/BrokerFunctions";
import { useBrokerConnection } from "@/hooks/useBrokerConnection";
import { accountTypes } from "@/components/broker-integration/BrokerData";
import { Skeleton } from "@/components/ui/skeleton";
import { Broker } from "@/types/broker";
import { fetchBrokerById } from "@/services/brokerService";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

const BrokerCredentials = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { brokerId } = location.state || {};
  
  const [selectedBroker, setSelectedBroker] = useState<Broker | null>(null);
  const [fetchingBroker, setFetchingBroker] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  const loadBroker = async (forceRefresh = false) => {
    if (!brokerId) {
      navigate("/broker-integration");
      return;
    }

    setFetchingBroker(true);
    
    // Generate a timestamp for cache busting
    const timestamp = forceRefresh ? new Date().getTime() : undefined;
    
    try {
      console.log(`Loading broker ${brokerId} details${forceRefresh ? ' (force refresh)' : ''}...`);
      const broker = await fetchBrokerById(brokerId);
      if (!broker) {
        toast.error("Broker not found");
        navigate("/broker-integration");
        return;
      }
      setSelectedBroker(broker);
      setLastRefreshed(new Date());
      
      if (forceRefresh) {
        toast.success("Broker details refreshed successfully");
      }
    } catch (error) {
      console.error("Error fetching broker:", error);
      toast.error("Failed to load broker details");
      navigate("/broker-integration");
    } finally {
      setFetchingBroker(false);
    }
  };

  useEffect(() => {
    // Initial load
    loadBroker(false);
    
    // Set up improved real-time subscription for broker details changes
    const brokerDetailsChannel = supabase
      .channel('broker_details_credential_page')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'broker_details', filter: `id=eq.${brokerId}` }, 
        (payload) => {
          console.log('📢 Broker details changed for current broker:', payload);
          
          // Check for name changes specifically
          const oldName = payload.old?.broker_name;
          const newName = payload.new?.broker_name;
          
          // Short delay to ensure database consistency
          setTimeout(() => {
            loadBroker(true);
            
            if (payload.eventType === 'UPDATE' && oldName !== newName && payload.new) {
              toast.info(`Broker name changed from "${oldName}" to "${newName}"`);
            } else {
              const brokerName = payload.new?.broker_name || payload.old?.broker_name || 'Unknown';
              toast.info(`Broker "${brokerName}" information updated`);
            }
          }, 500);
        }
      )
      .subscribe((status) => {
        console.log('Broker details channel subscription status:', status);
      });
    
    // Add improved subscription for brokers_admin table changes for this specific broker
    const brokersAdminChannel = supabase
      .channel('brokers_admin_credential_page')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'brokers_admin', filter: `id=eq.${brokerId}` }, 
        (payload) => {
          console.log('📢 Broker admin data changed for current broker:', payload);
          
          // Check for name changes specifically
          const oldName = payload.old?.broker_name;
          const newName = payload.new?.broker_name;
          
          // Short delay to ensure database consistency
          setTimeout(() => {
            loadBroker(true);
            
            if (payload.eventType === 'UPDATE' && oldName !== newName && payload.new) {
              toast.info(`Broker name changed from "${oldName}" to "${newName}"`);
            } else {
              const brokerName = payload.new?.broker_name || payload.old?.broker_name || 'Unknown';
              toast.info(`Broker "${brokerName}" administration data updated`);
            }
          }, 500);
        }
      )
      .subscribe((status) => {
        console.log('Broker admin channel subscription status:', status);
      });
    
    // Set up a more frequent refresh interval (every 5 seconds)
    const refreshInterval = setInterval(() => {
      loadBroker(false);
    }, 5000); // Refresh every 5 seconds
    
    // Clean up on unmount
    return () => {
      clearInterval(refreshInterval);
      supabase.removeChannel(brokerDetailsChannel);
      supabase.removeChannel(brokersAdminChannel);
    };
  }, [brokerId, navigate]);

  const handleRefresh = () => {
    loadBroker(true);
    toast.success("Broker details refreshed");
  };

  const showApiFields = selectedBroker?.apiRequired || false;

  const {
    connectionStep,
    credentials,
    setCredentials,
    selectedAccount,
    setSelectedAccount,
    permissions,
    setPermissions,
    showSuccessDialog,
    setShowSuccessDialog,
    handleCredentialsSubmit,
    handleSettingsSubmit,
    handleComplete,
    handleBack,
    isSubmitting,
    isConnected,
    isLoading,
    productType,
    setProductType
  } = useBrokerConnection(selectedBroker);

  if (fetchingBroker) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 pt-20 px-4">
        <BrokerHeader 
          onBack={() => navigate("/broker-integration")} 
          title="Loading Broker" 
        />
        <div className="space-y-4 mt-8">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    );
  }

  if (!selectedBroker) {
    return null; // Will redirect in useEffect
  }

  const renderCurrentStep = () => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      );
    }
    
    switch (connectionStep) {
      case "credentials":
        return (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">{selectedBroker.name}</h2>
              <div className="flex flex-col sm:flex-row gap-2 items-end sm:items-center">
                <div className="text-xs text-gray-400">
                  Last updated: {lastRefreshed.toLocaleTimeString()}
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleRefresh}
                  className="flex gap-2 items-center"
                >
                  <RefreshCw className="h-4 w-4" />
                  Refresh
                </Button>
              </div>
            </div>
            
            <CredentialsForm
              selectedBroker={selectedBroker}
              credentials={credentials}
              setCredentials={setCredentials}
              showApiFields={showApiFields}
              onBack={handleBack}
              isConnected={isConnected}
              productType={productType}
              setProductType={setProductType}
            />
            
            {selectedBroker && (
              <div className="mt-8">
                <BrokerFunctions 
                  brokerId={selectedBroker.id} 
                  brokerName={selectedBroker.name} 
                />
              </div>
            )}
          </div>
        );
      case "settings":
        return (
          <AccountSettings
            selectedAccount={selectedAccount}
            setSelectedAccount={setSelectedAccount}
            permissions={permissions}
            setPermissions={setPermissions}
            accountTypes={accountTypes}
            onBack={handleBack}
          />
        );
      default:
        return null;
    }
  };

  const handleStepSubmit = () => {
    switch (connectionStep) {
      case "credentials":
        handleCredentialsSubmit();
        break;
      case "settings":
        handleSettingsSubmit();
        break;
    }
  };

  const getActionButtonText = () => {
    if (isConnected) {
      return "Update Credentials";
    }
    
    switch (connectionStep) {
      case "credentials":
        return "Continue";
      case "settings":
        return "Connect Broker";
      default:
        return "Continue";
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <BrokerHeader 
        onBack={handleBack} 
        title={isConnected ? "Edit Broker Connection" : "Connect Your Broker"} 
      />

      <main className="pt-20 px-4 pb-24">
        {renderCurrentStep()}
      </main>

      <section className="fixed bottom-0 left-0 right-0 p-4 bg-gray-900/95 backdrop-blur-lg border-t border-gray-800">
        <div className="flex flex-col gap-3">
          <button
            className="w-full h-12 bg-gradient-to-r from-cyan to-cyan/80 text-charcoalPrimary rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleStepSubmit}
            disabled={isSubmitting || isLoading}
          >
            {isSubmitting ? "Processing..." : getActionButtonText()}
          </button>
          
          <button
            className="w-full h-12 border border-charcoalSecondary bg-transparent text-charcoalTextPrimary rounded-xl font-semibold"
            onClick={handleBack}
            disabled={isSubmitting || isLoading}
          >
            Cancel
          </button>
        </div>
      </section>

      <SuccessDialog
        open={showSuccessDialog}
        setOpen={setShowSuccessDialog}
        selectedBroker={selectedBroker}
        selectedAccount={selectedAccount}
        permissions={permissions}
        onComplete={handleComplete}
      />
    </div>
  );
};

export default BrokerCredentials;
