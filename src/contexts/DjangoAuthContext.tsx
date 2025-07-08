
import React, { createContext, useContext, useEffect, useState } from 'react';
import { djangoApiService } from '@/services/djangoApiService';
import { toast } from '@/hooks/use-toast';

interface User {
  id: string;
  email: string;
  full_name?: string;
  role?: string;
  department?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName?: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const DjangoAuthContext = createContext<AuthContextType | undefined>(undefined);

export const useDjangoAuth = () => {
  const context = useContext(DjangoAuthContext);
  if (!context) {
    throw new Error('useDjangoAuth must be used within a DjangoAuthProvider');
  }
  return context;
};

export const DjangoAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing token and fetch user profile
    const initializeAuth = async () => {
      const token = djangoApiService.getToken();
      if (token) {
        try {
          const profile = await djangoApiService.getProfile();
          setUser(profile);
        } catch (error) {
          console.error('Failed to fetch user profile:', error);
          djangoApiService.clearToken();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await djangoApiService.login(email, password);
      setUser(response.user);
      toast({
        title: "Success",
        description: "Signed in successfully",
      });
    } catch (error: any) {
      toast({
        title: "Sign In Failed",
        description: error.message || "Invalid credentials",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      setLoading(true);
      const response = await djangoApiService.register(email, password, fullName);
      setUser(response.user);
      toast({
        title: "Success",
        description: "Account created successfully",
      });
    } catch (error: any) {
      toast({
        title: "Sign Up Failed",
        description: error.message || "Failed to create account",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      djangoApiService.clearToken();
      setUser(null);
      toast({
        title: "Success",
        description: "Signed out successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    }
  };

  const refreshUser = async () => {
    try {
      const profile = await djangoApiService.getProfile();
      setUser(profile);
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  };

  return (
    <DjangoAuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
        refreshUser,
      }}
    >
      {children}
    </DjangoAuthContext.Provider>
  );
};
