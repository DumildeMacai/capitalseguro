import { ensureStorageBucket } from "./storageUtils";

export const initializeStorage = async () => {
  try {
    console.log("Iniciando processo de inicialização do armazenamento");
    
    // Garantir que o bucket de documentos existe
    const result = await ensureStorageBucket('documentos');
    
    console.log('Resultado da inicialização do armazenamento:', result ? 'Sucesso' : 'Falha parcial');
    
    return result;
  } catch (error) {
    console.error('Erro ao inicializar armazenamento:', error);
    // Não falhe completamente, apenas registre o erro
    return false;
  }
};
