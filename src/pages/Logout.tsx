
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Simply redirect to home page since there's no logout functionality
    navigate('/');
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF00D4] mx-auto mb-4"></div>
        <h1 className="text-xl font-medium">Redirecting...</h1>
        <p className="text-gray-400 mt-2">Please wait while we redirect you.</p>
      </div>
    </div>
  );
};

export default Logout;
