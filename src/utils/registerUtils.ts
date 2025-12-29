import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { RegisterFormValues } from "@/components/auth/RegisterFormSchema";
import { uploadDocumentWithoutAuth } from "./storageUtils";

export type DocumentFiles = { 
  biFront?: File; 
  biBack?: File 
};

export const registerUser = async (
  values: RegisterFormValues, 
  files: DocumentFiles,
  toast: ReturnType<typeof useToast>['toast']
) => {
  if (!files.biFront || !files.biBack) {
    toast({
      variant: "destructive",
      title: "Erro ao registrar",
      description: "Por favor, carregue as duas faces do seu BI.",
    });
    return { success: false };
  }

  try {
    console.log("Iniciando registro com dados:", { 
      email: values.email, 
      userType: values.userType,
      userData: {
        name: values.name,
        phone: values.phone
      } 
    });
    
    // Registro direto com Supabase
    const { data, error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        data: {
          tipo: values.userType,
          nome: values.name,
          telefone: values.phone,
          full_name: values.name, // Common metadata field
          phone_number: values.phone // Common metadata field
        }
      }
    });

    if (error) {
      // Detailed error logging for debugging
      console.error("Supabase Auth Error:", {
        message: error.message,
        status: error.status,
        code: error.code
      });

      // Se for erro de trigger (500), tentamos notificar de forma clara
      if (error.message.includes("Database error saving new user") || error.status === 500) {
        toast({
          variant: "destructive",
          title: "Erro de Configuração no Banco de Dados",
          description: "O servidor do Supabase (Trigger) falhou ao criar seu perfil. Por favor, verifique se a tabela 'profiles' tem colunas obrigatórias não preenchidas pelo gatilho 'on_auth_user_created'.",
        });
      } else if (error.message.includes("already registered")) {
        toast({
          variant: "destructive",
          title: "Usuário já existe",
          description: "Este e-mail já está cadastrado. Tente fazer login.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Erro no Cadastro",
          description: error.message || "Ocorreu um erro inesperado.",
        });
      }
      return { success: false };
    }
    
    console.log("Usuário registrado com sucesso:", data.user?.id);
    
    // Se o usuário foi criado com sucesso, fazer upload dos documentos
    if (data.user) {
      await handleDocumentUpload(data.user.id, files);
      await updateUserProfile(data.user.id, values, files);
      
      toast({
        title: "Cadastro realizado com sucesso!",
        description: "Você será redirecionado para a página de login.",
      });
      
      return { success: true };
    }

    return { success: false };
  } catch (error: any) {
    console.error("Erro completo no registro:", error);
    toast({
      variant: "destructive",
      title: "Erro ao registrar",
      description: error.message || "Ocorreu um erro durante o registro.",
    });
    return { success: false };
  }
};

const handleDocumentUpload = async (userId: string, files: DocumentFiles) => {
  try {
    // Upload do documento frente
    if (files.biFront) {
      await uploadDocumentWithoutAuth('documentos', `${userId}/bi_frente`, files.biFront);
    }
    
    // Upload do documento verso
    if (files.biBack) {
      await uploadDocumentWithoutAuth('documentos', `${userId}/bi_verso`, files.biBack);
    }
  } catch (error) {
    console.error("Erro durante o upload de documentos:", error);
  }
};

const updateUserProfile = async (userId: string, values: RegisterFormValues, files: DocumentFiles) => {
  try {
    console.log("Atualizando perfil com dados:", values);
    
    const { error } = await supabase
      .from("profiles")
      .update({
        nome_completo: values.name,
        telefone: values.phone,
        endereco: values.address,
        cidade: values.city,
        pais: values.province || "Angola",
        bio: values.bio || '',
        documento_url: files.biFront ? `${userId}/bi_frente` : null,
        empresa_nome: values.userType === 'parceiro' ? values.name : null,
      })
      .eq("id", userId);
      
    if (error) {
      console.error("Erro ao atualizar perfil:", error);
    } else {
      console.log("Perfil atualizado com sucesso");
    }
  } catch (updateError) {
    console.error("Exceção durante atualização de perfil:", updateError);
  }
};
