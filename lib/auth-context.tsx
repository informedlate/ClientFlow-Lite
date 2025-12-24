'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

interface AuthContextType {
    user: Session['user'] | null;
    session: Session | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    signUp: (email: string, password: string) => Promise<void>;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
    signInWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<Session['user'] | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
        // Get initial session
                const getSession = async () => {
                        const { data: { session } } = await supabase.auth.getSession();
                        setSession(session);
                        setUser(session?.user ?? null);
                        setIsLoading(false);
                };

                getSession();

                // Listen for auth changes
                const { data: { subscription } } = supabase.auth.onAuthStateChange(
                        (event, session) => {
                                  setSession(session);
                                  setUser(session?.user ?? null);
                        }
                      );

                return () => {
                        subscription?.unsubscribe();
                };
  }, []);

  const signUp = async (email: string, password: string) => {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
  };

  const signIn = async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
  };

  const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
  };

  const signInWithGoogle = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                          redirectTo: `${window.location.origin}/auth/callback`,
                },
        });
        if (error) throw error;
  };

  const value: AuthContextType = {
        user,
        session,
        isLoading,
        isAuthenticated: !!session,
        signUp,
        signIn,
        signOut,
        signInWithGoogle,
  };

  return (
        <AuthContext.Provider value={value}>
          {children}
        </AuthContext.Provider>AuthContext.Provider>
      );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
          throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
