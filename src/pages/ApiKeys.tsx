
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Copy, Eye, EyeOff, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface ApiKey {
  id: string;
  name: string;
  api_key: string;
  created_at: string;
  last_used?: string;
}

const ApiKeys = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [visibleKeys, setVisibleKeys] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchApiKeys();
  }, [user]);

  const fetchApiKeys = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      // Fetch API keys from Supabase
      const { data, error } = await supabase
        .from('user_api_keys')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true);

      if (error) {
        throw error;
      }
      
      // Map the database fields to our ApiKey interface
      const formattedKeys = data?.map(key => ({
        id: key.id,
        name: key.name || `Key ${new Date(key.created_at).toLocaleDateString()}`, // Provide a default name if not set
        api_key: key.api_key,
        created_at: key.created_at,
        last_used: key.last_used
      })) || [];
      
      setApiKeys(formattedKeys);
    } catch (error) {
      console.error("Error fetching API keys:", error);
      toast.error("Failed to load API keys");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleKeyVisibility = (keyId: string) => {
    setVisibleKeys(prev => ({
      ...prev,
      [keyId]: !prev[keyId]
    }));
  };

  const generateApiKey = () => {
    // Generate a random API key with trb_sk_ prefix
    const randomString = Array.from({ length: 24 }, () => 
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".charAt(
        Math.floor(Math.random() * 62)
      )
    ).join('');
    
    return `trb_sk_${randomString}`;
  };

  const handleCreateKey = async () => {
    if (!newKeyName.trim()) {
      toast.error("Please enter a name for your API key");
      return;
    }
    
    if (!user) {
      toast.error("You must be logged in to create API keys");
      return;
    }

    setIsCreating(true);
    try {
      const newApiKey = generateApiKey();
      
      // Insert the new key into Supabase
      const { data, error } = await supabase
        .from('user_api_keys')
        .insert({
          user_id: user.id,
          api_key: newApiKey,
          name: newKeyName,
          is_active: true
        })
        .select('*')
        .single();

      if (error) {
        throw error;
      }

      // Format the new key to match our ApiKey interface
      const formattedKey: ApiKey = {
        id: data.id,
        name: data.name || newKeyName, // Use the provided name or fall back to newKeyName
        api_key: data.api_key,
        created_at: data.created_at,
        last_used: data.last_used
      };

      // Add new key to state
      setApiKeys([formattedKey, ...apiKeys]);
      setShowAddDialog(false);
      setNewKeyName("");
      
      // Show the newly created key as visible
      setVisibleKeys(prev => ({
        ...prev,
        [formattedKey.id]: true
      }));
      
      toast.success("API key created successfully");
    } catch (error) {
      console.error("Error creating API key:", error);
      toast.error("Failed to create API key");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteKey = async (keyId: string) => {
    if (!user) {
      toast.error("You must be logged in to delete API keys");
      return;
    }

    try {
      // Soft delete by setting is_active to false
      const { error } = await supabase
        .from('user_api_keys')
        .update({ is_active: false })
        .eq('id', keyId)
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }

      // Update state to remove deleted key
      setApiKeys(apiKeys.filter(key => key.id !== keyId));
      toast.success("API key deleted");
    } catch (error) {
      console.error("Error deleting API key:", error);
      toast.error("Failed to delete API key");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("API key copied to clipboard");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-charcoalPrimary text-charcoalTextPrimary">
      <header className="fixed top-0 left-0 right-0 bg-charcoalPrimary/95 backdrop-blur-lg border-b border-gray-800 z-50">
        <div className="flex items-center justify-between px-4 h-16">
          <Button 
            variant="ghost" 
            className="p-2 hover:bg-charcoalSecondary hover:text-cyan"
            onClick={() => navigate('/settings')}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold text-cyan">API Keys</h1>
          <Button 
            variant="outline" 
            size="icon" 
            className="p-2 hover:bg-charcoalSecondary hover:text-cyan border-gray-700"
            onClick={() => setShowAddDialog(true)}
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <main className="pt-20 px-4 pb-24">
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-2">Your API Keys</h2>
          <p className="text-sm text-gray-400">
            API keys allow external applications to access your data. Keep them secure and never share them publicly.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin h-8 w-8 border-4 border-cyan rounded-full border-t-transparent"></div>
          </div>
        ) : apiKeys.length === 0 ? (
          <div className="text-center py-12 bg-charcoalSecondary/30 rounded-lg border border-gray-800/50">
            <p className="text-gray-400 mb-4">You haven't created any API keys yet</p>
            <Button 
              onClick={() => setShowAddDialog(true)}
              className="bg-cyan hover:bg-cyan/90 text-charcoalPrimary"
            >
              Create API Key
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {apiKeys.map((key) => (
              <div 
                key={key.id} 
                className="p-4 bg-charcoalSecondary/30 rounded-lg border border-gray-800/50"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{key.name}</h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-red-500 hover:text-red-400 hover:bg-red-900/20 p-2 h-8 w-8"
                    onClick={() => handleDeleteKey(key.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 bg-gray-800/50 rounded-md py-1 px-2 max-w-full overflow-hidden">
                    <code className="text-xs truncate max-w-[220px]">
                      {visibleKeys[key.id] ? key.api_key : '••••••••••••••••••••••••••'}
                    </code>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="p-1 h-6 w-6 text-gray-400 hover:text-white"
                      onClick={() => toggleKeyVisibility(key.id)}
                    >
                      {visibleKeys[key.id] ? (
                        <EyeOff className="w-3 h-3" />
                      ) : (
                        <Eye className="w-3 h-3" />
                      )}
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="p-1 h-6 w-6 text-gray-400 hover:text-white"
                      onClick={() => copyToClipboard(key.api_key)}
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                
                <div className="text-xs text-gray-400 flex justify-between mt-3">
                  <span>Created: {formatDate(key.created_at)}</span>
                  {key.last_used && (
                    <span>Last used: {formatDate(key.last_used)}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="bg-charcoalSecondary text-charcoalTextPrimary border border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">Create New API Key</DialogTitle>
            <DialogDescription className="text-gray-400">
              Give your API key a descriptive name to remember where it's used.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="key-name" className="text-gray-300">API Key Name</Label>
              <Input
                id="key-name"
                placeholder="e.g. Trading Bot, Mobile App"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                className="bg-charcoalPrimary border-gray-700 text-white"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowAddDialog(false)}
              className="border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCreateKey}
              className="bg-cyan hover:bg-cyan/90 text-charcoalPrimary"
              disabled={isCreating || !newKeyName.trim()}
            >
              {isCreating ? "Creating..." : "Create API Key"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ApiKeys;
