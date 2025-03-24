
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const RegistrationFooter: React.FC = () => {
  return (
    <footer className="mt-8 text-center text-sm text-gray-400 premium-card p-4 border border-cyan/10">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan/10 to-cyan/5 rounded-full -mr-16 -mt-16 blur-3xl z-0"></div>
      <div className="relative z-10">
        <p className="mb-2">
          By continuing, you agree to our{' '}
          <Link to="/terms">
            <Button variant="link" className="text-cyan p-0 h-auto">
              Terms
            </Button>
          </Link>{' '}
          &{' '}
          <Link to="/terms">
            <Button variant="link" className="text-cyan p-0 h-auto">
              Privacy Policy
            </Button>
          </Link>
        </p>
        <p>
          Need help?{' '}
          <Button variant="link" className="text-cyan p-0 h-auto" asChild>
            <a href="mailto:enquiry@infocap.info">Contact Support</a>
          </Button>
        </p>
      </div>
    </footer>
  );
};

export default RegistrationFooter;
