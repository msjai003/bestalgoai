
import { useEffect } from "react";
import { CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { Link } from "react-router-dom";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface LogoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const LogoutDialog = ({ open, onOpenChange }: LogoutDialogProps) => {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  useEffect(() => {
    const handleLogout = async () => {
      if (open) {
        try {
          // Sign out without showing any toast notification
          await signOut();
          // No toast notifications here
        } catch (error) {
          console.error("Logout error:", error);
          // No toast notifications for errors either
        }
      }
    };

    handleLogout();
  }, [open, signOut]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md mx-auto backdrop-blur-md premium-card p-8 shadow-xl rounded-2xl border border-cyan/10 relative overflow-hidden">
        {/* Background gradients */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-cyan/10 to-cyan/5 rounded-full -mr-32 -mt-32 blur-3xl z-0"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-purple-500/5 to-cyan/5 rounded-full -ml-32 -mb-32 blur-3xl z-0"></div>
        
        <div className="relative z-10">
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-cyan/20 p-4 shadow-lg animate-pulse">
              <CheckCircle2 
                className="h-12 w-12 text-cyan" 
                strokeWidth={1.5} 
              />
            </div>
          </div>
          
          <DialogHeader>
            <DialogTitle className="text-3xl font-semibold mb-4 text-center text-white">Logged Out</DialogTitle>
            <DialogDescription className="mb-8 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 text-white/90">
              You have successfully signed out of your account
            </DialogDescription>
          </DialogHeader>
          
          <Link to="/" className="block" onClick={() => onOpenChange(false)}>
            <Button 
              variant="secondary" 
              size="lg"
              className="w-full py-6 text-base font-medium hover:bg-white/90 group transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Home className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
              <span>Return to Home</span>
            </Button>
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LogoutDialog;
