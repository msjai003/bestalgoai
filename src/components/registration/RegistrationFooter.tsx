
import React from 'react';
import { Button } from '@/components/ui/button';

const RegistrationFooter: React.FC = () => {
  return (
    <footer className="mt-8 text-center text-sm text-gray-400">
      <p className="mb-2">
        By continuing, you agree to our{' '}
        <Button variant="link" className="text-[#FF00D4] p-0 h-auto">
          Terms
        </Button>{' '}
        &{' '}
        <Button variant="link" className="text-[#FF00D4] p-0 h-auto">
          Privacy Policy
        </Button>
      </p>
      <p>
        Need help?{' '}
        <Button variant="link" className="text-[#FF00D4] p-0 h-auto">
          Contact Support
        </Button>
      </p>
    </footer>
  );
};

export default RegistrationFooter;
