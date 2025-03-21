
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';

export const Hero = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isMobile = useIsMobile();
  
  const handleSignIn = () => {
    navigate('/auth');
  };

  const handleSignUp = () => {
    navigate('/registration');
  };
  
  const handleStartTrading = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/registration');
    }
  };
  
  return (
    <section className="relative px-4 py-12 bg-gradient-to-b from-gray-900 via-gray-900 to-black">
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-repeat opacity-10"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-pink-500/5 to-purple-500/5"></div>
      
      {/* Top header with sign in/sign up buttons aligned to the right */}
      {!user && (
        <div className="relative flex justify-end mb-10">
          <div className="flex space-x-3">
            <Button
              variant="ghost"
              className="text-gray-300 hover:text-white border border-gray-700/50 hover:border-gray-500 hover:animate-micro-scale glass"
              onClick={handleSignIn}
            >
              Sign In
            </Button>
            <Button
              className="gradient-button rounded-lg hover:animate-micro-scale"
              onClick={handleSignUp}
            >
              Sign Up
            </Button>
          </div>
        </div>
      )}
      
      <div className="relative">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          <span className="gradient-text">AI-Powered</span> Algo Trading for Everyone
        </h1>
        <p className="text-gray-300 mb-6">Join 10,000+ traders using advanced algorithms to maximize their returns in the Indian stock market</p>
        <Button 
          className="w-full py-6 gradient-button rounded-xl font-semibold shadow-lg hover:opacity-90 transition-opacity hover:animate-micro-glow"
          onClick={handleStartTrading}
        >
          Start Trading Now
        </Button>
      </div>
      <div className="mt-8">
        <div className="premium-frame">
          <img 
            className="w-full h-48 object-cover transform transition-all duration-700 hover:scale-[1.02] animate-image-float image-hifi"
            src="https://storage.googleapis.com/uxpilot-auth.appspot.com/493f062fc3-bc315fc272ae97137e07.png" 
            alt="3D illustration of trading dashboard with charts and graphs, dark theme with purple accents, modern UI"
          />
        </div>
      </div>
    </section>
  );
};
