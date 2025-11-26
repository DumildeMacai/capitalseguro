import { createContext, useContext, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { AuthContextType } from '@/types/auth.types';
import { useAuthState } from '@/hooks/useAuthState';
import { 
  handleSignIn, 
  handleSignUp,
  handleSignOut
} from '@/utils/authHelpers';

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const authState = useAuthState();
  const { toast } = useToast();
  const navigate = useNavigate();

  const signIn = async (email: string, password: string) => {
    return handleSignIn(email, password, navigate, toast);
  };

  const signUp = async (email: string, password: string, userType: 'investidor' | 'parceiro', userData: any) => {
    return handleSignUp(email, password, userType, userData, navigate, toast);
  };

  const signOut = async () => {
    return handleSignOut(navigate, toast);
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
