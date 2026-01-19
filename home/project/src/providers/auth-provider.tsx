'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { apiFetch } from '@/lib/api';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'client';
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
  refetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem('jwt_token');
    setUser(null);
  }, []);

  const verifyUser = useCallback(async () => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      try {
        const data = await apiFetch<User>('/me');
        setUser(data);
      } catch (error) {
        console.error("Token verification failed", error);
        logout();
      }
    }
    setIsLoading(false);
  }, [logout]);

  useEffect(() => {
    verifyUser();
  }, [verifyUser]);
  
  const login = async (token: string) => {
    localStorage.setItem('jwt_token', token);
    setIsLoading(true);
    await verifyUser();
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, refetchUser: verifyUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
