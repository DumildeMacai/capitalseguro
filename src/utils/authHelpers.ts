
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { handleAuthError, getRedirectPath } from '@/utils/authUtils';
import { UserType } from '@/types/auth';
import { NavigateFunction } from 'react-router-dom';

export const fetchUserType = async (userId: string): Promise<UserType | null> => {
  try {
    const { data, error } = await supabase.rpc('get_user_type', { user_id: userId });
    
    if (error) {
      console.error('Erro ao buscar tipo de usuário:', error);
      return null;
    }
    
    return data as UserType;
  } catch (error) {
    console.error('Exception ao buscar tipo de usuário:', error);
    return null;
  }
};

export const handleSignIn = async (
  email: string, 
  password: string, 
  navigate: NavigateFunction,
  toast: ReturnType<typeof useToast>['toast']
) => {
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
      const userType = await fetchUserType(data.user.id);
      
      if (userType) {
        const redirectPath = getRedirectPath(userType);
        console.log("Redirecting to:", redirectPath);
        navigate(redirectPath);

        toast({
          title: "Login realizado com sucesso",
          description: "Bem-vindo de volta!",
        });
      }
    }
    
  } catch (error: any) {
    console.error("Complete login error:", error);
    handleAuthError(error, toast);
    throw error;
  }
};

export const handleSignUp = async (
  email: string, 
  password: string, 
  userType: 'investidor' | 'parceiro', 
  userData: any,
  navigate: NavigateFunction,
  toast: ReturnType<typeof useToast>['toast']
) => {
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
      await handleDocumentUpload(data.user.id, userData);
      await updateUserProfile(data.user.id, userData, userType);
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

export const handleDocumentUpload = async (userId: string, userData: any) => {
  try {
    // Upload front document if available
    if (userData.biFront instanceof File) {
      const { error: frontError } = await supabase.storage
        .from('documentos')
        .upload(`${userId}/bi_frente`, userData.biFront);
      
      if (frontError) console.error("Error uploading front document:", frontError);
    }

    // Upload back document if available
    if (userData.biBack instanceof File) {
      const { error: backError } = await supabase.storage
        .from('documentos')
        .upload(`${userId}/bi_verso`, userData.biBack);
      
      if (backError) console.error("Error uploading back document:", backError);
    }
  } catch (error) {
    console.error("Error during document upload:", error);
  }
};

export const updateUserProfile = async (userId: string, userData: any, userType: 'investidor' | 'parceiro') => {
  try {
    const updateData = {
      user_id: userId,
      nome_completo: userData.name,
      telefone: userData.phone,
      endereco: userData.address,
      cidade: userData.city,
      provincia: userData.province,
      bio: userData.bio || '',
      doc_frente: userData.biFront instanceof File ? `${userId}/bi_frente` : null,
      doc_verso: userData.biBack instanceof File ? `${userId}/bi_verso` : null,
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
};

export const handleSignOut = async (navigate: NavigateFunction, toast: ReturnType<typeof useToast>['toast']) => {
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
