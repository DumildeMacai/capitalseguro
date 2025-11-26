import { supabase } from "@/integrations/supabase/client";

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
    console.log("Starting user registration with:", { email, userType, userData });
    
    // First register the user with basic info
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          tipo: userType,
          nome: userData.name,
          telefone: userData.phone
        }
      }
    });

    if (error) {
      console.error("Registration error:", error);
      throw error;
    }
    
    console.log("User registered successfully:", data.user?.id);
    
    // If we have document images and user was created successfully, upload them
    if (data.user && (userData.biFront || userData.biBack)) {
      const userId = data.user.id;
      console.log("Uploading documents for user:", userId);
      
      // Upload front document image if available
      if (userData.biFront instanceof File) {
        console.log("Uploading front document:", userData.biFront.name);
        const { error: frontError } = await supabase.storage
          .from('documentos')
          .upload(`${userId}/bi_frente`, userData.biFront);
          
        if (frontError) {
          console.error("Error uploading front document:", frontError);
        } else {
          console.log("Front document uploaded successfully");
        }
      }
      
      // Upload back document image if available
      if (userData.biBack instanceof File) {
        console.log("Uploading back document:", userData.biBack.name);
        const { error: backError } = await supabase.storage
          .from('documentos')
          .upload(`${userId}/bi_verso`, userData.biBack);
          
        if (backError) {
          console.error("Error uploading back document:", backError);
        } else {
          console.log("Back document uploaded successfully");
        }
      }

      // Update profile with document paths and additional user data using RPC
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
          console.error("Error updating profile with document paths:", updateError);
        } else {
          console.log("Profile updated successfully");
        }
      } catch (updateError) {
        console.error("Exception during profile update:", updateError);
      }
    }

    return data;
  } catch (error) {
    console.error("Complete registration error:", error);
    throw error;
  }
};

export const logoutUser = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};
