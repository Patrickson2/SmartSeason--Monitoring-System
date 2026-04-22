import { useAuth } from '../context/AuthContext';

export const useAuth = () => {
  const { user, isLoading, login, logout } = useAuth();

  const isAdmin = user?.role === 'admin';
  const isAgent = user?.role === 'agent';

  const hasPermission = (requiredRole: string) => {
    if (requiredRole === 'admin') return isAdmin;
    if (requiredRole === 'agent') return isAgent || isAdmin;
    return true;
  };

  return {
    user,
    isLoading,
    login,
    logout,
    isAdmin,
    isAgent,
    hasPermission,
  };
};