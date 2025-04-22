
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';

const GoogleUserWelcome = () => {
  const { user, googleUserDetails } = useAuth();
  
  if (!user) return null;
  
  // For Google users, display their Google profile
  if (googleUserDetails) {
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
  }
  
  // For non-Google users, show a generic welcome
  const displayName = user.email?.split('@')[0] || 'User';
  return (
    <div className="bg-charcoalSecondary/60 p-4 rounded-lg mb-6 border border-gray-700/30">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-700/50 flex items-center justify-center text-gray-300 font-semibold">
          {displayName.charAt(0).toUpperCase()}
        </div>
        <div>
          <h3 className="text-white font-medium">Welcome, {displayName}!</h3>
          <p className="text-gray-400 text-sm">Good to see you again</p>
        </div>
      </div>
    </div>
  );
};

export default GoogleUserWelcome;
