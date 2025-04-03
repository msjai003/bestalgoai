import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { useEffect, useRef, useState } from 'react';
import { ChartLine, TrendingUp, Sparkles, ArrowRight, Copy, Key } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const Hero = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  
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

  const generateApiKey = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to generate an API key",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      // Generate a random API key with format: xxxx-xxxx-xxxx-xxxx
      const key = Array(4).fill(0).map(() => 
        Math.random().toString(36).substring(2, 6)
      ).join('-');
      
      // Store the API key in Supabase if user is authenticated
      if (user) {
        const { error } = await supabase
          .from('user_api_keys')
          .upsert({ 
            user_id: user.id, 
            api_key: key,
            created_at: new Date().toISOString()
          });
          
        if (error) {
          throw new Error(error.message);
        }
      }
      
      setApiKey(key);
      toast({
        title: "API Key Generated",
        description: "Your API key was successfully generated"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate API key. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyApiKey = () => {
    if (!apiKey) return;
    
    navigator.clipboard.writeText(apiKey).then(() => {
      toast({
        title: "Copied!",
        description: "API key copied to clipboard"
      });
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Animation variables
    let time = 0;
    const points: { x: number; y: number; }[] = [];
    const maxPoints = 100;
    
    // Generate initial points for the line chart
    for (let i = 0; i < maxPoints; i++) {
      const x = (i / maxPoints) * canvas.width;
      const noise = Math.sin(i * 0.1) * 30 + Math.sin(i * 0.2) * 15 + Math.cos(i * 0.05) * 25;
      const y = (canvas.height / 2) + noise;
      points.push({ x, y });
    }

    // Candlestick data
    const candlesticks = Array.from({ length: 20 }, (_, i) => {
      const open = Math.random() * 40 + 140;
      const close = Math.random() * 40 + 140;
      const high = Math.max(open, close) + Math.random() * 10;
      const low = Math.min(open, close) - Math.random() * 10;
      return { open, close, high, low, x: (i + 1) * (canvas.width / 25) };
    });

    // Bars data
    const bars = Array.from({ length: 12 }, (_, i) => {
      return Math.random() * 60 + 20;
    });

    // Animation function
    const animate = () => {
      if (!ctx || !canvas) return;
      
      time += 0.05;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw grid lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      for (let i = 0; i < 10; i++) {
        const y = (i / 10) * canvas.height;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
      
      for (let i = 0; i < 10; i++) {
        const x = (i / 10) * canvas.width;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      // Draw main line chart (in cyan)
      ctx.strokeStyle = '#00BCD4';
      ctx.lineWidth = 2;
      ctx.beginPath();

      // Update points with subtle movement
      for (let i = 0; i < points.length; i++) {
        // Create smooth wave effect
        const noise = Math.sin((i * 0.1) + time) * 15 + 
                      Math.cos((i * 0.05) + time) * 10 + 
                      Math.sin((i * 0.033) + time * 0.7) * 8;
        
        points[i].y = (canvas.height * 0.5) + noise;
        
        if (i === 0) {
          ctx.moveTo(points[i].x, points[i].y);
        } else {
          ctx.lineTo(points[i].x, points[i].y);
        }
      }
      ctx.stroke();

      // Add gradient below the line
      const gradient = ctx.createLinearGradient(0, canvas.height * 0.3, 0, canvas.height);
      gradient.addColorStop(0, 'rgba(0, 188, 212, 0.3)');
      gradient.addColorStop(1, 'rgba(0, 188, 212, 0)');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      points.forEach(point => ctx.lineTo(point.x, point.y));
      ctx.lineTo(points[points.length - 1].x, canvas.height);
      ctx.lineTo(points[0].x, canvas.height);
      ctx.closePath();
      ctx.fill();

      // Draw candlestick chart in bottom left
      ctx.save();
      ctx.translate(canvas.width * 0.1, canvas.height * 0.65);
      ctx.scale(0.5, 0.5);
      
      candlesticks.forEach((candle, i) => {
        // Update positions for animation
        const animOffset = Math.sin(time + i * 0.3) * 5;
        const x = candle.x;
        const width = canvas.width / 40;
        
        // Draw wick
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.beginPath();
        ctx.moveTo(x, candle.low + animOffset);
        ctx.lineTo(x, candle.high + animOffset);
        ctx.stroke();
        
        // Draw body
        ctx.fillStyle = candle.close > candle.open ? '#4CAF50' : '#F44336';
        const bodyTop = Math.min(candle.open, candle.close) + animOffset;
        const bodyHeight = Math.abs(candle.close - candle.open);
        ctx.fillRect(x - width / 2, bodyTop, width, bodyHeight);
      });
      ctx.restore();

      // Draw bar chart in bottom right
      ctx.save();
      ctx.translate(canvas.width * 0.6, canvas.height * 0.65);
      ctx.scale(0.5, 0.5);
      
      const barWidth = canvas.width / 25;
      bars.forEach((height, i) => {
        // Animate bars
        const animatedHeight = height * (1 + Math.sin(time + i * 0.5) * 0.1);
        const x = i * barWidth * 1.5;
        
        // Gradient for bars
        const barGradient = ctx.createLinearGradient(0, 0, 0, animatedHeight);
        barGradient.addColorStop(0, 'rgba(0, 188, 212, 0.8)');
        barGradient.addColorStop(1, 'rgba(0, 188, 212, 0.2)');
        
        ctx.fillStyle = barGradient;
        ctx.fillRect(x, 0, barWidth, animatedHeight);
      });
      ctx.restore();

      // Add glowing data points on main chart
      points.forEach((point, i) => {
        if (i % 10 === 0) {
          const pulse = Math.sin(time * 3 + i) * 0.5 + 0.5;
          ctx.fillStyle = `rgba(0, 188, 212, ${0.3 + pulse * 0.7})`;
          ctx.beginPath();
          ctx.arc(point.x, point.y, 3 + pulse * 2, 0, Math.PI * 2);
          ctx.fill();
        }
      });
      
      // Add floating numbers and indicators
      ctx.font = '10px Manrope';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.fillText(`${(Math.sin(time) * 50 + 4300).toFixed(2)}`, canvas.width * 0.1, canvas.height * 0.2);
      ctx.fillText(`${(Math.cos(time) * 20 + 180).toFixed(2)}`, canvas.width * 0.8, canvas.height * 0.3);
      
      // Draw market moving arrow indicator
      const arrowX = canvas.width * 0.85;
      const arrowY = canvas.height * 0.15;
      const arrowAngle = Math.sin(time) * 0.3 + 0.3; // oscillating between up and horizontal
      
      ctx.save();
      ctx.translate(arrowX, arrowY);
      ctx.rotate(-arrowAngle);
      ctx.strokeStyle = Math.sin(time) > 0 ? '#4CAF50' : '#F44336';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-10, 0);
      ctx.lineTo(10, 0);
      ctx.lineTo(5, -8);
      ctx.moveTo(10, 0);
      ctx.lineTo(5, 8);
      ctx.stroke();
      ctx.restore();
      
      // Continue animation loop
      animationRef.current = requestAnimationFrame(animate);
    };
    
    // Start animation
    animationRef.current = requestAnimationFrame(animate);
    
    // Cleanup function
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);
  
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
          <ChartLine className="text-cyan text-2xl mr-2" />
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
            className="w-full sm:w-auto sm:px-6 rounded-lg font-semibold shadow-lg hover:animate-micro-glow group"
            onClick={handleStartTrading}
          >
            Start Trading Now
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>

          {/* API Key Generation Section */}
          <div className="mt-6 bg-charcoalSecondary/60 border border-cyan/20 rounded-xl p-4 backdrop-blur-sm max-w-lg mx-auto">
            <div className="flex items-center mb-3">
              <Key className="h-5 w-5 text-cyan mr-2" />
              <h3 className="text-lg font-semibold text-white">API Integration</h3>
            </div>
            
            <p className="text-sm text-gray-300 mb-4">
              Generate an API key to integrate our trading algorithms with your custom applications
            </p>
            
            {apiKey ? (
              <div className="flex items-center justify-between bg-charcoalPrimary/70 border border-gray-700 rounded-lg p-3 mb-3">
                <code className="text-cyan font-mono text-sm">{apiKey}</code>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  onClick={copyApiKey}
                  className="h-8 w-8 text-gray-400 hover:text-white"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                className="w-full sm:w-auto border-cyan/30 bg-cyan/5 text-cyan hover:bg-cyan/10"
                onClick={generateApiKey}
                disabled={isGenerating || !user}
              >
                {isGenerating ? (
                  <>
                    <span className="animate-spin mr-2">◌</span>
                    Generating...
                  </>
                ) : (
                  <>Generate API Key</>
                )}
              </Button>
            )}
            
            {!user && (
              <p className="text-xs text-amber-300/80 mt-2">
                Please sign in to generate an API key
              </p>
            )}
          </div>
        </div>
        
        <div className="premium-frame border-cyan/30 hover:border-cyan/60 transition-all duration-500 relative overflow-hidden">
          <div className="absolute top-2 left-2 z-10 flex items-center">
            <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse mr-1"></div>
            <span className="text-xs text-cyan/90 font-medium">Live Trading</span>
          </div>
          
          <div className="absolute bottom-2 right-2 z-10 flex items-center bg-charcoalPrimary/70 backdrop-blur-md rounded px-2 py-1">
            <Sparkles className="h-3 w-3 text-amber-400 mr-1 animate-pulse" />
            <span className="text-xs text-gray-200 font-medium">AI-Optimized</span>
          </div>
          
          <div className="absolute top-2 right-2 z-10 flex items-center bg-charcoalPrimary/70 backdrop-blur-md rounded px-2 py-1">
            <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
            <span className="text-xs text-gray-200 font-medium">+24.6%</span>
          </div>
          
          <canvas 
            ref={canvasRef} 
            className="w-full h-40 md:h-[280px] object-cover"
          ></canvas>
        </div>
      </div>
    </section>
  );
};
