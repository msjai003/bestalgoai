
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Home } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Logout = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        await signOut();
        // Show a success toast notification
        toast({
          title: "Signed out successfully",
          description: "You have been logged out of your account",
          variant: "success",
        });
      } catch (error) {
        console.error("Logout error:", error);
        toast({
          title: "Sign out failed",
          description: "There was a problem signing you out",
          variant: "destructive",
        });
      }
    };

    handleLogout();
  }, [signOut, toast]);

  return (
    <div className="min-h-screen bg-charcoalPrimary flex items-center justify-center text-white p-4">
      <div className="max-w-md w-full mx-auto">
        <div className="text-center backdrop-blur-md premium-card p-8 shadow-xl rounded-2xl border border-cyan/10 relative overflow-hidden">
          {/* Background gradients */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-cyan/10 to-cyan/5 rounded-full -mr-32 -mt-32 blur-3xl z-0"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-purple-500/5 to-cyan/5 rounded-full -ml-32 -mb-32 blur-3xl z-0"></div>
          
          <div className="relative z-10">
            <div className="mb-6 flex justify-center">
              <div className="rounded-full bg-green-100 p-4 shadow-lg">
                <CheckCircle2 className="h-12 w-12 text-green-500" />
              </div>
            </div>
            
            <h1 className="text-3xl font-semibold mb-4">Logged Out</h1>
            
            <div className="mb-8 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
              <p className="text-white/90">
                You have successfully signed out of your account
              </p>
            </div>
            
            <Link to="/" className="block">
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
        </div>
      </div>
    </div>
  );
};

export default Logout;
