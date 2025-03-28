
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
  
  const handleStartTrading = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/auth');
    }
  };
  
  return (
    <section className="relative px-4 py-12 bg-gradient-to-b from-charcoalSecondary via-charcoalSecondary to-charcoalPrimary">
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-repeat opacity-10"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-cyan/5 to-cyan/5"></div>
      
      {/* Top header with sign in button aligned to the right */}
      {!user && (
        <div className="relative flex justify-end mb-10">
          <div className="flex space-x-3">
            <Button
              variant="gradient"
              className="rounded-lg hover:animate-micro-scale font-semibold"
              onClick={handleSignIn}
            >
              Sign In
            </Button>
          </div>
        </div>
      )}
      
      <div className="relative max-w-3xl mx-auto text-center">
        <div className="flex items-center justify-center mb-6">
          <i className="fa-solid fa-chart-line text-cyan text-3xl mr-3"></i>
          <h2 className="text-cyan text-3xl font-bold">BestAlgo.ai</h2>
        </div>
        
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
          <span className="text-cyan">AI-Powered</span> Algo Trading for Everyone
        </h1>
        <p className="text-gray-300 mb-8 text-lg md:text-xl mx-auto max-w-2xl font-medium">
          Join 10,000+ traders using advanced algorithms to maximize their returns in the Indian stock market
        </p>
        <Button 
          variant="gradient"
          className="w-full md:w-auto md:px-10 py-6 rounded-xl font-semibold shadow-lg hover:animate-micro-glow"
          onClick={handleStartTrading}
        >
          Start Trading Now
        </Button>
      </div>
      <div className="mt-12 max-w-4xl mx-auto">
        <div className="premium-frame border-cyan/30 hover:border-cyan/50 transition-all duration-300">
          <img 
            className="w-full h-48 md:h-64 object-cover transform transition-all duration-700 hover:scale-[1.02] animate-image-float image-hifi"
            src="https://storage.googleapis.com/uxpilot-auth.appspot.com/493f062fc3-bc315fc272ae97137e07.png" 
            alt="3D illustration of trading dashboard with charts and graphs, dark theme with purple accents, modern UI"
          />
        </div>
      </div>
    </section>
  );
};
