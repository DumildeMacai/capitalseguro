
import { supabase } from "@/integrations/supabase/client";
import { validateAdminCredentials } from "@/utils/authUtils";

export const loginUser = async (email: string, password: string, userType?: 'investidor' | 'parceiro') => {
  // Verificar credenciais de admin primeiro
  if (validateAdminCredentials(email, password)) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    return { 
      ...data, 
      userType: 'admin'
    };
  }

  // Login normal
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) throw error;

  // Verificar o tipo de usuário se foi especificado
  if (userType) {
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('tipo')
      .eq('id', data.user.id)
      .single();

    if (profileError) throw profileError;

    if (profileData.tipo !== userType) {
      throw new Error(`Você está tentando entrar como ${userType}, mas esta conta é de ${profileData.tipo}.`);
    }
  }

  return data;
};

export const registerUser = async (
  email: string, 
  password: string, 
  userType: 'investidor' | 'parceiro',
  userData: any
) => {
  // Verificar se o email é reservado
  if (email === 'dumildemacai@gmail.com') {
    throw new Error("Este email não pode ser utilizado para registro.");
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        tipo: userType,
        ...userData
      }
    }
  });

  if (error) throw error;

  // Atualizar perfil com informações adicionais
  if (data.user) {
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        nome_completo: userData.nome,
        telefone: userData.telefone,
        empresa_nome: userType === 'parceiro' ? userData.nomeEmpresa : null,
        ramo_negocio: userType === 'parceiro' ? userData.ramoAtuacao : null,
        status_verificacao: 'pendente'
      })
      .eq('id', data.user.id);

    if (profileError) throw profileError;
  }

  return data;
};

export const logoutUser = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};
