import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';

// Função para fazer upload de um documento de identidade
export const uploadIdentityDocument = async (
  file: File, 
  userId: string, 
  type: 'frente' | 'verso'
): Promise<{url: string} | {error: string}> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${type}_${uuidv4()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error } = await supabase.storage
      .from('documentos')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) throw error;

    // Obter URL do arquivo
    const { data } = supabase.storage
      .from('documentos')
      .getPublicUrl(filePath);

    return { url: data.publicUrl };
  } catch (error: any) {
    console.error('Erro ao fazer upload:', error);
    return { error: error.message || 'Erro ao enviar o arquivo' };
  }
};

// Função para fazer upload de avatar do usuário
export const uploadAvatar = async (
  file: File, 
  userId: string
): Promise<{url: string} | {error: string}> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/avatar_${uuidv4()}.${fileExt}`;
    const filePath = fileName;

    const { error } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) throw error;

    // Obter URL do arquivo
    const { data } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    return { url: data.publicUrl };
  } catch (error: any) {
    console.error('Erro ao fazer upload do avatar:', error);
    return { error: error.message || 'Erro ao enviar o avatar' };
  }
};

// Função para fazer upload de documentos de investimento
export const uploadInvestmentDocument = async (
  file: File, 
  investmentId: string
): Promise<{url: string} | {error: string}> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${investmentId}/${file.name.split('.')[0]}_${uuidv4()}.${fileExt}`;
    const filePath = fileName;

    const { error } = await supabase.storage
      .from('investimentos')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) throw error;

    // Obter URL do arquivo
    const { data } = supabase.storage
      .from('investimentos')
      .getPublicUrl(filePath);

    return { url: data.publicUrl };
  } catch (error: any) {
    console.error('Erro ao fazer upload do documento de investimento:', error);
    return { error: error.message || 'Erro ao enviar o documento' };
  }
};
