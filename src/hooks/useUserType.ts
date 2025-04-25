
import { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from "@/integrations/supabase/client";
import { UserType } from '@/types/auth';
import { isAdminEmail } from '@/utils/authUtils';

export const useUserType = (session: Session | null) => {
  const [userType, setUserType] = useState<UserType>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserType = async (userId: string, email: string) => {
      // Verificar primeiro se é um admin com base no email
      if (isAdminEmail(email)) {
        setUserType('admin');
        setLoading(false);
        return;
      }

      // Para usuários não-admin, buscar o tipo do banco de dados
      const { data, error } = await supabase
        .from('profiles')
        .select('tipo')
        .eq('id', userId)
        .single();
        
      if (data) {
        setUserType(data.tipo);
      } else if (error) {
        console.error('Erro ao buscar tipo de usuário:', error);
      }
      
      setLoading(false);
    };

    if (session?.user) {
      fetchUserType(session.user.id, session.user.email || '');
    } else {
      setUserType(null);
      setLoading(false);
    }
  }, [session]);

  return { userType, loading };
};
