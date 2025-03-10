
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { X, ChevronLeft } from 'lucide-react';
import InstallPrompt from '@/components/InstallPrompt';

const Auth = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-gray-900 to-black">
      <div className="px-4 py-8 pb-32">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-gray-400">
              <ChevronLeft className="h-5 w-5" />
            </Link>
            <Link to="/" className="flex items-center">
              <i className="fa-solid fa-chart-line text-[#FF00D4] text-2xl"></i>
              <span className="text-white text-xl ml-2">BestAlgo.ai</span>
            </Link>
          </div>
          <Link to="/" className="text-gray-400">
            <X className="h-5 w-5" />
          </Link>
        </div>

        <div className="flex flex-col items-center mt-12">
          <h1 className="text-2xl font-bold text-white mb-8">
            Authentication Removed
          </h1>
          
          <div className="bg-gray-800/50 p-6 rounded-xl shadow-lg backdrop-blur-sm border border-gray-700 mb-8">
            <p className="text-white text-center">
              Login and registration functionality has been completely removed from this application.
            </p>
          </div>
          
          <Button 
            onClick={() => window.history.back()}
            className="w-full bg-gradient-to-r from-[#FF00D4] to-purple-600 text-white py-8 rounded-xl shadow-lg"
          >
            Go Back
          </Button>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-sm p-6">
        <p className="text-gray-500 text-sm">
          By continuing, you agree to our{' '}
          <Button variant="link" className="text-[#FF00D4] p-0 h-auto">
            Terms of Service
          </Button>{' '}
          &{' '}
          <Button variant="link" className="text-[#FF00D4] p-0 h-auto">
            Privacy Policy
          </Button>
        </p>
      </div>
      
      <InstallPrompt />
    </div>
  );
};

export default Auth;
