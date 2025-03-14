
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Logout = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        // This will handle the toast notification internally
        await signOut();
        // Redirect to home page after successful logout
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
    <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF00D4] mx-auto mb-4"></div>
        <h1 className="text-xl font-medium">Logging out...</h1>
        <p className="text-gray-400 mt-2">Please wait while we sign you out.</p>
      </div>
    </div>
  );
};

export default Logout;
