
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Star, Eye, ChevronRight } from "lucide-react";
import { DeleteConfirmationDialog } from "@/components/strategy/DeleteConfirmationDialog";
import { loadWishlistItems, removeFromWishlist } from "@/hooks/strategy/useStrategyWishlist";

interface WishlistItem {
  id: number;
  name: string;
  description: string;
}

const Wishlist = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<WishlistItem | null>(null);

  useEffect(() => {
    const fetchWishlistItems = async () => {
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please log in to view your wishlist",
          variant: "destructive",
        });
        navigate('/auth');
        return;
      }

      setIsLoading(true);
      try {
        const items = await loadWishlistItems(user.id);
        setWishlistItems(items);
      } catch (error) {
        console.error("Error loading wishlist:", error);
        toast({
          title: "Error",
          description: "Failed to load your wishlist items",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchWishlistItems();
  }, [user, navigate, toast]);

  const handleRemoveFromWishlist = (item: WishlistItem) => {
    setItemToDelete(item);
    setDeleteConfirmOpen(true);
  };

  const confirmDeleteItem = async () => {
    if (!itemToDelete || !user) return;
    
    try {
      await removeFromWishlist(user.id, itemToDelete.id);
      
      setWishlistItems(prev => prev.filter(item => item.id !== itemToDelete.id));
      
      toast({
        title: "Removed from wishlist",
        description: `${itemToDelete.name} has been removed from your wishlist`,
        variant: "default",
      });
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      toast({
        title: "Error",
        description: "Failed to remove item from wishlist",
        variant: "destructive",
      });
    } finally {
      setDeleteConfirmOpen(false);
      setItemToDelete(null);
    }
  };

  const cancelDeleteItem = () => {
    setDeleteConfirmOpen(false);
    setItemToDelete(null);
  };

  const handleViewDetails = (id: number) => {
    navigate(`/strategy-details/${id}`);
  };

  return (
    <div className="min-h-screen bg-charcoalPrimary text-charcoalTextPrimary">
      <Header />
      <main className="pt-16 pb-24 px-4">
        <div className="premium-card p-5 mb-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan/20 to-cyan/5 rounded-full -mr-16 -mt-16 blur-3xl z-0"></div>
          <div className="relative z-10">
            <h1 className="text-2xl font-bold text-white mb-2">My Wishlist</h1>
            <p className="text-gray-400 mb-4">Manage your favorite trading strategies</p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-cyan border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-3 text-gray-400">Loading wishlist...</span>
          </div>
        ) : wishlistItems.length > 0 ? (
          <div className="space-y-4">
            {wishlistItems.map((item) => (
              <div 
                key={item.id}
                className="premium-card p-5 relative z-10 overflow-hidden border border-cyan/20 rounded-lg hover:shadow-lg hover:shadow-cyan/10 transition-all duration-300"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan/10 to-cyan/5 rounded-full -mr-16 -mt-16 blur-3xl z-0"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-yellow-500" />
                      <h3 className="text-white font-medium">{item.name}</h3>
                    </div>
                  </div>

                  {item.description && (
                    <p className="text-sm text-gray-400 mb-4">{item.description}</p>
                  )}
                  
                  <div className="flex items-center justify-between mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-cyan bg-gray-800/50 border-gray-700 hover:bg-gray-700 glass-card"
                      onClick={() => handleRemoveFromWishlist(item)}
                    >
                      Remove
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-cyan bg-gray-800/50 border-gray-700 hover:bg-gray-700 glass-card"
                      onClick={() => handleViewDetails(item.id)}
                    >
                      <Eye className="mr-1 h-4 w-4" />
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="premium-card p-6 text-center border border-cyan/20">
            <Star className="h-12 w-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-300 mb-4">Your wishlist is empty</p>
            <Button 
              onClick={() => navigate('/strategy-selection')} 
              variant="gradient"
              className="mx-auto"
            >
              Browse Strategies
            </Button>
          </div>
        )}
      </main>
      
      <DeleteConfirmationDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        strategyName={itemToDelete?.name || ""}
        onConfirm={confirmDeleteItem}
        onCancel={cancelDeleteItem}
      />
      
      <BottomNav />
    </div>
  );
};

export default Wishlist;
