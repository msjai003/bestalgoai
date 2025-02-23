
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft, X } from 'lucide-react';

interface OnboardingSlide {
  title: string;
  description: string;
  image: string;
}

const slides: OnboardingSlide[] = [
  {
    title: "AI-Powered Trading",
    description: "Advanced algorithms working 24/7 to optimize your trading strategies",
    image: "/assets/ai-trading.png"
  },
  {
    title: "Real-Time Analytics",
    description: "Get instant insights and market analysis to make informed decisions",
    image: "/assets/analytics.png"
  },
  {
    title: "Secure & Reliable",
    description: "Your investments are protected with enterprise-grade security",
    image: "/assets/security.png"
  }
];

const Onboarding = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(prev => prev + 1);
    } else {
      navigate('/auth');
    }
  };

  const handleSkip = () => {
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="flex items-center justify-between px-4 py-3 bg-gray-900/80 backdrop-blur-lg fixed top-0 w-full z-50">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => currentSlide > 0 && setCurrentSlide(prev => prev - 1)}
          className={`p-2 ${currentSlide === 0 ? 'invisible' : ''}`}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div className="flex items-center">
          <i className="fa-solid fa-robot text-[#FF00D4] text-2xl mr-2"></i>
          <span className="text-xl font-bold bg-gradient-to-r from-[#FF00D4] to-purple-500 bg-clip-text text-transparent">
            BestAlgo.ai
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleSkip}
          className="p-2"
        >
          <X className="h-5 w-5" />
        </Button>
      </header>

      <main className="pt-16 px-4">
        <section className="text-center mt-8 mb-12">
          <h1 className="text-3xl font-bold mb-3">Welcome to BestAlgo.ai</h1>
          <p className="text-gray-400">
            Your AI-powered trading companion for smarter investments
          </p>
        </section>

        <section className="mb-12">
          <div className="relative overflow-hidden rounded-2xl bg-gray-800/50 backdrop-blur-sm shadow-xl border border-gray-700/30 p-6">
            <div className="text-center">
              <div className="mb-6">
                <img
                  className="w-48 h-48 mx-auto rounded-xl object-cover"
                  src={slides[currentSlide].image}
                  alt={slides[currentSlide].title}
                />
              </div>
              <h2 className="text-2xl font-bold mb-3 bg-gradient-to-r from-[#FF00D4] to-purple-500 bg-clip-text text-transparent">
                {slides[currentSlide].title}
              </h2>
              <p className="text-gray-400">{slides[currentSlide].description}</p>
            </div>
            <div className="flex justify-center gap-2 mt-6">
              {slides.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === currentSlide ? 'bg-[#FF00D4]' : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="fixed bottom-0 left-0 w-full bg-gray-900/80 backdrop-blur-lg border-t border-gray-800 p-4">
          <Button
            onClick={handleNext}
            className="w-full bg-gradient-to-r from-[#FF00D4] to-purple-500 text-white py-8 rounded-xl font-semibold mb-3 shadow-lg shadow-[#FF00D4]/20"
          >
            {currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}
          </Button>
          <p className="text-center text-gray-400">
            <Button
              variant="link"
              onClick={handleSkip}
              className="text-sm text-gray-400"
            >
              Skip onboarding
            </Button>
          </p>
        </section>
      </main>
    </div>
  );
};

export default Onboarding;
