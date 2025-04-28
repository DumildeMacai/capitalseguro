
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
      console.log("Checking existing session:", currentSession?.user?.id || "No session");
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log("Attempting login for:", email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Login error:", error);
        throw error;
      }

      console.log("Login successful:", data.user?.id);

      // Fetch user type using RPC
      if (data.user) {
        try {
          const { data: userTypeData, error: userTypeError } = await supabase
            .rpc('get_user_type', { user_id: data.user.id });
          
          if (userTypeError) {
            console.error("Error fetching user type:", userTypeError);
          }

          if (userTypeData) {
            const redirectPath = getRedirectPath(userTypeData);
            console.log("Redirecting to:", redirectPath);
            navigate(redirectPath);

            toast({
              title: "Login realizado com sucesso",
              description: "Bem-vindo de volta!",
            });
          }
        } catch (userTypeError) {
          console.error("Exception during user type fetch:", userTypeError);
        }
      }
    } catch (error: any) {
      console.error("Complete login error:", error);
      handleAuthError(error, toast);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, userType: 'investidor' | 'parceiro', userData: any) => {
    try {
      console.log("Registration data:", { email, userType, userData });
      
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
        console.error("Registration error in auth context:", error);
        throw error;
      }

      console.log("User registered in auth context:", data.user?.id);

      // If user was created successfully, handle document uploads and profile update
      if (data.user) {
        try {
          // Upload front document if available
          if (userData.biFront instanceof File) {
            const { error: frontError } = await supabase.storage
              .from('documentos')
              .upload(`${data.user.id}/bi_frente`, userData.biFront);
            
            if (frontError) console.error("Error uploading front document:", frontError);
          }

          // Upload back document if available
          if (userData.biBack instanceof File) {
            const { error: backError } = await supabase.storage
              .from('documentos')
              .upload(`${data.user.id}/bi_verso`, userData.biBack);
            
            if (backError) console.error("Error uploading back document:", backError);
          }

          // Update additional profile information using RPC
          try {
            const updateData = {
              user_id: data.user.id,
              nome_completo: userData.name,
              telefone: userData.phone,
              endereco: userData.address,
              cidade: userData.city,
              provincia: userData.province,
              bio: userData.bio || '',
              doc_frente: userData.biFront instanceof File ? `${data.user.id}/bi_frente` : null,
              doc_verso: userData.biBack instanceof File ? `${data.user.id}/bi_verso` : null,
              empresa_nome: userType === 'parceiro' && userData.nomeEmpresa ? userData.nomeEmpresa : null,
              ramo_negocio: userType === 'parceiro' && userData.ramoAtuacao ? userData.ramoAtuacao : null
            };
            
            console.log("Updating profile with data:", updateData);
            
            const { error: updateError } = await supabase
              .rpc('update_user_profile', updateData);
              
            if (updateError) {
              console.error('Error updating profile:', updateError);
            } else {
              console.log("Profile updated successfully");
            }
          } catch (updateError) {
            console.error("Exception during profile update:", updateError);
          }
        } catch (updateError) {
          console.error("Exception during document/profile handling:", updateError);
        }
      }

      toast({
        title: "Cadastro realizado com sucesso",
        description: "Agora você pode fazer login.",
      });

      navigate('/login');
    } catch (error: any) {
      console.error("Complete registration error in auth context:", error);
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
