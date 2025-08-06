'use client';

import { useSession } from 'next-auth/react';
import { AuthUser } from '@/types/auth';
import { useMemo } from 'react';

export function useAuth() {
  const { data: session, status } = useSession();

  const user: AuthUser | null = useMemo(() => {
    return session?.user ? {
      id: session.user.id,
      email: session.user.email || '',
      firstName: session.user.firstName || '',
      lastName: session.user.lastName || '',
      name: session.user.name || '',
    } : null;
  }, [session?.user]);

  return {
    user,
    isLoading: status === 'loading',
    isAuthenticated: !!session?.user,
    session,
  };
}
