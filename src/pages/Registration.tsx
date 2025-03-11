
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { AlertTriangle, ChevronLeft, X, WifiOff, Info, DatabaseIcon } from 'lucide-react';
import { toast } from 'sonner';
import { testSupabaseConnection, testTableAccess } from '@/lib/supabase/test-connection';

const Registration = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [detailedError, setDetailedError] = useState<string | null>(null);
  const [isNetworkIssue, setIsNetworkIssue] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<boolean | null>(null);
  const [tableStatus, setTableStatus] = useState<boolean | null>(null);
  const [isTestingConnection, setIsTestingConnection] = useState(true);
  const { signUp, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // Test the database connection and signup table on component mount
  useEffect(() => {
    const checkConnection = async () => {
      setIsTestingConnection(true);
      
      try {
        // Check general connection
        const connectionResult = await testSupabaseConnection();
        setConnectionStatus(connectionResult.success);
        
        if (!connectionResult.success) {
          setIsNetworkIssue(true);
          setErrorMessage('Database connection issue: ' + connectionResult.message);
          setIsTestingConnection(false);
          return;
        }
        
        // Check specifically the signup table
        const tableResult = await testTableAccess('signup');
        setTableStatus(tableResult.success);
        
        if (!tableResult.success) {
          setIsNetworkIssue(true);
          setErrorMessage('Signup table access issue: ' + tableResult.message);
        }
      } catch (error) {
        console.error('Connection check error:', error);
        setConnectionStatus(false);
        setIsNetworkIssue(true);
        setErrorMessage('Failed to check database connection');
      } finally {
        setIsTestingConnection(false);
      }
    };

    checkConnection();
  }, []);

  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setDetailedError(null);
    setIsNetworkIssue(false);
    setIsLoading(true);

    try {
      // Basic validation
      if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
        setErrorMessage('Please fill in all fields');
        setIsLoading(false);
        return;
      }

      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match');
        setIsLoading(false);
        return;
      }

      if (password.length < 6) {
        setErrorMessage('Password must be at least 6 characters');
        setIsLoading(false);
        return;
      }

      // Verify database connection before attempting registration
      if (connectionStatus === false || tableStatus === false) {
        setErrorMessage('Cannot register: Database connection issue');
        setIsNetworkIssue(true);
        setIsLoading(false);
        return;
      }

      // Call signUp from AuthContext with all three parameters
      const { error } = await signUp(email, password, confirmPassword);
      
      if (error) {
        console.error('Registration error details:', error);
        
        if (error.message?.includes('fetch') || error.message?.includes('network') || 
            error.message?.includes('Failed to connect') || error.message?.includes('store signup')) {
          setIsNetworkIssue(true);
          setErrorMessage('Network or database connection issue');
          setDetailedError(error.message || 'Failed to store signup information. Please try again.');
        } else {
          setErrorMessage(error.message || 'Failed to create account');
        }
      } else {
        toast.success('Signup was successful!');
        navigate('/dashboard');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      if (error.message?.includes('fetch') || error.message?.includes('network') || error.message?.includes('store signup')) {
        setIsNetworkIssue(true);
        setErrorMessage('Network connection issue');
        setDetailedError(error.message || 'Network error during signup. Please check your connection and try again.');
      } else {
        setErrorMessage(error.message || 'An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const retryConnectionTest = async () => {
    setIsTestingConnection(true);
    setErrorMessage(null);
    setDetailedError(null);
    
    try {
      // Check general connection
      const connectionResult = await testSupabaseConnection();
      setConnectionStatus(connectionResult.success);
      
      if (!connectionResult.success) {
        setIsNetworkIssue(true);
        setErrorMessage('Database connection issue: ' + connectionResult.message);
        setIsTestingConnection(false);
        return;
      }
      
      // Check specifically the signup table
      const tableResult = await testTableAccess('signup');
      setTableStatus(tableResult.success);
      
      if (!tableResult.success) {
        setIsNetworkIssue(true);
        setErrorMessage('Signup table access issue: ' + tableResult.message);
      } else {
        toast.success('Database connection successful!');
      }
    } catch (error) {
      console.error('Connection check error:', error);
      setConnectionStatus(false);
      setIsNetworkIssue(true);
      setErrorMessage('Failed to check database connection');
    } finally {
      setIsTestingConnection(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
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

      <section className="mb-8">
        <h1 className="text-2xl font-bold mb-4">Create Your Account</h1>
        <p className="text-gray-400">Join thousands of traders using BestAlgo.ai</p>
      </section>

      {isTestingConnection && (
        <Alert className="bg-blue-900/30 border-blue-800 mb-6">
          <Info className="h-4 w-4 text-blue-400" />
          <AlertDescription className="text-blue-200 ml-2 flex items-center">
            Testing database connection...
            <div className="ml-2 animate-spin h-4 w-4 border-2 border-blue-500 rounded-full border-t-transparent"></div>
          </AlertDescription>
        </Alert>
      )}

      {connectionStatus === false && !isTestingConnection && (
        <Alert className="bg-yellow-900/30 border-yellow-800 mb-6">
          <WifiOff className="h-4 w-4 text-yellow-400" />
          <AlertDescription className="text-yellow-200 ml-2">
            Unable to connect to the database. Some features may not work properly.
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2 bg-yellow-800/50 border-yellow-700 text-yellow-200 hover:bg-yellow-700"
              onClick={retryConnectionTest}
              disabled={isTestingConnection}
            >
              Retry Connection
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {tableStatus === false && connectionStatus === true && !isTestingConnection && (
        <Alert className="bg-yellow-900/30 border-yellow-800 mb-6">
          <Info className="h-4 w-4 text-yellow-400" />
          <AlertDescription className="text-yellow-200 ml-2">
            Connected to the database, but cannot access the signup table. Registration may fail.
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2 bg-yellow-800/50 border-yellow-700 text-yellow-200 hover:bg-yellow-700"
              onClick={retryConnectionTest}
              disabled={isTestingConnection}
            >
              Retry Connection
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {errorMessage && (
        <Alert className={`${isNetworkIssue ? 'bg-yellow-900/30 border-yellow-800' : 'bg-red-900/30 border-red-800'} mb-6`} variant="destructive">
          {isNetworkIssue ? (
            <WifiOff className="h-4 w-4 text-yellow-400" />
          ) : (
            <AlertTriangle className="h-4 w-4 text-red-400" />
          )}
          <AlertDescription className={`${isNetworkIssue ? 'text-yellow-200' : 'text-red-200'} ml-2`}>
            {errorMessage}
            {detailedError && (
              <div className="mt-2 text-xs opacity-80">{detailedError}</div>
            )}
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleRegistration} className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="email" className="text-gray-300 mb-2 block">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="bg-gray-800/50 border-gray-700 text-white h-12"
            />
          </div>
          
          <div>
            <Label htmlFor="password" className="text-gray-300 mb-2 block">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="bg-gray-800/50 border-gray-700 text-white h-12"
            />
          </div>

          <div>
            <Label htmlFor="confirmPassword" className="text-gray-300 mb-2 block">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="bg-gray-800/50 border-gray-700 text-white h-12"
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={isLoading || isTestingConnection || connectionStatus === false}
          className="w-full bg-gradient-to-r from-[#FF00D4] to-purple-600 text-white py-6 rounded-xl shadow-lg"
        >
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </Button>

        <div className="text-center mt-6">
          <p className="text-gray-400 text-sm">
            Already have an account? 
            <Link to="/auth" className="text-[#FF00D4] ml-2 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Registration;
