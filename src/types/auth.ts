
import { Session, User } from '@supabase/supabase-js';

export type UserType = 'investidor' | 'parceiro' | 'admin' | null;

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  userType: UserType;
  loading: boolean;
  signIn: (email: string, password: string, userType?: 'investidor' | 'parceiro') => Promise<void>;
  signUp: (email: string, password: string, userType: 'investidor' | 'parceiro', userData: any) => Promise<void>;
  signOut: () => Promise<void>;
}
