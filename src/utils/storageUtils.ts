import { supabase } from "@/integrations/supabase/client";

export const ensureStorageBucket = async (bucketName: string) => {
  try {
    console.log(`Verificando bucket de armazenamento: ${bucketName}`);
    
    // Verificar se o bucket existe
    const { data: bucket, error: getBucketError } = await supabase
      .storage
      .getBucket(bucketName);
    
    // Se houver erro diferente de "não encontrado", registre o erro
    if (getBucketError && !getBucketError.message.includes("not found")) {
      console.error(`Erro ao verificar bucket ${bucketName}:`, getBucketError);
      return false;
    }
    
    // Se o bucket não existir, tente criar
    if (!bucket) {
      console.log(`Bucket ${bucketName} não encontrado. Tentando criar...`);
      
      // Tente criar o bucket com política pública
      try {
        const { data, error: createError } = await supabase
          .storage
          .createBucket(bucketName, {
            public: true, // Tornar público para facilitar acesso
            allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'],
            fileSizeLimit: 5242880, // 5MB
          });
        
        if (createError) {
          console.error(`Erro ao criar bucket ${bucketName}:`, createError);
          // Mesmo com erro, continue a execução
          return false;
        }
        
        console.log(`Bucket ${bucketName} criado com sucesso!`);
      } catch (createException) {
        console.error(`Exceção ao criar bucket ${bucketName}:`, createException);
        // Continue a execução mesmo com erro
      }
    } else {
      console.log(`Bucket ${bucketName} já existe.`);
    }
    
    return true;
  } catch (error) {
    console.error(`Erro ao verificar/criar bucket ${bucketName}:`, error);
    // Continue a execução mesmo com erro
    return false;
  }
};

// Função auxiliar para upload de documentos mesmo sem autenticação
export const uploadDocumentWithoutAuth = async (
  bucketName: string,
  filePath: string,
  file: File
) => {
  try {
    console.log(`Tentando upload de ${file.name} para ${bucketName}/${filePath}`);
    
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });
    
    if (error) {
      console.error(`Erro no upload de ${filePath}:`, error);
      return { success: false, error };
    }
    
    console.log(`Upload bem-sucedido: ${filePath}`);
    return { success: true, data };
  } catch (error) {
    console.error(`Exceção no upload de ${filePath}:`, error);
    return { success: false, error };
  }
};
