
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Logout = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        // Let AuthContext handle the toast, don't show one here
        await signOut();
        // Redirect to home page after logout
        navigate('/');
      } catch (error) {
        console.error("Logout error:", error);
        // Even if there's an error, redirect to home
        navigate('/');
      }
    };

    handleLogout();
  }, [navigate, signOut]);

  return (
    <div className="min-h-screen bg-charcoalPrimary flex items-center justify-center text-white">
      <div className="text-center premium-card p-8 shadow-xl backdrop-blur-md">
        <div className="relative mx-auto mb-6 w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-cyan/20 animate-pulse"></div>
          <div className="absolute inset-0 rounded-full border-t-4 border-cyan animate-spin"></div>
        </div>
        <h1 className="text-xl font-medium gradient-text mb-2">Logging out...</h1>
        <p className="text-gray-400 mt-2">Please wait while we sign you out.</p>
      </div>
    </div>
  );
};

export default Logout;
