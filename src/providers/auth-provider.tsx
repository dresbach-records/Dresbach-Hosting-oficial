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
  login: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const verifyUser = useCallback(async () => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      try {
        const data = await apiFetch<User>('/v1/auth/me');
        setUser(data);
      } catch (error) {
        console.error("Failed to verify user with token", error);
        localStorage.removeItem('jwt_token');
        setUser(null);
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    verifyUser();
  }, [verifyUser]);
  
  const login = (token: string, userData: User) => {
    localStorage.setItem('jwt_token', token);
    setUser(userData);
  };


  const logout = () => {
    localStorage.removeItem('jwt_token');
    setUser(null);
    apiFetch('/v1/auth/logout', { method: 'POST' }).catch(console.error);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
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
