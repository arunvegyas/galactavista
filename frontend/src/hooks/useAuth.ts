import { useState, useEffect, useCallback } from 'react';
import { User, UserLoginRequest, UserRegisterRequest } from '../shared/types';
import { apiClient } from '../shared/utils/api';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true,
    isAuthenticated: false,
  });

  // Initialize auth state from localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        apiClient.setToken(token);
        setAuthState({
          user,
          token,
          isLoading: false,
          isAuthenticated: true,
        });
      } catch (error) {
        console.error('Error parsing user data:', error);
        logout();
      }
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = useCallback(async (credentials: UserLoginRequest) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      const response = await apiClient.login(credentials);
      
      // Store in localStorage
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      setAuthState({
        user: response.user,
        token: response.token,
        isLoading: false,
        isAuthenticated: true,
      });
      
      return response;
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  }, []);

  const register = useCallback(async (userData: UserRegisterRequest) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      const user = await apiClient.register(userData);
      
      setAuthState(prev => ({ ...prev, isLoading: false }));
      
      return user;
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Clear API client token
    apiClient.clearToken();
    
    setAuthState({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,
    });
  }, []);

  const updateProfile = useCallback(async (profileData: Partial<User>) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      const updatedUser = await apiClient.updateProfile(profileData);
      
      // Update localStorage
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      setAuthState(prev => ({
        ...prev,
        user: updatedUser,
        isLoading: false,
      }));
      
      return updatedUser;
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      const user = await apiClient.getProfile();
      
      // Update localStorage
      localStorage.setItem('user', JSON.stringify(user));
      
      setAuthState(prev => ({
        ...prev,
        user,
        isLoading: false,
      }));
      
      return user;
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  }, []);

  return {
    ...authState,
    login,
    register,
    logout,
    updateProfile,
    refreshProfile,
  };
}; 