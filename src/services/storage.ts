
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
      .from('documentos_identidade')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) throw error;

    // Obter URL do arquivo
    const { data } = supabase.storage
      .from('documentos_identidade')
      .getPublicUrl(filePath);

    return { url: data.publicUrl };
  } catch (error: any) {
    console.error('Erro ao fazer upload:', error);
    return { error: error.message || 'Erro ao enviar o arquivo' };
  }
};
