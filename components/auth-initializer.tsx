import { useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth-store';

interface AuthInitializerProps {
  children: React.ReactNode;
}

export function AuthInitializer({ children }: AuthInitializerProps) {
  const { isAuthenticated, fetchProfile } = useAuth();

  useEffect(() => {
    // Try to fetch profile on app initialization if we have a token
    if (!isAuthenticated) {
      fetchProfile();
    }
  }, [isAuthenticated, fetchProfile]);

  return <>{children}</>;
}
