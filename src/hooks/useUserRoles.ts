import { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from "@/integrations/supabase/client";

export type AppRole = 'admin' | 'parceiro' | 'investidor';
export type UserType = AppRole | null;

export const useUserRoles = (session: Session | null) => {
  const [userType, setUserType] = useState<UserType>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserType = async (userId: string) => {
      try {
        // Usar a função RPC get_user_type para obter a role primária
        const { data, error } = await supabase
          .rpc('get_user_type', { user_id: userId });
          
        if (data) {
          setUserType(data as UserType);
        } else if (error) {
          console.error('Erro ao buscar tipo de usuário:', error);
          setUserType('investidor'); // Fallback seguro
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Exception ao buscar tipo de usuário:', err);
        setUserType('investidor'); // Fallback seguro
        setLoading(false);
      }
    };

    if (session?.user) {
      fetchUserType(session.user.id);
    } else {
      setUserType(null);
      setLoading(false);
    }
  }, [session]);

  return { userType, loading };
};
