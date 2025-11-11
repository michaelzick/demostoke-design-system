import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, captchaToken?: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string, captchaToken?: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, captchaToken?: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        captchaToken: captchaToken
      }
    });
    return { error };
  };

  const signIn = async (email: string, password: string, captchaToken?: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
      options: {
        captchaToken: captchaToken
      }
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const metadataIndicatesAdmin = (metadata: Record<string, any> | null | undefined) => {
    if (!metadata) return false;
    if (metadata.is_admin === true) return true;
    const role =
      metadata.app_role ??
      metadata.role ??
      metadata.user_role ??
      metadata.display_role;
    if (typeof role === "string" && role.toLowerCase() === "admin") {
      return true;
    }
    return false;
  };

  useEffect(() => {
    let isMounted = true;

    if (!user) {
      setIsAdmin(false);
      return () => {
        isMounted = false;
      };
    }

    const metadataAdmin =
      metadataIndicatesAdmin(user.app_metadata as Record<string, any>) ||
      metadataIndicatesAdmin(user.user_metadata as Record<string, any>);

    if (metadataAdmin) {
      setIsAdmin(true);
      return () => {
        isMounted = false;
      };
    }

    const checkAdminStatus = async () => {
      try {
        const { data, error } = await supabase.rpc('is_admin', { user_id: user.id });
        if (!isMounted) return;

        if (error) {
          console.error('Error verifying admin role:', error);
          setIsAdmin(false);
          return;
        }

        setIsAdmin(Boolean(data));
      } catch (err) {
        if (!isMounted) return;
        console.error('Unexpected error verifying admin role:', err);
        setIsAdmin(false);
      }
    };

    checkAdminStatus();

    return () => {
      isMounted = false;
    };
  }, [user]);

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    isAuthenticated: !!user,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
