
import { supabase } from "@/integrations/supabase/client";

export const fetchFeaturedInvestments = async () => {
  try {
    const { data, error } = await supabase
      .from('investimentos')
      .select('*')
      .limit(3);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Erro ao buscar investimentos em destaque:", error);
    throw error;
  }
};

export const fetchAllInvestments = async () => {
  try {
    const { data, error } = await supabase
      .from('investimentos')
      .select('*');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Erro ao buscar todos os investimentos:", error);
    throw error;
  }
};

export const fetchInvestmentById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('investimentos')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Erro ao buscar investimento com ID ${id}:`, error);
    throw error;
  }
};
