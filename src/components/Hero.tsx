
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
    <section className="relative px-4 py-6 bg-gradient-to-b from-charcoalSecondary via-charcoalSecondary to-charcoalPrimary">
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-repeat opacity-10"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-cyan/5 to-cyan/5"></div>
      
      {!user && (
        <div className="relative container mx-auto flex justify-end mb-4">
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
        <div className="flex items-center justify-center mb-4">
          <i className="fa-solid fa-chart-line text-cyan text-2xl mr-2"></i>
          <h2 className="text-cyan text-2xl font-bold">BestAlgo.ai</h2>
        </div>
        
        <div className="text-center mb-6">
          <h1 className="text-2xl md:text-4xl font-bold mb-3 leading-tight">
            <span className="text-cyan">AI-Powered</span> Trading for Everyone
          </h1>
          <p className="text-gray-300 mb-5 text-sm md:text-base mx-auto max-w-xl">
            Join 10,000+ traders using advanced algorithms in the Indian stock market
          </p>
          <Button 
            variant="gradient"
            size="lg"
            className="w-full sm:w-auto sm:px-6 rounded-lg font-semibold shadow-lg hover:animate-micro-glow"
            onClick={handleStartTrading}
          >
            Start Trading Now
          </Button>
        </div>
        
        <div className="premium-frame border-cyan/30 hover:border-cyan/50 transition-all duration-300">
          <img 
            className="w-full h-40 md:h-56 object-cover transform transition-all duration-700 hover:scale-[1.02] animate-image-float image-hifi"
            src="https://storage.googleapis.com/uxpilot-auth.appspot.com/493f062fc3-bc315fc272ae97137e07.png" 
            alt="3D illustration of trading dashboard with charts and graphs, dark theme with purple accents, modern UI"
          />
        </div>
      </div>
    </section>
  );
};
