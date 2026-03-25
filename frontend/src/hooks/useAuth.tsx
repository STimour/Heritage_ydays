/**
 * Authentication context and hook
 * Temporarily uses mocks, will integrate with real backend
 */

'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';
import { mockCurrentUser } from '@/mocks';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (email: string, password: string, displayName: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  login: async () => {},
  logout: () => {},
  signup: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      // For MVP: check localStorage or load mock user
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        // Uncomment to auto-login for development
        // setUser(mockCurrentUser);
        // localStorage.setItem('user', JSON.stringify(mockCurrentUser));
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    // TODO: Call real API endpoint
    // For MVP: mock authentication
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Mock authentication - accept any email/password
      const mockUser: User = {
        ...mockCurrentUser,
        email,
      };

      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      localStorage.setItem('authToken', 'mock-jwt-token-' + Date.now());
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, displayName: string) => {
    // TODO: Call real API endpoint
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      const newUser: User = {
        id: Math.floor(Math.random() * 10000),
        email,
        displayName,
        pseudo: displayName.toLowerCase().replace(' ', '_'),
        bio: '',
        photo: `https://api.dicebear.com/7.x/avataaars/svg?seed=${displayName}`,
        createdAt: new Date().toISOString(),
      };

      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      localStorage.setItem('authToken', 'mock-jwt-token-' + Date.now());
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        signup,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
