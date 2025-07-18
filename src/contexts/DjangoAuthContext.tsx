
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
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

  // Memoize the initialization function to prevent re-runs
  const initializeAuth = useCallback(async () => {
    console.log('Initializing auth...');
    const token = djangoApiService.getToken();
    if (token) {
      try {
        console.log('Token found, fetching profile...');
        const profile = await djangoApiService.getProfile();
        console.log('Profile fetched:', profile);
        setUser(profile);
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
        djangoApiService.clearToken();
        setUser(null);
      }
    } else {
      console.log('No token found');
      setUser(null);
    }
    setLoading(false);
    console.log('Auth initialization complete');
  }, []);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true);
      console.log('Attempting sign in...');
      const response = await djangoApiService.login(email, password);
      console.log('Sign in successful:', response.user);
      setUser(response.user);
      toast({
        title: "Success",
        description: "Signed in successfully",
      });
    } catch (error: any) {
      console.error('Sign in error:', error);
      toast({
        title: "Sign In Failed",
        description: error.message || "Invalid credentials",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string, fullName?: string) => {
    try {
      setLoading(true);
      console.log('Attempting sign up...');
      const response = await djangoApiService.register(email, password, fullName);
      console.log('Sign up successful:', response.user);
      setUser(response.user);
      toast({
        title: "Success",
        description: "Account created successfully",
      });
    } catch (error: any) {
      console.error('Sign up error:', error);
      toast({
        title: "Sign Up Failed",
        description: error.message || "Failed to create account",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      console.log('Signing out...');
      djangoApiService.clearToken();
      setUser(null);
      toast({
        title: "Success",
        description: "Signed out successfully",
      });
    } catch (error: any) {
      console.error('Sign out error:', error);
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    }
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      console.log('Refreshing user...');
      const profile = await djangoApiService.getProfile();
      setUser(profile);
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  }, []);

  const contextValue = React.useMemo(() => ({
    user,
    loading,
    signIn,
    signUp,
    signOut,
    refreshUser,
  }), [user, loading, signIn, signUp, signOut, refreshUser]);

  return (
    <DjangoAuthContext.Provider value={contextValue}>
      {children}
    </DjangoAuthContext.Provider>
  );
};
