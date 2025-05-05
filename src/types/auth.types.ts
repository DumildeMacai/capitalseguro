
import { Session, User } from '@supabase/supabase-js';
import { UserType } from './auth';

export interface AuthState {
  user: User | null;
  session: Session | null;
  userType: UserType;
  loading: boolean;
}

export interface AuthActions {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userType: 'investidor' | 'parceiro', userData: any) => Promise<void>;
  signOut: () => Promise<void>;
}

export type AuthContextType = AuthState & AuthActions;
