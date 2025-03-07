import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, ChevronLeft, AlertCircle, Wifi, Globe, ServerCrash, RefreshCw, ExternalLink, Shield, WifiOff } from 'lucide-react';
import { toast } from 'sonner';
import { 
  supabase, 
  supabaseUrl,
  getCurrentUser, 
  checkFirefoxCompatibility, 
  getFirefoxInstructions, 
  testSupabaseConnection, 
  testDirectConnection, 
  offlineLogin,
  syncOfflineData,
  getCachedSession,
  directLogin
} from '@/lib/supabase';
import FirefoxHelpSection from '@/components/registration/FirefoxHelpSection';
import InstallPrompt from '@/components/InstallPrompt';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [showConnectionHelp, setShowConnectionHelp] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'untested' | 'success' | 'error' | 'offline'>('untested');
  const [connectionDetails, setConnectionDetails] = useState<any>(null);
  const [directConnectionStatus, setDirectConnectionStatus] = useState<'untested' | 'success' | 'error'>('untested');
  const [isOfflineMode, setIsOfflineMode] = useState(!navigator.onLine);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthStatus = async () => {
      const user = await getCurrentUser();
      if (user) {
        navigate('/dashboard');
      }
    };
    
    checkAuthStatus();
    
    const browserCheck = checkFirefoxCompatibility();
    if (browserCheck.isFirefox || browserCheck.isSafari || !browserCheck.cookiesEnabled) {
      setShowConnectionHelp(false);
    }
    
    setIsOfflineMode(!navigator.onLine);
    
    const handleOnline = () => {
      setIsOfflineMode(false);
      toast.success("You're back online!");
      syncOfflineData();
    };
    
    const handleOffline = () => {
      setIsOfflineMode(true);
      toast.error("You're offline. Limited functionality available.");
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    if (navigator.onLine) {
      syncOfflineData();
    }
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [navigate]);

  const handleSignUpClick = () => {
    navigate('/registration');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthError(null);
    setLoginAttempts(prev => prev + 1);

    try {
      if (!navigator.onLine) {
        if (isLogin) {
          const offlineResult = offlineLogin(email, password);
          if (offlineResult.success) {
            toast.success('Logged in with cached credentials');
            navigate('/dashboard');
            return;
          } else {
            throw new Error("Cannot verify credentials while offline. Please try again when you're back online.");
          }
        } else {
          throw new Error("You appear to be offline. Please check your internet connection.");
        }
      }
      
      if (isLogin) {
        const { data, error } = await directLogin(email, password);

        if (error) throw error;
        
        toast.success('Login successful!');
        navigate('/dashboard');
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      
      if (error.message?.includes('Invalid login credentials')) {
        setAuthError('Invalid email or password. Please try again.');
      } else if (error.message?.includes('Email not confirmed')) {
        setAuthError('Please confirm your email before logging in.');
      } else if (error.message?.includes('Failed to fetch') || 
                error.message?.includes('NetworkError') || 
                !navigator.onLine) {
        if (loginAttempts === 1) {
          try {
            await supabase.auth.refreshSession();
            const { error: refreshError } = await directLogin(email, password);
            if (!refreshError) {
              toast.success('Login successful after session refresh!');
              navigate('/dashboard');
              setIsLoading(false);
              return;
            }
          } catch (refreshError) {
            console.error("Refresh attempt failed:", refreshError);
          }
        }
        
        setAuthError('Connection error. We are having trouble reaching our authentication service. This might be due to your network settings or browser configuration.');
        setShowConnectionHelp(true);
        setConnectionStatus('offline');
      } else {
        setAuthError(error.message || 'Authentication failed');
      }
      
      toast.error(error.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestConnection = async () => {
    setTestingConnection(true);
    setConnectionStatus('untested');
    setAuthError(null);
    setConnectionDetails(null);
    setDirectConnectionStatus('untested');
    
    try {
      if (!navigator.onLine) {
        setConnectionStatus('offline');
        setAuthError('You appear to be offline. Please check your internet connection.');
        setShowConnectionHelp(true);
        setTestingConnection(false);
        return;
      }

      const directResult = await testDirectConnection();
      setDirectConnectionStatus(directResult.success ? 'success' : 'error');
      
      if (!directResult.success) {
        try {
          const simpleTest = await fetch(`${supabaseUrl}/`, {
            method: 'HEAD',
            mode: 'no-cors'
          });
          console.log("Simple CORS test result:", simpleTest.type);
          
          if (simpleTest.type === 'opaque') {
            toast.info("Basic connectivity to Supabase exists, but CORS policy is preventing full access");
          }
        } catch (e) {
          console.error("Even no-cors test failed:", e);
        }
      }
      
      const result = await testSupabaseConnection();
      console.log('Connection test result:', result);
      setConnectionDetails(result);
      
      if (result.success) {
        setConnectionStatus('success');
        toast.success('Successfully connected to Supabase!');
      } else {
        setConnectionStatus('error');
        if (result.isCorsOrCookieIssue || result.isNetworkIssue) {
          setAuthError('Connection issue detected. This could be related to network settings, cookies, or browser configuration.');
          setShowConnectionHelp(true);
        } else {
          setAuthError(result.error?.message || 'Failed to connect to Supabase');
        }
        toast.error('Failed to connect to Supabase');
      }
    } catch (error: any) {
      console.error('Connection test error:', error);
      setConnectionStatus('error');
      setAuthError('An unexpected error occurred while testing the connection');
      toast.error('Connection test failed');
    } finally {
      setTestingConnection(false);
    }
  };

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
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>

          <div className="bg-gray-800/50 p-1 rounded-xl mb-8">
            <div className="flex">
              <Button
                variant="ghost"
                className={`px-8 py-2 rounded-lg ${
                  isLogin ? 'bg-[#FF00D4] text-white' : 'text-gray-400'
                }`}
                onClick={() => setIsLogin(true)}
              >
                Login
              </Button>
              <Button
                variant="ghost"
                className={`px-8 py-2 rounded-lg ${
                  !isLogin ? 'bg-[#FF00D4] text-white' : 'text-gray-400'
                }`}
                onClick={() => {
                  setIsLogin(false);
                  handleSignUpClick();
                }}
              >
                Sign Up
              </Button>
            </div>
          </div>

          {isOfflineMode && (
            <div className="mb-4 p-4 bg-amber-900/30 border border-amber-700 rounded-lg flex items-start">
              <WifiOff className="text-amber-400 mr-2 h-5 w-5 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-amber-200 text-sm font-medium">You're currently offline</p>
                <p className="text-amber-200/80 text-xs mt-1">
                  {isLogin 
                    ? "You can still log in if you've previously logged in on this device." 
                    : "You need to be online to create a new account. Please check your connection."}
                </p>
                {getCachedSession() && (
                  <p className="text-green-300 text-xs mt-1">A previously authenticated session is available.</p>
                )}
              </div>
            </div>
          )}

          {authError && (
            <FirefoxHelpSection 
              connectionError={authError} 
              showFirefoxHelp={showConnectionHelp} 
            />
          )}

          {connectionStatus === 'success' && !authError && (
            <div className="mb-4 p-4 bg-green-900/30 border border-green-700 rounded-lg flex items-start">
              <Wifi className="text-green-400 mr-2 h-5 w-5 mt-0.5 flex-shrink-0" />
              <p className="text-green-200 text-sm">Successfully connected to Supabase! You can now log in.</p>
            </div>
          )}

          {connectionDetails && connectionStatus === 'error' && (
            <div className="mb-4 p-4 bg-amber-900/30 border border-amber-700 rounded-lg">
              <h3 className="text-amber-300 font-medium mb-2 flex items-center">
                <Shield className="h-4 w-4 mr-1" /> Connection Details:
              </h3>
              <ul className="list-disc list-inside text-sm text-amber-200 space-y-1">
                <li>Browser: {connectionDetails.browserInfo?.browser || 'Unknown'}</li>
                <li>Online Status: {navigator.onLine ? 'Online' : 'Offline'}</li>
                <li>Cookies Enabled: {connectionDetails.browserInfo?.cookiesEnabled ? 'Yes' : 'No'}</li>
                <li>Direct URL Access: {directConnectionStatus === 'success' ? 'Success' : 'Failed'}</li>
                <li>CORS/Cookie Issue: {connectionDetails.isCorsOrCookieIssue ? 'Likely' : 'Unknown'}</li>
                <li>Network Issue: {connectionDetails.isNetworkIssue ? 'Detected' : 'Unknown'}</li>
                {connectionDetails.isSpecificDomainBlocked && (
                  <li className="text-red-300">Specific Domain Blocked: Supabase URL is likely blocked by your network</li>
                )}
              </ul>
              
              <div className="mt-4 p-3 bg-amber-900/40 border border-amber-700/50 rounded-lg">
                <h4 className="text-amber-300 text-sm font-medium mb-1">Recommended Actions:</h4>
                <ul className="text-xs text-amber-200 space-y-1">
                  {directConnectionStatus === 'error' && (
                    <li>• Your network may be blocking direct access to Supabase. Try a different network or VPN.</li>
                  )}
                  {connectionDetails.isCorsOrCookieIssue && (
                    <li>• Browser security settings may be blocking the connection. Try disabling extensions or using incognito mode.</li>
                  )}
                  {connectionDetails.browserInfo?.browser !== 'Chrome' && (
                    <li>• Try using Chrome browser which has better compatibility with Supabase.</li>
                  )}
                  {isLogin && getCachedSession() && (
                    <li className="text-green-300">• Offline login is available with your cached credentials.</li>
                  )}
                </ul>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="w-full space-y-4">
            <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700">
              <Input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent text-white outline-none border-none"
                required
              />
            </div>
            <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700">
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent text-white outline-none border-none"
                required
              />
            </div>
            <div className="text-right">
              <Button variant="link" className="text-[#FF00D4] text-sm p-0 h-auto">
                Forgot Password?
              </Button>
            </div>

            <Button 
              type="submit"
              disabled={isLoading || (!navigator.onLine && !isLogin)}
              className="w-full bg-gradient-to-r from-[#FF00D4] to-purple-600 text-white py-8 rounded-xl shadow-lg"
            >
              {isLoading ? "Processing..." : (
                isOfflineMode && isLogin ? "Login (Offline Mode)" : "Login"
              )}
            </Button>

            <Button
              type="button"
              onClick={handleTestConnection}
              disabled={testingConnection || !navigator.onLine}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-xl"
            >
              {!navigator.onLine ? (
                <>
                  <WifiOff className="mr-2 h-4 w-4" />
                  Offline Mode (Connection Test Unavailable)
                </>
              ) : (
                <>
                  <ServerCrash className="mr-2 h-4 w-4" />
                  {testingConnection ? "Testing Connection..." : "Test Supabase Connection"}
                </>
              )}
            </Button>

            {(showConnectionHelp || connectionStatus === 'error' || isOfflineMode) && !isLoading && (
              <div className="flex flex-col gap-2">
                <Button
                  onClick={() => window.location.reload()}
                  className="w-full bg-transparent border border-[#FF00D4] text-[#FF00D4] py-2 rounded-xl"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reload Page
                </Button>
                
                {!isOfflineMode && (
                  <Button
                    onClick={() => window.open('https://www.google.com/chrome/', '_blank')}
                    className="w-full bg-transparent border border-gray-600 text-gray-300 py-2 rounded-xl"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Try Different Browser (Chrome)
                  </Button>
                )}
              </div>
            )}

            <div className="flex items-center gap-4 justify-center mt-6">
              <Button
                variant="outline"
                className="bg-gray-800/30 p-4 rounded-xl border border-gray-700 h-auto"
                disabled={isOfflineMode}
              >
                <i className="fa-brands fa-google text-white"></i>
              </Button>
              <Button
                variant="outline"
                className="bg-gray-800/30 p-4 rounded-xl border border-gray-700 h-auto"
                disabled={isOfflineMode}
              >
                <i className="fa-brands fa-apple text-white"></i>
              </Button>
              <Button
                variant="outline"
                className="bg-gray-800/30 p-4 rounded-xl border border-gray-700 h-auto"
                disabled={isOfflineMode}
              >
                <i className="fa-brands fa-facebook text-white"></i>
              </Button>
            </div>
          </form>
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
