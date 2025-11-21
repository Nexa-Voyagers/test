import { useCallback, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { isUserAuthenticated } from '@/lib/auth';
import { AuthCredentials, RegisterCredentials } from '@/types';

export function useAuth() {
  const {
    user,
    isLoading,
    isAuthenticated,
    error,
    login,
    register,
    logout,
    fetchUser,
    clearError,
  } = useAuthStore();

  // Initialize auth state on mount
  useEffect(() => {
    if (isUserAuthenticated() && !user) {
      fetchUser();
    }
  }, []);

  const handleLogin = useCallback(
    async (credentials: AuthCredentials) => {
      try {
        clearError();
        await login(credentials);
      } catch (err) {
        // Error is already set in store
        throw err;
      }
    },
    [login, clearError]
  );

  const handleRegister = useCallback(
    async (credentials: RegisterCredentials) => {
      try {
        clearError();
        await register(credentials);
      } catch (err) {
        // Error is already set in store
        throw err;
      }
    },
    [register, clearError]
  );

  const handleLogout = useCallback(
    async () => {
      try {
        clearError();
        await logout();
      } catch (err) {
        // Error is already set in store
        throw err;
      }
    },
    [logout, clearError]
  );

  return {
    user,
    isLoading,
    isAuthenticated,
    error,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    clearError,
  };
}

export default useAuth;
