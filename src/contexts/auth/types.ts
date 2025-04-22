
import { User } from '@supabase/supabase-js';

export interface AuthUser extends User {}

export interface GoogleUserDetails {
  id: string;
  email: string;
  google_id?: string;
  picture_url?: string;
  given_name?: string;
  family_name?: string;
  locale?: string;
  verified_email?: boolean;
}

export interface AuthContextType {
  user: User | null;
  googleUserDetails?: GoogleUserDetails | null;
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
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  updatePassword: (newPassword: string) => Promise<{ error: Error | null }>;
  isLoading: boolean;
}
