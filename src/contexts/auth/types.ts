
export interface AuthUser {
  id: string;
  email: string;
}

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
  user: AuthUser | null;
  googleUserDetails: GoogleUserDetails | null;
  signIn: (email: string, password: string) => Promise<{ error: Error | null; data?: { user: AuthUser } | null }>;
  signInWithGoogle: () => Promise<{ error: Error | null; data?: { user: AuthUser } | null }>;
  signUp: (
    email: string,
    password: string,
    confirmPassword: string,
    userData: { fullName: string; mobileNumber: string; tradingExperience: string; profilePictureUrl?: string | null }
  ) => Promise<{ error: Error | null; data?: { user: AuthUser | null } | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  updatePassword: (newPassword: string) => Promise<{ error: Error | null }>;
  isLoading: boolean;
  fetchGoogleUserDetails: () => Promise<void>;
}
