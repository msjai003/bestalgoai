
import { useSignIn } from './actions/signIn';
import { useSignInWithGoogle } from './actions/signInWithGoogle';
import { useSignUp } from './actions/signUp';
import { useSignOut } from './actions/signOut';
import { useResetPassword } from './actions/resetPassword';
import { useUpdatePassword } from './actions/updatePassword';

interface AuthActionsProps {
  setUser: (user: any) => void;
  setIsLoading: (isLoading: boolean) => void;
  handleGoogleUser?: (user: any) => Promise<void>;
}

export const useAuthActions = ({
  setUser,
  setIsLoading,
  handleGoogleUser
}: AuthActionsProps) => {
  const { signIn } = useSignIn({ setUser, setIsLoading });
  const { signInWithGoogle } = useSignInWithGoogle({ setIsLoading });
  const { signUp } = useSignUp({ setUser, setIsLoading });
  const { signOut } = useSignOut({ setUser, setIsLoading });
  const { resetPassword } = useResetPassword({ setIsLoading });
  const { updatePassword } = useUpdatePassword({ setIsLoading });

  return {
    signIn,
    signInWithGoogle,
    signUp,
    signOut,
    resetPassword,
    updatePassword
  };
};
