
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const GoogleAccountDetails = () => {
  const { googleUserDetails } = useAuth();

  if (!googleUserDetails) return null;

  return (
    <Card className="bg-charcoalSecondary border-cyan/20">
      <CardHeader>
        <CardTitle className="text-white">Google Account</CardTitle>
        <CardDescription className="text-gray-400">
          Your linked Google account details
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={googleUserDetails.picture_url || ''} alt="Google profile" />
            <AvatarFallback className="bg-cyan/30 text-white">
              {googleUserDetails.given_name?.charAt(0) || 'G'}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <div className="text-lg font-medium text-white">
              {googleUserDetails.given_name} {googleUserDetails.family_name}
            </div>
            {googleUserDetails.verified_email && (
              <div className="text-sm text-cyan">
                ✓ Verified Google Account
              </div>
            )}
            {googleUserDetails.locale && (
              <div className="text-sm text-gray-400">
                Locale: {googleUserDetails.locale}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GoogleAccountDetails;
