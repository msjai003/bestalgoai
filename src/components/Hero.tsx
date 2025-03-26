
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
    <section className="relative px-4 py-8 md:py-12 bg-gradient-to-b from-charcoalSecondary via-charcoalSecondary to-charcoalPrimary">
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-repeat opacity-10"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-cyan/5 to-cyan/5"></div>
      
      {/* Top nav area with sign in button */}
      {!user && (
        <div className="relative container mx-auto flex justify-end mb-6">
          <Button
            variant="outline"
            className="rounded-lg font-medium border-cyan/40 text-cyan hover:bg-cyan/10"
            onClick={handleSignIn}
          >
            Sign In
          </Button>
        </div>
      )}
      
      <div className="relative container mx-auto max-w-4xl">
        {/* Logo and Brand */}
        <div className="flex items-center justify-center mb-6">
          <i className="fa-solid fa-chart-line text-cyan text-3xl mr-3"></i>
          <h2 className="text-cyan text-3xl font-bold">BestAlgo.ai</h2>
        </div>
        
        {/* Hero content with proper spacing */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
            <span className="text-cyan">AI-Powered</span> Algo Trading for Everyone
          </h1>
          <p className="text-gray-300 mb-8 text-lg mx-auto max-w-2xl">
            Join 10,000+ traders using advanced algorithms to maximize their returns in the Indian stock market
          </p>
          <Button 
            variant="gradient"
            className="w-full sm:w-auto sm:px-10 py-6 rounded-xl font-semibold shadow-lg hover:animate-micro-glow"
            onClick={handleStartTrading}
          >
            Start Trading Now
          </Button>
        </div>
        
        {/* Hero image with proper framing */}
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
