import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setUser({
        id: '1',
        email,
        name: email.split('@')[0],
        avatar: `https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2`
      });
      setIsLoading(false);
      
      // Trigger news refresh after login
      window.dispatchEvent(new CustomEvent('userLoggedIn'));
    }, 1000);
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setUser({
        id: '1',
        email,
        name,
        avatar: `https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2`
      });
      setIsLoading(false);
      
      // Trigger news refresh after registration
      window.dispatchEvent(new CustomEvent('userLoggedIn'));
    }, 1000);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
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