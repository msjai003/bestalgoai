
import { useState } from 'react';
import { testRegistrationConnection } from '@/services/registrationService';

export const useConnectionTest = () => {
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const testConnection = async () => {
    const connectionTest = await testRegistrationConnection();
    if (!connectionTest.success) {
      setConnectionError(connectionTest.message || "Cannot connect to server");
      return false;
    }
    return true;
  };

  return {
    connectionError,
    setConnectionError,
    testConnection
  };
};
