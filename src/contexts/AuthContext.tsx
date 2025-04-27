
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
    // First set up auth state listener to avoid missing auth events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("Auth state changed:", event);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
      }
    );

    // Then check for existing session
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
      console.log("Tentando fazer login para:", email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Erro de login:", error);
        throw error;
      }

      console.log("Login bem-sucedido:", data.user?.id);

      // Agora vamos buscar o tipo de usuário
      if (data.user) {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('tipo')
          .eq('id', data.user.id)
          .maybeSingle();
        
        if (profileError) {
          console.error("Erro ao buscar perfil:", profileError);
        }

        if (profileData) {
          const redirectPath = getRedirectPath(profileData.tipo);
          console.log("Redirecionando para:", redirectPath);
          navigate(redirectPath);

          toast({
            title: "Login realizado com sucesso",
            description: "Bem-vindo de volta!",
          });
        }
      }
    } catch (error: any) {
      console.error("Erro completo no login:", error);
      handleAuthError(error, toast);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, userType: 'investidor' | 'parceiro', userData: any) => {
    try {
      console.log("Dados de registro:", { email, userType, userData });
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            tipo: userType,
            nome: userData.name,
            telefone: userData.phone,
          },
        }
      });

      if (error) {
        console.error("Erro no registro:", error);
        throw error;
      }

      console.log("Usuário registrado:", data.user?.id);

      // If user was created successfully
      if (data.user) {
        // Update profile information
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            nome_completo: userData.name,
            telefone: userData.phone,
            empresa_nome: userType === 'parceiro' ? userData.nomeEmpresa : null,
            ramo_negocio: userType === 'parceiro' ? userData.ramoAtuacao : null,
            email: email,
          })
          .eq('id', data.user.id);

        if (profileError) {
          console.error('Erro ao atualizar perfil:', profileError);
        }

        // Handle document uploads
        if (userData.biFront instanceof File) {
          try {
            const { error: frontError } = await supabase.storage
              .from('documentos')
              .upload(`${data.user.id}/bi_frente`, userData.biFront);
            
            if (frontError) console.error("Erro no upload do BI (frente):", frontError);
          } catch (uploadError) {
            console.error("Erro ao fazer upload do BI (frente):", uploadError);
          }
        }

        if (userData.biBack instanceof File) {
          try {
            const { error: backError } = await supabase.storage
              .from('documentos')
              .upload(`${data.user.id}/bi_verso`, userData.biBack);
            
            if (backError) console.error("Erro no upload do BI (verso):", backError);
          } catch (uploadError) {
            console.error("Erro ao fazer upload do BI (verso):", uploadError);
          }
        }

        // Update document paths in profile
        if (userData.biFront instanceof File || userData.biBack instanceof File) {
          const docUpdate: { documento_identidade_frente?: string; documento_identidade_verso?: string } = {};
          
          if (userData.biFront instanceof File) {
            docUpdate.documento_identidade_frente = `${data.user.id}/bi_frente`;
          }
          
          if (userData.biBack instanceof File) {
            docUpdate.documento_identidade_verso = `${data.user.id}/bi_verso`;
          }

          const { error: updateError } = await supabase
            .from('profiles')
            .update(docUpdate)
            .eq('id', data.user.id);
            
          if (updateError) {
            console.error("Erro ao atualizar caminhos dos documentos:", updateError);
          }
        }
      }

      toast({
        title: "Registro realizado com sucesso",
        description: "Agora você pode fazer login.",
      });

      navigate('/login');
    } catch (error: any) {
      console.error("Erro completo no registro:", error);
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
