
import { ensureStorageBucket } from "./storageUtils";

export const initializeStorage = async () => {
  try {
    // Garantir que o bucket de documentos existe
    await ensureStorageBucket('documentos');
    console.log('Armazenamento inicializado com sucesso');
    return true;
  } catch (error) {
    console.error('Erro ao inicializar armazenamento:', error);
    return false;
  }
};
