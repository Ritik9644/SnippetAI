import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { AuthState, User } from '../types';

export function useAuth(): AuthState & {
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
} {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: false, // Start with false to show content immediately
  });

  useEffect(() => {
    // Check if Supabase is configured
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey || supabaseUrl === 'https://placeholder.supabase.co') {
      console.log('Supabase not configured - showing auth form');
      setAuthState({
        user: null,
        loading: false,
      });
      return;
    }

    // Only try to get session if we have valid Supabase config
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setAuthState({
          user: session?.user ? {
            id: session.user.id,
            email: session.user.email!,
            created_at: session.user.created_at,
          } : null,
          loading: false,
        });
      } catch (error) {
        console.log('Error getting session:', error);
        setAuthState({
          user: null,
          loading: false,
        });
      }
    };

    getInitialSession();

    // Listen for auth changes
    try {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setAuthState({
          user: session?.user ? {
            id: session.user.id,
            email: session.user.email!,
            created_at: session.user.created_at,
          } : null,
          loading: false,
        });
      });

      return () => subscription.unsubscribe();
    } catch (error) {
      console.log('Auth listener not available:', error);
    }
  }, []);

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return {
    ...authState,
    signUp,
    signIn,
    signOut,
  };
}