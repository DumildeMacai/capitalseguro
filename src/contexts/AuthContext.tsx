
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from '@/hooks/use-toast';
import { Session, User } from '@supabase/supabase-js';
import { AuthContextType } from '@/types/auth';
import { useUserType } from '@/hooks/useUserType';
import { handleAuthError, getRedirectPath, validateAdminCredentials } from '@/utils/authUtils';

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

    // Verificar a sessão atual ao carregar
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string, userType?: 'investidor' | 'parceiro') => {
    try {
      // Verificar credenciais de admin primeiro
      if (validateAdminCredentials(email, password)) {
        // Fazer login através do Supabase para obter a sessão
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        toast({
          title: "Login realizado com sucesso",
          description: "Bem-vindo, Administrador!",
        });
        
        navigate('/admin');
        return;
      }

      // Verificar se o tipo de usuário foi especificado
      if (userType) {
        // Login normal através do Supabase
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        // Verificar se o tipo de usuário corresponde
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('tipo')
          .eq('id', data.user.id)
          .single();

        if (profileError) {
          throw new Error('Erro ao verificar tipo de usuário.');
        }

        if (profileData.tipo !== userType) {
          throw new Error(`Você está tentando entrar como ${userType}, mas esta conta é de ${profileData.tipo}.`);
        }

        toast({
          title: "Login realizado com sucesso",
          description: `Bem-vindo, ${userType === 'parceiro' ? 'Parceiro' : 'Investidor'}!`,
        });

        navigate(getRedirectPath(userType));
      } else {
        // Login sem especificar tipo de usuário
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
      }
    } catch (error: any) {
      handleAuthError(error, toast);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, userType: 'investidor' | 'parceiro', userData: any) => {
    try {
      // Verificar se o email é reservado para admin
      if (email === 'dumildemacai@gmail.com') {
        toast({
          variant: "destructive",
          title: "Email reservado",
          description: "Este email não pode ser utilizado para registro.",
        });
        throw new Error("Email reservado para administrador.");
      }

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
        // Atualizar o perfil do usuário com dados adicionais
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            nome_completo: userData.nome,
            telefone: userData.telefone,
            empresa_nome: userType === 'parceiro' ? userData.nomeEmpresa : null,
            ramo_negocio: userType === 'parceiro' ? userData.ramoAtuacao : null,
            tipo: userType, // Garantir que o tipo esteja correto
            status_verificacao: 'pendente'
          })
          .eq('id', data.user.id);

        if (profileError) {
          console.error('Erro ao atualizar perfil:', profileError);
          throw new Error('Erro ao atualizar perfil: ' + profileError.message);
        }

        // Upload de documentos, se fornecidos
        if (userData.documentoFrente) {
          // Implementar upload para Storage do Supabase aqui
          // Usar a função uploadIdentityDocument do services/storage.ts
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
