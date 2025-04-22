
import { User } from '@supabase/supabase-js';

export interface AuthUser {
  id: string;
  email: string;
}

export interface AuthContextType {
  user: User | null;
  signIn: (email: string, password: string) => Promise<{ error: Error | null; data?: { user?: User } }>;
  signUp: (
    email: string, 
    password: string, 
    confirmPassword: string, 
    userData: { 
      fullName: string, 
      mobileNumber: string, 
      tradingExperience: string, 
      profilePictureUrl?: string | null 
    }
  ) => Promise<{ error: Error | null; data?: { user?: User } }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  updatePassword: (newPassword: string) => Promise<{ error: Error | null }>;
  isLoading: boolean;
}
