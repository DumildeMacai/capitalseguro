
import { supabase } from "@/integrations/supabase/client";

export const ensureStorageBucket = async (bucketName: string) => {
  try {
    // Verificar se o bucket existe
    const { data: bucket, error: getBucketError } = await supabase
      .storage
      .getBucket(bucketName);
    
    if (getBucketError && !bucket) {
      // Se o bucket não existir, criar
      const { data, error: createError } = await supabase
        .storage
        .createBucket(bucketName, {
          public: false,
          allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'],
          fileSizeLimit: 5242880, // 5MB
        });
      
      if (createError) {
        console.error(`Erro ao criar bucket ${bucketName}:`, createError);
        return false;
      }
      
      console.log(`Bucket ${bucketName} criado com sucesso!`);
      return true;
    }
    
    return true;
  } catch (error) {
    console.error(`Erro ao verificar/criar bucket ${bucketName}:`, error);
    return false;
  }
};
