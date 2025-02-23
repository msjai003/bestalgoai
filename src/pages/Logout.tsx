
import { Button } from "@/components/ui/button";
import { useNavigate, Link } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  const handleCancel = () => {
    navigate(-1); // Go back to previous page
  };

  const handleLogout = () => {
    // Add logout logic here
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <header className="flex items-center mb-8">
        <Button 
          variant="ghost" 
          className="p-2"
          onClick={handleCancel}
        >
          <i className="fa-solid fa-arrow-left text-xl"></i>
        </Button>
        <Link to="/" className="flex-1 text-center mr-8">
          <h1 className="text-xl font-medium">BestAlgo.ai</h1>
        </Link>
      </header>

      <main className="flex flex-col items-center justify-center px-4 mt-16">
        <div className="w-full max-w-md bg-gray-800/50 rounded-2xl p-6 backdrop-blur-lg border border-gray-700 shadow-xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-[#FF00D4] to-purple-600 flex items-center justify-center">
              <i className="fa-solid fa-right-from-bracket text-2xl"></i>
            </div>
            <h2 className="text-xl font-semibold mb-3">Are you sure you want to log out?</h2>
            <p className="text-gray-400 text-sm">
              You will be signed out of your account and need to log in again to access your data.
            </p>
          </div>
          <div className="space-y-3">
            <Button 
              className="w-full py-6 bg-gradient-to-r from-[#FF00D4] to-purple-600 rounded-xl font-medium shadow-lg shadow-[#FF00D4]/20 hover:opacity-90 transition-opacity"
              onClick={handleLogout}
            >
              Logout
            </Button>
            <Button 
              className="w-full py-6 bg-gray-700/50 rounded-xl font-medium border border-gray-600 hover:bg-gray-700 transition-colors"
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </div>
        </div>
      </main>

      <footer className="absolute bottom-4 left-0 right-0 text-center text-xs text-gray-500">
        <p>BestAlgo.ai v2.0.1</p>
        <p className="mt-1">© 2025 All rights reserved</p>
      </footer>
    </div>
  );
};

export default Logout;
