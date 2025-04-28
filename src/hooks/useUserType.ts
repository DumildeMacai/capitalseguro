
import { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from "@/integrations/supabase/client";
import { UserType } from '@/types/auth';

export const useUserType = (session: Session | null) => {
  const [userType, setUserType] = useState<UserType>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserType = async (userId: string) => {
      try {
        // Use raw SQL query instead of builder to get user type
        const { data, error } = await supabase
          .rpc('get_user_type', { user_id: userId });
          
        if (data) {
          setUserType(data);
        } else if (error) {
          console.error('Erro ao buscar tipo de usuário:', error);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Exception ao buscar tipo de usuário:', err);
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
