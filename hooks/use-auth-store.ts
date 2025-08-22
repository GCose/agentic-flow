import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useEffect } from 'react';
import { User, UserRole } from '@/types/user';

// API Base URL - adjust this based on your environment
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:81/user-service';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

interface AuthActions {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchProfile: () => Promise<void>;
  setError: (error: string | null) => void;
  clearError: () => void;
  reset: () => void;
}

type AuthStore = AuthState & AuthActions;

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });

        try {
          const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Login failed');
          }

          const data = await response.json();
          
          if (data.success && data.data.token) {
            set({
              token: data.data.token,
              user: data.data.user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          } else {
            throw new Error(data.message || 'Login failed');
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Login failed';
          set({
            error: errorMessage,
            isLoading: false,
            user: null,
            token: null,
            isAuthenticated: false,
          });
          throw error;
        }
      },

      logout: async () => {
        const { token } = get();
        
        if (token) {
          try {
            await fetch(`${API_BASE_URL}/api/v1/s/auth/logout`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            });
          } catch (error) {
            // Log error but don't prevent logout
            console.error('Logout API call failed:', error);
          }
        }

        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
          isLoading: false,
        });
      },

      fetchProfile: async () => {
        const { token } = get();
        
        if (!token) {
          set({ isAuthenticated: false, user: null });
          return;
        }

        set({ isLoading: true, error: null });

        try {
          const response = await fetch(`${API_BASE_URL}/api/v1/s/me`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (!response.ok) {
            if (response.status === 401) {
              // Token is invalid, logout
              get().logout();
              return;
            }
            throw new Error('Failed to fetch profile');
          }

          const data = await response.json();
          
          if (data.success && data.data) {
            set({
              user: data.data,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          } else {
            throw new Error('Invalid profile response');
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to fetch profile';
          set({
            error: errorMessage,
            isLoading: false,
          });
          
          // If it's an auth error, logout
          if (errorMessage.includes('401') || errorMessage.includes('Unauthorized')) {
            get().logout();
          }
        }
      },

      setError: (error: string | null) => {
        set({ error });
      },

      clearError: () => {
        set({ error: null });
      },

      reset: () => {
        set(initialState);
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Helper hooks for common use cases
export const useAuth = () => {
  const {
    user,
    token,
    isLoading,
    error,
    isAuthenticated,
    login,
    logout,
    fetchProfile,
    setError,
    clearError,
  } = useAuthStore();

  return {
    user,
    token,
    isLoading,
    error,
    isAuthenticated,
    login,
    logout,
    fetchProfile,
    setError,
    clearError,
  };
};

// Helper function to determine primary role from user data
const getPrimaryRole = (user: User | null): UserRole | null => {
  if (!user || !user.userOrgMemberships || user.userOrgMemberships.length === 0) {
    return null;
  }

  // Get all roles from all memberships
  const allRoles: string[] = [];
  user.userOrgMemberships.forEach(membership => {
    membership.roles.forEach(role => {
      allRoles.push(role.roleName);
    });
  });

  // Role hierarchy - higher priority roles override lower ones
  const roleHierarchy: Record<string, UserRole> = {
    Administrator: 'Administrator',
    HR: 'HR',
    Videographer: 'Videographer',
    Designer: 'Designer',
    Organization: 'Organization',
  };
  // Find the highest priority role
  const priorityOrder: UserRole[] = ['Administrator', 'HR','Videographer', 'Designer', 'Organization'];

  for (const priority of priorityOrder) {
    for (const roleName of allRoles) {
      if (roleHierarchy[roleName] === priority) {
        return priority;
      }
    }
  }

  // Default to Organization if no specific role found
  return 'Organization';
};

// Helper function to check if user has specific permission
const checkPermission = (user: User | null, permissionKey: string): boolean => {
  if (!user || !user.userOrgMemberships) return false;
  
  for (const membership of user.userOrgMemberships) {
    // Check role permissions
    for (const role of membership.roles) {
      if (role.permissions.some(p => p.permissionKey === permissionKey)) {
        return true;
      }
    }
    // Check direct permissions
    if (membership.permission.some(p => p.permissionKey === permissionKey)) {
      return true;
    }
  }
  
  return false;
};

// Hook for checking specific roles
export const useRole = () => {
  const user = useAuthStore((state) => state.user);
  const primaryRole = getPrimaryRole(user);

  // Helper to check if user is internal admin
  const isInternalAdmin = () => {
    if (!user || !user.userOrgMemberships) return false;
    return user.userOrgMemberships.some(
      membership =>
        membership.orgType === 'internal' &&
        membership.roles.some(role => role.roleName === 'Administrator')
    );
  };

  // Helper to check if user is generic org member
  const isGenericOrg = () => {
    if (!user || !user.userOrgMemberships) return false;
    return user.userOrgMemberships.some(
      membership => membership.orgType === 'generic'
    );
  };

  // Update role helpers
  const hasRole = (role: UserRole) => primaryRole === role;
  const isAdmin = () => hasRole('Administrator');
  const isVideographer = () => hasRole('Videographer');
  const isDesigner = () => hasRole('Designer');
  // Rename 'client' to 'org'
  const isOrg = () => hasRole('Organization');

  // Function to check if user has specific permission
  const hasPermission = (permissionKey: string) => {
    if (!user || !user.userOrgMemberships) return false;
    for (const membership of user.userOrgMemberships) {
      // Check role permissions
      for (const role of membership.roles) {
        if (role.permissions.some(p => p.permissionKey === permissionKey)) {
          return true;
        }
      }
      // Check direct permissions
      if (membership.permission.some(p => p.permissionKey === permissionKey)) {
        return true;
      }
    }
    return false;
  };

  // Function to get all roles
  const getAllRoles = () => {
    if (!user || !user.userOrgMemberships) return [];
    const allRoles: string[] = [];
    user.userOrgMemberships.forEach(membership => {
      membership.roles.forEach(role => {
        if (!allRoles.includes(role.roleName)) {
          allRoles.push(role.roleName);
        }
      });
    });
    return allRoles;
  };

  return {
    role: primaryRole,
    hasRole,
    isAdmin,
    isVideographer,
    isDesigner,
    isOrg,
    isInternalAdmin,
    isGenericOrg,
    hasPermission,
    getAllRoles,
    user,
  };
};

// Hook for protected routes
export const useAuthGuard = () => {
  const { isAuthenticated, isLoading, fetchProfile } = useAuth();
  
  // Initialize auth check on mount
  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      fetchProfile();
    }
  }, [isAuthenticated, isLoading, fetchProfile]);

  return { isAuthenticated, isLoading };
};
