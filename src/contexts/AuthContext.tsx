
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from '@/hooks/use-toast';
import { Session, User } from '@supabase/supabase-js';
import { AuthContextType } from '@/types/auth';
import { useUserType } from '@/hooks/useUserType';
import { handleAuthError, getRedirectPath } from '@/utils/authUtils';

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const { userType, loading: userTypeLoading } = useUserType(session);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
      }
    );

    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      const { data: profileData } = await supabase
        .from('profiles')
        .select('tipo')
        .eq('id', data.user.id)
        .single();

      if (profileData) {
        const redirectPath = getRedirectPath(profileData.tipo);
        navigate(redirectPath);

        toast({
          title: "Login realizado com sucesso",
          description: "Bem-vindo de volta!",
        });
      }
    } catch (error: any) {
      handleAuthError(error, toast);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, userType: 'investidor' | 'parceiro', userData: any) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            tipo: userType,
            ...userData
          },
        }
      });

      if (error) throw error;

      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            nome_completo: userData.nome,
            telefone: userData.telefone,
            empresa_nome: userType === 'parceiro' ? userData.nomeEmpresa : null,
            ramo_negocio: userType === 'parceiro' ? userData.ramoAtuacao : null,
          })
          .eq('id', data.user.id);

        if (profileError) {
          console.error('Erro ao atualizar perfil:', profileError);
        }
      }

      toast({
        title: "Registro realizado com sucesso",
        description: "Agora você pode fazer login.",
      });

      navigate('/login');
    } catch (error: any) {
      handleAuthError(error, toast);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/login');
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso.",
      });
    } catch (error: any) {
      handleAuthError(error, toast);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        userType,
        loading: userTypeLoading,
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

