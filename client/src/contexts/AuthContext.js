import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Configure axios defaults
  useEffect(() => {
    axios.defaults.withCredentials = true;
    
    // Dynamically determine API URL based on current hostname
    const getApiUrl = () => {
      if (process.env.REACT_APP_API_URL) {
        return process.env.REACT_APP_API_URL;
      }
      
      const currentHost = window.location.hostname;
      const currentProtocol = window.location.protocol;
      
      // If accessing via IP or any hostname other than localhost, use that same host for API
      return `${currentProtocol}//${currentHost}:5000/api`;
    };
    
    axios.defaults.baseURL = getApiUrl();
  }, []);

  // Check if user is authenticated on app load
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await axios.get('/auth/user');
      setUser(response.data);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = {
    discord: () => {
      window.location.href = `${axios.defaults.baseURL}/auth/discord`;
    },
    battlenet: () => {
      window.location.href = `${axios.defaults.baseURL}/auth/bnet`;
    }
  };

  const logout = async () => {
    try {
      await axios.post('/auth/logout');
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear user state even if request fails
      setUser(null);
    }
  };

  const updateUser = (userData) => {
    setUser(prev => ({ ...prev, ...userData }));
  };

  const value = {
    user,
    loading,
    login,
    logout,
    updateUser,
    checkAuth,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 