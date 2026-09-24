import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../services/api';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const { success, error: toastError } = useToast();

  const logout = useCallback((showToast = true) => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    if (showToast) {
      success('Logged out successfully');
    }
  }, [success]);

  useEffect(() => {
    const handleAuthLogout = () => {
      logout(false);
    };
    window.addEventListener('auth-logout', handleAuthLogout);
    return () => window.removeEventListener('auth-logout', handleAuthLogout);
  }, [logout]);

  // Verify current user on mount
  useEffect(() => {
    const verifyAuth = async () => {
      if (token) {
        try {
          const res = await authApi.getMe();
          if (res.success && res.data) {
            setUser(res.data);
            localStorage.setItem('user', JSON.stringify(res.data));
          }
        } catch (err) {
          console.error('Auth verification failed:', err);
          logout(false);
        }
      }
      setLoading(false);
    };
    verifyAuth();
  }, [token, logout]);

  const login = async (email, password) => {
    try {
      const res = await authApi.login({ email, password });
      if (res.success && res.data) {
        const { token: jwtToken, ...userData } = res.data;
        setToken(jwtToken);
        setUser(userData);
        localStorage.setItem('token', jwtToken);
        localStorage.setItem('user', JSON.stringify(userData));
        success(`Welcome back, ${userData.name}!`);
        return { success: true, user: userData };
      }
    } catch (err) {
      toastError(err.message || 'Login failed. Please check your credentials.');
      return { success: false, error: err.message };
    }
  };

  const register = async (data) => {
    try {
      const res = await authApi.register(data);
      if (res.success && res.data) {
        const { token: jwtToken, ...userData } = res.data;
        setToken(jwtToken);
        setUser(userData);
        localStorage.setItem('token', jwtToken);
        localStorage.setItem('user', JSON.stringify(userData));
        success(`Account created! Welcome, ${userData.name}!`);
        return { success: true, user: userData };
      }
    } catch (err) {
      toastError(err.message || 'Registration failed');
      return { success: false, error: err.message };
    }
  };

  const updateUser = (updatedData) => {
    setUser((prev) => {
      const updated = { ...prev, ...updatedData };
      localStorage.setItem('user', JSON.stringify(updated));
      return updated;
    });
  };

  const [isImpersonating, setIsImpersonating] = useState(() => !!sessionStorage.getItem('admin_original_token'));

  const startImpersonation = (targetAuthData) => {
    if (!token || !user) return;
    // Save admin original session to sessionStorage
    sessionStorage.setItem('admin_original_token', token);
    sessionStorage.setItem('admin_original_user', JSON.stringify(user));
    
    const { token: userToken, ...userData } = targetAuthData;
    setToken(userToken);
    setUser(userData);
    setIsImpersonating(true);
    localStorage.setItem('token', userToken);
    localStorage.setItem('user', JSON.stringify(userData));
    success(`Impersonation active: Logged in as ${userData.name}`);
  };

  const exitImpersonation = () => {
    const origToken = sessionStorage.getItem('admin_original_token');
    const origUser = sessionStorage.getItem('admin_original_user');
    if (origToken && origUser) {
      const parsedUser = JSON.parse(origUser);
      setToken(origToken);
      setUser(parsedUser);
      setIsImpersonating(false);
      localStorage.setItem('token', origToken);
      localStorage.setItem('user', origUser);
      sessionStorage.removeItem('admin_original_token');
      sessionStorage.removeItem('admin_original_user');
      success('Exited impersonation. Administrator session restored.');
    }
  };

  const isAdmin = (user?.role === 'ROLE_ADMIN' || user?.role === 'ADMIN') || isImpersonating;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token,
        isAdmin: user?.role === 'ROLE_ADMIN' || user?.role === 'ADMIN',
        isImpersonating,
        login,
        register,
        logout,
        updateUser,
        startImpersonation,
        exitImpersonation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
