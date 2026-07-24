import { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { fetchUserType } from '@/utils/authHelpers';

export type AppRole = 'admin' | 'parceiro' | 'investidor';
export type UserType = AppRole | null;

export const useUserRoles = (session: Session | null) => {
  const [userType, setUserType] = useState<UserType>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const resolveUserType = async (userId: string, userMetadata?: Record<string, unknown> | null) => {
      try {
        const resolvedType = await fetchUserType(userId, userMetadata);
        setUserType(resolvedType ?? 'investidor');
      } catch (err) {
        console.error('Exception ao buscar tipo de usuário:', err);
        setUserType('investidor');
      } finally {
        setLoading(false);
      }
    };

    if (session?.user) {
      resolveUserType(session.user.id, session.user.user_metadata);
    } else {
      setUserType(null);
      setLoading(false);
    }
  }, [session]);

  return { userType, loading };
};
