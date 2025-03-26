
import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import RegistrationHeader from '@/components/registration/RegistrationHeader';
import ProgressIndicator from '@/components/registration/ProgressIndicator';
import RegistrationStepOne from '@/components/registration/RegistrationStepOne';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Info } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const GoogleRegistration = () => {
  const { googleUserDetails, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    tradingExperience: 'beginner'
  });
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    // Pre-fill form with Google data if available
    if (googleUserDetails) {
      const fullName = googleUserDetails.given_name && googleUserDetails.family_name 
        ? `${googleUserDetails.given_name} ${googleUserDetails.family_name}`
        : googleUserDetails.given_name || '';
      
      setFormData(prev => ({
        ...prev,
        fullName: fullName,
        email: googleUserDetails.email || '',
      }));
    }
  }, [googleUserDetails]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user makes changes
    if (errorMessage) {
      setErrorMessage(null);
    }
  };

  const handleBack = () => {
    navigate('/auth');
  };

  const validateForm = () => {
    if (!formData.fullName || !formData.email || !formData.mobile) {
      setErrorMessage('Please fill in all required fields');
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setErrorMessage('Please enter a valid email address');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Update user profile with the additional information
      if (user) {
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            id: user.id,
            full_name: formData.fullName,
            email: formData.email,
            mobile_number: formData.mobile,
            trading_experience: formData.tradingExperience
          })
          .onConflict('id')
          .merge();
          
        if (profileError) {
          console.error('Error creating profile for Google user:', profileError);
          setErrorMessage(profileError.message);
          setIsLoading(false);
          return;
        }
        
        toast.success('Profile created successfully!');
        navigate('/dashboard');
      } else {
        setErrorMessage('Not logged in. Please sign in with Google first.');
      }
    } catch (error: any) {
      console.error('Error completing Google registration:', error);
      setErrorMessage(error.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-charcoalPrimary text-white p-4">
      <RegistrationHeader handleBack={handleBack} />

      <section className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Complete Your Profile</h1>
        <p className="text-gray-400">Please provide additional details to complete your account</p>
      </section>

      <ProgressIndicator step={step} totalSteps={1} />

      <Alert className="bg-cyan/10 border-cyan/30 mb-6" variant="info">
        <Info className="h-4 w-4 text-cyan" />
        <AlertDescription className="text-gray-200 ml-2">
          You've signed in with Google. Just fill in any missing details below.
        </AlertDescription>
      </Alert>

      {errorMessage && (
        <Alert className="bg-charcoalDanger/10 border-charcoalDanger/30 mb-6" variant="destructive">
          <AlertTriangle className="h-4 w-4 text-charcoalDanger" />
          <AlertDescription className="text-red-200 ml-2">
            {errorMessage}
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 premium-card p-6 border border-cyan/30">
        <RegistrationStepOne 
          formData={formData} 
          handleChange={handleChange} 
          googleData={{
            fullName: googleUserDetails?.given_name && googleUserDetails?.family_name 
              ? `${googleUserDetails.given_name} ${googleUserDetails.family_name}`
              : googleUserDetails?.given_name || '',
            email: googleUserDetails?.email
          }}
        />
        
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-cyan to-purple-600 text-white py-6 rounded-xl shadow-lg"
        >
          {isLoading ? 'Creating Profile...' : 'Complete Registration'}
        </Button>
      </form>
    </div>
  );
};

export default GoogleRegistration;
