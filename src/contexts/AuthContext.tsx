
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from '@/hooks/use-toast';
import { Session, User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userType: 'investidor' | 'parceiro' | 'admin' | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userType: 'investidor' | 'parceiro', userData: any) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userType, setUserType] = useState<'investidor' | 'parceiro' | 'admin' | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Configurar listener para mudanças no estado de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          // Buscar o tipo de usuário no perfil
          const { data, error } = await supabase
            .from('profiles')
            .select('tipo')
            .eq('id', currentSession.user.id)
            .single();
            
          if (data) {
            setUserType(data.tipo as any);
          } else if (error) {
            console.error('Erro ao buscar tipo de usuário:', error);
          }
        } else {
          setUserType(null);
        }

        setLoading(false);
      }
    );

    // Verificar sessão atual na inicialização
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        // Buscar o tipo de usuário no perfil usando setTimeout para evitar deadlock
        setTimeout(async () => {
          const { data, error } = await supabase
            .from('profiles')
            .select('tipo')
            .eq('id', currentSession.user.id)
            .single();
            
          if (data) {
            setUserType(data.tipo as any);
          } else if (error) {
            console.error('Erro ao buscar tipo de usuário:', error);
          }
          
          setLoading(false);
        }, 0);
      } else {
        setLoading(false);
      }
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
        switch (profileData.tipo) {
          case 'admin':
            navigate('/admin');
            break;
          case 'parceiro':
            navigate('/parceiro');
            break;
          default:
            navigate('/investidor');
        }

        toast({
          title: "Login realizado com sucesso",
          description: "Bem-vindo de volta!",
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro no login",
        description: error.message || "Email ou senha incorretos.",
      });
      throw error;
    }
  };

  const signUp = async (email: string, password: string, userType: 'investidor' | 'parceiro', userData: any) => {
    try {
      // Criar usuário
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

      // Atualizar perfil com dados adicionais
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
        description: "Verifique seu email para confirmar a conta.",
      });

      // Redirecionar para a página de login
      navigate('/login');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro no registro",
        description: error.message || "Ocorreu um erro durante o registro.",
      });
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
      toast({
        variant: "destructive",
        title: "Erro ao sair",
        description: error.message || "Ocorreu um erro ao fazer logout.",
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        userType,
        loading,
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
