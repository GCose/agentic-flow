import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth, useRole } from '@/hooks/use-auth-store';
import { User } from '@/types/user';

type Role = 'Administrator' | 'Videographer' | 'Designer' | 'Organization' | 'HR';

interface WithAuthProps {
  allowedRoles?: Role[];
  redirectTo?: string;
}

export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: WithAuthProps = {}
) {
  const { allowedRoles, redirectTo = '/auth' } = options;

  return function AuthGuardedComponent(props: P) {
    const { isAuthenticated, isLoading, fetchProfile } = useAuth();
    const { role } = useRole();
    const router = useRouter();

    useEffect(() => {
      // If not loading and not authenticated, try to fetch profile
      if (!isLoading && !isAuthenticated) {
        fetchProfile();
      }
    }, [isLoading, isAuthenticated, fetchProfile]);

    useEffect(() => {
      // If not loading and still not authenticated, redirect to login
      if (!isLoading && !isAuthenticated) {
        router.push(redirectTo);
        return;
      }

      // If authenticated but role doesn't match allowed roles, redirect
      if (isAuthenticated && allowedRoles && role && !allowedRoles.includes(role)) {
        // Redirect to appropriate dashboard based on role
        switch (role) {
          case 'Administrator':
            router.push('/admin');
            break;
          case 'Videographer':
            router.push('/videographer');
            break;
          case 'Designer':
            router.push('/designer');
            break;
          case 'Organization':
            router.push('/org');
            break;
          default:
            router.push('/auth');
        }
      }
    }, [isLoading, isAuthenticated, role, router, redirectTo]);

    // Show loading while checking authentication
    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-white">Loading...</div>
        </div>
      );
    }

    // Don't render if not authenticated
    if (!isAuthenticated) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-white">Redirecting to login...</div>
        </div>
      );
    }

    // Don't render if role is not allowed
    if (allowedRoles && role && !allowedRoles.includes(role)) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-white">Access denied. Redirecting...</div>
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };
}

// Convenience HOCs for specific roles
export const withAdminAuth = <P extends object>(component: React.ComponentType<P>) =>
  withAuth(component, { allowedRoles: ['Administrator'] });

export const withVideographerAuth = <P extends object>(component: React.ComponentType<P>) =>
  withAuth(component, { allowedRoles: ['Videographer'] });

export const withDesignerAuth = <P extends object>(component: React.ComponentType<P>) =>
  withAuth(component, { allowedRoles: ['Designer'] });

export const withOrgAuth = <P extends object>(component: React.ComponentType<P>) =>
  withAuth(component, { allowedRoles: ['Organization'] });

export const withAnyAuth = <P extends object>(component: React.ComponentType<P>) =>
  withAuth(component, { allowedRoles: ['Administrator', 'Videographer', 'Designer', 'Organization'] });
