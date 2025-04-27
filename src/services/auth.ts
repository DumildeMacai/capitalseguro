
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const loginUser = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) throw error;
  return data;
};

export const registerUser = async (
  email: string, 
  password: string, 
  userType: 'investidor' | 'parceiro',
  userData: any
) => {
  try {
    // First register the user with basic info
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          tipo: userType,
          nome: userData.name,
          telefone: userData.phone,
          endereco: userData.address,
          cidade: userData.city,
          provincia: userData.province,
          bio: userData.bio || ''
        }
      }
    });

    if (error) throw error;
    
    // If we have document images and user was created successfully, upload them
    if (data.user && (userData.biFront instanceof File || userData.biBack instanceof File)) {
      const userId = data.user.id;
      
      // Upload front document image if available
      if (userData.biFront instanceof File) {
        const { error: frontError } = await supabase.storage
          .from('documentos')
          .upload(`${userId}/bi_frente`, userData.biFront);
          
        if (frontError) console.error("Erro ao fazer upload do BI (frente):", frontError);
      }
      
      // Upload back document image if available
      if (userData.biBack instanceof File) {
        const { error: backError } = await supabase.storage
          .from('documentos')
          .upload(`${userId}/bi_verso`, userData.biBack);
          
        if (backError) console.error("Erro ao fazer upload do BI (verso):", backError);
      }

      // Update profile with document paths
      if (userData.biFront instanceof File || userData.biBack instanceof File) {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ 
            documento_identidade_frente: userData.biFront instanceof File ? `${userId}/bi_frente` : null,
            documento_identidade_verso: userData.biBack instanceof File ? `${userId}/bi_verso` : null
          })
          .eq('id', userId);
          
        if (updateError) console.error("Erro ao atualizar perfil com caminhos de documentos:", updateError);
      }
    }

    return data;
  } catch (error) {
    console.error("Erro completo no registro:", error);
    throw error;
  }
};

export const logoutUser = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};
