import React, { createContext, useContext, useState, useEffect } from 'react';
import { storage } from '../utils/storage';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing auth token
    const token = storage.getAuthToken();
    const profile = storage.getUserProfile();
    
    if (token && profile) {
      setUser(profile);
    }
    setIsLoading(false);
  }, []);

  const login = (email, password) => {
    // Mock login - in real app, this would call backend
    const mockUser = {
      id: '1',
      email: email,
      name: email.split('@')[0],
      createdAt: new Date().toISOString()
    };
    
    const mockToken = 'mock_jwt_token_' + Date.now();
    
    storage.setAuthToken(mockToken);
    storage.setUserProfile(mockUser);
    setUser(mockUser);
    
    return Promise.resolve({ success: true, user: mockUser });
  };

  const signup = (email, password, name) => {
    // Mock signup
    const mockUser = {
      id: Date.now().toString(),
      email: email,
      name: name || email.split('@')[0],
      createdAt: new Date().toISOString()
    };
    
    const mockToken = 'mock_jwt_token_' + Date.now();
    
    storage.setAuthToken(mockToken);
    storage.setUserProfile(mockUser);
    setUser(mockUser);
    
    return Promise.resolve({ success: true, user: mockUser });
  };

  const logout = () => {
    storage.removeAuthToken();
    storage.setUserProfile(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};