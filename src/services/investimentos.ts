
import { supabase } from "@/integrations/supabase/client";

// Buscar todos os investimentos
export const fetchInvestimentos = async () => {
  const { data, error } = await supabase
    .from('investimentos')
    .select('*')
    .order('data_criacao', { ascending: false });

  if (error) {
    console.error('Erro ao buscar investimentos:', error);
    throw error;
  }

  return data || [];
};

// Buscar investimento por ID
export const fetchInvestimentoById = async (id: string) => {
  const { data, error } = await supabase
    .from('investimentos')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Erro ao buscar investimento:', error);
    throw error;
  }

  return data;
};

// Buscar investimentos por parceiro
export const fetchInvestimentosByParceiro = async (parceiroId: string) => {
  const { data, error } = await supabase
    .from('investimentos')
    .select('*')
    .eq('parceiro_id', parceiroId)
    .order('data_criacao', { ascending: false });

  if (error) {
    console.error('Erro ao buscar investimentos do parceiro:', error);
    throw error;
  }

  return data || [];
};

// Criar novo investimento
export const createInvestimento = async (investimento: any) => {
  const { data, error } = await supabase
    .from('investimentos')
    .insert([investimento])
    .select();

  if (error) {
    console.error('Erro ao criar investimento:', error);
    throw error;
  }

  return data?.[0];
};

// Atualizar investimento
export const updateInvestimento = async (id: string, investimento: any) => {
  const { data, error } = await supabase
    .from('investimentos')
    .update(investimento)
    .eq('id', id)
    .select();

  if (error) {
    console.error('Erro ao atualizar investimento:', error);
    throw error;
  }

  return data?.[0];
};

// Excluir investimento
export const deleteInvestimento = async (id: string) => {
  const { error } = await supabase
    .from('investimentos')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Erro ao excluir investimento:', error);
    throw error;
  }

  return true;
};
