import { useState, useEffect } from "react";
import { 
  fetchBrokerDetails, 
  saveBroker, 
  updateBroker, 
  deleteBroker 
} from "@/services/brokerService";
import { Broker } from "@/types/broker";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { toast } from "sonner";
import { Plus, Pencil, Trash, ArrowLeft, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";
import { uploadBrokerImage, getBrokerImageUrl } from "@/utils/brokerImageUtils";

const BrokerManagement = () => {
  const navigate = useNavigate();
  const [brokers, setBrokers] = useState<Broker[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBroker, setEditingBroker] = useState<Partial<Broker> | null>(null);
  const [requiredInputs, setRequiredInputs] = useState<string[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    loadBrokers();
  }, []);

  const loadBrokers = async () => {
    setLoading(true);
    try {
      const brokerData = await fetchBrokerDetails();
      setBrokers(brokerData);
    } catch (error) {
      console.error("Error loading brokers:", error);
      toast.error("Failed to load broker list");
    } finally {
      setLoading(false);
    }
  };

  const handleAddBroker = () => {
    setEditingBroker({});
    setRequiredInputs([]);
    setImageFile(null);
    setImagePreview(null);
    setDialogOpen(true);
  };

  const handleEditBroker = async (broker: Broker) => {
    setEditingBroker(broker);
    setRequiredInputs(broker.requiredInputs || []);
    
    // Get the latest image URL from our new table
    const imageUrl = await getBrokerImageUrl(broker.id);
    setImagePreview(imageUrl || broker.logo);
    setImageFile(null);
    
    setDialogOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    setImageFile(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditingBroker(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleRequiredInputChange = (input: string, checked: boolean) => {
    if (checked) {
      setRequiredInputs(prev => [...prev, input]);
    } else {
      setRequiredInputs(prev => prev.filter(i => i !== input));
    }
  };

  const handleSaveBroker = async () => {
    if (!editingBroker || !editingBroker.name) {
      toast.error("Broker name is required");
      return;
    }

    try {
      let imageUrl = editingBroker.logo;
      
      // If we have a new image file, upload it using our updated function
      if (imageFile) {
        // For new brokers without ID, use a temporary ID (will be replaced after save)
        const tempBrokerId = editingBroker.id || Math.floor(Math.random() * -1000);
        
        const uploadedUrl = await uploadBrokerImage(
          imageFile, 
          tempBrokerId
        );
        
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
          console.log("Image uploaded successfully:", uploadedUrl);
        } else {
          console.warn("Failed to upload image");
        }
      }

      const brokerData = {
        ...editingBroker,
        logo: imageUrl,
        requiredInputs: requiredInputs
      };

      let success = false;
      if (editingBroker.id) {
        success = await updateBroker(editingBroker.id, brokerData);
        if (success) {
          // If we uploaded an image with a temporary ID, re-upload it with the real ID
          if (imageFile && imageUrl && !editingBroker.id) {
            await uploadBrokerImage(imageFile, editingBroker.id);
          }
          toast.success("Broker updated successfully");
        }
      } else {
        const newId = await saveBroker(brokerData);
        if (newId) {
          // If we have a new image, re-upload it with the real broker ID
          if (imageFile && imageUrl) {
            await uploadBrokerImage(imageFile, newId);
          }
          toast.success("Broker added successfully");
          success = true;
        }
      }

      if (success) {
        setDialogOpen(false);
        loadBrokers();
      } else {
        toast.error("Failed to save broker");
      }
    } catch (error) {
      console.error("Error saving broker:", error);
      toast.error("An error occurred while saving the broker");
    }
  };

  const handleDeleteBroker = async (brokerId: number) => {
    if (!window.confirm("Are you sure you want to delete this broker?")) {
      return;
    }

    try {
      const success = await deleteBroker(brokerId);
      if (success) {
        toast.success("Broker deleted successfully");
        loadBrokers();
      } else {
        toast.error("Failed to delete broker");
      }
    } catch (error) {
      console.error("Error deleting broker:", error);
      toast.error("An error occurred while deleting the broker");
    }
  };

  return (
    <div className="min-h-screen bg-charcoalPrimary text-charcoalTextPrimary">
      <header className="fixed top-0 left-0 right-0 bg-charcoalPrimary/95 backdrop-blur-lg border-b border-charcoalSecondary z-50">
        <div className="flex items-center justify-between px-4 h-16">
          <Button 
            variant="ghost" 
            className="p-2"
            onClick={() => navigate('/settings')}
          >
            <ArrowLeft className="w-5 h-5 text-charcoalTextSecondary" />
          </Button>
          <h1 className="text-lg font-semibold">Broker Management</h1>
          <Button 
            variant="ghost" 
            className="p-2"
            onClick={handleAddBroker}
          >
            <Plus className="w-5 h-5 text-charcoalTextSecondary" />
          </Button>
        </div>
      </header>

      <main className="pt-20 px-4 pb-24">
        <div className="bg-charcoalSecondary rounded-lg p-4">
          {loading ? (
            <div className="text-center py-8">
              <p>Loading brokers...</p>
            </div>
          ) : brokers.length === 0 ? (
            <div className="text-center py-8">
              <p>No brokers found. Add your first broker to get started.</p>
              <Button 
                onClick={handleAddBroker}
                className="mt-4"
              >
                Add Broker
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Logo</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Required Inputs</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {brokers.map(broker => (
                  <TableRow key={broker.id}>
                    <TableCell>
                      <img 
                        src={broker.logo} 
                        alt={broker.name} 
                        className="w-10 h-10 rounded-lg object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/placeholder.svg";
                        }}
                      />
                    </TableCell>
                    <TableCell>{broker.name}</TableCell>
                    <TableCell>
                      {broker.requiredInputs?.join(", ") || "None"}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEditBroker(broker)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteBroker(broker.id)}
                        >
                          <Trash className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </main>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-charcoalSecondary border-charcoalSecondary text-white">
          <DialogHeader>
            <DialogTitle>
              {editingBroker?.id ? "Edit Broker" : "Add Broker"}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              {editingBroker?.id 
                ? "Update the broker details below." 
                : "Fill in the broker details below."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Broker Name</Label>
              <Input
                id="name"
                name="name"
                value={editingBroker?.name || ""}
                onChange={handleInputChange}
                className="bg-gray-800 border-gray-700"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={editingBroker?.description || ""}
                onChange={handleInputChange}
                className="bg-gray-800 border-gray-700"
              />
            </div>

            <div>
              <Label>Required Inputs</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="input-username" 
                    checked={requiredInputs.includes("username")}
                    onCheckedChange={(checked) => 
                      handleRequiredInputChange("username", checked as boolean)
                    }
                  />
                  <Label htmlFor="input-username">Username</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="input-password" 
                    checked={requiredInputs.includes("password")}
                    onCheckedChange={(checked) => 
                      handleRequiredInputChange("password", checked as boolean)
                    }
                  />
                  <Label htmlFor="input-password">Password</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="input-api_key" 
                    checked={requiredInputs.includes("api_key")}
                    onCheckedChange={(checked) => 
                      handleRequiredInputChange("api_key", checked as boolean)
                    }
                  />
                  <Label htmlFor="input-api_key">API Key</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="input-secret_key" 
                    checked={requiredInputs.includes("secret_key")}
                    onCheckedChange={(checked) => 
                      handleRequiredInputChange("secret_key", checked as boolean)
                    }
                  />
                  <Label htmlFor="input-secret_key">Secret Key</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="input-session_id" 
                    checked={requiredInputs.includes("session_id")}
                    onCheckedChange={(checked) => 
                      handleRequiredInputChange("session_id", checked as boolean)
                    }
                  />
                  <Label htmlFor="input-session_id">Session ID</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="input-two_factor" 
                    checked={requiredInputs.includes("two_factor")}
                    onCheckedChange={(checked) => 
                      handleRequiredInputChange("two_factor", checked as boolean)
                    }
                  />
                  <Label htmlFor="input-two_factor">2FA</Label>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="logo">Broker Logo</Label>
              <div className="flex items-center space-x-4 mt-2">
                {imagePreview && (
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-16 h-16 rounded-lg object-cover border border-gray-700"
                  />
                )}
                <Label 
                  htmlFor="logo-upload" 
                  className="cursor-pointer bg-gray-800 hover:bg-gray-700 text-white p-2 rounded-lg flex items-center space-x-2"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload Image</span>
                </Label>
                <Input
                  id="logo-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setDialogOpen(false)}
              className="border-gray-700"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveBroker}
              className="bg-gradient-to-r from-cyan to-cyan/80 text-charcoalPrimary"
            >
              {editingBroker?.id ? "Update" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BrokerManagement;
