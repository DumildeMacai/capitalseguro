
import { supabase } from "@/integrations/supabase/client";

// Buscar inscrições do usuário
export const fetchUserInvestimentos = async (userId: string) => {
  const { data, error } = await supabase
    .from('inscricoes_investimentos')
    .select(`
      *,
      investimento:investimento_id (
        titulo,
        descricao,
        categoria,
        retorno_estimado,
        prazo_minimo
      )
    `)
    .eq('usuario_id', userId);

  if (error) {
    console.error('Erro ao buscar inscrições do usuário:', error);
    throw error;
  }

  return data || [];
};

// Criar nova inscrição
export const createInscricao = async (inscricao: any) => {
  const { data, error } = await supabase
    .from('inscricoes_investimentos')
    .insert([inscricao])
    .select();

  if (error) {
    console.error('Erro ao criar inscrição:', error);
    throw error;
  }

  return data?.[0];
};

// Cancelar inscrição
export const cancelarInscricao = async (id: string) => {
  const { data, error } = await supabase
    .from('inscricoes_investimentos')
    .update({ status: 'cancelado' })
    .eq('id', id)
    .select();

  if (error) {
    console.error('Erro ao cancelar inscrição:', error);
    throw error;
  }

  return data?.[0];
};

// Buscar todas inscrições (para admins)
export const fetchAllInscricoes = async () => {
  const { data, error } = await supabase
    .from('inscricoes_investimentos')
    .select(`
      *,
      investimento:investimento_id (
        titulo,
        categoria,
        retorno_estimado
      ),
      usuario:usuario_id (
        nome_completo,
        email
      )
    `);

  if (error) {
    console.error('Erro ao buscar todas as inscrições:', error);
    throw error;
  }

  return data || [];
};
