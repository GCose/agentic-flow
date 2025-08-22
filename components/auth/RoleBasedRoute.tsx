import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAuth, useRole } from '@/hooks/use-auth-store';
import { UserRole } from '@/types/user';

interface RoleBasedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  requiredPermissions?: string[];
  fallbackRole?: UserRole;
}

export const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({
  children,
  allowedRoles = [],
  requiredPermissions = [],
  fallbackRole = 'organization', // Default fallback role
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  const { role, hasPermission } = useRole();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/auth');
        return;
      }

      if (allowedRoles.length > 0 && role && !allowedRoles.includes(role)) {
        // Redirect to appropriate dashboard based on role
        const roleRoutes: Record<UserRole, string> = {
          Administrator: '/admin',
          Videographer: '/videographer',
          Designer: '/designer',
          Organization: '/org',
          HR: '/hr',
         
        };

        router.push(
          roleRoutes[role as UserRole] ||
          roleRoutes[fallbackRole as UserRole]
        );
        return;
      }

      if (requiredPermissions.length > 0) {
        const hasAllPermissions = requiredPermissions.every(permission => 
          hasPermission(permission)
        );

        if (!hasAllPermissions) {
          router.push('/unauthorized');
          return;
        }
      }
    }
  }, [isAuthenticated, isLoading, role, allowedRoles, requiredPermissions, router, hasPermission, fallbackRole]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (allowedRoles.length > 0 && role && !allowedRoles.includes(role)) {
    return null;
  }

  if (requiredPermissions.length > 0) {
    const hasAllPermissions = requiredPermissions.every(permission => 
      hasPermission(permission)
    );

    if (!hasAllPermissions) {
      return null;
    }
  }

  return <>{children}</>;
};

export default RoleBasedRoute;
