
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';

const GoogleUserWelcome = () => {
  const { user, googleUserDetails } = useAuth();
  
  if (!user || !googleUserDetails) return null;
  
  const displayName = googleUserDetails.given_name || user.email?.split('@')[0] || 'User';
  
  return (
    <div className="bg-charcoalSecondary/60 p-4 rounded-lg mb-6 border border-cyan/10">
      <div className="flex items-center gap-3">
        {googleUserDetails.picture_url ? (
          <img 
            src={googleUserDetails.picture_url} 
            alt="Profile" 
            className="w-10 h-10 rounded-full border-2 border-cyan/30"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-cyan/20 flex items-center justify-center text-cyan font-semibold">
            {displayName.charAt(0).toUpperCase()}
          </div>
        )}
        <div>
          <h3 className="text-white font-medium">Welcome, {displayName}!</h3>
          <p className="text-gray-400 text-sm">Signed in with Google</p>
        </div>
      </div>
    </div>
  );
};

export default GoogleUserWelcome;
