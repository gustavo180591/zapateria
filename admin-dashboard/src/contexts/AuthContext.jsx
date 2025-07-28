import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from 'react-query';
import { jwtDecode } from 'jwt-decode';
import { login as loginApi, getCurrentUser } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Check if user is authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('token');
      
      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        // Verify token is not expired
        const decoded = jwtDecode(storedToken);
        const currentTime = Date.now() / 1000;
        
        if (decoded.exp < currentTime) {
          // Token expired
          logout();
          return;
        }

        // Token is valid, fetch user data
        const userData = await getCurrentUser();
        setUser(userData);
        setToken(storedToken);
      } catch (error) {
        console.error('Error checking authentication:', error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (credentials) => {
    try {
      setError(null);
      const { token: authToken, user: userData } = await loginApi(credentials);
      
      // Store token in localStorage
      localStorage.setItem('token', authToken);
      
      // Set auth state
      setToken(authToken);
      setUser(userData);
      
      // Redirect to dashboard
      navigate('/dashboard');
      
      return userData;
    } catch (error) {
      setError(error.message || 'Error al iniciar sesión');
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    // Clear auth state
    setToken(null);
    setUser(null);
    
    // Remove token from localStorage
    localStorage.removeItem('token');
    
    // Clear React Query cache
    queryClient.clear();
    
    // Redirect to login
    navigate('/auth/login');
  };

  // Update user data
  const updateUser = (userData) => {
    setUser(prev => ({
      ...prev,
      ...userData
    }));
  };

  // Check if user has required role
  const hasRole = (requiredRole) => {
    if (!user) return false;
    return user.role === requiredRole || user.role === 'admin';
  };

  // Check if user has any of the required roles
  const hasAnyRole = (requiredRoles) => {
    if (!user) return false;
    return requiredRoles.includes(user.role) || user.role === 'admin';
  };

  // Check if user has all required permissions
  const hasPermission = (requiredPermission) => {
    if (!user || !user.permissions) return false;
    return user.permissions.includes(requiredPermission) || user.role === 'admin';
  };

  // Check if user has all required permissions
  const hasAllPermissions = (requiredPermissions) => {
    if (!user || !user.permissions) return false;
    if (user.role === 'admin') return true;
    
    return requiredPermissions.every(permission => 
      user.permissions.includes(permission)
    );
  };

  // Check if user has any of the required permissions
  const hasAnyPermission = (requiredPermissions) => {
    if (!user || !user.permissions) return false;
    if (user.role === 'admin') return true;
    
    return requiredPermissions.some(permission => 
      user.permissions.includes(permission)
    );
  };

  const value = {
    isAuthenticated: !!user,
    user,
    token,
    loading,
    error,
    login,
    logout,
    updateUser,
    hasRole,
    hasAnyRole,
    hasPermission,
    hasAllPermissions,
    hasAnyPermission,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};

export default AuthContext;
