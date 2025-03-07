
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Logout = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = async () => {
      await signOut();
      navigate('/auth');
    };

    handleLogout();
  }, [navigate, signOut]);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF00D4] mx-auto mb-4"></div>
        <h1 className="text-xl font-medium">Signing out...</h1>
        <p className="text-gray-400 mt-2">Please wait while we log you out.</p>
      </div>
    </div>
  );
};

export default Logout;
