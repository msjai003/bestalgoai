
  resetPassword: async (email: string) => {
    try {
      setIsLoading(true);
      
      // Use the current window location to determine the redirect URL dynamically
      // This ensures we don't hardcode any domains that might change
      const baseUrl = window.location.origin;
      const redirectUrl = `${baseUrl}/auth/callback`;
      
      console.log('Sending password reset with redirect to:', redirectUrl);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });

      if (error) {
        console.error('Error during password reset:', error);
        toast.error(error.message);
        return { error };
      }
      
      toast.success('Password reset instructions sent to your email');
      return { error: null };
    } catch (error: any) {
      console.error('Error during password reset:', error);
      toast.error('Error sending password reset instructions');
      return { error: error as Error };
    } finally {
      setIsLoading(false);
    }
  }
